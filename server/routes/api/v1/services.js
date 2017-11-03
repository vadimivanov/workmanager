const router = require('express').Router();

const auth = require('../../../auth');
const AuthMiddleware = require('../../../auth/auth-middleware-factory');
const serviceController = require('../../../controllers/service-controller');
const { respondPayload, respondError } = require('../../router-utils');

const getServiceReqHandler = (req, res) => {
  serviceController.getServiceById(req.params.service_id)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const updateServiceReqHandler = (req, res) => {
  serviceController.updateService(req.body, req.params.service_id)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const deleteServiceReqHandler = (req, res) => {
  serviceController.deleteServiceById(req.params.service_id)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const getAllServicesReqHandler = (req, res) => {
  serviceController.getAllServices(req.query.offset, req.query.limit)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const createServiceReqHandler = (req, res) => {
  serviceController.createService(req.body)
    .then(respondPayload(res))
    .catch(respondError(res));
};

router.route('/:service_id')
  .get(getServiceReqHandler)
  .put(AuthMiddleware.preConctructedMiddlewares.allowSupporterAdmin(), updateServiceReqHandler)
  .delete(AuthMiddleware.preConctructedMiddlewares.allowSupporterAdmin(), deleteServiceReqHandler);

router.route('/')
  .get(getAllServicesReqHandler)
  .post(createServiceReqHandler);

module.exports = router;
