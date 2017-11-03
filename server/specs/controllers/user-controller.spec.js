const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');

const initialization = require('../../initialization/postgres-connect.initialization.js');
const userController = require('../../controllers/user-controller');
const userUtils = require('../helpers/user-management.helper');
const [userRater] = require('../../../config/database/seeds/Users.seed.json');

const TEST_USER = Object.assign({},
  userRater, {
    login: Date.now() + userRater.login,
    email: Date.now() + userRater.email,
  }
);

delete TEST_USER.id;

describe('User controller', () => {
  let createdUser = null;

  before('Create new user', async () => {
    try {
      await initialization;
      createdUser = await userController.createUser(TEST_USER);
      expect(createdUser.login).to.equal(TEST_USER.login);
    } catch (e) {
      console.error(e.message);
      expect(e).to.not.exist;
    }
  });

  it('Get single user', async () => {
    try {
      const singleUser = await userController.getUserById(createdUser.get('id'));
      expect(singleUser.get('login')).to.equal(TEST_USER.login);
    } catch (e) {
      console.error(e.message);
      expect(e).to.not.exist;
    }
  });

  it('Update user', async () => {
    try {
      const updatedUser = (await userController.updateUserById({ is_enabled: true }, createdUser.get('id')));
      expect(updatedUser.get('login')).to.equal(TEST_USER.login);
    } catch (e) {
      console.error(e.message);
      expect(e).to.not.exist;
    }
  });

  it('Get all users', async () => {
    try {
      const users = await userController.getAllUsers();
      expect(users).to.be.not.empty;
    } catch (e) {
      console.error(e.message);
      expect(e).to.not.exist;
    }
  });

  after('Delete user', async () => {
    try {
      await userUtils.deleteUser(createdUser);
    } catch (e) {
      console.log(e.message);
      expect(e).to.not.exist;
    }
  });
}
);
