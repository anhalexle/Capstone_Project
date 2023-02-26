const express = require('express');

const alarmController = require('../controllers/alarm.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.use(authController.protect);

router.route('/').get(alarmController.getAllAlarm);
router.route('/:id').get(alarmController.getAlarm);

module.exports = router;
