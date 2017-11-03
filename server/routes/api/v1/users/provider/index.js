const router = require('express').Router();

const auth = require('../../../../../auth');
const AuthMiddleware = require('../../../../../auth/auth-middleware-factory');
const locationsRouter = require('./locations');
const portfolioPhotosRouter = require('./portfolio-photos');
const documentsRouter = require('./documents');
const staffMembersRouter = require('./staff-members');
const feedbackRequestsRouter = require('./feedback-requests');
const feedbacksRouter = require('./feedbacks');
const providerSubServices = require('./sub-services');
const visitsRouter = require('./visits');
const _ = require('lodash/fp');

const providerController = require('../../../../../controllers/provider/provider-controller');
const planLimitController = require('../../../../../controllers/plan-limit-controller');
const { respondPayload, respondError, emitProvidersVisits } = require('../../../../router-utils');

const getProviderReqHandler = (req, res) => {
  providerController.getProviderByUser(req.meta.user)
    .then(planLimitController.filterNews(_.get('auth.user', req)))
    .then(emitProvidersVisits(res))
    .then(respondPayload(res))
    .catch(respondError(res))
};

const updateProviderReqHandler = (req, res) => {
  providerController.updateProviderByUserId(req.body, req.meta.user.id)
    .then(respondPayload(res))
    .catch(respondError(res))
};

const putProviderToReq = req => providerController.getProviderByUser(req.meta.user)
  .then(provider => req.meta.provider = provider);

router.all('*', (req, res, next) => {
  putProviderToReq(req)
  .then(()=>next())
  .catch(respondError(res))
});

router.use('/locations', locationsRouter);
router.use('/portfolio-photos', portfolioPhotosRouter);
router.use('/documents', documentsRouter);
router.use('/staff-members', staffMembersRouter);
router.use('/feedback-requests', feedbackRequestsRouter);
router.use('/feedbacks', feedbacksRouter);
router.use('/subservices', providerSubServices);
router.use('/visits', visitsRouter);
router.use('/notifications', require('./notifications'));
router.use('/request-feedback-by-email', require('./request-feedback-by-email'));

router.route('/')
  .get(getProviderReqHandler)
  .put(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), updateProviderReqHandler);

module.exports = router;
