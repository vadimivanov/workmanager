const router = require('express').Router();

const AuthMiddleware = require('../../../../../auth/auth-middleware-factory');
const { respondError } = require('../../../../router-utils');

const stripeController = require('../../../../../controllers/stripe/stripe-controller');

const getStripePublishableKeyReqHandler = (req, res) => stripeController.getStripePublishableKey()
    .then(key => res.send({ key }))
    .catch(respondError(res));

router.route('/')
  .get(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), getStripePublishableKeyReqHandler);

module.exports = router;
