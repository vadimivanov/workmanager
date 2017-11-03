const log = require('../../utils/logger/logger')(module);

class ControllerUtils {
  constructor() {
    /**
     * Removing id field from target object
     * if he have it
     *
     * @param targetSubject {Object} - object to clone
     * @returns {Object} - cloned object
     */
    this.sanitizeSubject = (targetSubject) => {
      const clonedSubject = Object.assign({}, targetSubject);
      delete clonedSubject.id;
      return clonedSubject;
    }
  }
}

module.exports = new ControllerUtils();
