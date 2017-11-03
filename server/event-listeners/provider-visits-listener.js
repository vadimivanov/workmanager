const eventBus = require('../utils/event-bus');
const visitController = require('../controllers/visit-controller');
const eventTypes = require('../../config/event-types.config.json');

class ProviderVisitsListener {
  constructor() {
    this.initialize = () => {
      eventBus.subject
        .filter(event => event.type === eventTypes.provider.PROVIDER_VISITED)
        .subscribe({
          next: event => visitController.createVisit(event.payload, event.payload.provider),
        });
      return Promise.resolve();
    }
  }
}

module.exports = new ProviderVisitsListener();
