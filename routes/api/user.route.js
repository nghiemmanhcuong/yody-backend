const express = require('express');
const router = express.Router();
const userApiController = require('../../controllers/api/userContrll');

router.put('/like-product',userApiController.likeProduct);
router.put('/unlike-product',userApiController.unlikeProduct);
router.post('/add-address',userApiController.addAddress);
router.delete('/delete-address/:userEmail/:addressId',userApiController.deleteAddress);

module.exports = router;