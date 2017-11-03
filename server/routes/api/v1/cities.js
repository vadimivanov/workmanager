const router = require('express').Router();

const zipCityController = require('../../../controllers/zip-city-controller');
const { respondPayload, respondError } = require('../../router-utils');

const getAllCitiesReqHandler = (req, res) => {
  const { offset, limit, zipPart, cityPart } = req.query;

  return zipCityController.getAllCities({ offset, limit, zipPart, cityPart })
    .then(respondPayload(res))
    .catch(respondError(res));
};

router.route('/')
  .get(getAllCitiesReqHandler);

module.exports = router;
