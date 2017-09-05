'use strict';

const async  = require('async');
const log4js = require('log4js');
const logger = log4js.getLogger('core-plugins-hw-arduino-home.IrcRgb');
const Driver = require('./service/irc/driver');

module.exports = class IrcRgb {
  constructor(config) {
    this.online = 'off';
    this.active = 'off';
    this.color = 0;

    this.driver = new Driver(config.agentKey, config.nick, config.service);
    this.driver.on('online', value => {
      this.online = (value ? 'on' : 'off');
      value && this._refresh();
    });
  }

  _refresh() {
    if(this.online === 'off') {
      return;
    }

    const msg = { state: true };
    if(this.active === 'off') {
      logger.info('rgb: OFF');
      msg.r = 0;
      msg.g = 0;
      msg.b = 0;
    } else {
      // https://www.andrewzammit.com/blog/explode-rgb-unsigned-integer-into-individual-r-g-and-b-values/
      logger.info(`rgb: ${JSON.stringify(msg)}`);
      msg.r = ((this.color >> 16) & 255) << 2;
      msg.g = ((this.color >> 8) & 255) << 2;
      msg.b = (this.color & 255) << 2;
    }

    this.driver.write(msg);
  }

  setActive(arg) {
    this.active = arg;
    this._refresh();
  }

  setColor(arg) {
    this.color = arg;
    this._refresh();
  }

  close(done) {
    this.driver.close();
    setImmediate(done);
  }

  static metadata(builder) {
    const binary = builder.enum('off', 'on');
    const color  = builder.range(0, 16777215);

    builder.usage.driver();

    builder.attribute('online', binary);
    builder.attribute('active', binary);
    builder.attribute('color', color);

    builder.action('setActive', binary);
    builder.action('setColor', color);

    builder.config('agentKey', 'string');
    builder.config('nick', 'string');
    builder.config('service', 'string');
  }
};
