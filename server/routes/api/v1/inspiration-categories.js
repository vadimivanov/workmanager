const router = require('express').Router();

const AuthMiddleware = require('../../../auth/auth-middleware-factory');
const inspirationCategoryController = require('../../../controllers/inspiration-categories-controller');
const { respondPayload, respondError } = require('../../router-utils');

const createInspirationCategoryReqHandler = (req, res) => {
  inspirationCategoryController.createInspirationCategory(req.body)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const getInspirationCategoryReqHandler = (req, res) => {
  inspirationCategoryController.getInspirationCategoryById(req.params.category_id)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const getAllInspirationCategoriesReqHandler = (req, res) => {
  inspirationCategoryController.getAllInspirationCategories(req.query.offset, req.query.limit)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const updateInspirationCategoryReqHandler = (req, res) => {
  inspirationCategoryController.updateInspirationCategory(req.body, req.params.category_id)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const deleteInspirationCategoryReqHandler = (req, res) => {
  inspirationCategoryController.deleteInspirationCategoryById(req.params.category_id)
    .then(respondPayload(res))
    .catch(respondError(res));
};

router.route('/:category_id')
  .get(getInspirationCategoryReqHandler)
  .put(AuthMiddleware.preConctructedMiddlewares.allowSupporterAdmin(), updateInspirationCategoryReqHandler)
  .delete(AuthMiddleware.preConctructedMiddlewares.allowSupporterAdmin(), deleteInspirationCategoryReqHandler);

router.route('/')
  .post(AuthMiddleware.preConctructedMiddlewares.allowSupporterAdmin(), createInspirationCategoryReqHandler)
  .get(getAllInspirationCategoriesReqHandler);

module.exports = router;
