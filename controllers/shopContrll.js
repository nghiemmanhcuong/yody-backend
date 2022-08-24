const Shops = require('../models/shopModel');
const handlePaginationHref = require('../utils/handlePaginationHref');
const {provinces} = require('../utils/constants');

class shopController {
    // [GET] shop/
    async getView(req, res) {
        let shops;
        let countShops;
        const limit = 12;
        const currPage = req.query.page ? req.query.page : 1;
        const keyword = req.query.keyword;
        const field = req.query.field;
        const criteria = req.query.criteria;

        if (keyword) {
            if (field && criteria) {
                const result = await Shops.find({$text: {$search: keyword}})
                    .skip(limit * currPage - limit)
                    .limit(limit)
                    .sort({field: criteria})
                    .lean();
                    shops = result;
            } else {
                const result = await Shops.find({$text: {$search: keyword}})
                    .skip(limit * currPage - limit)
                    .limit(limit)
                    .lean();
                    shops = result;
            }
            const resultCount = await Shops.countDocuments({
                $text: {$search: keyword},
            });
            countShops = resultCount;
        } else {
            if (field && criteria) {
                const result = await Shops.find()
                    .sort({[field]: Number(criteria)})
                    .skip(limit * currPage - limit)
                    .limit(limit)
                    .allowDiskUse(true)
                    .lean();
                    shops = result;
            } else {
                const result = await Shops.find()
                    .skip(limit * currPage - limit)
                    .limit(limit)
                    .lean();
                    shops = result;
            }

            const resultCount = await Shops.countDocuments();
            countShops = resultCount;
        }

        res.render('layouts/shop/index', {
            title: 'Danh sách cửa hàng',
            shops,
            keyword,
            field,
            criteria,
            pagination: {
                page: currPage,
                pageCount: Math.ceil(countShops / limit),
            },
            href: handlePaginationHref(keyword, field, criteria),
            error: req.session.error,
            success: req.session.success,
        });
        req.session.error = null;
        req.session.success = null;
    }

    // [GET] shop/add
    async addView(req, res) {
        res.render('layouts/shop/add', {
            title: 'Thêm của hàng',
            errors: req.session.errors,
            error: req.session.error,
            success: req.session.success,
            data: req.session.data,
            provinces,
        });
        req.session.errors = null;
        req.session.error = null;
        req.session.success = null;
        req.session.data = null;
    }

    // [GET] shop/edit/:id
    async editView(req, res) {
        try {
            const shop = await Shops.findById(req.params.id).lean();
            if(shop) {
                res.render('layouts/shop/edit', {
                    title: 'Sửa của hàng',
                    errors: req.session.errors,
                    error: req.session.error,
                    shop,
                    provinces,
                });
                req.session.errors = null;
                req.session.error = null;
            }else {
                req.session.error = 'Có lỗi khi xảy ra';
                res.redirect('/shop');
            }
        } catch (error) {
            req.session.error = 'Có lỗi khi xảy ra';
            res.redirect('/shop');
        }
    }

    // store
    // [POST] banner/store-add
    async storeAdd(req, res) {
        const errors = {};
        let {shopName, phone, province, address, linkMap} = req.body;

        if (!shopName) {
            errors.shopName = 'Vui lòng nhập tên cửa hàng';
        }

        if (!phone) {
            errors.phone = 'Vui lòng nhập số điện thoại cửa hàng';
        }

        if (!province) {
            errors.province = 'Vui lòng nhập tỉnh thành cửa hàng';
        }

        if (!address) {
            errors.address = 'Vui lòng nhập địa chỉ cửa hàng';
        }

        if (!linkMap) {
            errors.linkMap = 'Vui lòng nhập link google map cửa hàng';
        }

        if (Object.entries(errors).length > 0) {
            req.session.errors = errors;
            req.session.data = req.body;
            res.redirect('/shop/add');
        } else {
            try {
                const newShop = new Shops(req.body);
                await newShop.save();

                req.session.success = 'Thêm cửa hàng thành công';
                res.redirect('/shop/add');
            } catch (error) {
                req.session.error = 'Có lỗi khi xảy ra';
                res.redirect('/shop/add');
            }
        }
    }

    // [PUT] banner/store-edit/:id
    async storeEdit(req, res) {
        const errors = {};
        let {shopName, phone, province, address, linkMap} = req.body;

        if (!shopName) {
            errors.shopName = 'Vui lòng nhập tên cửa hàng';
        }

        if (!phone) {
            errors.phone = 'Vui lòng nhập số điện thoại cửa hàng';
        }

        if (!province) {
            errors.province = 'Vui lòng nhập tỉnh thành cửa hàng';
        }

        if (!address) {
            errors.address = 'Vui lòng nhập địa chỉ cửa hàng';
        }

        if (!linkMap) {
            errors.linkMap = 'Vui lòng nhập link google map cửa hàng';
        }

        if (Object.entries(errors).length > 0) {
            req.session.errors = errors;
            req.session.data = req.body;
            res.redirect('/shop/edit/' + req.params.id);
        } else {
            try {
                await Shops.updateOne({_id:req.params.id},req.body);

                req.session.success = 'Sửa cửa hàng thành công';
                res.redirect('/shop');
            } catch (error) {
                req.session.error = 'Có lỗi khi xảy ra';
                res.redirect('/shop');
            }
        }
    }

    //[DELETE] shop/store-delete/:id
    async storeDelete(req, res) {
        try {
            await Shops.deleteOne({_id: req.params.id});
            req.session.success = 'Xoá cửa hàng thành công';
            res.redirect('/shop');
        } catch (error) {
            req.session.error =
                'Có lỗi khi thực hiện xoá cửa hàng vui lòng thêm lại hoặc liên hệ quản trị viên';
            res.redirect('/shop');
        }
    }
}

module.exports = new shopController();
