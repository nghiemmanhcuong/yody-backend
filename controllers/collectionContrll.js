const Collection = require('../models/collectionModel');

class collectionController {
    // [GET] /
    async getView(req, res) {
        const limit = 12;
        const currPage = req.query.page ? req.query.page : 1;

        const collections = await Collection.find({})
            .skip(limit * currPage - limit)
            .limit(limit)
            .lean();

        const countCollection = await Collection.countDocuments({});

        res.render('layouts/collection/index', {
            title: 'Bộ sưu tập',
            collections,
            pagination: {
                page: currPage,
                pageCount: Math.ceil(countCollection / limit),
            },
            error: req.session.error,
            success: req.session.success,
        });
        req.session.error = null;
        req.session.success = null;
    }

    // [GET] /add
    async addView(req, res) {
        res.render('layouts/collection/add', {
            title: 'Thêm bộ sưu tập',
            errors: req.session.errors,
            success: req.session.success,
            data: req.session.data,
        });
        req.session.errors = null;
        req.session.success = null;
    }

    // [GET] collection/edit/:id
    async editView(req, res) {
        try {
            const collection = await Collection.findById(req.params.id).lean();
            res.render('layouts/collection/edit', {
                title: 'Sửa bộ sưu tập',
                errors: req.session.errors,
                error: req.session.error,
                collection,
            });
            req.session.errors = null;
            req.session.error = null;
        } catch (error) {
            req.session.error =
                    'Có lỗi vui lòng tải lại trang hoặc liên hệ quản trị viên';
                res.redirect('/collection');
        }
    }

    // store
    // [POST] collection/store-add
    async storeAdd(req, res) {
        const errors = {};
        if (req.error) {
            errors.image = req.error;
        }

        if(!req.file) {
            errors.image =  'Ảnh bộ sưu tập không được để trống';
        }

        if(req.body.name === ''){
            errors.name = 'Tên bộ sưu tập không được để trống';
        }else { 
            if(req.body.name.length > 50) {
                errors.name = 'Tên bộ sưu tập không được trên 50 ký tự';
            }
        }

        if(Object.entries(errors).length > 0) {
            req.session.errors = errors;
            res.redirect('/collection/add');
        }else {
            try {
                const formData = {
                    name: req.body.name,
                    image:req.file.path
                }

                const newCollection = new Collection(formData);
                await newCollection.save();

                req.session.success = 'Thêm bộ sưu tập thành công';
                res.redirect('/collection/add');
            } catch (error) {
                req.session.error =
                    'Có lỗi khi thực hiện thêm bộ sưu tập vui lòng thêm lại hoặc liên hệ quản trị viên';
                res.redirect('/collection/add');
            }
        }
    }

    // [POST] collection/store-edit/:id
    async storeEdit(req, res) {
        const errors = {};

        if(req.body.name === ''){
            errors.name = 'Tên bộ sưu tập không được để trống';
        }else { 
            if(req.body.name.length > 50) {
                errors.name = 'Tên bộ sưu tập không được trên 50 ký tự';
            }
        }

        if(Object.entries(errors).length > 0) {
            req.session.errors = errors;
            res.redirect('/collection/edit/'+ req.params.id);
        }else {
            try {
                let formData;
                if(!req.file){
                    formData = {
                        name: req.body.name,
                        image:req.body.img
                    }
                }else {
                    formData = {
                        name: req.body.name,
                        image:req.file.path
                    }
                }

                await Collection.updateOne({_id:req.params.id},formData);
                req.session.success = 'Sửa bộ sưu tập thành công';
                res.redirect('/collection');

            } catch (error) {
                req.session.error =
                    'Có lỗi khi thực hiện thêm bộ sưu tập vui lòng thêm lại hoặc liên hệ quản trị viên';
                res.redirect('/collection/edit/'+ req.params.id);
            }
        }
    }

    //[DELETE] collection/store-delete/:id
    async storeDelete(req, res) {
        try {
            await Collection.deleteOne({_id: req.params.id});
            req.session.success = 'Xoá bộ sưu tập thành công';
            res.redirect('/collection');
        } catch (error) {
            req.session.error =
                'Có lỗi khi thực hiện xoá bộ sưu tập vui lòng thêm lại hoặc liên hệ quản trị viên';
            res.redirect('/collection');
        }
    }
}

module.exports = new collectionController();
