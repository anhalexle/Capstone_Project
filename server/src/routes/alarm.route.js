const express = require('express');

const alarmController = require('../controllers/alarm.controller');

const router = express.Router();

router.route('/').get(alarmController.getAllAlarm);
router.route('/:id').get(alarmController.getAlarm);

module.exports = router;
