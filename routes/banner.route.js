const express = require('express');
const router = express.Router();

const bannerController = require('../controllers/bannerContrll');
const upload = require('../middleware/upload');

router.get('/',bannerController.getView);
router.get('/add',bannerController.addView);
router.get('/edit/:id',bannerController.editView);

router.post('/store-add',upload.single('image'),bannerController.storeAdd);
router.put('/store-edit/:id',upload.single('image'),bannerController.storeEdit);
router.delete('/store-delete/:id',bannerController.storeDelete);

module.exports = router;