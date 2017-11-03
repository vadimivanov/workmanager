const EventEmitter = require('events');
const _ = require('lodash/fp');
const log = require('../utils/logger/logger')(module);

const emailService = require('../services/email.service');
const userController = require('./user-controller');
const raterController = require('./rater/rater-controller');
const providerController = require('./provider/provider-controller');
const notificationSittingsListController = require('./notification-settings-list-controller');
const eventBus = require('../utils/event-bus');
const eventTypes = require('../../config/event-types.config.json');

const templateContactUsLetterForUser = '../views/templateOfLetterForContactUsForUser.jade';
const templateContactUsLetterFoSupport = '../views/templateOfLetterForContactUsForSupport.jade';
const templateConfirmEmail = '../views/templateOfLetterForConfirmEmail.jade';
const templateForgotPassword = '../views/templateOfLetterForForgotPassword.jade';
const templateNewFeedback = '../views/templateOfLetterForNewFeedback.jade';
const templateNewFeedbackRequest = '../views/templateOfLetterForNewFeedbackRequest.jade';
const templateProblemFeedbackReport = '../views/templateOfLetterForProblemFeedbackReport.jade';
const templateDeletedUser = '../views/templateOfLetterForDeletedUser.jade';
const templateForRejectedFeedback = '../views/templateOfLetterForRejectedFeedback.jade';
const templateForDeletedFeedbackRequest = '../views/templateOfLetterForDeletedFeedbackRequest.jade';
const templateForRequestFeedbackByEmail = '../views/templateOfLetterForRequestFeedbackByEmail.jade';

const { support_email } = require('../../config/email.config.json');

