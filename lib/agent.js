'use strict';

const log4js = require('log4js');
const logger = log4js.getLogger('core-plugins-hw-arduino-home.Agent');

module.exports = class Agent {
  constructor(config) {

    this.online = 'off';

  }
/*
  close(done) {
  }
*/
  static metadata(builder) {
    const binary = builder.enum('off', 'on');

    builder.usage.driver();

    builder.attribute('online', binary);

    builder.config('key', 'string');
    builder.config('channel', 'string');
  }
};
