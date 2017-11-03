const EventEmitter = require('events');
const _ = require('lodash/fp');

const userService = require('../services/user.service');
const providerController = require('../controllers/provider/provider-controller');
const portfolioPhotoController = require('../controllers/portfolio-photo-controller');
const { PlanLimit } = require('../models');

const { viewStatistics } = require('../../config/database/enums/PlanLimitTypes.enum.json');

class PlanLimitController extends EventEmitter {
  constructor() {
    super();

    this.getPlanLimitByUser = user => userService.getFullUser({ id: user.id })
      .then((userInstance) => {
        if (_.isEmpty(userInstance)) return Promise.reject(`no user with id ${user.id}`);
        return PlanLimit
            .findOne({
              where: { billing_plan_id: _.get('stripe_subscription.items.data[0].plan.id', userInstance) },
            })
      });

    this.getAllPlanLimits = () => PlanLimit
      .findAll();

    /**
     * Filter inspiration photos according to authenticated user plan limit
     * @param authenticatedUser
     * @param provider
     */
    this.filterPhotos = (authenticatedUser, provider) => (portfolioPhotos) => {
      //return all photos if provider belongs to requesting user
      if (_.get('id', authenticatedUser) === provider.user_id) return { portfolioPhotos };

      return this.getPlanLimitByUser({ id: provider.user_id })
        .then((planLimit) => {
          //get unique inspiration photos
          const ideaForInspirationPhotos = portfolioPhotos
            .filter(portfolioPhoto => portfolioPhoto.is_idea_for_inspiration)
            .slice(0, planLimit.photos_inspiration_page_limit); //take according to plan limit
          return { portfolioPhotos, ideaForInspirationPhotos };
        })
    };

    /**
     * Check quantity uploading portfolio photos according to authenticated user plan limit
     *
     * @param provider
     */
    this.checkQuantityPhotos = (newPortfolioPhoto, provider) => portfolioPhotos => new Promise((resolve, reject) => {
      return this.getPlanLimitByUser({ id: provider.user_id })
        .then((planLimit) => {
          const simplePhotos = portfolioPhotos
            .filter(portfolioPhoto => !_.isEmpty(portfolioPhoto.photo_simple_url));
          const beforeAfterPhotos = portfolioPhotos
            .filter(portfolioPhoto => !_.isEmpty(portfolioPhoto.photo_before_url) || !_.isEmpty(portfolioPhoto.photo_after_url));
          if (!_.isEmpty(newPortfolioPhoto.photo_simple_url)) return (simplePhotos.length + 1) <= planLimit.photos_simple_limit ? resolve() : reject({ message: `You have limit to upload simple portfolio photos ${planLimit.photos_simple_limit} and before-after portfolio photos ${planLimit.photos_before_after_limit}` });
          if (!_.isEmpty(newPortfolioPhoto.photo_before_url) || !_.isEmpty(newPortfolioPhoto.photo_after_url)) return (beforeAfterPhotos.length + 1) <= planLimit.photos_before_after_limit ? resolve() : reject({ message: `You have limit to upload simple portfolio photos ${planLimit.photos_simple_limit} and before-after portfolio photos ${planLimit.photos_before_after_limit}` });
        })
    });

    /**
     * Check quantity uploaded photos in feedback request, according to authenticated user plan limit
     * @param newfeedbackRequest
     * @param provider
     */
    this.checkQuantityPhotosInRequestFeedback = (newfeedbackRequest, provider) => new Promise((resolve, reject) => {
      return this.getPlanLimitByUser({ id: provider.user_id })
        .then((planLimit) => {
          return newfeedbackRequest.photo_urls.length > planLimit.photos_feedback_request_limit
            ? reject({ message: `You can't upload more than ${planLimit.photos_feedback_request_limit} photos, according to ypurs billing plan.` })
            : resolve();
        })
    });

    /**
     * Check files uploading according to authenticated user plan limit
     *
     */
    this.checkFilesUploading = authenticatedUser => new Promise((resolve, reject) => {
      return !_.isEmpty(authenticatedUser) ?
        this.getPlanLimitByUser({ id: _.get('id', authenticatedUser) })
        .then((planLimit) => {
          return planLimit.info_files_enabled ? resolve() : reject({ message: "Yours billing plan haven't opportunity to upload files." });
        }) :
        reject({ message: 'You not registered' });
    });

    /**
     * Filter staff members according to authenticated user plan limit
     * @param authenticatedUser
     * @param provider
     */
    this.filterStaffMembers = (authenticatedUser, provider) => (staffMembers) => {
      if (_.get('id', authenticatedUser) === provider.user_id) return staffMembers;
      return this.getPlanLimitByUser({ id: provider.user_id })
        .then((planLimit) => {
          if (planLimit.staff_members_enabled) return staffMembers;
          return null;
        })
    };

    /**
     * Filter news according to authenticated user plan limit
     * @param authenticatedUser
     */
    this.filterNews = authenticatedUser => (provider) => {
      if (_.get('id', authenticatedUser) === provider.user_id) return provider;
      return this.getPlanLimitByUser({ id: provider.user_id })
        .then((planLimit) => {
          if (planLimit.general_news_enabled) return provider;
          delete provider.dataValues.general_news;
          return provider;
        })
    };

    /**
     * Filter feedback quotes according to authenticated user plan limit
     * @param authenticatedUser
     * @param provider
     */
    this.filterFeedbackQuotes = (authenticatedUser, provider) => (feedbacks) => {
      if (_.get('id', authenticatedUser) === provider.user_id) return feedbacks;
      return this.getPlanLimitByUser({ id: provider.user_id })
        .then((planLimit) => {
          if (planLimit.feedback_quotes_enabled) return feedbacks;
          return feedbacks.map((feedback) => {
            const cloned = Object.assign({}, feedback);
            delete cloned.dataValues.quoted_job_description;
            return feedback;
          });
        })
    };

    /**
     * Filter statistic according to authenticated user plan limit
     * @param provider
     */
    this.filterStatistics = provider => (statistics) => {
      return this.getPlanLimitByUser({ id: provider.user_id })
        .then((planLimit) => {
          return planLimit.view_statistics !== viewStatistics.NONE
            ? statistics
            : null;
        })
    };

    /**
     * Sort providers by search rating according to authenticated user plan limit
     * @param usersProviders
     */
    this.sortProviders = usersProviders => Promise.all(usersProviders.map(this._addPlanLimitToUser))
      .then((expandedUsersProviders) => { return expandedUsersProviders.sort(this._compareProviders) });

    this._addPlanLimitToUser = user => PlanLimit
      .findOne({
        where: { billing_plan_id: _.get('stripe_subscription.items.data[0].plan.id', user) },
      })
      .then((planLimits) => { return Object.defineProperty(user, 'plan_limits', { value: planLimits, enumerable: true, configurable: true, writable: true }) });

    this._compareProviders = (UserProvider1, UserProvider2) => {
      return UserProvider1.plan_limits.search_rating === UserProvider2.plan_limits.search_rating
        ? 0
        : UserProvider1.plan_limits.search_rating > UserProvider2.plan_limits.search_rating
          ? -1
          : 1;
    };

    /**
     * Checking quantity portfolio photos and inspiration photos according to new plan limit of user
     *
     * @param user
     */
    this.checkingQuantityPhotosInTimeOfChangingPlan = (user) => {
      return this.getPlanLimitByUser({ id: user.id })
        .then(planLimit => providerController.getProviderByUser(user)
          .then(foundProvider => portfolioPhotoController._getAllProviderPortfolioPhotos(foundProvider)
            .then((portfolioPhotos) => {
              // checking quantity of simple photos
              const simplePhotos = portfolioPhotos
                .filter(portfolioPhoto => !_.isNull(portfolioPhoto.photo_simple_url));
              if (simplePhotos.length > planLimit.photos_simple_limit) {
                const quantityOfExtraPhoto = simplePhotos.length - planLimit.photos_simple_limit;
                simplePhotos
                  .forEach((element, index, array) => {
                    if (index < quantityOfExtraPhoto && element.is_visible) portfolioPhotoController.updatePortfolioPhotoById(element, { is_visible: false });
                    if (index >= quantityOfExtraPhoto && !element.is_visible) portfolioPhotoController.updatePortfolioPhotoById(element, { is_visible: true });
                  });
              }
              if (simplePhotos.length <= planLimit.photos_simple_limit) {
                simplePhotos
                  .forEach((element) => {
                    if (!element.is_visible) portfolioPhotoController.updatePortfolioPhotoById(element, { is_visible: true });
                  })
              }

              // checking quantity of before-after photos
              const beforeAfterPhotos = portfolioPhotos
                .filter(portfolioPhoto => _.isNull(portfolioPhoto.photo_simple_url));
              if (beforeAfterPhotos.length > planLimit.photos_before_after_limit) {
                const quantityOfExtraPhoto = beforeAfterPhotos.length - planLimit.photos_before_after_limit;
                beforeAfterPhotos
                  .forEach((element, index, array) => {
                    if (index < quantityOfExtraPhoto && element.is_visible) portfolioPhotoController.updatePortfolioPhotoById(element, { is_visible: false });
                    if (index >= quantityOfExtraPhoto && !element.is_visible) portfolioPhotoController.updatePortfolioPhotoById(element, { is_visible: true });
                  });
              }
              if (beforeAfterPhotos.length <= planLimit.photos_before_after_limit) {
                beforeAfterPhotos
                  .forEach((element) => {
                    if (!element.is_visible) portfolioPhotoController.updatePortfolioPhotoById(element, { is_visible: true });
                  })
              }

              // erasing status of inspiration photos
              const ideaForInspirationPhotos = portfolioPhotos
                .filter(portfolioPhoto => portfolioPhoto.is_idea_for_inspiration);
              if (ideaForInspirationPhotos.length > planLimit.photos_inspiration_page_limit) {
                ideaForInspirationPhotos
                  .forEach((element) => {
                    if (element.is_idea_for_inspiration) portfolioPhotoController.updatePortfolioPhotoById(element, { is_idea_for_inspiration: false });
                  });
              }
            })))
    };
  }
}

module.exports = new PlanLimitController();
