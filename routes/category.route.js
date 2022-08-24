const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryContrll');
const upload = require('../middleware/upload');

router.get('/',categoryController.getView);
router.get('/add',categoryController.addView);  
router.get('/edit/:id',categoryController.editView);  
router.get('/child/:parentId',categoryController.childView);
router.get('/add-child/:parentId',categoryController.addChildView);

router.post('/store-add',upload.single('icon'),categoryController.storeAdd);
router.post('/store-add-child',categoryController.storeAddChild);
router.put('/store-edit/:id',upload.single('icon'),categoryController.storeEdit);
router.delete('/store-delete/:id',categoryController.storeDelete);
router.delete('/store-delete-child/:id/:parentId',categoryController.storeDeleteChild);

module.exports = router;