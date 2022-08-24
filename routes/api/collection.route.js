const express = require('express');
const router = express.Router();

const collectionApiController = require('../../controllers/api/collectionContrll');

router.get('/all',collectionApiController.getAll);
router.get('/by-slug/:slug',collectionApiController.getBySlug);

module.exports = router;