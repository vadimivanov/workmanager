const router = require('express').Router();

const portfolioPhotoController = require('../../../controllers/portfolio-photo-controller');
const { respondPayload, respondError } = require('../../router-utils');

const getAllInspirationPortfolioPhotosReqHandler = (req, res) => {
  portfolioPhotoController.getAllInspirationPortfolioPhotos(req.query.offset, req.query.limit)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const getAllPortfolioPhotosByInspirationCategoryReqHandler = (req, res) => {
  portfolioPhotoController.getAllPortfolioPhotosByInspirationCategory(req.params.inspiration_category_id, req.query.offset, req.query.limit)
    .then(respondPayload(res))
    .catch(respondError(res));
};

router.route('/')
  .get(getAllInspirationPortfolioPhotosReqHandler);

router.route('/:inspiration_category_id')
  .get(getAllPortfolioPhotosByInspirationCategoryReqHandler);

module.exports = router;
