const router = require('express').Router();

const auth = require('../../../../../auth/index');
const authMiddleware = require('../../../../../auth/auth-middleware-factory');
const raterNotificationsController = require('../../../../../controllers/rater/rater-notifications-controller');
const { respondPayload, respondError } = require('../../../../router-utils/index');

const getNotificationsReqHandler = (req, res) => {
  raterNotificationsController.getNotifications(req.meta.user)
    .then(respondPayload(res))
    .catch(respondError(res))
};

router.route('/')
  .get(getNotificationsReqHandler)

module.exports = router;
