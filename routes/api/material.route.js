const express = require('express');
const router = express.Router();

const materialApiController = require('../../controllers/api/materialContrll');

router.get('/popular',materialApiController.getPopular);
router.get('/all',materialApiController.getAll);

module.exports = router;