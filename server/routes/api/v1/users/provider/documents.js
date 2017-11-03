const router = require('express').Router();

const auth = require('../../../../../auth');
const AuthMiddleware = require('../../../../../auth/auth-middleware-factory');
const documentController = require('../../../../../controllers/document-controller');
const { respondPayload, respondError, respondFileDownload } = require('../../../../router-utils/index');

const getDocumentByIdReqHandler = (req, res) => {
  documentController.getDocumentById(req.params.document_id)
    .then(respondFileDownload(res))
    .catch(respondError(res));
};

const replaceDocumentReqHandler = (req, res) => {
  documentController.replaceDocument(req.body, req.params.document_id)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const createDocumentReqHandler = (req, res) => {
  documentController.createDocument(req.body, req.meta.provider)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const getDocumentsByProviderReqHandler = (req, res) => {
  documentController.getDocumentsByProvider(req.meta.provider, req.query.offset, req.query.limit)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const deleteDocumentReqHandler = (req, res) => {
  documentController.deleteDocument(req.params.document_id)
    .then(respondPayload(res))
    .catch(respondError(res));
};

router.route('/:document_id')
  .get(getDocumentByIdReqHandler)
  .put(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), replaceDocumentReqHandler)
  .delete(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), deleteDocumentReqHandler);

router.route('/')
  .post(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), createDocumentReqHandler)
  .get(getDocumentsByProviderReqHandler);

module.exports = router;
