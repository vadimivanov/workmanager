const router = require('express').Router();

const auth = require('../../../../../auth');
const AuthMiddleware = require('../../../../../auth/auth-middleware-factory');
const locationController = require('../../../../../controllers/location-controller');
const { respondPayload, respondError } = require('../../../../router-utils/index');

const createLocationsReqHandler = (req, res) => {
  locationController.createLocationByProvider(req.body, req.meta.provider)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const getLocationsByProviderReqHandler = (req, res) => {
  locationController.getLocationsByProvider(req.meta.provider)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const updateLocationByIdReqHandler = (req, res) => {
  locationController.replaceLocation(req.body, req.params.location_id)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const getLocationsByIdReqHandler = (req, res) => {
  locationController.getLocationById(req.params.location_id)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const deleteLocationsByIdReqHandler = (req, res) => {
  locationController.deleteLocationById(req.params.location_id)
    .then(respondPayload(res))
    .catch(respondError(res));
};

router.route('/:location_id')
  .get(getLocationsByIdReqHandler)
  .put(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), updateLocationByIdReqHandler)
  .delete(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), deleteLocationsByIdReqHandler);

router.route('/')
  .post(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), createLocationsReqHandler)
  .get(getLocationsByProviderReqHandler);

module.exports = router;
