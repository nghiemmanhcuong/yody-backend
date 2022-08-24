const Orders = require('../../models/orderModel.js');

class OrderController {
    // [POST] api/order/add
    async addOrder(req, res) {
        try {
            const newOrder = new Orders(req.body);
            await newOrder.save();
            res.status(200).json({
                success: true,
                message: 'Order added successfully',
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi server ' + error,
            });
        }
    }
}

module.exports = new OrderController();
