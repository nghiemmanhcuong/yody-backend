const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shopContrll');

router.get('/',shopController.getView);
router.get('/add',shopController.addView);
router.get('/edit/:id',shopController.editView);

router.post('/store-add',shopController.storeAdd);
router.put('/store-edit/:id',shopController.storeEdit);
router.delete('/store-delete/:id',shopController.storeDelete);

module.exports = router;