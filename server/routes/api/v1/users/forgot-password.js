const router = require('express').Router();

const { respondPayload, respondError } = require('../../../router-utils');
const emailController = require('../../../../controllers/email-controller');
const signInController = require('../../../../auth/sign-in-controller');

const forgotPasswordReqHandler = (req, res) => {
  signInController.appendingTokenToUser(req.meta.user)
    .then(updatedUser => emailController.forgotPassword(req.headers, updatedUser))
    .then(respondPayload(res))
    .catch(respondError(res));
};

router.get('/', forgotPasswordReqHandler);

module.exports = router;
