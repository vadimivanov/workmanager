const router = require('express').Router();

router.use('/card-form', require('./card-form'));
router.use('/stripe-publishable-key', require('./stripe-publishable-key'));

module.exports = router;
