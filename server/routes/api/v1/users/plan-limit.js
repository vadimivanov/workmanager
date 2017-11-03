const router = require('express').Router();

const planLimitController = require('../../../../controllers/plan-limit-controller');
const { respondPayload, respondError } = require('../../../router-utils');

const getUserPlanLimitReqHandler = (req, res) =>
  planLimitController.getPlanLimitByUser(req.meta.user)
    .then(respondPayload(res))
    .catch(respondError(res));

router.route('/')
  .get(getUserPlanLimitReqHandler);

module.exports = router;
