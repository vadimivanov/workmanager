const router = require('express').Router();

const { respondPayload, respondError } = require('../../../router-utils');
const userController = require('../../../../controllers/user-controller');

const updateSubscribeOfUserToStripePlanReqHandler = (req, res) => {
  userController.updateSubscribeOfUserOnStripePlan(req.meta.user, req.body.plan_id)
    .then(respondPayload(res))
    .catch(respondError(res));
};

router.route('/')
  .put(updateSubscribeOfUserToStripePlanReqHandler);

module.exports = router;
