const Alarm = require('../models/alarm.model');
const CRUDFactory = require('./factory.controller');

const factoryController = new CRUDFactory(Alarm);

exports.getAllAlarm = factoryController.getAll();
exports.getAlarm = factoryController.getOne();