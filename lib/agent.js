'use strict';

const Client     = require('./service/agent');
const Repository = require('./service/repository');
const log4js     = require('log4js');
const logger     = log4js.getLogger('core-plugins-hw-arduino-home.Agent');

module.exports = class Agent {
  constructor(config) {

    this.online = 'off';

    const { key, channel, host, port } = config;

    this.agent = new Client(key, channel, host, port);
    Repository.add(key, this.agent);

    this.agent.on('online', value => { this.online = (value ? 'on' : 'off'); });
  }

  close(done) {
    Repository.remove(this.agent.key);
    this.agent.close(done);
  }

  static metadata(builder) {
    const binary = builder.enum('off', 'on');

    builder.usage.driver();

    builder.attribute('online', binary);

    builder.config('key', 'string');
    builder.config('host', 'string');
    builder.config('port', 'integer');
    builder.config('channel', 'string');
  }
};
