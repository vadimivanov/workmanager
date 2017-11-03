const router = require('express').Router();
const HttpStatus = require('http-status-codes');
const _ = require('lodash/fp');

const singleUserRoute = require('./single-user');
const userController = require('../../../../controllers/user-controller');
const log = require('../../../../utils/logger/logger')(module);
const { respondPayload, respondError } = require('../../../router-utils');

const allUsersReqHandler = (req, res) => {
  const { offset, limit, email } = req.query;
  userController.getAllUsers(offset, limit, email)
    .then(respondPayload(res))
    .catch(respondError(res))
};

router.param('user_id', (req, res, next, id) => {
  userController.getUserById(id)
    .then((user) => {
      _.isEmpty(user)
        ? res.status(HttpStatus.NO_CONTENT).end()
        : !_.isEmpty(_.get('auth.user', req)) && _.get('auth.user', req).is_enabled === false
          ? res.status(HttpStatus.LOCKED).send({ success: false, msg: 'Blocked user!' })
          : (
            req.meta = { user },
            next()
          )
    })
    .catch((e) => {
      log.error(e.message);
      res.status(HttpStatus.BAD_REQUEST).send(e.message);
    });
});

router.use('/:user_id', singleUserRoute);
router.use('/', allUsersReqHandler);

module.exports = router;
