const EventEmitter = require('events');
const _ = require('lodash/fp');
const Rx = require('rxjs');

const log = require('../../utils/logger/logger')(module);

/**
 * Wrapper around Rx.Subject
 * @singleton
 */
class EventBus extends EventEmitter {
  constructor() {
    super();

    this.subject = new Rx.Subject();
    this.sources = [];

    this.initEventBus = () => {
      log.info('Initializing event bus');
      return Promise.resolve();
    };

    this.register = (eventEmitter, type) => {
      const source = Rx.Observable
        .fromEvent(eventEmitter, type)
        .map(payload => ({ type, payload }))

      source.subscribe(this.subject);
      this.sources.push(source);
    }
  }
}

module.exports = new EventBus();
