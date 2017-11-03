const EventEmitter = require('events');
const HttpCodes = require('http-status-codes');
const _ = require('lodash/fp');

const USER_ROLES = require('../../config/database/enums/UserRoles.enum.json');

/**
 * Authorization middleware factory.
 * Allow creating a set of rules for allowing or forbidding access.
 *
 * Main idea - check, if specified key-value pairs belong to user instance from request.
 * Or we can specify key-values that are forbidden for user.
 * Also, we can define a special predicate function - predicate will be invoke with user as argument and should return boolean.
 *
 * Than we can get middleware and use it directly in express riutes.
 *
 * @class
 * @example
 * AuthMiddlewareFactory
 *    .instance()
 *    .allow({ id: 1 } )
 *    .allow({ role: 'ADMIN' })
 *    .getMiddleware() //allows user with id:1 OR user with role:ADMIN
 *
 * @example
 * AuthMiddlewareFactory
 *    .instance()
 *    .allow({ is_verified:true, is_enabled:true })
 *    .allow({ role: 'ADMIN' })
 *    .getMiddleware() //allows user which is_verified AND is_enabled OR user with role:ADMIN
 *
 *
 * @example
 * AuthMiddlewareFactory
 *    .instance()
 *    .forbid({ is_enabled:false })
 *    .allow({ role: 'ADMIN' })
 *    .getMiddleware() //allows user with role:ADMIN BUT forbid all users which are not is_enabled
 *
 * @example
 * AuthMiddlewareFactory
 *    .instance()
 *    .allow(user => user.login > 5)
 *    .getMiddleware() //predicate allows user with login longer than 5 letters
 */
class AuthMiddlewareFactory extends EventEmitter {
  static get responseDefaultAccessDenied() {
    return (
      res => res.status(HttpCodes.FORBIDDEN).send({ success: false }))
  }

  /**
   * Get factory instance
   * @return {function(...[*]): AuthMiddlewareFactory}
   */
  static get instance() {
    return (...args) => new AuthMiddlewareFactory(...args);
  }

  static get isSubObjectOf() {
    return (
      /**
       * Check - is sub object is a part of object
       * e.g. { id: 1 } is a part of { id: 1, login: 'login' }
       * @param subObject
       * @param object
       * @return {boolean}
       */
        (subObject, object) => {
          return _.entries(subObject)
          .every(subObjKeyValue => _.entries(object.get ? object.get({ plain: true }) : object)
            .some(objectKeyValue => _.isEqual(objectKeyValue, subObjKeyValue))
          )
        })
  }

  static get defaultPredicates() {
    return ({
      isAdmin: { role: USER_ROLES.ADMIN },
      isSupporter: { role: USER_ROLES.SUPPORTER },
    })
  }

  static get preConctructedMiddlewares() {
    return ({
      allowSupporterAdmin: () => AuthMiddlewareFactory
        .instance()
        .allow(AuthMiddlewareFactory.defaultPredicates.isAdmin)
        .allow(AuthMiddlewareFactory.defaultPredicates.isSupporter)
        .getMiddleware(),

      allowOwnerSupporterAdmin: () => (req, res, next) => AuthMiddlewareFactory
        .instance()
        .allow({ id: _.get('meta.user.id', req) })
        .allow(AuthMiddlewareFactory.defaultPredicates.isAdmin)
        .allow(AuthMiddlewareFactory.defaultPredicates.isSupporter)
        .getMiddleware()(req, res, next),
    })
  }

  /**
   * @constructor
   * @param reqUserPath {string} - path to user object in request
   * @param responseAccessDenied {function(res)}
   */
  constructor(reqUserPath, responseAccessDenied) {
    super();
    this.responseAccessDenied = responseAccessDenied || AuthMiddlewareFactory.responseDefaultAccessDenied;
    this.reqUserPath = 'auth.user' || reqUserPath;
    this.allowedSubUserPredicates = [];
    this.forbiddenUserPredicates = [];
  }

  /**
   * Allow access if user has defined part
   * @param subUserPredicate {object|function}
   */
  allow(subUserPredicate) {
    this.allowedSubUserPredicates = this.allowedSubUserPredicates.concat(subUserPredicate);
    return this;
  }

  /**
   * Forbid access if user has defined part.
   * @param forbiddenSubUserPredicate {object|function}
   */
  forbid(forbiddenSubUserPredicate) {
    this.forbiddenUserPredicates = this.forbiddenUserPredicates.concat(forbiddenSubUserPredicate);
    return this;
  }

  /**
   * Checks - is user allowed.
   * At least 1 array in allowedSubUserPredicates should contains part of user
   * @param user {object}
   * @return {boolean}
   */
  isAllowed(user) {
    return this.allowedSubUserPredicates
      .some(subUserPredicate =>
        typeof subUserPredicate === 'function'
          ? subUserPredicate.call(this, user)
          : AuthMiddlewareFactory.isSubObjectOf(subUserPredicate, user)
      )
  }

  /**
   * Checks - is user forbidden.
   * At least 1 array in forbiddenUserPredicates should contains part of user
   * @param user
   * @return {boolean}
   */
  isForbidden(user) {
    return this.forbiddenUserPredicates
      .some(subUserPredicate =>
        typeof subUserPredicate === 'function'
          ? subUserPredicate.call(this, user)
          : AuthMiddlewareFactory.isSubObjectOf(subUserPredicate, user)
      )
  }

  /**
   * Get exppress type middleware.
   * which will take user from request and call next() if user allowed
   * or send appropriate response if forbidden or not allowed.
   * @return {function(*=, *=, *)}
   */
  getMiddleware() {
    return (req, res, next) => {
      const user = _.get(this.reqUserPath, req);
      if (user && user.id && !this.isForbidden(user) && this.isAllowed(user)) {
        next();
      } else {
        this.responseAccessDenied(res)
      }
    }
  }
}

module.exports = AuthMiddlewareFactory;
