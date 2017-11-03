const _ = require('lodash/fp');
const bcrypt = require('bcrypt');
const { saltRounds } = require('../../../config/auth/hash.config.json');

const initialization = require('../../initialization/postgres-connect.initialization');
const userController = require('../../controllers/user-controller');
const providerController = require('../../controllers/provider/provider-controller');
const raterController = require('../../controllers/rater/rater-controller');
const stripeController = require('../../controllers/stripe/stripe-controller');

class UserManagementUtils {
  constructor() {
    this._createUniqueUserDTO = (user = {}) => Object.assign({},
      user, {
        login: Date.now() + user.login,
        email: Date.now() + user.email,
        password_hash: bcrypt.hashSync(user.password, saltRounds),
        id: undefined,
      }
    );

    this.createUniqueUserProvider = (user = {}, provider = {}) => {
      const uniqueUserDTO = this._createUniqueUserDTO(user);

      const uniqueProvider = Object.assign({},
        provider, {
          id: undefined,
        });
      delete uniqueProvider.user_id;

      return initialization
        .then(() => userController.createUserProvider(uniqueUserDTO))
        /*.then(dbUser => stripeController.getAllBillingPlans()
          .then(plans => userController.subscribeUserOnStripePlan(dbUser, _.get('data[0].id', plans)))
        )*/
        .then(dbUser => providerController.updateProviderByUserId(uniqueProvider, dbUser.id))
        .then(dbProvider => userController.getFullUserById(dbProvider.user_id))
    };

    this.createUniqueUserRater = (user, rater) => {
      const uniqueUserDTO = this._createUniqueUserDTO(user);

      const uniqueRater = Object.assign(
        { id: undefined },
        rater,
      );

      return initialization
        .then(() => userController.createUserRater(uniqueUserDTO))
        .then(dbUser => raterController.updateRaterByUserId(uniqueRater, dbUser.id))
        .then(dbRater => userController.getFullUserById(dbRater.user_id))
    };

    this.deleteUser = user => userController.deleteUserById(user.id)
      .then(() => {
        if (user.stripe_account_id) stripeController.deleteStripeCustomerByUser(user);
        else return
      });

    this.deleteUserByProviderId = providerId => providerController.getFullProviderById(providerId)
      .then(user => this.deleteUser(user.id))
  }
}

module.exports = new UserManagementUtils();
