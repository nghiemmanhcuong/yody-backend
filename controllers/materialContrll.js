const Materials = require('../models/materialModel');
const handlePaginationHref = require('../utils/handlePaginationHref');

class materialController {
    // [GET] material/
    async getView(req, res) {
        let materials;
        let countmaterials;
        const limit = 12;
        const currPage = req.query.page ? req.query.page : 1;
        const keyword = req.query.keyword;
        const field = req.query.field;
        const criteria = req.query.criteria;

        if (keyword) {
            if (field && criteria) {
                const result = await Materials.find({
                    $text: {$search: keyword},
                })
                    .skip(limit * currPage - limit)
                    .limit(limit)
                    .sort({field: criteria})
                    .lean();
                materials = result;
            } else {
                const result = await Materials.find({
                    $text: {$search: keyword},
                })
                    .skip(limit * currPage - limit)
                    .limit(limit)
                    .lean();
                materials = result;
            }
            const resultCount = await Materials.countDocuments({
                $text: {$search: keyword},
            });
            countmaterials = resultCount;
        } else {
            if (field && criteria) {
                const result = await Materials.find({isParent: true})
                    .sort({[field]: Number(criteria)})
                    .skip(limit * currPage - limit)
                    .limit(limit)
                    .allowDiskUse(true)
                    .lean();
                materials = result;
            } else {
                const result = await Materials.find({isParent: true})
                    .skip(limit * currPage - limit)
                    .limit(limit)
                    .lean();
                materials = result;
            }

            const resultCount = await Materials.countDocuments({isParent: true});
            countmaterials = resultCount;
        }

        res.render('layouts/material/index', {
            title: 'Danh s??ch ch???t li???u',
            materials,
            keyword,
            field,
            criteria,
            pagination: {
                page: currPage,
                pageCount: Math.ceil(countmaterials / limit),
            },
            href: handlePaginationHref(keyword, field, criteria),
            error: req.session.error,
            success: req.session.success,
        });
        req.session.error = null;
        req.session.success = null;
    }

    // [GET] material/add
    async addView(req, res) {
        res.render('layouts/material/add', {
            error: req.session.error,
            success: req.session.success,
        });
        req.session.error = null;
        req.session.success = null;
    }

    // [GET] material/edit
    async editView(req, res) {
        try {
            const material = await Materials.findById(req.params.id).lean();

            res.render('layouts/material/edit', {
                error: req.session.error,
                material
            });
            req.session.error = null;
        } catch (error) {
            req.session.error =
                'C?? l???i khi x???y ra';
            res.redirect('/material');
        }
    }

    // store
    // [POST] material/store-add
    async storeAdd(req, res) {
        let error = '';
        if (req.body.name == '') {
            error = 'Vui l??ng nh???p t??n ch???t li???u';
        } else {
            if (req.body.name.length > 100) {
                error = 'T??n ch???t li???u kh??ng ???????c qu?? 100 k?? t???';
            }
        }

        if (error != '') {
            req.session.error = error;
            req.session.name = req.body.name;
            res.redirect('/material/add');
        } else {
            try {
                const newMaterial = new Materials(req.body);

                await newMaterial.save();
                req.session.success = 'Th??m ch???t li???u th??nh c??ng';
                res.redirect('/material/add');
            } catch (error) {
                req.session.error =
                    'C?? l???i khi th???c hi???n th??m ch???t li???u vui l??ng th??m l???i ho???c li??n h??? qu???n tr??? vi??n';
                res.redirect('/material/add');
            }
        }
    }

    // [PUT] material/store-edit/:id
    async storeEdit(req, res) {
        let error = '';
        if (req.body.name == '') {
            error = 'Vui l??ng nh???p t??n ch???t li???u';
        } else {
            if (req.body.name.length > 100) {
                error = 'T??n ch???t li???u kh??ng ???????c qu?? 100 k?? t???';
            }
        }

        if (error != '') {
            req.session.error = error;
            res.redirect('/material/edit');
        } else {
            try {
                await Materials.updateOne({_id:req.params.id},req.body);

                req.session.success = 'S???a ch???t li???u th??nh c??ng';
                res.redirect('/material');
            } catch (error) {
                req.session.error =
                    'C?? l???i khi th???c hi???n th??m ch???t li???u vui l??ng th??m l???i ho???c li??n h??? qu???n tr??? vi??n';
                res.redirect('/material');
            }
        }
    }

    //[DELETE] material/store-delete/:id
    async storeDelete(req, res) {
        try {
            await Materials.deleteOne({_id: req.params.id});
            req.session.success = 'Xo?? ch???t li???u th??nh c??ng';
            res.redirect('/material');
        } catch (error) {
            req.session.error =
                'C?? l???i khi th???c hi???n xo?? ch???t li???u vui l??ng th??m l???i ho???c li??n h??? qu???n tr??? vi??n';
            res.redirect('/material');
        }
    }
}

module.exports = new materialController();
