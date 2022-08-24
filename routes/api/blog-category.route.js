const express = require('express');
const router = express.Router();

const blogCategoryApiController = require('../../controllers/api/blogCategoryContrll');

router.get('/all',blogCategoryApiController.getAll);

module.exports = router;