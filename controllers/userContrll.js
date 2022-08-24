const User = require('../models/userModel');
const handlePaginationHref = require('../utils/handlePaginationHref');

class userController {
    // [GET] user/
    async getView(req, res) {
        let users;
        let countUser;
        const limit = 12;
        const currPage = req.query.page ? req.query.page : 1;
        const keyword = req.query.keyword;
        const field = req.query.field;
        const criteria = req.query.criteria;

        if (keyword) {
            if (field && criteria) {
                const result = await User.find({$text: {$search: keyword}})
                    .skip(limit * currPage - limit)
                    .limit(limit)
                    .sort({field: criteria})
                    .lean();
                users = result;
            } else {
                const result = await User.find({$text: {$search: keyword}})
                    .skip(limit * currPage - limit)
                    .limit(limit)
                    .lean();
                users = result;
            }
            const resultCount = await User.countDocuments({$text: {$search: keyword}});
            countUser = resultCount;
        } else {
            if (field && criteria) {
                const result = await User.find({})
                    .sort({[field]: Number(criteria)})
                    .skip(limit * currPage - limit)
                    .limit(limit)
                    .allowDiskUse(true)
                    .lean();
                users = result;
            } else {
                const result = await User.find({})
                    .skip(limit * currPage - limit)
                    .limit(limit)
                    .lean();
                users = result;
            }

            const resultCount = await User.countDocuments({});
            countUser = resultCount;
        }

        res.render('layouts/user/index', {
            title:'Danh sách người dùng',
            users,
            keyword,
            field,
            criteria,
            pagination: {
                page: currPage,
                pageCount: Math.ceil(countUser / limit),
                
            },
            href:handlePaginationHref(keyword, field, criteria),
            error: req.session.error,
            success: req.session.success,
        });
        req.session.error = null;
        req.session.success = null;
    }

    // [GET] user/add
    async addView(req, res) {
        res.render('layouts/user/add', {
            title: 'Thêm người dùng',
            errors: req.session.errors,
            error: req.session.error,
            success: req.session.success,
            data: req.session.data,
        });
        req.session.errors = null;
        req.session.error = null;
        req.session.success = null;
        req.session.data = null;
    }

    // [GET] user/edit/:id
    async editView(req, res) {
        try {
            const user = await User.findById(req.params.id).lean();
            if (user) {
                res.render('layouts/user/edit', {
                    user,
                    title: 'Sửa người dùng',
                    error: req.session.error,
                    errors: req.session.errors,
                });
                req.session.error = null;
                req.session.errors = null;
            } else {
                res.redirect('/user');
            }
        } catch (error) {
            res.redirect('/user');
        }
    }

    // [POST] user/store-add
    async storeAdd(req, res) {
        const errors = {};
        const {surname, name, phone, email, access, password} = req.body;

        if (surname == '') {
            errors.surname = 'Họ và tên đệm không được để trống';
        } else {
            if (surname.length > 50) {
                errors.surname = 'Họ và tên đệm không được trên 50 ký tự';
            }
        }

        if (name == '') {
            errors.name = 'Tên đệm không được để trống';
        } else {
            if (name.length > 25) {
                errors.name = 'Tên đệm không được trên 25 ký tự';
            }
        }

        if (phone == '') {
            errors.phone = 'Số điện thoại không được để trống';
        } else {
            var pattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
            if (!phone.match(pattern)) {
                errors.phone = 'Số điện thoại không hợp lệ';
            }
        }

        if (email == '') {
            errors.email = 'Email không được để trống';
        } else {
            var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!email.match(pattern)) {
                errors.email = 'Email không hợp lệ';
            }
        }

        if (password == '') {
            errors.password = 'Mật khẩu không được để trống';
        }

        if (access == '') {
            errors.access = 'Quền truy cập không được để trống';
        }

        if (Object.entries(errors).length > 0) {
            req.session.errors = errors;
            req.session.data = req.body;
            res.redirect('/user/add');
        } else {
            try {
                const formData = req.body;
                const newUser = new User(formData);

                newUser.save();
                req.session.success = 'Thêm người dùng thành công';
                res.redirect('/user/add');
            } catch (error) {
                req.session.error =
                    'Có lỗi khi thực hiện thêm người vui lòng thêm lại hoặc liên hệ quản trị viên';
                res.redirect('/user/add');
            }
        }
    }

    // [POST] user/store-edit/:id
    async storeEdit(req, res) {
        const errors = {};
        const {surname, name, phone, email, access} = req.body;

        if (surname == '') {
            errors.surname = 'Họ và tên đệm không được để trống';
        } else {
            if (surname.length > 50) {
                errors.surname = 'Họ và tên đệm không được trên 50 ký tự';
            }
        }

        if (name == '') {
            errors.name = 'Tên đệm không được để trống';
        } else {
            if (name.length > 25) {
                errors.name = 'Tên đệm không được trên 25 ký tự';
            }
        }

        if (phone == '') {
            errors.phone = 'Số điện thoại không được để trống';
        } else {
            var pattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
            if (!phone.match(pattern)) {
                errors.phone = 'Số điện thoại không hợp lệ';
            }
        }

        if (email == '') {
            errors.email = 'Email không được để trống';
        } else {
            var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!email.match(pattern)) {
                errors.email = 'Email không hợp lệ';
            }
        }

        if (access == '') {
            errors.access = 'Quền truy cập không được để trống';
        }

        if (Object.entries(errors).length > 0) {
            req.session.errors = errors;
            res.redirect('/user/edit/' + req.params.id);
        } else {
            try {
                const formData = req.body;
                await User.updateOne({_id: req.params.id}, formData);
                req.session.success = 'Sửa người dùng thành công';
                res.redirect('/user');
            } catch (error) {
                req.session.error =
                    'Có lỗi khi thực hiện sửa người vui lòng sửa lại hoặc liên hệ quản trị viên';
                res.redirect('/user/edit/' + req.params.id);
            }
        }
    }

    //[DELETE] user/store-delete/:id
    async storeDelete(req, res) {
        try {
            await User.deleteOne({_id: req.params.id});
            req.session.success = 'Xoá người dùng thành công';
            res.redirect('/user');
        } catch (error) {
            req.session.error =
                'Có lỗi khi thực hiện xoá người dùng vui lòng thêm lại hoặc liên hệ quản trị viên';
            res.redirect('/user');
        }
    }
}

module.exports = new userController();
