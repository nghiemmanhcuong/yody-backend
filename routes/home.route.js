const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeContrll');

router.get('/',homeController.getView);

module.exports = router;