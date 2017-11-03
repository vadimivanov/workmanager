const EventEmitter = require('events');
const CronJob = require('cron').CronJob;

const log = require('../../utils/logger/logger')(module);
const cronJobsConfig = require('../../../config/cron-jobs.config.json');
const providerController = require('../../controllers/provider/provider-controller');

class CronJobs extends EventEmitter {
  constructor() {
    super();

    this.jobs = [];

    /* methods */

    this.initAllCronJobs = () => {
      log.info('Initializing cron jobs');
      return Promise.resolve();
      //this.recalculateProvidersRating();
    };

    this.recalculateProvidersRating = () => {
      const recalculateProvidersRatingCronJob = new CronJob({
        cronTime: cronJobsConfig.every12Hours,
        onTick() {
          providerController.recalculateAllProvidersRating()
          .then(() => log.info('All providers rating updated'))
        },
        start: true,
        timeZone: cronJobsConfig.timezone,
      });

      this.jobs.push(recalculateProvidersRatingCronJob);
    }
  }
}

module.exports = new CronJobs();
