const EventEmitter = require('events');
const _ = require('lodash/fp');

const { Document } = require('../models');

const { sanitizeSubject } = require('./controller-utils/index');

class DocumentController extends EventEmitter {
  constructor() {
    super();

    this.createDocument = (newDocument, { id }) => Document.create(sanitizeSubject(Object.assign({}, newDocument, { provider_id: id })));

    this.getDocumentById = id => Document.findById(id);

    this.getAllDocuments = (offset, limit) => Document.findAll({
      attributes: {
        exclude: ['file'],
      },
      offset,
      limit,
      order: [['created_at', 'ASC']],
    });

    this.getDocumentsByProvider = ({ id }, offset, limit) => Document.findAll({
      where: { provider_id: id },
      offset,
      limit,
      order: [['created_at', 'ASC']],
    });

    this.replaceDocument = (newDocument, id) => Document.update(
        sanitizeSubject(newDocument),
      {
        where: { id },
        returning: true,
        plain: true,
      })
      .then(_.last);

    this.deleteDocument = id => Document.destroy({
      where: { id },
    });
  }
}

module.exports = new DocumentController();
