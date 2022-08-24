const express = require('express');
const router = express.Router();

const contactController = require('../controllers/contactContrll');

router.get('/',contactController.getView);
router.get('/detail/:id',contactController.getDetail);

module.exports = router;