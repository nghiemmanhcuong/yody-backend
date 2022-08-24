const express = require('express')
const router = express.Router();

const pageController = require('../controllers/pageContrll');

router.get('/error',pageController.error);
router.get('/404',pageController.pageNotFound);

module.exports = router;