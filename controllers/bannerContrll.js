const Banners = require('../models/bannersModel');
const Categories = require('../models/categoryModel');
const Collections = require('../models/collectionModel');
const handlePaginationHref = require('../utils/handlePaginationHref');

class bannerController {
    // [GET] banner/
    async getView(req, res) {
        let banners;
        let countBanner;
        const limit = 8;
        const currPage = req.query.page ? req.query.page : 1;
        const field = req.query.field;
        const criteria = req.query.criteria;

        if (field && criteria) {
            const result = await Banners.find({})
                .sort({[field]: Number(criteria)})
                .skip(limit * currPage - limit)
                .limit(limit)
                .allowDiskUse(true)
                .lean();
            banners = result;
        } else {
            const result = await Banners.find({})
                .skip(limit * currPage - limit)
                .limit(limit)
                .lean();
            banners = result;
        }

        const resultCount = await Banners.countDocuments({});
        countBanner = resultCount;

        res.render('layouts/banner/index', {
            title: 'Danh sách banner',
            banners,
            field,
            criteria,
            pagination: {
                page: currPage,
                pageCount: Math.ceil(countBanner / limit),
            },
            href: handlePaginationHref(null, field, criteria),
            error: req.session.error,
            success: req.session.success,
        });
        req.session.error = null;
        req.session.success = null;
    }

    // [GET] banner/add
    async addView(req, res) {
        try {
            const categories = await Categories.find({}).lean();
            const collections = await Collections.find({}).lean();

            res.render('layouts/banner/add', {
                title: 'Thêm banner',
                errors: req.session.errors,
                error: req.session.error,
                success: req.session.success,
                data: req.session.data,
                categories,
                collections,
            });
            req.session.errors = null;
            req.session.error = null;
            req.session.success = null;
            req.session.data = null;
        } catch (error) {
            req.session.error = 'Có lỗi khi xảy ra';
            res.redirect('/banner');
        }
    }

    // [GET] banner/edit
    async editView(req, res) {
        try {
            const categories = await Categories.find({}).lean();
            const collections = await Collections.find({}).lean();
            const banner = await Banners.findById(req.params.id).lean();

            res.render('layouts/banner/edit', {
                title: 'Sửa banner',
                errors: req.session.errors,
                error: req.session.error,
                categories,
                collections,
                banner
            });
            req.session.errors = null;
            req.session.error = null;
        } catch (error) {
            req.session.error = 'Có lỗi khi xảy ra';
            res.redirect('/banner');
        }
    }

    // store
    // [POST] banner/store-add
    async storeAdd(req, res) {
        const formData = {};
        const errors = {};
        let {
            height,
            width,
            category_link,
            collection_link,
            isTopbar,
            isSliderHero,
            isSliderBot,
            isPopular,
            isHot
        } = req.body;

        if (!height) {
            errors.height = 'Vui lòng chọn chiều cao banner';
        } else {
            if (isNaN(height) || height < 1) {
                errors.height = 'Chiều cao không hợp lệ';
            } else {
                formData.height = Number(height);
            }
        }

        if (!width) {
            errors.width = 'Vui lòng chọn chiều rộng banner';
        } else {
            if (isNaN(width) || width < 1) {
                errors.width = 'Chiều rộng không hợp lệ';
            } else {
                formData.width = Number(width);
            }
        }

        if (!req.file) {
            errors.image = 'Vui lòng chọn ảnh banner';
        } else {
            if (req.error) {
                errors.image = req.error;
            } else {
                formData.image = req.file.path;
            }
        }

        if (!category_link && !collection_link) {
            errors.category_link = 'Vui lòng chọn 1 trong 2 liên kết';
            errors.collection_link = 'Vui lòng chọn 1 trong 2 liên kết';
        } else {
            if (category_link && collection_link) {
                errors.category_link = 'Bạn chỉ được chọn 1 trong 2 liên kết';
                errors.collection_link = 'Bạn chỉ được chọn 1 trong 2 liên kết';
            } else {
                if (category_link) {
                    formData.link = category_link;
                } else if (collection_link) {
                    formData.link = collection_link;
                }
            }
        }

        if (!isTopbar && !isSliderHero && !isSliderBot && !isPopular && !isHot) {
            errors.place = 'Vui lòng chọn vị trí đặt banner';
        } else {
            if (isTopbar) {
                formData.isTopbar = true;
            } else if (isSliderHero) {
                formData.isSliderHero = true;
            } else if (isSliderBot) {
                formData.isSliderBot = true;
            } else if (isPopular) {
                formData.isPopular = true;
            }else if (isHot) {
                formData.isHot = true;
            }
        }

        if(Object.entries(errors).length > 0) {
            req.session.errors = errors;
            req.session.data = req.body;
            res.redirect('/banner/add');
        }else {
            try {
                const newBanner = new Banners(formData);
                await newBanner.save();

                req.session.success = 'Thêm banner thành công';
                res.redirect('/banner/add');
            } catch (error) {
                req.session.error = 'Có lỗi khi xảy ra';
                res.redirect('/banner/add');
            }
        }
    }

