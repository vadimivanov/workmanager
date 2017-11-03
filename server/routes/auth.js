const router = require('express').Router();
const HttpStatus = require('http-status-codes');
const log = require('../utils/logger/logger')(module);

const { respondPayload, respondError } = require('./router-utils');
const signInController = require('../auth/sign-in-controller');
const userController = require('../controllers/user-controller');

const signIn = (req, res) => {
  const { login, email, password } = req.body;
  const sendUnAuth = () => res.status(HttpStatus.UNAUTHORIZED).send({ success: false, msg: 'Wrong credentials!' });
  const sendBlocked = message => res.status(HttpStatus.LOCKED).send(message);

  if (password && (email || login)) {
    signInController.checkIsUserBlocked({ login, email, password })
      .then(messageOfBlocking => messageOfBlocking
        ? sendBlocked(messageOfBlocking)
        : signInController
          .getToken({ login, email, password })
          .then(token => token
            ? res.send(token)
            : sendUnAuth()
          )
      )
      .catch((e) => {
        log.error(e);
        sendUnAuth();
      })
  } else sendUnAuth()
};

const createUserRater = (req, res) =>
  userController.createUserRater(req.body)
    .then(createdUser => signInController.appendingTokenToUser(createdUser))
    .then(respondPayload(res))
    .catch(respondError(res));

const createUserProvider = (req, res) =>
  userController.createUserProvider(req.body)
    .then(createdUser => signInController.appendingTokenToUser(createdUser))
    .then(respondPayload(res))
    .catch(respondError(res));

router.post('/sign-in', signIn);
router.post('/sign-up/rater', createUserRater);
router.post('/sign-up/provider', createUserProvider);

module.exports = router;
