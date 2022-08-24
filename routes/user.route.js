const express = require('express');
const router = express.Router();

const userController = require('../controllers/userContrll');

router.get('',userController.getView);
router.get('/add',userController.addView);
router.get('/edit/:id',userController.editView);

router.post('/store-add',userController.storeAdd);
router.put('/store-edit/:id',userController.storeEdit);
router.delete('/store-delete/:id',userController.storeDelete);

module.exports = router;