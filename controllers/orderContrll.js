const Orders = require('../models/orderModel');

class OrderController {
    // [GET] order/
    async getView(req, res) {
        const limit = 10;
        const currPage = req.query.page ? req.query.page : 1;
        try {
            const orders = await Orders.find()
                .skip(limit * currPage - limit)
                .limit(limit)
                .lean();

            const countOrders = await Orders.countDocuments();

            res.render('layouts/order/index', {
                orders,
                pagination: {
                    page: currPage,
                    pageCount: Math.ceil(countOrders / limit),
                },
                success: req.session.success,
            });
            req.session.success = null;
        } catch (error) {
            console.log('Có lỗi xảy ra', error);
        }
    }

    // [GET] order/detail
    async getDetail(req, res) {
        const {id} = req.params;
        if (id) {
            try {
                const order = await Orders.findById(id).lean();
                if (order) {
                    res.render('layouts/order/detail', {
                        order: order,
                        title: 'Chi tiết đơn hàng',
                    });
                } else {
                    res.render('page/404');
                }
            } catch (error) {
                console.log('Có lỗi xảy ra', error);
            }
        } else {
            res.render('page/404');
        }
    }

    // [GET] order/change-status/:id
    async changeStatus(req, res) {
        const {id} = req.params;
        if (id) {
            try {
                const order = await Orders.findById(id).lean();
                if (order) {
                    res.render('layouts/order/change-status', {
                        order: order,
                        title: 'Thay đổi trang thái đơn hàng',
                    });
                } else {
                    res.render('page/404');
                }
            } catch (error) {
                console.log('Có lỗi xảy ra', error);
            }
        } else {
            res.render('page/404');
        }
    }

    // [PUT] order/store-change-status
    async storeChangeStatus(req, res) {
        try {
            await Orders.findByIdAndUpdate(
                req.body.orderId,
                {
                    $set: {
                        'status.transport': req.body.statusTransport,
                        'status.payment': req.body.statusPayment,
                    },
                },
            );
            req.session.success = 'Sửa trạng thái thành công';
            res.redirect('/order');
        } catch (error) {
            console.log('Có lỗi xảy ra', error);
        }
    }
}

module.exports = new OrderController();
