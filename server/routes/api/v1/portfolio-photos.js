const router = require('express').Router();

const portfolioPhotoController = require('../../../controllers/portfolio-photo-controller');
const { respondError, respondPayload } = require('../../router-utils');

const getPortfolioPhotoByIdReqHandler = (req, res) => {
  portfolioPhotoController.getPortfolioPhotoById(req.params.portfolio_photo_id)
      .then(respondPayload(res))
      .catch(respondError(res));
};

router.route('/:portfolio_photo_id')
  .get(getPortfolioPhotoByIdReqHandler);

module.exports = router;
