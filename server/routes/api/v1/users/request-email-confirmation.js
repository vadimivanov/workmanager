const router = require('express').Router();

const { respondPayload, respondError } = require('../../../router-utils');
const emailController = require('../../../../controllers/email-controller');

const sendEmailToConfirmReqHandler = (req, res) => {
  emailController.sendEmailForConfirm(req.headers, req.meta.user)
    .then(respondPayload(res))
    .catch(respondError(res));
};

router.get('/', sendEmailToConfirmReqHandler);

module.exports = router;
