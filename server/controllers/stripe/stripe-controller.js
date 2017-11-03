const EventEmitter = require('events');
const _ = require('lodash/fp');

const log = require('../../utils/logger/logger')(module);
const stripeConfig = require('../../../config/stripe.config.json');
const stripe = process.env.NODE_ENV === 'production'
  ? require('stripe')(stripeConfig.apiLiveKeys.secretKey)
  : require('stripe')(stripeConfig.apiTestKeys.secretKey);

const stripePublishableKey = process.env.NODE_ENV === 'production'
  ? stripeConfig.apiLiveKeys.publishableKey
  : stripeConfig.apiTestKeys.publishableKey;

class StripeController extends EventEmitter {
  constructor() {
    super();

    /**
     * Registrate stripe customer account by users email
     * @param email
     * @return {Promise}
     */
    this.createStripeCustomerByUser = ({ email }) => (new Promise((resolve, reject) => {
      stripe.customers.create(
        { email },
        (err, customer) => {
          if (err) return reject(err);
          return resolve(customer);
        }
      );
    }));

    this.getStripeCustomerByUser = ({ stripe_account_id }) => (new Promise((resolve, reject) => {
      if (stripe_account_id) {
        stripe.customers.retrieve(
          stripe_account_id,
          (err, account) => {
            if (err) {
              //TODO: should be return reject(err);
              log.error(err);
              resolve(null);
            }
            return resolve(account);
          }
        );
        //TODO: should be return reject(err);
      } else resolve(null)
    }));

    this.getAllBillingPlans = () => (new Promise((resolve, reject) => {
      stripe.plans.list(
        { limit: 100 },
        (err, plans) => {
          if (err) return reject(err);
          return resolve(plans);
        }
      );
    }));

    this.subscribeStripeCustomerOnPlan = ({ stripe_account_id }, { plan_id }) => (new Promise((resolve, reject) => {
      if (_.isEmpty(stripe_account_id) || _.isEmpty(plan_id)) return reject(new Error('no stripe_account_id or plan_id'));
      stripe.subscriptions.create({
        customer: stripe_account_id,
        plan: plan_id,
      }, (err, subscription) => {
        if (err) return reject(err);
        return resolve(subscription);
      });
    }));

    /* UPDATE */

    this.updateStripeCustomerSubscriptionPlan = ({ stripe_subscription }, { plan_id }) => (new Promise((resolve, reject) => stripe.subscriptions.update(
        stripe_subscription.id,
        { plan: plan_id },
        (err, updatedSubscription) => {
          if (err) return reject(err);
          return resolve(updatedSubscription);
        })
      )
  );

    this.updateStripeCustomerEmail = (email, { stripe_account_id }) => (new Promise((resolve, reject) => {
      stripe.customers.update(stripe_account_id, {
        email,
      }, (err, customer) => {
        if (err) { return reject(err) }
        return resolve(customer);
      });
    }));

    /* DELETE */

    this.deleteStripeCustomerByUser = ({ stripe_account_id }) => (new Promise((resolve, reject) => {
      if (stripe_account_id) {
        stripe.customers.del(
          stripe_account_id,
          (err, confirmation) => {
            if (err) return reject(err);
            return resolve(confirmation);
          }
        );
      } else reject(new Error('No stripe_account_id'))
    }));

    this.getCustomers = () => (new Promise((resolve, reject) => {
      stripe.customers.list(
        { limit: 100 },
        (err, customers) => {
          if (err) {
            log.error(err);
            return reject(new Error(err.message));
          }
          return resolve(customers);
        }
      );
    }));

    this.deleteCustomers = customers => (new Promise((resolve, reject) => {
      for (let i = 0; i < customers.data.length; i++) {
        stripe.customers.del(
          customers.data[i].id,
          (err, confirmation) => {
            if (err) {
              log.error(err);
              return reject(new Error(err.message));
            }
            if (!confirmation.deleted) {
              const deleteError = new Error(`Customer id: ${confirmation.id} not deleted.`);
              log.error(deleteError);
              return reject(deleteError);
            }
            if (i === (customers.data.length - 1)) return resolve('All customers was deleted from stripe.')
          }
        );
      }
    }));

    this.deleteAllCustomers = () => this.getCustomers()
      .then(customers => this.deleteCustomers(customers));

    this.getStripePublishableKey = () => Promise.resolve(stripePublishableKey);
  }
}

module.exports = new StripeController();
