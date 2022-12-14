const Products = require('../models/productModel');
const Materials = require('../models/materialModel');
const Categories = require('../models/categoryModel');
const Collections = require('../models/collectionModel');
const {colors} = require('../utils/constants');
const handlePaginationHref = require('../utils/handlePaginationHref');

class productController {
    //[GET] /product
    async getView(req, res) {
        let products;
        let countProducts;
        const limit = 10;
        const currPage = req.query.page ? req.query.page : 1;
        const keyword = req.query.keyword;
        const field = req.query.field;
        const criteria = req.query.criteria;

        if (keyword) {
            if (field && criteria) {
                const result = await Products.find({$text: {$search: keyword}})
                    .skip(limit * currPage - limit)
                    .limit(limit)
                    .sort({field: criteria})
                    .lean();
                products = result;
            } else {
                const result = await Products.find({$text: {$search: keyword}})
                    .skip(limit * currPage - limit)
                    .limit(limit)
                    .lean();
                products = result;
            }
            const resultCount = await Products.countDocuments({
                $text: {$search: keyword},
            });
            countProducts = resultCount;
        } else {
            if (field && criteria) {
                const result = await Products.find()
                    .sort({[field]: Number(criteria)})
                    .skip(limit * currPage - limit)
                    .limit(limit)
                    .allowDiskUse(true)
                    .lean();
                products = result;
            } else {
                const result = await Products.find()
                    .skip(limit * currPage - limit)
                    .limit(limit)
                    .lean();
                products = result;
            }

            const resultCount = await Products.countDocuments();
            countProducts = resultCount;
        }

        res.render('layouts/product/index', {
            title: 'Danh s??ch s???n ph???m',
            products,
            keyword,
            field,
            criteria,
            pagination: {
                page: currPage,
                pageCount: Math.ceil(countProducts / limit),
            },
            href: handlePaginationHref(keyword, field, criteria),
            error: req.session.error,
            success: req.session.success,
        });
        req.session.error = null;
        req.session.success = null;
    }

    // [GET] /product/add
    async addView(req, res) {
        try {
            const categories = await Categories.find({$or : [{isParent: false},{category:'navigation'},{childCategorires:[]}]}).lean();
            const collections = await Collections.find({}).lean();
            const materials = await Materials.find({}).lean();

            res.render('layouts/product/add', {
                title: 'Th??m s???n ph???m',
                errors: req.session.errors,
                success: req.session.success,
                data: req.session.data,
                categories,
                collections,
                materials,
                colors
            });
            req.session.errors = null;
            req.session.success = null;
            req.session.data = null;
        } catch (error) {
            req.session.error = 'C?? l???i x???y ra vui l??ng t???i l???i trang ho???c li??n h??? qu???n tr??? vi??n';
            res.redirect('/product');
        }
    }

    // [GET] /product/add
    async editView(req, res) {
        try {
            const categories = await Categories.find({isParent: false}).lean();
            const collections = await Collections.find({}).lean();
            const materials = await Materials.find({}).lean();
            const product = await Products.findById(req.params.id).lean();

            res.render('layouts/product/edit', {
                title: 'S???a s???n ph???m',
                errors: req.session.errors,
                categories,
                collections,
                product,
                materials,
                colors
            });
            req.session.errors = null;
        } catch (error) {
            req.session.error = 'C?? l???i x???y ra vui l??ng t???i l???i trang ho???c li??n h??? qu???n tr??? vi??n';
            res.redirect('/product');
        }
    }

