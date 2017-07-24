'use strict';

const EventEmitter = require('events');
const log4js       = require('log4js');
const logger       = log4js.getLogger('core-plugins-hw-arduino-home.Repository');

class Repository extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(100); // each driver adds listener

    this.agents = new Map();
  }

  add(key, agent) {
    this.agents.set(key, agent);
    logger.debug('Added agent: ' + key);
    this.emit('changed', { type: 'add', key} );
  }

  remove(key) {
    this.agents.delete(key);
    logger.debug('Removed agent: ' + key);
    this.emit('changed', { type: 'remove', key} );
  }

  get(key) {
    return this.agents.get(key);
  }
}

module.exports = new Repository();