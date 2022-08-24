const Categories = require('../models/categoryModel');
const handlePaginationHref = require('../utils/handlePaginationHref');

class categoryController {
    // [GET] category/
    async getView(req, res) {
        let categories;
        let countCategories;
        const limit = 12;
        const currPage = req.query.page ? req.query.page : 1;
        const keyword = req.query.keyword;
        const field = req.query.field;
        const criteria = req.query.criteria;

        if (keyword) {
            if (field && criteria) {
                const result = await Categories.find({$text: {$search: keyword}, isParent: true})
                    .skip(limit * currPage - limit)
                    .limit(limit)
                    .sort({field: criteria})
                    .lean();
                categories = result;
            } else {
                const result = await Categories.find({$text: {$search: keyword}, isParent: true})
                    .skip(limit * currPage - limit)
                    .limit(limit)
                    .lean();
                categories = result;
            }
            const resultCount = await Categories.countDocuments({
                $text: {$search: keyword},
                isParent: true,
            });
            countCategories = resultCount;
        } else {
            if (field && criteria) {
                const result = await Categories.find({isParent: true})
                    .sort({[field]: Number(criteria)})
                    .skip(limit * currPage - limit)
                    .limit(limit)
                    .allowDiskUse(true)
                    .lean();
                categories = result;
            } else {
                const result = await Categories.find({isParent: true})
                    .skip(limit * currPage - limit)
                    .limit(limit)
                    .lean();
                categories = result;
            }

            const resultCount = await Categories.countDocuments({isParent: true});
            countCategories = resultCount;
        }

        res.render('layouts/category/index', {
            title: 'Loại sản phẩm',
            categories,
            keyword,
            field,
            criteria,
            pagination: {
                page: currPage,
                pageCount: Math.ceil(countCategories / limit),
            },
            href: handlePaginationHref(keyword, field, criteria),
            error: req.session.error,
            success: req.session.success,
        });
        req.session.error = null;
        req.session.success = null;
    }

    // [GET] category/add
    async addView(req, res) {
        res.render('layouts/category/add', {
            title: 'Thêm loại sản phẩm',
            error: req.session.error,
            success: req.session.success,
        });
        req.session.error = null;
        req.session.success = null;
    }

    // [GET] category/edit/:id
    async editView(req, res) {
        try {
            const category = await Categories.findById(req.params.id).lean();

            res.render('layouts/category/edit', {
                title: 'Sửa loại sản phẩm',
                type: req.query.type,
                category: category,
                error: req.session.error,
            });
            req.session.error = null;
        } catch (error) {
            req.session.error = 'Có lỗi Vui lòng trở lại và liên hệ quản trị viên';
            res.redirect('/page/error');
        }
    }

    // [GET] category/add-child
    async addChildView(req, res) {
        const categories = await Categories.find({isParent: false}).lean();

        res.render('layouts/category/add-child', {
            title: 'Thêm cấp con',
            error: req.session.error,
            success: req.session.success,
            parentId: req.params.parentId,
            categories: categories,
        });
        req.session.error = null;
        req.session.success = null;
    }

    // [GET] category/child
    async childView(req, res) {
        try {
            const parentCategory = await Categories.findById(req.params.parentId);

            if (parentCategory) {
                const childCategorires = await Promise.all(
                    parentCategory.childCategorires.map((id) => {
                        return Categories.findById(id).lean();
                    }),
                );

                res.render('layouts/category/child', {
                    title: 'Danh sách cấp con ' + parentCategory.name,
                    childCategorires,
                    parentId: req.params.parentId,
                    error: req.session.error,
                    success: req.session.success,
                });
                req.session.error = null;
                req.session.success = null;
            } else {
                res.redirect('/category');
            }
        } catch (error) {
            res.redirect('/page/404');
        }
    }

    // ------- STORE ----------

    // [POST] category/store-add
    async storeAdd(req, res) {
        let error = '';
        if (req.body.name == '') {
            error = 'Vui lòng nhập tên loại sản phẩm';
        } else {
            if (req.body.name.length > 50) {
                error = 'Tên loại sản phẩm không được quá 50 ký tự';
            }
        }

        if (error != '') {
            req.session.error = error;
            req.session.name = req.body.name;
            res.redirect('/category/add');
        } else {
            try {
                const formData = req.body;
                formData.isParent = true;

                if (req.body.isPopular) {
                    formData.isPopular = true;
                }

                const newCategory = new Categories(formData);

                await newCategory.save();
                req.session.success = 'Thêm loại sản phẩm thành công';
                res.redirect('/category/add');
            } catch (error) {
                req.session.error =
                    'Có lỗi khi thực hiện thêm loại sản phẩm vui lòng thêm lại hoặc liên hệ quản trị viên';
                res.redirect('/category/add');
            }
        }
    }

