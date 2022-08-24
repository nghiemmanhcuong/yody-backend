const express = require('express');
const router = express.Router();
const authApiController = require('../../controllers/api/authContrll');

router.post('/register',authApiController.register);
router.post('/login',authApiController.login);
router.put('/change-password',authApiController.changePassword);

module.exports = router;