const express = require('express');
const router = express.Router();

const productController = require('../controllers/productContrll');
const upload = require('../middleware/upload');

router.get('',productController.getView);
router.get('/add',productController.addView);
router.get('/edit/:id',productController.editView);

router.post('/store-add',upload.fields([{name: 'images',maxCount:100},{name: 'image_main'}]),productController.storeAdd);
router.put('/store-edit/:id',upload.single('image_main'),productController.storeEdit);
router.delete('/store-delete/:id',productController.storeDelete);

module.exports = router;