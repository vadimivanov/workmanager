const EventEmitter = require('events');
const _ = require('lodash/fp');

const { Location } = require('../models');

const { sanitizeSubject } = require('./controller-utils/index');

class LocationController extends EventEmitter {
  constructor() {
    super();

    /* create */

    this._createLocation = (newLocation, { id }) => Location.create(sanitizeSubject(Object.assign({}, newLocation, { provider_id: id })));

    this.createLocationByProvider = (newLocation, { id }) => Location.create(sanitizeSubject(Object.assign({}, newLocation, { provider_id: id })));

    this.setLocationsToProvider = (newLocations, provider) => this._deleteLocationsByProvider(provider)
      .then(() => { return Promise.all(newLocations.map((location) => { return this._createLocation(location, provider) })) });

    /* get */

    this.getLocationsByProvider = ({ id }) => Location.findAll({
      where: { provider_id: id },
      order: [['created_at', 'ASC']],
    });

    this.getLocationById = id => Location.findOne({
      where: { id },
    });

    /* update */

    this.replaceLocation = (newLocation, id) => Location.update(
      sanitizeSubject(newLocation),
      {
        where: { id },
        returning: true,
        plain: true,
      })
      .then(_.last);

    /* delete */

    this._deleteLocation = id => Location.destroy({
      where: { id },
    });

    this.deleteLocationById = id => Location.destroy({
      where: { id },
    });

    this._deleteLocationsByProvider = provider => this.getLocationsByProvider(provider)
      .then(allLocationsOfProvider => Promise.all(allLocationsOfProvider.map((location) => { return this._deleteLocation(location.id) })))
  }
}

module.exports = new LocationController();
