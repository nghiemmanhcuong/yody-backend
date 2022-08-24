const express = require('express');
const router = express.Router();

const contactApiController = require('../../controllers/api/contactContrll');

router.post('/add',contactApiController.addContact);

module.exports = router;