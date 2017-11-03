const router = require('express').Router();

const auth = require('../../../../../auth');
const AuthMiddleware = require('../../../../../auth/auth-middleware-factory');
const raterController = require('../../../../../controllers/rater/rater-controller');
const { respondPayload, respondError } = require('../../../../router-utils');

const getUserRaterReqHandler = (req, res) => {
  raterController.getRaterByUser(req.meta.user)
    .then(respondPayload(res))
    .catch(respondError(res))
};

const updateUserReqHandler = (req, res) =>
  raterController.updateRaterByUserId(req.body, req.meta.user.id)
    .then(respondPayload(res))
    .catch(respondError(res));

const putRaterToReq = req => raterController.getRaterByUser(req.meta.user)
  .then(rater => req.meta.rater = rater);

router.all('*', (req, res, next) => {
  putRaterToReq(req)
    .then(()=>next())
    .catch(respondError(res))
});

router.use('/feedback-requests', require('./feedback-requests'));
router.use('/feedbacks', require('./feedbacks'));
router.use('/notifications', require('./notifications'));

router.route('/')
  .get(getUserRaterReqHandler)
  .put( AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), updateUserReqHandler);

module.exports = router;
