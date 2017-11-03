const router = require('express').Router();

const auth = require('../../../auth');
const userOnlineController = require('../../../controllers/user-online-controller');

router.use('/', auth.authenticate(), userOnlineController.setUserLastOnlineNowMiddleware);
router.use('/portfolio-photos', require('./portfolio-photos'));
router.use('/inspiration-photos', require('./inspiration-photos'));
router.use('/users', require('./users/users'));
router.use('/services', require('./services'));
router.use('/sub-services', require('./sub-services'));
router.use('/documents', require('./documents'));
router.use('/inspiration-categories', require('./inspiration-categories'));
router.use('/feedbacks', require('./feedbacks'));
router.use('/feedback-requests', require('./feedback-requests'));
router.use('/problem-feedback-reports', require('./problem-feedback-reports'));
router.use('/uploads', require('./uploads'));
router.use('/providers', require('./providers'));
router.use('/raters', require('./raters'));
router.use('/contact-us', require('./contact-us'));
router.use('/billing', require('./billing'));
router.use('/notifications', require('./notifications'));
router.use('/zip-codes', require('./zip-codes'));
router.use('/cities', require('./cities'));
router.use('/stripe-notifications', require('./stripe-notifications'));

module.exports = router;
