const router = require('express').Router();

const { respondPayload, respondError } = require('../../../router-utils');
const stripeController = require('../../../../controllers/stripe/stripe-controller');

const plansReqHandler = (req, res) => {
  stripeController.getAllBillingPlans()
    .then(respondPayload(res))
    .catch(respondError(res));
};

router.get('/plans', plansReqHandler);

module.exports = router;
