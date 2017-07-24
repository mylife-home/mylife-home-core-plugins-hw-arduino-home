'use strict';

const os           = require('os');
const EventEmitter = require('events');
const irc          = require('irc');
const log4js       = require('log4js');
const logger       = log4js.getLogger('core-plugins-hw-arduino-home.Client');

class Client extends EventEmitter {
  constructor(key, channel, host, port) {
    super();
    this.setMaxListeners(100); // each driver adds listener

    this.key     = key;
    this.channel = channel;
    const nick   = `agent-${os.hostname()}-${key}`;

    const opt = {
      server                              : host,
      port                                : port,
      autoRejoign                         : true,
      channels                            : [channel],
      nick                                : nick,
      userName                            : nick,
      realName                            : 'Mylife Home Core plugin: HW Arduino Home',
      millisecondsOfSilenceBeforePingSent : 60 * 1000,
      millisecondsBeforePingTimeout       : 180 * 1000,
      //debug: true
    };
    this.irc = new irc.Client(null, null, opt);

    this.irc.on('error',    message => logger.error('IRC error: ' + JSON.stringify(message)));
    this.irc.on('netError', message => logger.error('Network error: ' + JSON.stringify(message)));

    this.irc.conn.on('close', () => { this._clear(); this.emit('online', false); });
    this.irc.on('registered', () => this.emit('online', true));

    this.irc.on('message', this._message.bind(this));

    this.irc.on('names',(c, u) => { if(c !== this.channel) { return; } this._reset(Object.keys(u)); });
    this.irc.on('join', (c, n) => { if(c !== this.channel) { return; } this._add(n); });
    this.irc.on('nick', this._change.bind(this));
    this.irc.on('part', (c, n) => { if(c !== this.channel) { return; } this._remove(n); });
    this.irc.on('kick', (c, n) => { if(c !== this.channel) { return; } this._remove(n); });
    this.irc.on('kill', this._remove.bind(this));
    this.irc.on('quit', this._remove.bind(this));

    this.nicks = new Set();
  }

  _reset(nicks) {
    this._clear();
    for(let nick of nicks) {
      if(nick === this.irc.nick) { continue; }
      this._add(nick);
    }
  }

  _clear() {
    this.nicks.clear();
    this.emit('clear');
  }

  _add(nick) {
    this.nicks.add(nick);
    this.emit('add', nick);
  }

  _remove(nick) {
    this.nicks.delete(nick);
    this.emit('remove', nick);
  }

  _change(oldNick, newNick) {
    if(oldNick === this.irc.nick) { return; }
    if(newNick === this.irc.nick) { return; }

    this._remove(oldNick);
    this._add(newNick);
  }

  _message(from, to, text) {
    if(to.toUpperCase() !== this.channel.toUpperCase()) {
      return;
    }

    this.emit('message', from, text);
  }

  send(text) {
    if(!this.irc) { return; }

    if(!this.irc.nick) { return; } // not connected/not registered
    this.irc.say(this.channel, text);
  }

  close(cb) {
    this._clear();
    this.emit('online', false);
    this.irc.disconnect('Closing', cb);
    this.irc = null;
  }
}

module.exports = Client;

