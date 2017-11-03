const router = require('express').Router();

const { respondPayload, respondError } = require('../../../../router-utils');
const emailController = require('../../../../../controllers/email-controller');

const sendRequestFeedbackByEmailReqHandler = (req, res) => {
  emailController.sendRequestFeedbackByEmail(req.headers, req.body, req.meta.user, req.meta.provider)
    .then(respondPayload(res))
    .catch(respondError(res));
};

router.post('/', sendRequestFeedbackByEmailReqHandler);

module.exports = router;