    // store
    // [POST] product/store-add
    async storeAdd(req, res) {
        const errors = {};
        const formData = {};
        formData.price = {};
        formData.warehouse = {};
        formData.seo = {};
        let {
            name,
            material,
            category,
            collection,
            real_price,
            sale_price,
            sale_number,
            size_shirts,
            size_trousers,
            colors,
            seo_title,
            seo_keywords,
            seo_description,
            description,
            detail,
            isPopular,
        } = req.body;

        if (!name) {
            errors.name = 'Vui l??ng nh???p t??n s???n ph???m';
        } else {
            if (name.length > 255) {
                errors.name = 'T??n s???n ph???m kh??ng ???????c qu?? 255 k?? t???';
            } else {
                formData.name = name;
            }
        }

        if (material) {
            formData.material = material;
        }

        if (!category) {
            errors.category = 'Vui l??ng nh???p lo???i s???n ph???m';
        } else {
            formData.categoryId = category;
        }

        if (collection) {
            formData.collectionId = collection;
        }

        if (!real_price) {
            errors.real_price = 'Vui l??ng nh???p gi?? s???n ph???m';
        } else {
            if (isNaN(real_price)) {
                errors.real_price = 'Gi?? s???n ph???m kh??ng h???p l???';
            } else {
                formData.price.real_price = real_price;
            }
        }

        if (sale_price) {
            if (isNaN(sale_price)) {
                errors.sale_price = 'Gi?? gi???m s???n ph???m kh??ng h???p l???';
            } else {
                formData.price.sale_price = sale_price;
            }
        }

        if (sale_number) {
            if (isNaN(sale_number) || sale_number < 0 || sale_number > 100) {
                errors.sale_number = 'Gi???m gi?? kh??ng h???p l???';
            } else {
                formData.price.sale_number = sale_number;
            }
        }

        if (description) {
            formData.description = description;
        }

        if (!detail) {
            errors.detail = 'Chi ti???t s???n ph???m kh??ng ???????c ????? tr???ng';
        } else {
            formData.detail = detail;
        }

        if (!size_shirts && !size_trousers) {
            errors.size_shirts = 'Vui l??ng ch???n size s???n ph???m';
            errors.size_trousers = 'Vui l??ng ch???n size s???n ph???m';
        } else {
            if (size_shirts) {
                formData.warehouse.sizes = size_shirts;
            }

            if (size_trousers) {
                formData.warehouse.sizes = size_trousers;
            }
        }

        if (!colors) {
            errors.colors = 'Vui l??ng ch???n m??u s???n ph???m';
        } else {
            formData.warehouse.colors = colors;
        }

        if (!seo_title) {
            if (name) {
                seo_title = name;
                formData.seo.title = name;
            }
        } else {
            formData.seo.title = seo_title;
        }

        if (!seo_keywords) {
            if (seo_title) {
                formData.seo.metaKeyword = seo_title;
            }
        } else {
            formData.seo.metaKeyword = seo_keywords;
        }

        if (!seo_description) {
            if (seo_title) {
                formData.seo.metaDescription = seo_title;
            }
        } else {
            formData.seo.metaDescription = seo_description;
        }

        if(isPopular){
            formData.isPopular = true;
        }

        if(!req.files) {
            errors.image_main = 'Vui l??ng ch???n ???nh ch??nh';
            errors.images = 'Vui l??ng ch???n ???nh';
        }else {
            if(!req.files.image_main) {
                errors.image_main = 'Vui l??ng ch???n ???nh ch??nh';
            }else {
                formData.image_main = req.files.image_main[0].path;
            }
    
            if (!req.files.images) {
                errors.images = 'Vui l??ng ch???n ???nh';
            } else {
                if (req.error) {
                    errors.images = req.error;
                } else {
                    const images = [];
                    req.files.images.forEach((file, index) => {
                        images.push(file.path);
                    });
                    formData.images = images;
                }
            }
        }
        
        if (Object.entries(errors).length > 0) {
            req.session.errors = errors;
            req.session.data = req.body;
            res.redirect('/product/add');
        } else {
            try {
                const newProduct = new Products(formData);
                await newProduct.save();
                req.session.success = 'Th??m s???n ph???m th??nh c??ng';
                res.redirect('/product/add');
            } catch (error) {
                req.session.error =
                    'C?? l???i x???y ra khi th??m s???n ph???m th??m l???i ho???c li??n h??? qu???n tr??? vi??n';
                res.redirect('/product');
            }
        }
    }

