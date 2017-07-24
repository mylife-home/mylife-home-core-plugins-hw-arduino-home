'use strict';

const EventEmitter = require('events');
const log4js       = require('log4js');
const logger       = log4js.getLogger('core-plugins-hw-arduino-home.Repository');

class Repository extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(100); // each driver adds listener

    this.clients = new Map();
  }

  add(key, client) {
    this.clients.set(key, client);
    logger.debug('Added client: ' + key);
    this.emit('changed', { type: 'add', key} );
  }

  remove(key) {
    this.clients.delete(key);
    logger.debug('Removed client: ' + key);
    this.emit('changed', { type: 'remove', key} );
  }

  get(key) {
    return this.clients.get(key);
  }
}

module.exports = new Repository();