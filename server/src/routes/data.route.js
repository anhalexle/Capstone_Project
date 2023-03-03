const express = require('express');

const dataController = require('../controllers/data.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.route('/exportExcel').get(dataController.exportExcel);
router.route('/exportPDF').get(dataController.exportPDF);

router.use(authController.protect);
router.route('/').get(dataController.getAllDataFromSocket);

router.route('/drawChart').post(dataController.drawChart);

router.use(authController.restrictTo('admin', 'manager'));

// router.route('/calc-electric-bill/').post(dataController.calcElectricBill);

router.route('/secret').get(dataController.getAllData);

module.exports = router;
