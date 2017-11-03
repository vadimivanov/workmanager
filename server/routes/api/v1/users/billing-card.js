const router = require('express').Router();
const HttpStatus = require('http-status-codes');

const AuthMiddleware = require('../../../../auth/auth-middleware-factory');
const { respondPayload, respondError } = require('../../../router-utils');
const stripeCreditCardController = require('../../../../controllers/stripe/stripe-credit-card-controller');

const createCardReqHandler = (req, res) => stripeCreditCardController.setStripeUserSourceCard(req.meta.user, req.body.stripeToken)
  .then(() => res.status(HttpStatus.MULTIPLE_CHOICES).redirect(`${req.headers.origin}/#/billing?is_redirected=true`))
  .catch(respondError(res));

const getCardConfirmationReqHandler = (req, res) => stripeCreditCardController.isUserHaveCards(req.meta.user)
  .then(respondPayload(res))
  .catch(respondError(res));

const deleteAllCardsReqHandler = (req, res) => stripeCreditCardController.deleteAllUserCards(req.meta.user)
  .then(respondPayload(res))
  .catch(respondError(res));

router.route('/')
  .get(getCardConfirmationReqHandler)
  .post(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), createCardReqHandler)
  .delete(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), deleteAllCardsReqHandler);

module.exports = router;
