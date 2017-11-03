const EventEmitter = require('events');
const _ = require('lodash/fp');

const roles = require('../../../config/database/enums/UserRoles.enum.json');
const userController = require('../user-controller');
const { Rater, Feedback, ProblemFeedbackReport, Provider, User } = require('../../models/index');
const { sanitizeSubject } = require('../controller-utils/index');

// This types of plans don't set plans in stripe - only correspond to their id
const billingPlans = require('../../../config/database/enums/StripeBillingPlans.enum.json');

class RaterController extends EventEmitter {
  static get fullRaterIncludedModels() {
    return [
      {
        model: User,
        where: {
          is_verified: true,
        },
      },
      {
        model: Feedback,
        include: [ProblemFeedbackReport, Provider],
      }]
  }

  constructor() {
    super();

    /* GET */

    this.getAllFullRaters = (offset, limit) => Rater.findAll({
      offset,
      limit,
      order: [['created_at', 'ASC']],
      include: RaterController.fullRaterIncludedModels,
    });

    this.getRaterByUser = ({ id }) => Rater.findOne({
      where: { user_id: id },
    });

    this.getFullRaterById = id => Rater.findOne({
      where: { id },
      include: RaterController.fullRaterIncludedModels,
    });

    /* PUT */

    this.updateRaterByUserId = (rater, userId) => Rater.update(
      Object.assign({},
      sanitizeSubject(rater),
      { user_id: userId }), {
        where: { user_id: userId },
        user_id: userId,
        returning: true,
        plain: true,
      })
      .then(_.last);
  }
}

module.exports = new RaterController();
