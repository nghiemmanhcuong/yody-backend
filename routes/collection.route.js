const express = require('express');
const router = express.Router();

const collectionController = require('../controllers/collectionContrll');
const upload = require('../middleware/upload');

router.get('',collectionController.getView);
router.get('/add',collectionController.addView);
router.get('/edit/:id',collectionController.editView);

router.post('/store-add',upload.single('image'),collectionController.storeAdd);
router.put('/store-edit/:id',upload.single('image'),collectionController.storeEdit);
router.delete('/store-delete/:id',collectionController.storeDelete);

module.exports = router;