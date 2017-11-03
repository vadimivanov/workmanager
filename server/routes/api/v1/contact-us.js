const router = require('express').Router();

const { respondPayload, respondError } = require('../../router-utils');
const emailController = require('../../../controllers/email-controller');

const contactUsReqHandler = (req, res) => {
  emailController.contactUs(req.body)
    .then(respondPayload(res))
    .catch(respondError(res));
};

router.post('/', contactUsReqHandler);

module.exports = router;
