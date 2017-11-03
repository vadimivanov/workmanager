const router = require('express').Router();
const _ = require('lodash/fp');

const { getParsedFormDataSingleFile, respondPayload, respondError } = require('../../router-utils');
const fileUploadsController = require('../../../controllers/file-uploads-controller');
const planLimitController = require('../../../controllers/plan-limit-controller');

const imagesReqHandler = (req, res) => {
  getParsedFormDataSingleFile(req)
    .then(file => fileUploadsController.saveImage(file))
    .then(respondPayload(res))
    .catch(respondError(res));
};

const filesReqHandler = (req, res) => {
  planLimitController.checkFilesUploading(_.get('auth.user', req))
    .then(() => getParsedFormDataSingleFile(req))
    .then(file => fileUploadsController.saveFile(file))
    .then(respondPayload(res))
    .catch(respondError(res));
};

router.post('/images', imagesReqHandler);
router.post('/files', filesReqHandler);

module.exports = router;
