const express = require('express');
const router = express.Router();

const productEvaluateController = require('../../controllers/api/productEvaluateContrll');

router.get('/all/:productId',productEvaluateController.getAll);

module.exports = router;