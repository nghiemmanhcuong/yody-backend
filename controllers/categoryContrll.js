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
            title: 'Lo???i s???n ph???m',
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
            title: 'Th??m lo???i s???n ph???m',
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
                title: 'S???a lo???i s???n ph???m',
                type: req.query.type,
                category: category,
                error: req.session.error,
            });
            req.session.error = null;
        } catch (error) {
            req.session.error = 'C?? l???i Vui l??ng tr??? l???i v?? li??n h??? qu???n tr??? vi??n';
            res.redirect('/page/error');
        }
    }

    // [GET] category/add-child
    async addChildView(req, res) {
        const categories = await Categories.find({isParent: false}).lean();

        res.render('layouts/category/add-child', {
            title: 'Th??m c???p con',
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
                    title: 'Danh s??ch c???p con ' + parentCategory.name,
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
            error = 'Vui l??ng nh???p t??n lo???i s???n ph???m';
        } else {
            if (req.body.name.length > 50) {
                error = 'T??n lo???i s???n ph???m kh??ng ???????c qu?? 50 k?? t???';
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
                req.session.success = 'Th??m lo???i s???n ph???m th??nh c??ng';
                res.redirect('/category/add');
            } catch (error) {
                req.session.error =
                    'C?? l???i khi th???c hi???n th??m lo???i s???n ph???m vui l??ng th??m l???i ho???c li??n h??? qu???n tr??? vi??n';
                res.redirect('/category/add');
            }
        }
    }

    // [POST] category/store-add-child/:parentId
    async storeAddChild(req, res) {
        let error = '';
        if (req.body.name == '' && !req.body.categories) {
            error = 'Vui l??ng nh???p t??n c???p con';
        } else {
            if (req.body.name.length > 50) {
                error = 'T??n c???p con kh??ng ???????c qu?? 50 k?? t???';
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

                        req.session.success = 'Th??m c???p con th??nh c??ng';
                        res.redirect('/category/add-child/' + req.body.parentId);
                    }
                } else {
                    req.body.categories.forEach(category => {
                        parentCategory.childCategorires.push(category);
                    })
                    await Categories.updateOne({_id: req.body.parentId}, parentCategory);
                    req.session.success = 'Th??m c???p con th??nh c??ng';
                    res.redirect('/category/add-child/' + req.body.parentId);
                }
            } catch (error) {
                req.session.error =
                    'C?? l???i khi th???c hi???n th??m c???p con vui l??ng th??m l???i ho???c li??n h??? qu???n tr??? vi??n';
                res.redirect('/category/add-child/' + req.body.parentId);
            }
        }
    }

    //[PUT] /category/store-edit/:id
    async storeEdit(req, res) {
        let error = '';
        if (req.body.name == '') {
            error = 'T??n lo???i s???n ph???m kh??ng ???????c ????? tr???ng';
        } else {
            if (req.body.name.length > 50) {
                error = 'T??n lo???i s???n ph???m kh??ng ???????c qu?? 50 k?? t???';
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
                req.session.success = 'S???a lo???i s???n ph???m th??nh c??ng';
                res.redirect('/category');
            } catch (error) {
                req.session.error =
                    'C?? l???i khi th???c hi???n xo?? lo???i s???n ph???m vui l??ng th??m l???i ho???c li??n h??? qu???n tr??? vi??n';
                res.redirect('/category');
            }
        }
    }

    //[DELETE] /category/store-delete/:id
    async storeDelete(req, res) {
        try {
            await Categories.deleteOne({_id: req.params.id});
            req.session.success = 'Xo?? lo???i s???n ph???m th??nh c??ng';
            res.redirect('/category');
        } catch (error) {
            req.session.error =
                'C?? l???i khi th???c hi???n xo?? lo???i s???n ph???m vui l??ng th??m l???i ho???c li??n h??? qu???n tr??? vi??n';
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
            req.session.success = 'Xo?? c???p con th??nh c??ng';
            res.redirect('/category/child/' + req.params.parentId);
        } catch (error) {
            req.session.error =
                'C?? l???i khi th???c hi???n xo?? lo???i s???n ph???m vui l??ng th??m l???i ho???c li??n h??? qu???n tr??? vi??n';
            res.redirect('/category');
        }
    }
}

module.exports = new categoryController();
