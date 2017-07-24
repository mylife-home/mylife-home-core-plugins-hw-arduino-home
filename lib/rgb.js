'use strict';

const async  = require('async');
const log4js = require('log4js');
const logger = log4js.getLogger('core-plugins-hw-arduino-home.Rgb');
const Driver = require('./service/driver');

module.exports = class Rgb {
  constructor(config) {
    this.online = 'off';
    this.active = 'off';
    this.r = 0;
    this.g = 0;
    this.b = 0;

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
      logger.info(`rgb: R=${this.r}, G=${this.g}, B=${this.b}`);
      msg.r = Math.floor(this.r * 1023 / 100);
      msg.g = Math.floor(this.g * 1023 / 100);
      msg.b = Math.floor(this.b * 1023 / 100);
    }

    this.driver.write(msg);
  }

  setActive(arg) {
    this.active = arg;
    this._refresh();
  }

  setR(arg) {
    this.r = arg;
    this._refresh();
  }

  setG(arg) {
    this.g = arg;
    this._refresh();
  }

  setB(arg) {
    this.b = arg;
    this._refresh();
  }

  close(done) {
    this.driver.close();
    setImmediate(done);
  }

  static metadata(builder) {
    const binary  = builder.enum('off', 'on');
    const percent = builder.range(0, 100);

    builder.usage.driver();

    builder.attribute('online', binary);
    builder.attribute('active', binary);
    builder.attribute('r', percent);
    builder.attribute('g', percent);
    builder.attribute('b', percent);

    builder.action('setActive', binary);
    builder.action('setR', percent);
    builder.action('setG', percent);
    builder.action('setB', percent);

    builder.config('agentKey', 'string');
    builder.config('nick', 'string');
    builder.config('service', 'string');
  }
};
