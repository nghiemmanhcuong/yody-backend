const express = require('express');
const router = express.Router();

const blogController = require('../controllers/blogContrll');
const upload = require('../middleware/upload');

router.get('/',blogController.getView);
router.get('/add',blogController.addView);
router.get('/edit/:id',blogController.editView);

router.post('/store-add',upload.single('image'),blogController.storeAdd);
router.put('/store-edit/:id',upload.single('image'),blogController.storeEdit);
router.delete('/store-delete/:id',blogController.storeDelete);

module.exports = router;