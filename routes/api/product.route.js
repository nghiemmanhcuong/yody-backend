const express = require('express');
const router = express.Router();

const productApiController = require('../../controllers/api/productContrll');

router.get('/popular',productApiController.getPopular);
router.get('/relate/:category',productApiController.getRelate);
router.get('/by-keyword/:keyword',productApiController.getByKeyword);
router.get('/by-keyword/:keyword/:limit',productApiController.getByKeyword);
router.get('/by-material/:materialId/:limit',productApiController.getByMaterial);
router.post('/by-category/:category',productApiController.getByCategory);
router.post('/by-category/:category/:limit/:page',productApiController.getByCategory);
router.post('/by-collection/:collection',productApiController.getByCollection);
router.post('/by-collection/:collection/:limit/:page',productApiController.getByCollection);
router.get('/by-subject/:category',productApiController.getBySubject);
router.get('/detail/:slug',productApiController.getDetail);

module.exports = router;