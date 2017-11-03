/**
 * Init connection to databases
 */
const log = require('../utils/logger/logger')(module);

//TODO all should be promisified and allow start app only if all are resolved
const initPostgres = require('./postgres-connect.initialization.js');
const initMongoDB = require('./mongodb-connect.initialization');
const initS3 = require('./s3.initialization');
const initStripe = require('./stripe-check-connection.initialization');
const initCronJobs = require('../utils/cron-jobs/cron-jobs').initAllCronJobs();
const initEventBus = require('../utils/event-bus/index').initEventBus();
const initEventListeners = require('../event-listeners').initialize();

log.info('App started with process.env.NODE_ENV: ', process.env.NODE_ENV);
