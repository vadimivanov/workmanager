const EventEmitter = require('events');
const _ = require('lodash/fp');

const providersAllIncludedModels = require('../../../config/model-fields/providers-all-included-models.config');
const userPrivateFields = require('../../../config/model-fields/user-private-fields.config.json')
const { PROVIDER } = require('../../../config/database/enums/UserRoles.enum.json');
const { User, Provider, sequelize } = require('../../models');

class ProviderSearchController extends EventEmitter {
  constructor() {
    super();

    this._getProviderRatingPredicate = (minRating, maxRating) => {
      if (_.isEmpty(minRating) || _.isEmpty(maxRating)) return undefined;
      return {
        rating: {
          $and: {
            $gte: minRating,
            $lte: maxRating,
          },
        },
      }
    };

    /**
     * Search occurrence of searchText to names or metatags
     * @param searchText
     * @return {function} - sequelize.or
     * @private
     */
    this._getTextSearchPredicate = (searchText) => {
      const searchTextPattern = `%${searchText}%`.toLowerCase();
      //return TRUE cause this predicate use in AND expression
      if (_.isEmpty(searchText)) return true;
      return sequelize.or(
        sequelize.fn('LIKE', sequelize.fn('lower', sequelize.col('Provider.company_name')), searchTextPattern),
        sequelize.fn('LIKE', sequelize.fn('lower', sequelize.col('Provider.Subservices.name')), searchTextPattern),
        sequelize.fn('LIKE', sequelize.fn('lower', sequelize.fn('array_to_string', sequelize.col('Provider.Subservices.metatags'), ',', '*')), searchTextPattern),
        sequelize.fn('LIKE', sequelize.fn('lower', sequelize.col('Provider.Subservices.Service.name')), searchTextPattern),
        sequelize.fn('LIKE', sequelize.fn('lower', sequelize.fn('array_to_string', sequelize.col('Provider.Subservices.Service.metatags'), ',', '*')), searchTextPattern)
      )
    };

    this._getGISSearchPredicate = (lng, lat, distance) => {
      const DEFAULT_RADIUS_M = 10000;
      const DEGREES_TO_METERS_COEFFICIENT = 0.00001;
      //return TRUE cause this predicate use in AND expression
      if (_.isEmpty(lng) || _.isEmpty(lat)) return true;
      return sequelize.where(
        sequelize.fn('ST_DWithin',
          sequelize.col('Provider.Locations.location_coordinates'),
          sequelize.fn('ST_MakePoint', lng, lat),
          (distance * DEGREES_TO_METERS_COEFFICIENT) || (DEFAULT_RADIUS_M * DEGREES_TO_METERS_COEFFICIENT)),
        true);
    };

    this._getSubserviceNamePredicate = (subserviceName) => {
      //return TRUE cause this predicate use in AND expression
      if (_.isEmpty(subserviceName)) return true;
      //Subservice name should be equal with subserviceName
      return sequelize.fn('LIKE', sequelize.col('Provider.Subservices.name'), subserviceName);
    };

    this._getServiceNamePredicate = (serviceName) => {
      //return TRUE cause this predicate use in AND expression
      if (_.isEmpty(serviceName)) return true;
      //Service name should be equal with serviceName
      return sequelize.fn('LIKE', sequelize.col('Provider.Subservices.Service.name'), serviceName);
    };

    this._getProviderCityPredicate = (city) => {
      //return TRUE cause this predicate use in AND expression
      if (_.isEmpty(city)) return true;
      //Name of location city should be equal with city
      return sequelize.fn('LIKE', sequelize.col('Provider.Locations.city'), city);
    };

    this._getProviderZipCodePredicate = (zipCode) => {
      //return TRUE cause this predicate use in AND expression
      if (_.isEmpty(zipCode)) return true;
      //Zip code of location should be equal with zipCode
      return sequelize.where(sequelize.col('Provider.Locations.zip_code'), { $eq: zipCode });
    };

    this._getVerifiedProviderPredicate = (getAutomaticallyRegisteredUsers) => {
      //Email verification status should be true and if is_self_registered status false email verification status can be false
      if (getAutomaticallyRegisteredUsers) return sequelize.or(
        sequelize.where(sequelize.col('is_verified'), { $eq: true }),
        sequelize.where(sequelize.col('is_self_registered'), { $eq: false })
      );
      //Email verification status should be true
      return sequelize.where(sequelize.col('is_verified'), { $eq: true });
    };

    this._getEnabledProviderPredicate = (isGettingDisabledUsers) => {
      //Enabled status should be true
      if (_.isEmpty(isGettingDisabledUsers) || isGettingDisabledUsers !== 'true') return sequelize.where(sequelize.col('is_enabled'), { $eq: true });
      return true;
    };

    this._getSortingCriteria = (isSortByRatingOnly) => {
      const sortingCriteria = [];
      if (_.isEmpty(isSortByRatingOnly) || isSortByRatingOnly === 'false') sortingCriteria.push([sequelize.json('stripe_subscription.plan.id'), 'DESC']); //sort by plan id
      sortingCriteria.push([sequelize.col('Provider.rating'), 'DESC']); //sort by rating
      return sortingCriteria;
    };

    this.findUserProviderBy = ({ offset, limit, subserviceName, serviceName, lng, lat, distance, minRating, maxRating, isSortByRatingOnly, searchText, city, zipCode, isGettingDisabledUsers, getAutomaticallyRegisteredUsers }) => User.findAll({
      offset,
      limit,
      subQuery: false,
      attributes: { exclude: userPrivateFields },
      where: sequelize.and(
        this._getVerifiedProviderPredicate(getAutomaticallyRegisteredUsers),
        this._getEnabledProviderPredicate(isGettingDisabledUsers),
        this._getTextSearchPredicate(searchText),
        this._getGISSearchPredicate(lng, lat, distance),
        this._getSubserviceNamePredicate(subserviceName),
        this._getServiceNamePredicate(serviceName),
        this._getProviderCityPredicate(city),
        this._getProviderZipCodePredicate(zipCode),
        { role: PROVIDER }
      ),
      include: [{
        model: Provider,
        where: this._getProviderRatingPredicate(minRating, maxRating),
        include: providersAllIncludedModels,
      }],
      order: this._getSortingCriteria(isSortByRatingOnly),
    });
  }
}

module.exports = new ProviderSearchController();