class EmailController extends EventEmitter {
  constructor() {
    super();

    /**
     * Sending email to supporter, from user and email notification to user about that.
     *
     * @param dataFromContactUsForm
     */
    this.contactUs = dataFromContactUsForm => emailService.createMailSender(
      dataFromContactUsForm.email,
      emailService.getMergedJadeFile(
        templateContactUsLetterForUser,
        dataFromContactUsForm
      ))
      .then(infoOfSentLetter => emailService.createMailSender(
        support_email.email,
        emailService.getMergedJadeFile(
          templateContactUsLetterFoSupport,
          dataFromContactUsForm),
        infoOfSentLetter
      ));

    /**
     * Sending email to users with link for confirmation what his email existing.
     *
     * @param host
     * @param user
     */
    this.sendEmailForConfirm = ({ host }, user) => emailService.createMailSender(
      user.email,
      emailService.getMergedJadeFile(
        templateConfirmEmail,
        {
          URL: encodeURI(`http://${host}/api/v1/users/${user.id}/confirm-email?email=${emailService.encodeEmail(user.email)}`),
          login: user.login,
        }))
      .catch(err => this.emitEmailUserRegistrationFailed(user)
        .then(() => Promise.reject(err)));

    /**
     * Email confirmation.
     *
     * @param candidateEmail
     * @param user
     */
    this.confirmEmail = (candidateEmail, user) => new Promise((resolve, reject) => {
      const decodedEmailOfCandidate = emailService.decodeEmail(candidateEmail);
      if (user.email !== decodedEmailOfCandidate) {
        log.error(`Emails address of candidate ${decodedEmailOfCandidate} is not matched to email address of existing user ${user.email}.`);
        return reject(new Error(`Emails address of candidate ${decodedEmailOfCandidate} is not matched to email address of existing user ${user.email}.`));
      }
      return resolve({ is_verified: true });
    });

    /**
     * Sending email with link for changing password.
     *
     * @param host
     * @param user
     */
    this.forgotPassword = ({ host }, user) => emailService.createMailSender(
      user.email,
      emailService.getMergedJadeFile(
        templateForgotPassword,
        {
          URL: encodeURI(`http://${host}/#/reset-password?id=${user.id}&jwt=${user.JWT}`),
          login: user.login,
        }));

    /**
     * Notifying provider by email if he got a new feedback.
     *
     * @param feedback
     */
    this.newFeedbackNotify = feedback => providerController.getFullProviderById(feedback.provider_id)
      .then((foundProvider) => {
        notificationSittingsListController.getNotificationSettingsListByUser(foundProvider)
          .then((settings) => {
            if (settings.is_feedbacks_notify) {
              raterController.getFullRaterById(feedback.rater_id)
                .then(rater => emailService.createMailSender(
                  settings.email_for_notifications,
                  emailService.getMergedJadeFile(
                    templateNewFeedback,
                    {
                      company_name: foundProvider.Provider.company_name,
                      first_name: rater.first_name,
                      last_name: rater.last_name,
                    })))
            }
          })
      });

    /**
     * Notifying rater by email if he got a new feedback-request.
     *
     * @param feedbackRequest
     */
    this.newFeedbackRequestNotify = feedbackRequest => providerController.getFullProviderById(feedbackRequest.provider_id)
      .then(foundProvider => raterController.getFullRaterById(feedbackRequest.rater_id)
        .then((foundRater) => {
          notificationSittingsListController.getNotificationSettingsListByUser({ id: foundRater.user_id })
            .then((settings) => {
              if (settings.is_feedbacks_request_notify) {
                emailService.createMailSender(
                  settings.email_for_notifications,
                  emailService.getMergedJadeFile(
                    templateNewFeedbackRequest,
                    {
                      company_name: foundProvider.Provider.company_name,
                      first_name: foundRater.first_name,
                      last_name: foundRater.last_name,
                    }))
              }
            })
        }));

    /**
     * Sending email to unregistered users with link for registration.
     *
     * @param host
     * @param email_for_notification
     * @param message
     * @param user
     * @param provider
     */
    this.sendRequestFeedbackByEmail = ({ host }, { email_for_notification, job_title, message }, user, provider) => emailService.createMailSender(
      email_for_notification,
      emailService.getMergedJadeFile(
        templateForRequestFeedbackByEmail,
        {
          company_name: provider.company_name,
          job_title,
          message,
          registrationURL: encodeURI(`http://${host}/#/register/rater`),
          providerProfileURL: encodeURI(`http://${host}/#/provider-profile/${user.id}`),
        }));

    /**
     * Notifying rater by email if feedback was rejected.
     *
     * @param feedback
     */
    this.rejectedFeedbackNotify = feedback => raterController.getFullRaterById(feedback.rater_id)
        .then((foundRater) => {
          emailService.createMailSender(
            foundRater.User.email,
            emailService.getMergedJadeFile(
              templateForRejectedFeedback,
              {
                first_name: foundRater.first_name,
                last_name: foundRater.last_name,
                job_description: feedback.job_description,
                reason_reject: feedback.reason_reject,
              }))
        });

    /**
     * Notifying user if problem report was accepted or declined.
     *
     * @param problemFeedbackReport
     */
    this.problemFeedbackReportNotify = problemFeedbackReport => userController.getUserById(problemFeedbackReport.user_id)
      .then(user => emailService.createMailSender(
        user.email,
        emailService.getMergedJadeFile(
          templateProblemFeedbackReport,
          {
            login: user.login,
            is_approved: problemFeedbackReport.is_approved,
            reason_reject: problemFeedbackReport.reason_reject,
            description: problemFeedbackReport.description,
          })));

    /**
     * Notifying provider by email if his feedback-request was deleted.
     *
     * @param feedbackRequest
     */
    this.deletingFeedbackRequestNotify = feedbackRequest => providerController.getFullProviderById(feedbackRequest.provider_id)
      .then(foundProvider => emailService.createMailSender(
        foundProvider.email,
        emailService.getMergedJadeFile(
          templateForDeletedFeedbackRequest,
          {
            company_name: foundProvider.Provider.company_name,
            job_title: feedbackRequest.job_title,
          })));

    /**
     * Notifying user if his account was deleted.
     *
     * @param user
     */
    this.deletedUserNotify = user => emailService.createMailSender(
      user.email,
      emailService.getMergedJadeFile(
        templateDeletedUser,
        {
          login: user.login,
          support_email: support_email.email,
        }));

    /* events */

    this._createEmitEmailPromise = type => (user) => {
      eventBus.subject.next({
        type,
        payload: { user },
      });

      return Promise.resolve();
    };

    this.emitEmailUserRegistrationFailed = this._createEmitEmailPromise(eventTypes.email.EMAIL_USER_REGISTRATION_FAILED);
  }
}

module.exports = new EmailController();
