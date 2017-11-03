const EventEmitter = require('events');
const _ = require('lodash/fp');

const { Service, Subservice } = require('../models');
const { sanitizeSubject } = require('./controller-utils');

class ServiceController extends EventEmitter {
  constructor() {
    super();

    this.createService = service => Service.create(sanitizeSubject(service));

    this.getAllServices = (offset, limit) => Service.findAll({
      offset,
      limit,
      order: [['rating', 'DESC'], ['created_at', 'ASC']],
      include: [Subservice],
    });

    this.getServiceById = id => Service.findOne({
      where: { id },
      include: [Subservice],
    });

    this.updateService = (newServiceFields, id) => Service.update(
      sanitizeSubject(newServiceFields), {
        where: { id },
        returning: true,
        plain: true,
      })
      .then(_.last);

    this.deleteServiceById = id => Service.destroy({
      where: { id },
    })
  }
}

module.exports = new ServiceController();