    // [PUT] banner/store-edit/:id
    async storeEdit(req, res) {
        const formData = {};
        const errors = {};
        let {
            height,
            width,
            img,
            category_link,
            collection_link,
            isTopbar,
            isSliderHero,
            isSliderBot,
            isPopular,
            isHot
        } = req.body;

        if (!height) {
            errors.height = 'Vui lòng chọn chiều cao banner';
        } else {
            if (isNaN(height) || height < 1) {
                errors.height = 'Chiều cao không hợp lệ';
            } else {
                formData.height = Number(height);
            }
        }

        if (!width) {
            errors.width = 'Vui lòng chọn chiều rộng banner';
        } else {
            if (isNaN(width) || width < 1) {
                errors.width = 'Chiều rộng không hợp lệ';
            } else {
                formData.width = Number(width);
            }
        }

        if (!req.file) {
            formData.image = img;
        } else {
            if (req.error) {
                errors.image = req.error;
            } else {
                formData.image = req.file.path;
            }
        }

        if (!category_link && !collection_link) {
            errors.category_link = 'Vui lòng chọn 1 trong 2 liên kết';
            errors.collection_link = 'Vui lòng chọn 1 trong 2 liên kết';
        } else {
            if (category_link && collection_link) {
                errors.category_link = 'Bạn chỉ được chọn 1 trong 2 liên kết';
                errors.collection_link = 'Bạn chỉ được chọn 1 trong 2 liên kết';
            } else {
                if (category_link) {
                    formData.link = category_link;
                } else if (collection_link) {
                    formData.link = collection_link;
                }
            }
        }

        if (!isTopbar && !isSliderHero && !isSliderBot && !isPopular && !isHot) {
            errors.place = 'Vui lòng chọn vị trí đặt banner';
        } else {
            if (isTopbar) {
                formData.isTopbar = true;
            } else if (isSliderHero) {
                formData.isSliderHero = true;
            } else if (isSliderBot) {
                formData.isSliderBot = true;
            } else if (isPopular) {
                formData.isPopular = true;
            }else if (isHot) {
                formData.isHot = true;
            }
        }

        if(Object.entries(errors).length > 0) {
            req.session.errors = errors;
            req.session.data = req.body;
            res.redirect('/banner/edit/' + req.params.id);
        }else {
            try {
                await Banners.updateOne({_id:req.params.id},formData);

                req.session.success = 'Sửa banner thành công';
                res.redirect('/banner');
            } catch (error) {
                req.session.error = 'Có lỗi khi xảy ra';
                res.redirect('/banner');
            }
        }
    }

    //[DELETE] banner/store-delete/:id
    async storeDelete(req, res) {
        try {
            await Banners.deleteOne({_id: req.params.id});
            req.session.success = 'Xoá banner thành công';
            res.redirect('/banner');
        } catch (error) {
            req.session.error =
                'Có lỗi khi thực hiện xoá banner vui lòng thêm lại hoặc liên hệ quản trị viên';
            res.redirect('/banner');
        }
    }
}

module.exports = new bannerController();
