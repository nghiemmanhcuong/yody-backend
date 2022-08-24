const express = require('express');
const router = express.Router();

const materialController = require('../controllers/materialContrll');

router.get('/',materialController.getView);
router.get('/add',materialController.addView);
router.get('/edit/:id',materialController.editView);

router.post('/store-add',materialController.storeAdd);
router.put('/store-edit/:id',materialController.storeEdit);
router.delete('/store-delete/:id',materialController.storeDelete);

module.exports = router;