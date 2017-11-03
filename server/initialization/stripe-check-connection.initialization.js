const stripeConfig = require('../../config/stripe.config.json');
const stripe = require('stripe')(stripeConfig.apiTestKeys.secretKey);

const log = require('../utils/logger/logger')(module);

const listAllStripeAccounts = new Promise((resolve, reject) => stripe.accounts.list(
  { limit: 100 },
  (err, accounts) => {
    if (err) return reject(err);
    return resolve(accounts);
  })
);

module.exports = listAllStripeAccounts
  .then(accounts => log.info('List of stripe accounts:', JSON.stringify(accounts)))
  .catch(error => log.error(error)) //TODO remove it to app.js
