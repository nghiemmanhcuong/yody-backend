const express = require('express');
const router = express.Router();

const bannerApiController = require('../../controllers/api/bannerContrll');

router.get('/topbar',bannerApiController.getTopbar);
router.get('/slide-hero',bannerApiController.getSlideHero);
router.get('/slide-bot',bannerApiController.getSlideBot);
router.get('/popular',bannerApiController.getPopular);
router.get('/hot',bannerApiController.getHot);

module.exports = router;