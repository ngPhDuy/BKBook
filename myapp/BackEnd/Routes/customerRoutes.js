const express = require('express');
const router = express.Router();
const customerController = require('../Controller/customerController');

router.get('/customerInfo/:username', customerController.getInfo);
router.get('/orderList/:username', customerController.getOrderList);
router.get('/orderProduct/:id', customerController.getOrderProduct);
router.put('/updateOrderState/:id', customerController.updateOrderState);

module.exports = router;