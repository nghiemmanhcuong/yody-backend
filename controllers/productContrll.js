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
            title: 'Danh sách sản phẩm',
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
                title: 'Thêm sản phẩm',
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
            req.session.error = 'Có lỗi xảy ra vui lòng tải lại trang hoặc liên hệ quản trị viên';
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
                title: 'Sửa sản phẩm',
                errors: req.session.errors,
                categories,
                collections,
                product,
                materials,
                colors
            });
            req.session.errors = null;
        } catch (error) {
            req.session.error = 'Có lỗi xảy ra vui lòng tải lại trang hoặc liên hệ quản trị viên';
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
            errors.name = 'Vui lòng nhập tên sản phẩm';
        } else {
            if (name.length > 255) {
                errors.name = 'Tên sản phẩm không được quá 255 ký tự';
            } else {
                formData.name = name;
            }
        }

        if (material) {
            formData.material = material;
        }

        if (!category) {
            errors.category = 'Vui lòng nhập loại sản phẩm';
        } else {
            formData.categoryId = category;
        }

        if (collection) {
            formData.collectionId = collection;
        }

        if (!real_price) {
            errors.real_price = 'Vui lòng nhập giá sản phẩm';
        } else {
            if (isNaN(real_price)) {
                errors.real_price = 'Giá sản phẩm không hợp lệ';
            } else {
                formData.price.real_price = real_price;
            }
        }

        if (sale_price) {
            if (isNaN(sale_price)) {
                errors.sale_price = 'Giá giảm sản phẩm không hợp lệ';
            } else {
                formData.price.sale_price = sale_price;
            }
        }

        if (sale_number) {
            if (isNaN(sale_number) || sale_number < 0 || sale_number > 100) {
                errors.sale_number = 'Giảm giá không hợp lệ';
            } else {
                formData.price.sale_number = sale_number;
            }
        }

        if (description) {
            formData.description = description;
        }

        if (!detail) {
            errors.detail = 'Chi tiết sản phẩm không được để trống';
        } else {
            formData.detail = detail;
        }

        if (!size_shirts && !size_trousers) {
            errors.size_shirts = 'Vui lòng chọn size sản phẩm';
            errors.size_trousers = 'Vui lòng chọn size sản phẩm';
        } else {
            if (size_shirts) {
                formData.warehouse.sizes = size_shirts;
            }

            if (size_trousers) {
                formData.warehouse.sizes = size_trousers;
            }
        }

        if (!colors) {
            errors.colors = 'Vui lòng chọn màu sản phẩm';
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
            errors.image_main = 'Vui lòng chọn ảnh chính';
            errors.images = 'Vui lòng chọn ảnh';
        }else {
            if(!req.files.image_main) {
                errors.image_main = 'Vui lòng chọn ảnh chính';
            }else {
                formData.image_main = req.files.image_main[0].path;
            }
    
            if (!req.files.images) {
                errors.images = 'Vui lòng chọn ảnh';
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
                req.session.success = 'Thêm sản phẩm thành công';
                res.redirect('/product/add');
            } catch (error) {
                req.session.error =
                    'Có lỗi xảy ra khi thêm sản phẩm thêm lại hoặc liên hệ quản trị viên';
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
            errors.name = 'Vui lòng nhập tên sản phẩm';
        } else {
            if (name.length > 255) {
                errors.name = 'Tên sản phẩm không được quá 255 ký tự';
            } else {
                formData.name = name;
            }
        }

        if (material) {
            formData.material = material;
        }

        if (!category) {
            errors.category = 'Vui lòng nhập loại sản phẩm';
        } else {
            formData.categoryId = category;
        }

        if (collection) {
            formData.collectionId = collection;
        }

        if (!real_price) {
            errors.real_price = 'Vui lòng nhập giá sản phẩm';
        } else {
            if (isNaN(real_price)) {
                errors.real_price = 'Giá sản phẩm không hợp lệ';
            } else {
                formData.price.real_price = real_price;
            }
        }

        if (sale_price) {
            if (isNaN(sale_price)) {
                errors.sale_price = 'Giá giảm sản phẩm không hợp lệ';
            } else {
                formData.price.sale_price = sale_price;
            }
        }

        if (sale_number) {
            if (isNaN(sale_number) || sale_number < 0 || sale_number > 100) {
                errors.sale_number = 'Giảm giá không hợp lệ';
            } else {
                formData.price.sale_number = sale_number;
            }
        }

        if (description) {
            formData.description = description;
        }

        if (!detail) {
            errors.detail = 'Chi tiết sản phẩm không được để trống';
        } else {
            formData.detail = detail;
        }

        if (!size_shirts && !size_trousers) {
            errors.size_shirts = 'Vui lòng chọn size sản phẩm';
            errors.size_trousers = 'Vui lòng chọn size sản phẩm';
        } else {
            if (size_shirts) {
                formData.warehouse.sizes = size_shirts;
            }

            if (size_trousers) {
                formData.warehouse.sizes = size_trousers;
            }
        }

        if (!colors) {
            errors.colors = 'Vui lòng chọn màu sản phẩm';
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

                req.session.success = 'Sửa sản phẩm thành công';
                res.redirect('/product');
            } catch (error) {
                req.session.error =
                    'Có lỗi xảy ra khi thêm sản phẩm thêm lại hoặc liên hệ quản trị viên';
                res.redirect('/product');
            }
        }
    }

    //[DELETE] product/store-delete/:id
    async storeDelete(req, res) {
        try {
            await Products.deleteOne({_id: req.params.id});
            req.session.success = 'Xoá sản phẩm thành công';
            res.redirect('/product');
        } catch (error) {
            req.session.error =
                'Có lỗi khi thực hiện xoá sản phẩm vui lòng thêm lại hoặc liên hệ quản trị viên';
            res.redirect('/product');
        }
    }
}

module.exports = new productController();
