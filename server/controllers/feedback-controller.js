const EventEmitter = require('events');
const _ = require('lodash/fp');

const log = require('../utils/logger/logger')(module);
const userController = require('./user-controller');
const providerService = require('../services/provider.service');
const feedbackService = require('../services/feedback.service');
const { Feedback, Provider, Rater } = require('../models');
const roles = require('../../config/database/enums/UserRoles.enum.json');

class FeedbackController extends EventEmitter {
  constructor() {
    super();

    /**
     * @param feedbackDTO {FeedbackDTO}
     * @param rater {Rater}
     */
    this.createFeedback = (feedbackDTO, rater) => {
      if (!feedbackDTO.provider_id) {
        //let's create a new dummy provider
        log.info('Feedback will be created after provider system registration');
        return userController.createUserProvider({
          login: feedbackDTO.provider_email,
          email: feedbackDTO.provider_email,
          password: feedbackDTO.provider_email,
        })
        //update Provider from feedback DTO
          .then(systemRegisteredUser => userController.updateUserById({ is_self_registered: false }, systemRegisteredUser.id)
            .then(updatedUser => providerService.updateProvider(
              { company_name: feedbackDTO.company_name },
              { user_id: updatedUser.id }
            ))
          .then((systemRegisteredProvider) => {
            const systemRegistredProviderFeedback = Object.assign(
              { provider_id: systemRegisteredProvider.id },
              _.getOr(feedbackDTO, 'dataValues', feedbackDTO)
            );
            return feedbackService.createFeedback(systemRegistredProviderFeedback, rater);
          }))
      }

      return feedbackService.createFeedback(feedbackDTO, rater);
    };

    /* get */

    this.getAllFeedbacks = (offset, limit) => Feedback.findAll({
      where: {
        is_approved: true,
        is_displaying: true,
      },
      offset,
      limit,
      include: {
        model: Provider,
        attributes: ['company_name', 'photo_url', 'id', 'user_id'],
      },
      order: [['created_at', 'DESC']],
    });

    this.getAllFeedbacksByRater = (authenticatedUser, { id, user_id }, offset, limit) => Feedback.findAll({
      where: (_.get('id', authenticatedUser) === user_id || _.get('role', authenticatedUser) === roles.ADMIN)
        ? { rater_id: id }
        : {
          rater_id: id,
          is_approved: true,
          is_displaying: true,
        },
      offset,
      limit,
      include: {
        model: Provider,
        attributes: ['company_name', 'photo_url', 'id', 'user_id'],
      },
      order: [['created_at', 'DESC']],
    });

    this.getAllFeedbacksByProvider = (authenticatedUser, { id, user_id }, offset, limit) => Feedback.findAll({
      where: (_.get('id', authenticatedUser) === user_id || _.get('role', authenticatedUser) === roles.ADMIN)
        ? {
          provider_id: id,
          is_approved: true,
        }
        : {
          provider_id: id,
          is_approved: true,
          is_displaying: true,
        },
      offset,
      limit,
      include: {
        model: Rater,
        attributes: ['first_name', 'last_name', 'photo_url', 'id', 'user_id'],
      },
      order: [['created_at', 'DESC']],
    });

    this.getFeedbackById = id => feedbackService.getFeedbackById(id);

    this.getFeedbackByIdAndProvider = (feedbackId, { id }) => Feedback.findOne({
      where: { id: feedbackId, provider_id: id },
    });

    //TODO maybe implement this by raw string and AVG using in database
    this.getFeedbacksAverageRatingByProvider = ({ id }) => this.getAllFeedbacksByProvider({ id })
      .then((feedbacks) => {
        const qualitySum = feedbacks
          .reduce((prevValue, { quality_of_work, quality_of_price, quality_of_friendliness, quality_of_timeschedule }) =>
              (prevValue + ((quality_of_work + quality_of_price + quality_of_friendliness + quality_of_timeschedule) / 4))
            , 0);
        return (qualitySum / feedbacks.length || 0)
      });

    /* update */

    this.updateFeedbackById = (feedbackFields, feedbackId) => feedbackService.updateFeedback(
      feedbackFields, {
        where: { id: feedbackId },
        returning: true,
        plain: true,
      });

    this.updateRaterFeedbackById = (feedbackFields, rater, feedbackId) => feedbackService.updateFeedback(
      Object.assign({},
        feedbackFields,
        {
          is_displaying: false,
          is_approved: null,
        }
      ), {
        where: {
          id: feedbackId,
          rater_id: rater.id,
        },
        returning: true,
        plain: true,
      });

    this.updateProviderRelatedFieldsById = ({ quoted_job_description, is_displaying, is_displaying_quote, replies, likes }, feedbackId) => feedbackService.updateFeedback(
      _.isUndefined(is_displaying)
        ? _.isUndefined(is_displaying_quote)
          ? { quoted_job_description, replies, likes }
          : { quoted_job_description, is_displaying_quote, replies, likes }
        : _.isUndefined(is_displaying_quote)
          ? { quoted_job_description, is_displaying, replies, likes }
          : { quoted_job_description, is_displaying, is_displaying_quote, replies, likes },
      {
        where: { id: feedbackId },
        returning: true,
        plain: true,
      });

    /* delete */

    this.deleteFeedbackById = id => Feedback.destroy({
      where: { id },
    });

    this.deleteFeedbackByIdAndRater = (feedbackId, { id }) => Feedback.destroy({
      where: { id: feedbackId, rater_id: id },
    });
  }
}

module.exports = new FeedbackController();

