const router = require('express').Router();

const zipCityController = require('../../../controllers/zip-city-controller');
const { respondPayload, respondError } = require('../../router-utils');

const getAllZipCodesReqHandler = (req, res) => {
  const { offset, limit, zipPart, cityPart } = req.query;

  return zipCityController.getAllZipCodes({ offset, limit, zipPart, cityPart })
    .then(respondPayload(res))
    .catch(respondError(res));
};

router.route('/')
  .get(getAllZipCodesReqHandler);

module.exports = router;
