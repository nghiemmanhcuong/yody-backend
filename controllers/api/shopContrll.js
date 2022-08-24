const Shops = require('../../models/shopModel.js');

class ShopApiController {
    // [GET] api/shop/
    async getAll(req, res) {
        const {province, keyword} = req.body;
        try {
            let data;
            if (province) {
                data = await Shops.find({province: province});
                if (keyword) {
                    data = await Shops.find({
                        $and: [{province: province}, {$text: {$search: keyword}}],
                    });
                }
            } else {
                if (keyword) {
                    data = await Shops.find({$text: {$search: keyword}});
                } else {
                    data = await Shops.find();
                }
            }
            res.status(200).json({
                success: true,
                shops: data,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi server ' + error,
            });
        }
    }
}

module.exports = new ShopApiController();
