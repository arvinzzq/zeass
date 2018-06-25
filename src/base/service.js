import bunyan from 'bunyan';

export default class Service {
  constructor() {
    this.Looger = bunyan.createLogger({
      name: this.constructor.name,
      level: 'debug'
    });
  }
}
