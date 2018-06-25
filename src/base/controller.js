import bunyan from 'bunyan';

export default class Controller {
  constructor() {
    this.Logger = bunyan.createLogger({
      name: this.constructor.name,
      level: 'debug'
    });
  }
}