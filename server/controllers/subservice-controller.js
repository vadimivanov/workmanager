const EventEmitter = require('events');
const _ = require('lodash/fp');

const { Service, Subservice, Provider } = require('../models');

class SubServiceController extends EventEmitter {
  constructor() {
    super();

    this.createSubService = subService => Subservice.create(subService);

    this.getAllSubServices = (offset, limit) => Subservice.findAll({
      offset,
      limit,
      order: [['created_at', 'ASC']],
      include: [Service],
    });

    this.getSubServiceById = id => Subservice.findOne({
      where: { id },
      include: [Service],
    });

    this.getProvidersBySubService = id => Subservice.findOne({
      where: { id },
      include: [{
        model: Provider,
        through: 'ProviderSubservice',
      }],
    })
      .then((subservice) => {
        return subservice.Providers;
      });

    this.updateSubService = (newSubService, id) => Subservice.update(newSubService, {
      where: { id },
      returning: true,
      plain: true,
    })
      .then(_.last);

    this.deleteSubServiceById = id => Subservice.destroy({
      where: { id },
    })
  }
}

module.exports = new SubServiceController();
