const express = require('express');
const router = express.Router();
const ShopApiController = require('../../controllers/api/shopContrll.js');

router.post('/',ShopApiController.getAll);

module.exports = router;