const router = require('express').Router();

const AuthMiddleware = require('../../../../../auth/auth-middleware-factory');
const stripeConfig = require('../../../../../../config/stripe.config.json');
const { respondError } = require('../../../../router-utils');

const rawJWTUtils = require('../../../../../auth/raw-jwt-utils');

const stripePublishableKey = process.env.NODE_ENV === 'production'
  ? stripeConfig.apiLiveKeys.publishableKey
  : stripeConfig.apiTestKeys.publishableKey;

const cardFormReqHandler = (req, res) => {
  const jwtToken = req.header('Authorization') || req.query.jwtToken || req.body.jwtToken;

  rawJWTUtils.getUserFromJWT(jwtToken)
    .then(user => res.render('billing-card-form', { stripePublishableKey, jwtToken, user }))
    .catch(respondError(res))
};

router.route('/')
  .get(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), cardFormReqHandler);

module.exports = router;
