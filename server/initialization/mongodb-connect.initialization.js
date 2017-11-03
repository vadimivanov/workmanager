/**
 * Database connection to mLab.
 *
 * @see {@link http://blog.mlab.com/2014/04/mongodb-driver-mongoose/}
 */
const log = require('../utils/logger/logger')(module);
const db = require('../../config/database/mongodb.config.json');
const mongoose = require('mongoose');

/** mongodb URL to connect to mlab*/
const DB_URL = `mongodb://${db.credentials.user}:${db.credentials.password}@${db.credentials.host}:${db.credentials.port}/${db.credentials.name}`;

/**
 * Connect to Mongo DB by URL
 *
 * Mongoose by default sets the auto_reconnect option to true.
 * We recommend setting socket options at both the server and replica set level.
 * We recommend a 30 second connection timeout because it allows for
 * plenty of time in most operating environments.
 */
(function () {
  log.info('Trying to connect to DB by %s', DB_URL);

  /** connect to mLab*/
  //connect(DB_URL, db.options);
  mongoose.connect(DB_URL, db.options);

  const conn = mongoose.connection;

  //while error
  //conn.on('error', ()=>log.log('error', "Error while connecting to DB: %s", DB_URL));
  conn.on('error', err => log.error('Error while connecting to DB: %s. Error text: %s', DB_URL, err.message));

  //while connection opens successfully
  //conn.once('open', ()=>log.info("Database connection established to %s", DB_URL));
  conn.once('open', () => log.info('Connection successful to %s', DB_URL));
}());
