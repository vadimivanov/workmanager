const router = require('express').Router();

const { respondPayload, respondError } = require('../../../router-utils');
const emailController = require('../../../../controllers/email-controller');
const userController = require('../../../../controllers/user-controller');
const stripeController = require('../../../../controllers/stripe/stripe-controller');

const changeEmailReqHandler = (req, res) => {
  const { email } = req.body;
  userController.updateUserById({ email }, req.meta.user.id)
    .then(updatedUser => emailController.sendEmailForConfirm(req.headers, updatedUser)
      .then(stripeController.updateStripeCustomerEmail(email, req.meta.user)
        .then(respondPayload(res)(updatedUser))))
    .catch(respondError(res));
};

router.put('/', changeEmailReqHandler);

module.exports = router;
