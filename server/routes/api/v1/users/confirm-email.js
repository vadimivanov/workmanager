const router = require('express').Router();
const HttpStatus = require('http-status-codes');

const emailController = require('../../../../controllers/email-controller');
const userController = require('../../../../controllers/user-controller');

const confirmEmailReqHandler = (req, res) => {
  emailController.confirmEmail(req.query.email, req.meta.user)
    .then(isVerified => userController.updateUserById(isVerified, req.meta.user.id))
    .then(() => res.status(HttpStatus.MULTIPLE_CHOICES).redirect(`http://${req.headers.host}`))
    .catch(() => res.status(HttpStatus.MULTIPLE_CHOICES).redirect(`http://${req.headers.host}`));
};

router.get('/', confirmEmailReqHandler);

module.exports = router;
