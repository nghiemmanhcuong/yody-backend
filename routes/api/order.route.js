const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/api/orderControll.js');

router.post('/add',orderController.addOrder);

module.exports = router;