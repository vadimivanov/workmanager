const { describe, it, before } = require('mocha');
const { expect } = require('chai');

const userUtils = require('../helpers/user-management.helper');
const initialization = require('../../initialization/postgres-connect.initialization');
const [, userProvider] = require('../../../config/database/seeds/Users.seed.json');
const [testProvider] = require('../../../config/database/seeds/Providers.seed.json');
const notificationSettingsLitController = require('../../controllers/notification-settings-list-controller');

const [testNotificationSettingsList] = require('../../../config/database/seeds/NotificationSetingsLists.seed.json');

const TEST_NOTIFICATION_SETTINGS_LIST = Object.assign({},
  testNotificationSettingsList,
  { id: undefined },
);

describe('Notification settings list controller', () => {
  let createdUser = null;
  let createdNotificationSettingsList = null;

  before('Create new user', async () => {
    try {
      createdUser = await userUtils.createUniqueUserProvider(userProvider, testProvider);
    } catch (e) {
      console.error(e.message);
      expect(e).to.not.exist;
    }
  });

  it('Create new notification settings list for user', async () => {
    try {
      createdNotificationSettingsList = await notificationSettingsLitController.createNotificationSettingsListForUser(TEST_NOTIFICATION_SETTINGS_LIST, createdUser);
      expect(createdNotificationSettingsList.email_for_notifications).to.be.equals(TEST_NOTIFICATION_SETTINGS_LIST.email_for_notifications);
    } catch (e) {
      console.error(e.message);
      expect(e).to.not.exist;
    }
  });

  it('Get single notification settings list by user', async () => {
    try {
      const singleNotificationSettingsList = await notificationSettingsLitController.getNotificationSettingsListByUser(createdUser);
      expect(singleNotificationSettingsList.is_feedbacks_notify).to.be.equals(TEST_NOTIFICATION_SETTINGS_LIST.is_feedbacks_notify);
    } catch (e) {
      console.error(e.message);
      expect(e).to.not.exist;
    }
  });

  it('Update notification settings list by user', async () => {
    try {
      const singleNotificationSettingsList = await notificationSettingsLitController.updateNotificationSettingsListByUser(TEST_NOTIFICATION_SETTINGS_LIST, createdUser);
      expect(singleNotificationSettingsList.email_for_notifications).to.be.equals(TEST_NOTIFICATION_SETTINGS_LIST.email_for_notifications);
    } catch (e) {
      console.error(e.message);
      expect(e).to.not.exist;
    }
  });

  after('Delete created user', async () => {
    try {
      await userUtils.deleteUser(createdUser);
    } catch (e) {
      console.log(e.message);
      expect(e).to.not.exist;
    }
  });
});
