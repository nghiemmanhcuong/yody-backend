const Infos = require('../models/infoModel');

class infoController {
    // [GET] info/
    async getView(req, res) {
        try {
            const infos = await Infos.findOne({}).lean();

            res.render('layouts/info/index', {
                title:'Thông tin YODY',
                success: req.session.success,
                error: req.session.error,
                infos,  
            });
            req.session.success = null;
            req.session.error = null;
        } catch (error) {
            req.session.error = 'Có lỗi khi xảy ra';
            res.redirect('/info');
        }
    }

    // [PUT] info/store-edit
    async storeEdit(req, res) {
        let error = '';
        const {
            companyName,
            address,
            hotline,
            phoneOrder,
            phoneWonder,
            phoneFeedback,
            mailCustomerCare,
            slogan,
        } = req.body;

        if (
            !companyName ||
            !address ||
            !hotline ||
            !phoneOrder ||
            !phoneWonder ||
            !phoneFeedback ||
            !mailCustomerCare ||
            !slogan
        ) {
            error = 'Vui lòng khồng để trống thông tin';
        }

        if(error != '') {
            req.session.error = error;
            res.redirect('/info');
        }else {
            try {
                await Infos.updateOne(req.body);

                req.session.success = 'Lưu chỉnh sửa thành công';
                res.redirect('/info');
            } catch (error) {
                req.session.error = 'Có lỗi khi xảy ra';
                res.redirect('/info');
            }
        }
    }
}

module.exports = new infoController();
