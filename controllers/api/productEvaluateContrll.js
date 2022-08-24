const ProductEvaluates = require('../../models/productEvaluate');

class productEvaluateApiController {
    // [GET] api/product-evaluate/:productId
    async getAll(req, res) {
        try {
            const productId = req.params.productId;
            const productEvaluates = await ProductEvaluates.find({productId: productId}).lean();

            if(productEvaluates) {
                res.status(200).json({
                    success: true,
                    data: productEvaluates,
                });
            }else {
                res.status(500).json({
                    success: false, 
                    message: 'Không tìm thấy dữ liệu'
                });
            }

        } catch (error) {
            res.status(500).json({
                success: false, 
                message: 'Lỗi server ' + error
            });
        }
    }
}

module.exports = new productEvaluateApiController();
