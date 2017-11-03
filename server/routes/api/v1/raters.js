const router = require('express').Router();

const raterController = require('../../../controllers/rater/rater-controller');
const { respondPayload, respondError } = require('../../router-utils');

const getRaterReqHandler = (req, res) => {
  raterController.getFullRaterById(req.params.rater_id)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const getAllRatersReqHandler = (req, res) => {
  raterController.getAllFullRaters(req.query.offset, req.query.limit)
    .then(respondPayload(res))
    .catch(respondError(res));
};

router.route('/:rater_id')
  .get(getRaterReqHandler);

router.route('/')
  .get(getAllRatersReqHandler);

module.exports = router;
