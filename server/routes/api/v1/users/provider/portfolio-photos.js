const router = require('express').Router();
const _ = require('lodash/fp');

const auth = require('../../../../../auth');
const AuthMiddleware = require('../../../../../auth/auth-middleware-factory');
const portfolioPhotoController = require('../../../../../controllers/portfolio-photo-controller');
const planLimitController = require('../../../../../controllers/plan-limit-controller');
const { respondPayload, respondError, respondFile } = require('../../../../router-utils/index');

const createPortfolioPhotoReqHandler = (req, res) => {
  portfolioPhotoController.getAllPortfolioPhotosByProvider(_.get('auth.user', req), req.meta.provider)
    .then(planLimitController.checkQuantityPhotos(req.body, req.meta.provider))
    .then(() => portfolioPhotoController.createPortfolioPhoto(req.body, req.meta.provider))
    .then(respondPayload(res))
    .catch(respondError(res));
};

const getAllPortfolioPhotosByProviderReqHandler = (req, res) => {
  portfolioPhotoController.getAllPortfolioPhotosByProvider(_.get('auth.user', req), req.meta.provider, req.query.offset, req.query.limit)
    .then(planLimitController.filterPhotos(_.get('auth.user', req), req.meta.provider))
    .then(respondPayload(res))
    .catch(respondError(res));
};

const getPortfolioPhotoByIdReqHandler = (req, res) => {
  portfolioPhotoController.getPortfolioPhotoById(req.params.portfolio_photo_id, req.query.file)
    .then(respondFile(res, req.query.file))
    .catch(respondError(res));
};

const updatePortfolioPhotoByIdAndProviderReqHandler = (req, res) => {
  portfolioPhotoController.updatePortfolioPhotoByIdAndProvider(req.body, req.params.portfolio_photo_id, req.meta.provider)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const deletePortfolioPhotoByIdReqHandler = (req, res) => {
  portfolioPhotoController.deletePortfolioPhotoById(req.params.portfolio_photo_id)
    .then(respondPayload(res))
    .catch(respondError(res));
};

router.route('/:portfolio_photo_id')
  .get(getPortfolioPhotoByIdReqHandler)
  .put(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), updatePortfolioPhotoByIdAndProviderReqHandler)
  .delete(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), deletePortfolioPhotoByIdReqHandler);

router.route('/')
  .get(getAllPortfolioPhotosByProviderReqHandler)
  .post(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), createPortfolioPhotoReqHandler);

module.exports = router;
