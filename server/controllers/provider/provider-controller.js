const EventEmitter = require('events');
const _ = require('lodash/fp');

const feedbackController = require('../feedback-controller');
const userService = require('../../services/user.service');
const providerService = require('../../services/provider.service');
const { sanitizeSubject } = require('../controller-utils/index');
const { Provider, Subservice, Service, Location } = require('../../models');

class ProviderController extends EventEmitter {
  constructor() {
    super();

    /* GET */

    this.getProviderByUser = ({ id }) => Provider.findOne({
      where: { user_id: id },
      include: [{ model: Location }],
    });

    this.getFullProviderById = id => Provider.findOne({ where: { id } })
      .then(provider => userService.getFullUser({ id: provider.user_id }));

    this.getSubServicesByProvider = ({ id }) => Provider.findOne({
      where: { id },
      include: [{
        model: Subservice,
        through: 'ProviderSubservice',
        include: [{
          model: Service,
        }],
      }],
    })
      .then((provider) => {
        return provider.Subservices;
      });

    /**
     * @param provider {Provider}
     * @param id {number}
     * @returns Promise of ProviderSubservice
     */
    this.setSubServiceToProvider = (provider, { id }) =>
      Subservice
        .findOne({ where: { id } })
        .then(subService => provider.addSubservice(subService))
        .then(_.last);

    /**
     * @param provider {Provider}
     * @param subservices {[Subservice]}
     * @returns Promise
     */
    this.setSubServicesToProvider = (provider, subservices) => Provider
      .findOne({
        where: { id: provider.id },
      })
      .then(providerInstance => Subservice
        .findAll({
          where: { id: _.map('id', subservices) },
        })
        .then(subservicesInstances => providerInstance.setSubservices(subservicesInstances))
      )
      .then(_.last);

    /* PUT */

    this.updateProviderByUserId = (provider, userId) => providerService.updateProvider(
      Object.assign(
        { user_id: userId },
        sanitizeSubject(provider)
      ),
      { user_id: userId }
    )

    this._setProvidersRating = (rating, { id }) => Provider.update(
      { rating },
      {
        where: { id },
        returning: true,
        plain: true,
      })
      .then(_.last);

    this.recalculateAllProvidersRating = () => Provider.findAll()
      .then(providers => Promise.all(
        providers.map(provider =>
          feedbackController.getFeedbacksAverageRatingByProvider(provider)
            .then(rating => this._setProvidersRating(rating, provider))
        )
      ));

    /* DELETE */

    this.removeSubServiceFromProvider = (provider, id) => (
      Subservice
        .findOne({ where: { id } })
        .then(subService => provider.removeSubservice(subService))
    )
  }
}

module.exports = new ProviderController();
