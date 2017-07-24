'use strict';

const async      = require('async');
const log4js     = require('log4js');
const logger     = log4js.getLogger('core-plugins-hw-arduino-home.Rgb');
const Controller = require('./controller');

module.exports = class Rgb {
  constructor(config) {

    this.online = 'off';
    this.active = 'off';
    this.r = 0;
    this.g = 0;
    this.b = 0;
  }

  _refresh() {
    // TODO
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
/*
  close(done) {
  }
*/
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
    builder.config('id', 'string');
  }
};
