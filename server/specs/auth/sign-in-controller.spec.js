const { describe, it, before } = require('mocha');
const { expect } = require('chai');

const initialization = require('../../initialization/postgres-connect.initialization');
const signInController = require('../../auth/sign-in-controller');
const userUtils = require('../helpers/user-management.helper');
const [, userProvider] = require('../../../config/database/seeds/Users.seed.json');
const [testProvider] = require('../../../config/database/seeds/Providers.seed.json');

describe('Sign in controller', () => {
  let createdUser = null;

  before('Create new user provider', async () => {
    try {
      await initialization;
      createdUser = await userUtils.createUniqueUserProvider(userProvider, testProvider);
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  describe('JWT token should be when valid credentials -', () => {
    it('valid login', async () => {
      try {
        const token = await signInController.getToken({
          login: createdUser.login,
          password: userProvider.password,
        });
        // console.log(jwt.decode(token, 'MyS3cr3tK3Y'));
        expect(token).to.exist;
      } catch (e) {
        console.log(JSON.stringify(e, null, 4));
        expect(e).to.not.exist;
      }
    });

    it('valid email', async () => {
      try {
        const token = await signInController.getToken({
          email: createdUser.email,
          password: userProvider.password,
        });
        expect(token).to.exist;
      } catch (e) {
        console.log(JSON.stringify(e, null, 4));
        expect(e).to.not.exist;
      }
    });
  });

  describe('No JWT token should be when invalid credentials -', () => {
    it('empty credentials', async () => {
      try {
        const token = await signInController.getToken({});
        expect(token).to.not.exist;
      } catch (e) {
        console.error(e.message);
        expect(e).to.not.exist;
      }
    });

    it('no login and email', async () => {
      try {
        const token = await signInController.getToken({ password: createdUser.password });
        expect(token).to.not.exist;
      } catch (e) {
        console.error(e.message);
        expect(e).to.not.exist;
      }
    });

    it('no password', async () => {
      try {
        const token = await signInController.getToken({ login: createdUser.login });
        expect(token).to.not.exist;
      } catch (e) {
        console.error(e.message);
        expect(e).to.not.exist;
      }
    });

    it('wrong password', async () => {
      try {
        const token = await signInController.getToken({ password: 'aaa' });
        expect(token).to.not.exist;
      } catch (e) {
        console.error(e.message);
        expect(e).to.not.exist;
      }
    })
  });

  after('Delete user', async () => {
    try {
      await userUtils.deleteUser(createdUser);
    } catch (e) {
      console.log(e.message);
      expect(e).to.not.exist;
    }
  });
})
