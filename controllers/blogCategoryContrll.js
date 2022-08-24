const BlogCategories = require('../models/blogCategoryModel');
const handlePaginationHref = require('../utils/handlePaginationHref');

class blogCategoryController {
    // [GET] blog-category/
    async getView(req, res) {
        let blogCategories;
        let countBlogCategories;
        const limit = 12;
        const currPage = req.query.page ? req.query.page : 1;
        const keyword = req.query.keyword;
        const field = req.query.field;
        const criteria = req.query.criteria;

        if (keyword) {
            if (field && criteria) {
                const result = await BlogCategories.find({
                    $text: {$search: keyword},
                    isParent: true,
                })
                    .skip(limit * currPage - limit)
                    .limit(limit)
                    .sort({field: criteria})
                    .lean();
                blogCategories = result;
            } else {
                const result = await BlogCategories.find({
                    $text: {$search: keyword},
                    isParent: true,
                })
                    .skip(limit * currPage - limit)
                    .limit(limit)
                    .lean();
                blogCategories = result;
            }
            const resultCount = await BlogCategories.countDocuments({
                $text: {$search: keyword},
                isParent: true,
            });
            countBlogCategories = resultCount;
        } else {
            if (field && criteria) {
                const result = await BlogCategories.find({isParent: true})
                    .sort({[field]: Number(criteria)})
                    .skip(limit * currPage - limit)
                    .limit(limit)
                    .allowDiskUse(true)
                    .lean();
                blogCategories = result;
            } else {
                const result = await BlogCategories.find({isParent: true})
                    .skip(limit * currPage - limit)
                    .limit(limit)
                    .lean();
                blogCategories = result;
            }

            const resultCount = await BlogCategories.countDocuments({isParent: true});
            countBlogCategories = resultCount;
        }

        res.render('layouts/blogCategory/index', {
            title:'Danh mục bài viết',
            blogCategories,
            keyword,
            field,
            criteria,
            pagination: {
                page: currPage,
                pageCount: Math.ceil(countBlogCategories / limit),
            },
            href: handlePaginationHref(keyword, field, criteria),
            error: req.session.error,
            success: req.session.success,
        });
        req.session.error = null;
        req.session.success = null;
    }

    // [GET] blog-category/add
    async addView(req, res) {
        res.render('layouts/blogCategory/add', {
            title:'Thêm danh mục bài viết',
            error: req.session.error,
            success: req.session.success,
            data: req.session.data,
        });
        req.session.error = null;
        req.session.success = null;
        req.session.data = null;
    }

    // [GET] blog-category/edit
    async editView(req, res) {
        try {
            const blogCategory = await BlogCategories.findById(req.params.id).lean();

            res.render('layouts/blogCategory/edit', {
                error: req.session.error,
                blogCategory
            });
            req.session.error = null;
        } catch (error) {
            req.session.error =
                'Có lỗi khi xảy ra';
            res.redirect('/blog-category');
        }
    }

    // [GET] blog-category/child/:parentId
    async childView(req, res) {
        try {
            const parentCategory = await BlogCategories.findById(req.params.parentId);

            if (parentCategory) {
                const childCategorires = await Promise.all(
                    parentCategory.childCategorires.map((id) => {
                        return BlogCategories.findById(id).lean();
                    }),
                );

                res.render('layouts/blogCategory/child', {
                    title:'Danh sách cấp con bài viết',
                    childCategorires,
                    parentId: req.params.parentId,
                    error: req.session.error,
                    success: req.session.success,
                });
                req.session.error = null;
                req.session.success = null;
            } else {
                res.redirect('/blog-category');
            }
        } catch (error) {
            req.session.error = 'Có lỗi sảy ra';
            res.redirect('/blog-category');
        }
    }

    // [GET] blog-category/add-child/:parentId
    async AddChildView(req, res) {
        res.render('layouts/blogCategory/add-child', {
            title:'Thêm cấp con bài viết',
            error: req.session.error,
            success: req.session.success,
            parentId: req.params.parentId,
        });
        req.session.error = null;
        req.session.success = null;
    }

