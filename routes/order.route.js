const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderContrll');

router.get('/', orderController.getView);
router.get('/detail/:id', orderController.getDetail);
router.get('/change-status/:id', orderController.changeStatus);

router.put('/store-change-status', orderController.storeChangeStatus);

module.exports = router;
