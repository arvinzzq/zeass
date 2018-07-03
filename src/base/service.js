import bunyan from 'bunyan';

export default class Service {
  constructor() {
    this.Logger = bunyan.createLogger({
      name: this.constructor.name,
      level: 'debug'
    });
  }
}
