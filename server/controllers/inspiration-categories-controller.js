const EventEmitter = require('events');
const _ = require('lodash/fp');

const { InspirationCategory } = require('../models');
const { sanitizeSubject } = require('./controller-utils');

class InspirationCategoryController extends EventEmitter {
  constructor() {
    super();

    this.createInspirationCategory = inspirationCategory => InspirationCategory.create(sanitizeSubject(inspirationCategory));

    this.getAllInspirationCategories = (offset, limit) => InspirationCategory.findAll({
      offset,
      limit,
      order: [['created_at', 'ASC']],
    });

    this.getInspirationCategoryById = id => InspirationCategory.findOne({
      where: { id },
    });

    this.updateInspirationCategory = (inspirationCategoryFields, id) => InspirationCategory.update(
      sanitizeSubject(inspirationCategoryFields), {
        where: { id },
        returning: true,
        plain: true,
      })
      .then(_.last);

    this.deleteInspirationCategoryById = id => InspirationCategory.destroy({
      where: { id },
    })
  }
}

module.exports = new InspirationCategoryController();

