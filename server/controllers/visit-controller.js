const EventEmitter = require('events');

const { Visit } = require('../models');
const { sanitizeSubject } = require('./controller-utils');

class VisitController extends EventEmitter {
  constructor() {
    super();

    this.createVisit = (visit, provider) => (Visit
      .create(Object.assign(
        {},
        sanitizeSubject(visit),
        { provider_id: provider.Provider
            ? provider.Provider.id
            : provider.id,
        })
      )
    );

    this.getAllVisitsByProvider = ({ id }, offset, limit) => Visit
      .findAll({
        offset,
        limit,
        where: { provider_id: id },
        order: [['created_at', 'ASC']],
      });

    this._deleteVisitById = id => Visit
      .destroy({
        where: { id },
      })
  }
}

module.exports = new VisitController();
