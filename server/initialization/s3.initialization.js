const AWS = require('aws-sdk');

const log = require('../utils/logger/logger')(module);
const s3Config = require('../../config/database/s3.config.json');

//path related to node_modules
AWS.config.loadFromPath('./config/database/s3-access.config.json');

// set the parameters for S3.getBucketCors
const bucketParams = { Bucket: s3Config.Bucket.name };

// Create S3 service object
const s3 = new AWS.S3({
  apiVersion: s3Config.apiVersion,
  params: bucketParams,
});

// call S3 to retrieve policy for selected bucket
s3.getBucketAcl(bucketParams, (err, data) => {
  if (err) {
    log.error(err);
  } else if (data) {
    log.info('Connection successful to S3 Bucket', bucketParams, data);
  }
});

module.exports = s3;
