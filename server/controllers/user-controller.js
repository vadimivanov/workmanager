const EventEmitter = require('events');
const _ = require('lodash/fp');

const { User, NotificationSettingsList, Rater, Provider, ProblemFeedbackReport } = require('../models');
const roles = require('../../config/database/enums/UserRoles.enum.json');
const billingPlans = require('../../config/database/enums/StripeBillingPlans.enum.json');
const notificationSettingsListController = require('./notification-settings-list-controller');
const stripeController = require('./stripe/stripe-controller');
const userService = require('../services/user.service');
const eventBus = require('../utils/event-bus');
const eventTypes = require('../../config/event-types.config.json');
const userPrivateFields = require('../../config/model-fields/user-private-fields.config.json');

class UserController extends EventEmitter {
  constructor() {
    super();

    this.createUser = user => User
      .create(user)
      .then(dbUser => stripeController.createStripeCustomerByUser(dbUser)
        .then(stripeAccount => this.updateUserById({ stripe_account_id: stripeAccount.id }, dbUser.id))
      )
      .then(dbUser => this.subscribeUserOnStripePlan(dbUser, billingPlans.BASIC))
      .then(dbUser => this.getUserById(dbUser.id));

    /* POST */

    this.createUserProvider = ({ login, email, password }) => {
      const user = {
        login,
        email,
        password,
        role: roles.PROVIDER,
      };

      return this.createUser(user)
        .then(dbUser => notificationSettingsListController.createDefaultNotificationSettingsListForUser(dbUser, { is_feedbacks_notify: true, is_feedbacks_request_notify: false }).then(() => dbUser))
        .then(userInstance => Provider.create({ user_id: userInstance.get('id'), rating: 0 }))
        .then(provider => this.getFullUserById(provider.user_id))
    };

    this.createUserRater = ({ login, email, password }) => {
      const user = {
        login,
        email,
        password,
        role: roles.RATER,
      };

      return this.createUser(user)
        .then(dbUser => notificationSettingsListController.createDefaultNotificationSettingsListForUser(dbUser, { is_feedbacks_notify: false, is_feedbacks_request_notify: true }).then(() => dbUser))
        .then(userInstanceWithStripeSibscripe =>
          Rater.create({ user_id: userInstanceWithStripeSibscripe.get('id') })
        )
        .then(rater => this.getFullUserById(rater.user_id))
    };

    /* GET */

    this.getAllUsers = (offset, limit, email) => User.findAll({
      offset,
      limit,
      attributes: { exclude: userPrivateFields },
      where: _.isEmpty(email) ? {} : { email },
      order: [['created_at', 'ASC']],
    });

    this.getUserById = id => userService.getUser({ id });

    this.getUserByPK = ({ login, email }) => {
      if (login) return userService.getUser({ login });
      if (email) return userService.getUser({ email });
      return Promise.resolve(null)
    };

    this.getFullUserById = id =>
      userService.getFullUser({ id })
        .then(user => stripeController.getStripeCustomerByUser(user)
          .then((stripeCustomer) => {
            user.setDataValue('stripe_account', stripeCustomer);
            return user;
          })
        );

    /* UPDATE */

    this.updateUserById = (newUserFields, id) => userService.updateUser(newUserFields, { id });

    this.subscribeUserOnStripePlan = (user, plan_id) => stripeController
      .subscribeStripeCustomerOnPlan(user, { plan_id })
      .then(subscription => userService.updateUser(
        { stripe_subscription: subscription },
        { id: user.id })
      );

    this.updateSubscribeOfUserOnStripePlan = (user, plan_id) => stripeController
      .updateStripeCustomerSubscriptionPlan(user, { plan_id })
      .then(subscription => userService.updateUser(
        { stripe_subscription: subscription },
        { id: user.id })
        .then(this.emitSubscribeChanged)
      );

    /* DELETE */

    this.deleteUserById = id => User.destroy({
      where: { id },
    });

    this.deleteUserWithStripeAccount = user => this.deleteUserById(user.id)
      .then(stripeController.deleteStripeCustomerByUser(user))
      .then(this.emitUserDeleted(user));

    /* events */

    this._createEmitUserPromise = type => (user) => {
      eventBus.subject.next({
        type,
        payload: { user: _.get('dataValues', user) },
      });

      return Promise.resolve(user);
    };

    this.emitUserDeleted = this._createEmitUserPromise(eventTypes.user.USER_DELETE);
    this.emitSubscribeChanged = this._createEmitUserPromise(eventTypes.subscribe.SUBSCRIBE_CHANGED);
  }
}

module.exports = new UserController();
