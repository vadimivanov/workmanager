const router = require('express').Router();
const HttpStatus = require('http-status-codes');
const _ = require('lodash/fp');

const documentController = require('../../../controllers/document-controller');
const { respondPayload, respondError, respondFileDownload } = require('../../router-utils');

const getDocumentByIdReqHandler = (req, res) => {
  documentController.getDocumentById(req.params.document_id)
    .then(respondFileDownload(res))
    .catch(respondError(res));
};

const getAllDocumentsReqHandler = (req, res) => {
  documentController.getAllDocuments(req.query.offset, req.query.limit)
    .then(respondPayload(res))
    .catch(respondError(res));
};

router.route('/:document_id')
  .get(getDocumentByIdReqHandler);

router.route('/')
  .get(getAllDocumentsReqHandler);

module.exports = router;