    // store
    // [POST] blog-category/store-add
    async storeAdd(req, res) {
        let error = '';
        if (req.body.name == '') {
            error = 'Vui lòng nhập tên mục bài viết';
        } else {
            if (req.body.name.length > 50) {
                error = 'Tên mục bài viết không được quá 50 ký tự';
            }
        }

        if (error != '') {
            req.session.error = error;
            req.session.name = req.body.name;
            res.redirect('/blog-category/add');
        } else {
            try {
                const formData = req.body;
                formData.isParent = true;

                const newBlogCategory = new BlogCategories(formData);

                await newBlogCategory.save();
                req.session.success = 'Thêm mục bài viết thành công';
                res.redirect('/blog-category/add');
            } catch (error) {
                req.session.error =
                    'Có lỗi khi thực hiện thêm mục bài viết vui lòng thêm lại hoặc liên hệ quản trị viên';
                res.redirect('/blog-category/add');
            }
        }
    }

    // [PUT] blog-category/store-edit/:id
    async storeEdit(req, res) {
        let error = '';
        if (req.body.name == '') {
            error = 'Vui lòng nhập tên mục bài viết';
        } else {
            if (req.body.name.length > 50) {
                error = 'Tên mục bài viết không được quá 50 ký tự';
            }
        }

        if (error != '') {
            req.session.error = error;
            res.redirect('/blog-category/edit/' + req.params.id);
        } else {
            try {
                const formData = req.body;
                formData.isParent = true;

                await BlogCategories.updateOne({_id:req.params.id},formData);
                
                req.session.success = 'Sửa mục bài viết thành công';
                res.redirect('/blog-category');
            } catch (error) {
                req.session.error =
                    'Có lỗi khi thực hiện sửa mục bài viết vui lòng sửa lại hoặc liên hệ quản trị viên';
                res.redirect('/blog-category');
            }
        }
    }

    //[DELETE] blog-category/store-delete/:id
    async storeDelete(req, res) {
        try {
            await BlogCategories.deleteOne({_id: req.params.id});
            req.session.success = 'Xoá mục bài viết thành công';
            res.redirect('/blog-category');
        } catch (error) {
            req.session.error =
                'Có lỗi khi thực hiện xoá mục bài viết vui lòng xoá lại hoặc liên hệ quản trị viên';
            res.redirect('/blog-category');
        }
    }

    // [POST] blog-category/store-add-child
    async storeAddChild(req, res) {
        let error = '';
        if (req.body.name == '') {
            error = 'Vui lòng nhập tên mục con';
        } else {
            if (req.body.name.length > 50) {
                error = 'Tên mục con không được quá 50 ký tự';
            }
        }

        if (error != '') {
            req.session.error = error;
            req.session.name = req.body.name;
            res.redirect('/blog-category/add-child/' + req.body.parentId);
        } else {
            try {
                const parentCategory = await BlogCategories.findById({_id: req.body.parentId});
                const formData = req.body;

                const newCategoryChild = new BlogCategories(formData);
                await newCategoryChild.save();

                const lastChildCategory = await BlogCategories.find({}).sort({_id: -1}).limit(1);

                if (lastChildCategory) {
                    parentCategory.childCategorires.push(lastChildCategory[0]._id);
                    await BlogCategories.updateOne({_id: req.body.parentId}, parentCategory);

                    req.session.success = 'Thêm cấp con thành công';
                    res.redirect('/blog-category/add-child/' + req.body.parentId);
                } else {
                    req.session.error =
                        'Có lỗi khi thực hiện thêm cấp con vui lòng thêm lại hoặc liên hệ quản trị viên';
                    res.redirect('/blog-category/add-child/' + req.body.parentId);
                }
            } catch (error) {
                req.session.error =
                    'Có lỗi khi thực hiện thêm mục con vui lòng thêm lại hoặc liên hệ quản trị viên';
                res.redirect('/blog-category/add-child/' + req.body.parentId);
            }
        }
    }

    //[DELETE] /blog-category/store-delete/:id/:parentId
    async storeDeleteChild(req, res) {
        try {
            const parentCategory = await BlogCategories.findById(req.params.parentId);
            if (parentCategory.childCategorires.includes(req.params.id)) {
                const childCategorires = parentCategory.childCategorires.filter(
                    (child) => child != req.params.id,
                );
                await BlogCategories.updateOne(
                    {_id: req.params.parentId},
                    {$set: {childCategorires: childCategorires}},
                );
            }

            await BlogCategories.deleteOne({_id: req.params.id});
            req.session.success = 'Xoá cấp con thành công';
            res.redirect('/blog-category/child/' + req.params.parentId);
        } catch (error) {
            req.session.error =
                'Có lỗi khi thực hiện xoá loại sản phẩm vui lòng thêm lại hoặc liên hệ quản trị viên';
            res.redirect('/blog-category');
        }
    }
}

module.exports = new blogCategoryController();
