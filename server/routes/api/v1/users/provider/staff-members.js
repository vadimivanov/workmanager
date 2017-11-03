const router = require('express').Router();

const _ = require('lodash/fp');
const auth = require('../../../../../auth');
const AuthMiddleware = require('../../../../../auth/auth-middleware-factory');
const staffMemberController = require('../../../../../controllers/staff-member-controller');
const planLimitController = require('../../../../../controllers/plan-limit-controller');
const { respondPayload, respondError, getParsedFormData } = require('../../../../router-utils/index');

const createStaffMemberReqHandler = (req, res) => {
  staffMemberController.createStaffMember(req.body, req.meta.provider)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const getStaffMemberByIdReqHandler = (req, res) => {
  staffMemberController.getStaffMemberById(req.params.staff_id)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const getAllStaffMembersByProviderReqHandler = (req, res) => {
  staffMemberController.getAllStaffMembersByProvider(req.meta.provider, req.query.offset, req.query.limit)
    .then(planLimitController.filterStaffMembers(_.get('auth.user', req), req.meta.provider))
    .then(respondPayload(res))
    .catch(respondError(res));
};

const updateStaffMemberReqHandler = (req, res) => {
  staffMemberController.updateStaffMemberByIdAndProvider(req.body, req.params.staff_id, req.meta.provider)
    .then(respondPayload(res))
    .catch(respondError(res));
};

const deleteStaffMemberReqHandler = (req, res) => {
  staffMemberController.deleteStaffMemberByIdAndProvider(req.params.staff_id, req.meta.provider)
    .then(respondPayload(res))
    .catch(respondError(res));
};

router.route('/:staff_id')
  .get(getStaffMemberByIdReqHandler)
  .put(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), updateStaffMemberReqHandler)
  .delete(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), deleteStaffMemberReqHandler);

router.route('/')
  .get(getAllStaffMembersByProviderReqHandler)
  .post(AuthMiddleware.preConctructedMiddlewares.allowOwnerSupporterAdmin(), createStaffMemberReqHandler);

module.exports = router;
