const router = require('express').Router();

const auth = require('../../../../../auth');
const authMiddleware = require('../../../../../auth/auth-middleware-factory');
const visitController = require('../../../../../controllers/visit-controller');
const planLimitController = require('../../../../../controllers/plan-limit-controller');
const { respondPayload, respondError } = require('../../../../router-utils/index');

const getVisitsByProviderReqHandler = (req, res) => {
  visitController.getAllVisitsByProvider(req.meta.provider, req.offset, req.limit)
    .then(planLimitController.filterStatistics(req.meta.provider))
    .then(respondPayload(res))
    .catch(respondError(res));
};

router.route('/')
  .get(getVisitsByProviderReqHandler);

module.exports = router;
