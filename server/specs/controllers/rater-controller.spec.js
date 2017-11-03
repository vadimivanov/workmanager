const { describe, it, before } = require('mocha');
const { expect } = require('chai');

const initialization = require('../../initialization/postgres-connect.initialization');
const raterController = require('../../controllers/rater/rater-controller');
const userController = require('../../controllers/user-controller');
const [userRater] = require('../../../config/database/seeds/Users.seed.json');
const [firstRater] = require('../../../config/database/seeds/Raters.seed.json');

const userUtils = require('../helpers/user-management.helper');

const TEST_USER = Object.assign({},
  userRater, {
    login: Date.now() + userRater.login,
    email: Date.now() + userRater.email,
  }
);

const TEST_RATER = Object.assign({}, firstRater);

delete TEST_USER.id;
delete TEST_RATER.id;

describe('Rater controller', () => {
  let createdUser = null;

  before('Create new rater', async () => {
    try {
      await initialization;
      createdUser = await userController.createUserRater(TEST_USER);

      expect(createdUser.get('login')).to.equal(TEST_USER.login);
    } catch (e) {
      console.error(e.message);
      expect(e).to.not.exist;
    }
  });

  it('Get single rater by users ID', async () => {
    try {
      const singleRater = await raterController.getRaterByUser(createdUser);

      expect(singleRater.get('user_id')).to.equal(createdUser.get('id'));
    } catch (e) {
      console.error(e.message);
      expect(e).to.not.exist;
    }
  });

  it('Replace single user-rater by himself', async () => {
    try {
      const updatedRater = await raterController.updateRaterByUserId(TEST_RATER, createdUser.get('id'));
      expect(updatedRater.get('first_name')).to.equal(TEST_RATER.first_name);
    } catch (e) {
      console.error(e.message);
      expect(e).to.not.exist;
    }
  });

  after('Delete user and rater', async () => {
    try {
        //await raterService.deleteRaterById(createdRater.get('id'));
      await userUtils.deleteUser(createdUser);
    } catch (e) {
      console.log(e.message);
      expect(e).to.not.exist;
    }
  });
});
