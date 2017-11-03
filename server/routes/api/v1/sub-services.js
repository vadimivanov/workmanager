const router = require('express').Router();

const AuthMiddleware = require('../../../auth/auth-middleware-factory');
const subServiceController = require('../../../controllers/subservice-controller');
const { respondPayload, respondError } = require('../../router-utils');

const createSubServiceReqHandler = (req, res) => {
  subServiceController.createSubService(req.body)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const getAllSubServicesReqHandler = (req, res) => {
  subServiceController.getAllSubServices(req.query.offset, req.query.limit)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const getSubServiceByIdReqHandler = (req, res) => {
  subServiceController.getSubServiceById(req.params.sub_service_id)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const updateSubServiceReqHandler = (req, res) => {
  subServiceController.updateSubService(req.body, req.params.sub_service_id)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const deleteSubServiceByIdReqHandler = (req, res) => {
  subServiceController.deleteSubServiceById(req.params.sub_service_id)
    .then(respondPayload(res))
    .catch(respondError(res));
};

router.route('/:sub_service_id')
  .get(getSubServiceByIdReqHandler)
  .put(AuthMiddleware.preConctructedMiddlewares.allowSupporterAdmin(), updateSubServiceReqHandler)
  .delete(AuthMiddleware.preConctructedMiddlewares.allowSupporterAdmin(), deleteSubServiceByIdReqHandler);

router.route('/')
  .post(AuthMiddleware.preConctructedMiddlewares.allowSupporterAdmin(), createSubServiceReqHandler)
  .get(getAllSubServicesReqHandler);

module.exports = router;
