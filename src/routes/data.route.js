const express = require('express');

const dataController = require('../controllers/data.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.use(authController.protect);
router.route('/').get(dataController.getAllDataFromSocket);

router.route('/drawChart').post(dataController.drawChart);

router.use(authController.restrictTo('admin', 'manager'));

router.use('/calc-electric-bill', dataController.calcElectricBill);

router.route('/secret').get(dataController.getAllData);

module.exports = router;
