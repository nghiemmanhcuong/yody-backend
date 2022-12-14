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
            title:'Danh m???c b??i vi???t',
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
            title:'Th??m danh m???c b??i vi???t',
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
                'C?? l???i khi x???y ra';
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
                    title:'Danh s??ch c???p con b??i vi???t',
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
            req.session.error = 'C?? l???i s???y ra';
            res.redirect('/blog-category');
        }
    }

    // [GET] blog-category/add-child/:parentId
    async AddChildView(req, res) {
        res.render('layouts/blogCategory/add-child', {
            title:'Th??m c???p con b??i vi???t',
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
            error = 'Vui l??ng nh???p t??n m???c b??i vi???t';
        } else {
            if (req.body.name.length > 50) {
                error = 'T??n m???c b??i vi???t kh??ng ???????c qu?? 50 k?? t???';
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
                req.session.success = 'Th??m m???c b??i vi???t th??nh c??ng';
                res.redirect('/blog-category/add');
            } catch (error) {
                req.session.error =
                    'C?? l???i khi th???c hi???n th??m m???c b??i vi???t vui l??ng th??m l???i ho???c li??n h??? qu???n tr??? vi??n';
                res.redirect('/blog-category/add');
            }
        }
    }

    // [PUT] blog-category/store-edit/:id
    async storeEdit(req, res) {
        let error = '';
        if (req.body.name == '') {
            error = 'Vui l??ng nh???p t??n m???c b??i vi???t';
        } else {
            if (req.body.name.length > 50) {
                error = 'T??n m???c b??i vi???t kh??ng ???????c qu?? 50 k?? t???';
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
                
                req.session.success = 'S???a m???c b??i vi???t th??nh c??ng';
                res.redirect('/blog-category');
            } catch (error) {
                req.session.error =
                    'C?? l???i khi th???c hi???n s???a m???c b??i vi???t vui l??ng s???a l???i ho???c li??n h??? qu???n tr??? vi??n';
                res.redirect('/blog-category');
            }
        }
    }

    //[DELETE] blog-category/store-delete/:id
    async storeDelete(req, res) {
        try {
            await BlogCategories.deleteOne({_id: req.params.id});
            req.session.success = 'Xo?? m???c b??i vi???t th??nh c??ng';
            res.redirect('/blog-category');
        } catch (error) {
            req.session.error =
                'C?? l???i khi th???c hi???n xo?? m???c b??i vi???t vui l??ng xo?? l???i ho???c li??n h??? qu???n tr??? vi??n';
            res.redirect('/blog-category');
        }
    }

    // [POST] blog-category/store-add-child
    async storeAddChild(req, res) {
        let error = '';
        if (req.body.name == '') {
            error = 'Vui l??ng nh???p t??n m???c con';
        } else {
            if (req.body.name.length > 50) {
                error = 'T??n m???c con kh??ng ???????c qu?? 50 k?? t???';
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

                    req.session.success = 'Th??m c???p con th??nh c??ng';
                    res.redirect('/blog-category/add-child/' + req.body.parentId);
                } else {
                    req.session.error =
                        'C?? l???i khi th???c hi???n th??m c???p con vui l??ng th??m l???i ho???c li??n h??? qu???n tr??? vi??n';
                    res.redirect('/blog-category/add-child/' + req.body.parentId);
                }
            } catch (error) {
                req.session.error =
                    'C?? l???i khi th???c hi???n th??m m???c con vui l??ng th??m l???i ho???c li??n h??? qu???n tr??? vi??n';
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
            req.session.success = 'Xo?? c???p con th??nh c??ng';
            res.redirect('/blog-category/child/' + req.params.parentId);
        } catch (error) {
            req.session.error =
                'C?? l???i khi th???c hi???n xo?? lo???i s???n ph???m vui l??ng th??m l???i ho???c li??n h??? qu???n tr??? vi??n';
            res.redirect('/blog-category');
        }
    }
}

module.exports = new blogCategoryController();
