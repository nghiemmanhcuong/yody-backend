const express = require('express');
const router = express.Router();

const blogApiController = require('../../controllers/api/blogContrll');

router.get('/popular',blogApiController.getPopular);
router.get('/detail/:slug',blogApiController.getDetail);
router.get('/popular/:limit',blogApiController.getPopular);
router.get('/by-category/:category/:limit',blogApiController.getByCategory);
router.get('/by-category-popular/:category',blogApiController.getByCategoryPopular);

module.exports = router;