
class Extension {

  constructor(anternet) {
    this.anternet = anternet;

    this.init();
  }

  init() {
  }

  setup() {
    this.bindEvents();
  }

  destroy() {
    this.unbindEvents();
  }

  release() {
    this.anternet.release(this.constructor);
  }

  getEvents() {
    return {};
  }

  bindEvents() {
    this.eventsMap = this.getEvents();

    for (const event of Object.keys(this.eventsMap)) {
      this.anternet.on(event, this.eventsMap[event]);
    }
  }

  unbindEvents() {
    for (const event of Object.keys(this.eventsMap)) {
      this.anternet.removeListener(event, this.eventsMap[event]);
    }

    this.eventsMap = null;
  }

}
module.exports = Extension;
