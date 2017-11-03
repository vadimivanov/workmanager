const _ = require('lodash/fp');

const { Provider } = require('../models');

class ProviderService {
  constructor() {
    /**
     * @param providerFields {Provider}
     * @param predicate {Object} - where parameters
     */
    this.updateProvider = (providerFields, predicate) => Provider.update(
      providerFields, {
        where: predicate,
        returning: true,
        plain: true,
      })
      .then(_.last);
  }
}

module.exports = new ProviderService();
