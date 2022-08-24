const express = require('express');
const router = express.Router();

const blogCategoryController = require('../controllers/blogCategoryContrll');

router.get('/',blogCategoryController.getView);
router.get('/add',blogCategoryController.addView);
router.get('/edit/:id',blogCategoryController.editView);
router.get('/child/:parentId',blogCategoryController.childView);
router.get('/add-child/:parentId',blogCategoryController.AddChildView);

router.post('/store-add',blogCategoryController.storeAdd);
router.post('/store-add-child',blogCategoryController.storeAddChild);
router.put('/store-edit/:id',blogCategoryController.storeEdit);
router.delete('/store-delete/:id',blogCategoryController.storeDelete);
router.delete('/store-delete-child/:id/:parentId',blogCategoryController.storeDeleteChild);

module.exports = router;