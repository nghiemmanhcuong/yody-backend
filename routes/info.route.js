const express = require('express');
const router = express.Router();

const infoController = require('../controllers/infoContrll');

router.get('/',infoController.getView);
router.put('/store-edit',infoController.storeEdit);

module.exports = router;