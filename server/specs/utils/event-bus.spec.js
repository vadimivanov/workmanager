const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const EventEmitter = require('events');

const initialization = require('../../initialization/postgres-connect.initialization.js');
const eventBus = require('../../utils/event-bus/index');

describe('Custom Event bus', () => {
  before('initialization', async () => {
    try {
      await initialization;
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });

  it('Register in Event bus', () => {
    try {
      class TestEmitter extends EventEmitter {}
      const testEmitter = new TestEmitter();
      const testMessage = {
        type: 'test',
        payload: 'test message',
      };

      eventBus.register(testEmitter, 'test');
      eventBus.subject
        .subscribe({
          next: x => expect(x).to.be.deep.equal(testMessage),
        });

      testEmitter.emit(testMessage.type, testMessage.payload);
    } catch (e) {
      console.log(JSON.stringify(e, null, 4));
      expect(e).to.not.exist;
    }
  });
});
