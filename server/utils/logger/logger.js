const winston = require('winston');
const MongoDB = require('winston-mongodb').MongoDB;
const db = require('../../../config/database/mongodb.config.json');

/** mongodb URL to connect to mlab*/
const DB_URL = `mongodb://${db.credentials.user}:${db.credentials.password}@${db.credentials.host}:${db.credentials.port}/${db.credentials.name}`;

/**
 * Create logger transport.
 *
 * @see <a href="https://github.com/winstonjs/winston"></a>
 * @param module - module where logger event occurs
 * @returns {*} - logger instance
 */
function getLogger(module) {
  const path = module.filename.split('/').slice(-2).join('/');

  return new winston.Logger({
    transports: [
      new winston.transports.Console({
        colorize: true,
        level: 'debug',
        label: path,
        timestamp: () => (new Date()).toISOString(),
      }),

          // transport logs to mongodb
      new winston.transports.MongoDB({
        db: DB_URL,
        collection: 'logs',
      }),
    ],
  });
}

module.exports = getLogger;
