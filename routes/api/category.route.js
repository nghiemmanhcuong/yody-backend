const express = require('express');
const router = express.Router();

const categoryApiController = require('../../controllers/api/categoryContrll');

router.get('/popular/:subject',categoryApiController.getPopular);
router.get('/parent-popular/:subject',categoryApiController.getParentPopular);
router.get('/by-subject/:subject',categoryApiController.getBySubject);
router.get('/in-navigation',categoryApiController.getInNavigation);
router.get('/by-slug/:slug',categoryApiController.getBySlug);

module.exports = router;