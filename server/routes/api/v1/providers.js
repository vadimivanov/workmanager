const router = require('express').Router();

const authMiddleware = require('../../../auth/auth-middleware-factory');
const providerController = require('../../../controllers/provider/provider-controller');
const providerSearchController = require('../../../controllers/provider/provider-search-controller');
const planLimitController = require('../../../controllers/plan-limit-controller');
const { respondPayload, respondError, emitProvidersVisits } = require('../../router-utils');

const getProviderReqHandler = (req, res) => {
  providerController.getFullProviderById(req.params.provider_id)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const getAllProvidersReqHandler = (req, res) => {
  const { offset, limit, subserviceName, serviceName, lng, lat, distance, minRating, maxRating, isSortByRatingOnly, searchText, city, zipCode, isGettingDisabledUsers, getAutomaticallyRegisteredUsers } = req.query;
  providerSearchController.findUserProviderBy({ offset, limit, subserviceName, serviceName, lng, lat, distance, minRating, maxRating, isSortByRatingOnly, searchText, city, zipCode, isGettingDisabledUsers, getAutomaticallyRegisteredUsers })
    .then(emitProvidersVisits(req))
    .then(planLimitController.sortProviders)
    .then(respondPayload(res))
    .catch(respondError(res));
};

router.route('/:provider_id')
  .get(getProviderReqHandler);

router.route('/')
  .get(getAllProvidersReqHandler);

module.exports = router;