    // [POST] category/store-add-child/:parentId
    async storeAddChild(req, res) {
        let error = '';
        if (req.body.name == '' && !req.body.categories) {
            error = 'Vui lòng nhập tên cấp con';
        } else {
            if (req.body.name.length > 50) {
                error = 'Tên cấp con không được quá 50 ký tự';
            }
        }

        if (error != '') {
            req.session.error = error;
            req.session.name = req.body.name;
            res.redirect('/category/add-child/' + req.body.parentId);
        } else {
            try {
                let newChildCategory = [];
                const parentCategory = await Categories.findById({_id: req.body.parentId});
                let formData = req.body;
                formData.category = parentCategory.category;
                formData.attributes = {};

                if (req.body.hot) {
                    formData.attributes.hot = true;
                }

                if (req.body.sale) {
                    formData.attributes.sale = true;
                }

                if (req.body.new) {
                    formData.attributes.new = true;
                }

                if (req.body.name) {
                    const newCategoryChild = new Categories(formData);
                    await newCategoryChild.save();

                    const lastChildCategory = await Categories.find({}).sort({_id: -1}).limit(1);

                    if (lastChildCategory) {
                        parentCategory.childCategorires.push(lastChildCategory[0]._id);
                        await Categories.updateOne({_id: req.body.parentId}, parentCategory);

                        req.session.success = 'Thêm cấp con thành công';
                        res.redirect('/category/add-child/' + req.body.parentId);
                    }
                } else {
                    req.body.categories.forEach(category => {
                        parentCategory.childCategorires.push(category);
                    })
                    await Categories.updateOne({_id: req.body.parentId}, parentCategory);
                    req.session.success = 'Thêm cấp con thành công';
                    res.redirect('/category/add-child/' + req.body.parentId);
                }
            } catch (error) {
                req.session.error =
                    'Có lỗi khi thực hiện thêm cấp con vui lòng thêm lại hoặc liên hệ quản trị viên';
                res.redirect('/category/add-child/' + req.body.parentId);
            }
        }
    }

    //[PUT] /category/store-edit/:id
    async storeEdit(req, res) {
        let error = '';
        if (req.body.name == '') {
            error = 'Tên loại sản phẩm không được để trống';
        } else {
            if (req.body.name.length > 50) {
                error = 'Tên loại sản phẩm không được quá 50 ký tự';
            }
        }

        if (error != '') {
            req.session.error = error;
            res.redirect('/category/edit/' + req.params.id);
        } else {
            try {
                const formData = req.body;
                formData.attributes = {};

                if (req.body.hot) {
                    formData.attributes.hot = true;
                }

                if (req.body.sale) {
                    formData.attributes.sale = true;
                }

                if (req.body.new) {
                    formData.attributes.new = true;
                }

                if (req.body.isPopular) {
                    formData.isPopular = true;
                }

                await Categories.updateOne({_id: req.params.id}, formData);
                req.session.success = 'Sửa loại sản phẩm thành công';
                res.redirect('/category');
            } catch (error) {
                req.session.error =
                    'Có lỗi khi thực hiện xoá loại sản phẩm vui lòng thêm lại hoặc liên hệ quản trị viên';
                res.redirect('/category');
            }
        }
    }

    //[DELETE] /category/store-delete/:id
    async storeDelete(req, res) {
        try {
            await Categories.deleteOne({_id: req.params.id});
            req.session.success = 'Xoá loại sản phẩm thành công';
            res.redirect('/category');
        } catch (error) {
            req.session.error =
                'Có lỗi khi thực hiện xoá loại sản phẩm vui lòng thêm lại hoặc liên hệ quản trị viên';
            res.redirect('/category');
        }
    }

    //[DELETE] /category/store-delete/:id/:parentId
    async storeDeleteChild(req, res) {
        try {
            const parentCategory = await Categories.findById(req.params.parentId);
            if (parentCategory.childCategorires.includes(req.params.id)) {
                const childCategorires = parentCategory.childCategorires.filter(
                    (child) => child != req.params.id,
                );
                await Categories.updateOne(
                    {_id: req.params.parentId},
                    {$set: {childCategorires: childCategorires}},
                );
            }

            await Categories.deleteOne({_id: req.params.id});
            req.session.success = 'Xoá cấp con thành công';
            res.redirect('/category/child/' + req.params.parentId);
        } catch (error) {
            req.session.error =
                'Có lỗi khi thực hiện xoá loại sản phẩm vui lòng thêm lại hoặc liên hệ quản trị viên';
            res.redirect('/category');
        }
    }
}

module.exports = new categoryController();
