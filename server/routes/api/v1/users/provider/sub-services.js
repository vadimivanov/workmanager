const router = require('express').Router();

const AuthMiddleware = require('../../../../../auth/auth-middleware-factory');
const providerController = require('../../../../../controllers/provider/provider-controller');
const { respondPayload, respondError } = require('../../../../router-utils');

const setSubServicesToProviderReqHandler = (req, res) => {
  providerController.setSubServicesToProvider(req.meta.provider, req.body)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const getSubServicesByProviderReqHandler = (req, res) => {
  providerController.getSubServicesByProvider(req.meta.provider)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const removeSubServiceFromProviderReqHandler = (req, res) => {
  providerController.removeSubServiceFromProvider(req.meta.provider, req.params.sub_service_id)
    .then(respondPayload(res))
    .catch(respondError(res));
};

router.route('/:sub_service_id')
  .delete(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), removeSubServiceFromProviderReqHandler);

router.route('/')
  .get(getSubServicesByProviderReqHandler)
  .post(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), setSubServicesToProviderReqHandler);

module.exports = router;