    // [POST] product/store-edit/:id
    async storeEdit(req, res) {
        const errors = {};
        const formData = {};
        formData.price = {};
        formData.warehouse = {};
        formData.seo = {};
        let {
            name,
            material,
            category,
            collection,
            real_price,
            sale_price,
            sale_number,
            size_shirts,
            size_trousers,
            colors,
            seo_title,
            seo_keywords,
            seo_description,
            description,
            detail,
            image,
            isPopular
        } = req.body;

        if (!name) {
            errors.name = 'Vui l??ng nh???p t??n s???n ph???m';
        } else {
            if (name.length > 255) {
                errors.name = 'T??n s???n ph???m kh??ng ???????c qu?? 255 k?? t???';
            } else {
                formData.name = name;
            }
        }

        if (material) {
            formData.material = material;
        }

        if (!category) {
            errors.category = 'Vui l??ng nh???p lo???i s???n ph???m';
        } else {
            formData.categoryId = category;
        }

        if (collection) {
            formData.collectionId = collection;
        }

        if (!real_price) {
            errors.real_price = 'Vui l??ng nh???p gi?? s???n ph???m';
        } else {
            if (isNaN(real_price)) {
                errors.real_price = 'Gi?? s???n ph???m kh??ng h???p l???';
            } else {
                formData.price.real_price = real_price;
            }
        }

        if (sale_price) {
            if (isNaN(sale_price)) {
                errors.sale_price = 'Gi?? gi???m s???n ph???m kh??ng h???p l???';
            } else {
                formData.price.sale_price = sale_price;
            }
        }

        if (sale_number) {
            if (isNaN(sale_number) || sale_number < 0 || sale_number > 100) {
                errors.sale_number = 'Gi???m gi?? kh??ng h???p l???';
            } else {
                formData.price.sale_number = sale_number;
            }
        }

        if (description) {
            formData.description = description;
        }

        if (!detail) {
            errors.detail = 'Chi ti???t s???n ph???m kh??ng ???????c ????? tr???ng';
        } else {
            formData.detail = detail;
        }

        if (!size_shirts && !size_trousers) {
            errors.size_shirts = 'Vui l??ng ch???n size s???n ph???m';
            errors.size_trousers = 'Vui l??ng ch???n size s???n ph???m';
        } else {
            if (size_shirts) {
                formData.warehouse.sizes = size_shirts;
            }

            if (size_trousers) {
                formData.warehouse.sizes = size_trousers;
            }
        }

        if (!colors) {
            errors.colors = 'Vui l??ng ch???n m??u s???n ph???m';
        } else {
            formData.warehouse.colors = colors;
        }

        if (!seo_title) {
            if (name) {
                seo_title = name;
                formData.seo.title = name;
            }
        } else {
            formData.seo.title = seo_title;
        }

        if (!seo_keywords) {
            if (seo_title) {
                formData.seo.metaKeyword = seo_title;
            }
        } else {
            formData.seo.metaKeyword = seo_keywords;
        }

        if (!seo_description) {
            if (seo_title) {
                formData.seo.metaDescription = seo_title;
            }
        } else {
            formData.seo.metaDescription = seo_description;
        }

        if(!req.file) {
            formData.image_main = image;
        }else {
            if(req.error) {
                errors.image_main = req.error;
            }else {
                formData.image_main = req.file.path;
            }
        }

        if(isPopular){
            formData.isPopular = true;
        }
        
        if (Object.entries(errors).length > 0) {
            req.session.errors = errors;
            req.session.data = req.body;
            res.redirect('/product/add');
        } else {
            try {
                await Products.updateOne({_id: req.params.id}, formData);

                req.session.success = 'S???a s???n ph???m th??nh c??ng';
                res.redirect('/product');
            } catch (error) {
                req.session.error =
                    'C?? l???i x???y ra khi th??m s???n ph???m th??m l???i ho???c li??n h??? qu???n tr??? vi??n';
                res.redirect('/product');
            }
        }
    }

    //[DELETE] product/store-delete/:id
    async storeDelete(req, res) {
        try {
            await Products.deleteOne({_id: req.params.id});
            req.session.success = 'Xo?? s???n ph???m th??nh c??ng';
            res.redirect('/product');
        } catch (error) {
            req.session.error =
                'C?? l???i khi th???c hi???n xo?? s???n ph???m vui l??ng th??m l???i ho???c li??n h??? qu???n tr??? vi??n';
            res.redirect('/product');
        }
    }
}

module.exports = new productController();
