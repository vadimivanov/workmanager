const _ = require('lodash/fp');

const userPrivateFields = require('../../config/model-fields/user-private-fields.config.json');
const providersAllIncludedModels = require('../../config/model-fields/providers-all-included-models.config');
const { User, NotificationSettingsList, ProblemFeedbackReport, Provider, Rater } = require('../models');

class UserService {
  constructor() {
    this.getFullUser = predicate => User.findOne({
      where: predicate,
      attributes: { exclude: userPrivateFields },
      include: [NotificationSettingsList,
        ProblemFeedbackReport,
        Rater, {
          model: Provider,
          include: providersAllIncludedModels,
        },
      ],
    });

    this.getUser = predicate => User.findOne({ where: predicate });

    /**
     * @param userFields {Object}
     * @param predicate {Object} - where parameters
     */
    this.updateUser = (userFields, predicate) => User.update(
      userFields, {
        where: predicate,
        returning: true,
        plain: true,
      })
      .then(_.last);
  }
}

module.exports = new UserService();
