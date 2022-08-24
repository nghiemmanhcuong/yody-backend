const express = require('express');
const router = express.Router();

const infoApiController = require('../../controllers/api/infoContrll');

router.get('/',infoApiController.getInfo);

module.exports = router;