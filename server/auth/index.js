const _ = require('lodash/fp');
const passport = require('passport');
const passportJWT = require('passport-jwt');

const userController = require('../controllers/user-controller');
const jwtConfig = require('../../config/auth/jwt.config.json');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

/**
 * Extractor that returns JWT encoded: null with secret key 'MyS3cr3tK3Y'
 */
const unregisteredUserToken = () => 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6bnVsbH0.VyyM6SzjC3AMSM5hD69qibbbBJ1A8jYJDScBU5TLtuQ';

const params = {
  secretOrKey: jwtConfig['jwt-secret'],
  jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeader(), ExtractJwt.fromBodyField('jwtToken'), ExtractJwt.fromUrlQueryParameter('jwtToken'), unregisteredUserToken]),
  passReqToCallback: true,
};

/**
 * This strategy adds user to req.auth.user - if JWT token is valid.
 */
const strategy = new JwtStrategy(params, (req, candidateUser, done) =>
  userController.getUserById(candidateUser.id)
    .then((user) => {
      if (_.isEmpty(user)) {
        req.auth = { user: null };
        done(null, { id: null })
      } else {
        req.auth = { user };
        done(null, { id: user.id })
      }
    })
);

passport.use(strategy);

module.exports = {
  initialize() {
    return passport.initialize();
  },
  authenticate() {
    return passport.authenticate('jwt', jwtConfig['jwt-session']);
  },
};
