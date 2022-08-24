const Products = require('../../models/productModel');
const Categories = require('../../models/categoryModel');
const Collections = require('../../models/collectionModel');
const Materials = require('../../models/materialModel');

const {colors, sizes, prices} = require('../../utils/constants');

class productApiController {
    //[GET] api/product/popular
    async getPopular(req, res) {
        const limit  = req.query.limit ? req.query.limit : 12
        try {
            const popularProduct = await Products.find({isPopular: true}).limit(limit);
            if (popularProduct) {
                res.status(200).json({
                    success: true,
                    data: popularProduct,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Không tìm thấy dữ liệu',
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi server ' + error,
            });
        }
    }

    //[GET] api/product/relate/:category
    async getRelate(req, res) {
        if(!req.params.category) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy dữ liệu hoặc trang mong muốn',
            });
        }else {
            try {
                const products = await Products.find({categoryId: req.params.category});
                if (products) {
                    res.status(200).json({
                        success: true,
                        data: products,
                    });
                } else {
                    res.status(500).json({
                        success: false,
                        message: 'Không tìm thấy dữ liệu',
                    });
                }
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Lỗi server ' + error,
                });
            }
        }
    }

    //[GET] api/product/get-by-material/:materialId/:limit
    async getByMaterial(req, res) {
        const {materialId, limit} = req.params;
        if (!materialId || !limit) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy trang hoặc dữ liệu mong muốn',
            });
        } else {
            try {
                const material = await Materials.findById(materialId);
                if (material) {
                    const productByMaterial = await Products.find({material: materialId}).limit(
                        limit,
                    );
                    if (productByMaterial) {
                        res.status(200).json({
                            success: true,
                            data: productByMaterial,
                        });
                    } else {
                        res.status(500).json({
                            success: false,
                            message: 'Lỗi server không tìm thấy dữ liệu',
                        });
                    }
                } else {
                    res.status(404).json({
                        success: false,
                        message: 'Không tìm thấy trang hoặc dữ liệu mong muốn',
                    });
                }
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Lỗi server ' + error,
                });
            }
        }
    }

    //[GET] api/product/by-category/:category/:limit/:page
    async getByCategory(req, res) {
        if (!req.params.category) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy trang hoặc dữ liệu mong muốn',
            });
        } else {
            let products;
            let countProducts;
            let categoryList = [];
            let filterColors = req.body.filterColors && req.body.filterColors .length > 0 ? req.body.filterColors : colors;
            let filterSizes = req.body.filterSizes && req.body.filterSizes .length > 0 ? req.body.filterSizes : sizes;
            let filterPrices = req.body.filterPrices && req.body.filterPrices .length > 0 ? req.body.filterPrices : prices;
            let minPrice = filterPrices[0].minValue;
            let maxPrice = filterPrices[0].maxValue;

            const limit = req.params.limit ? req.params.limit : 40;
            const page = req.params.page ? req.params.page : 1;
            const field = req.body.field;
            const criteria = req.body.criteria;

            for (let i = 0; i < filterPrices.length; i++) {
                if (filterPrices[i].minValue < minPrice) {
                    minPrice = filterPrices[i].minValue;
                }

                if (filterPrices[i].maxValue > maxPrice) {
                    maxPrice = filterPrices[i].maxValue;
                }
            }

            try {
                const category = await Categories.findOne({slug: req.params.category});
                if (category.isParent) {
                    categoryList = category.childCategorires;
                    categoryList.push(category._id);
                } else {
                    categoryList.push(category._id);
                }

                if (category) {
                    if (req.body.filterMaterials && req.body.filterMaterials.length > 0) {
                        if (field && criteria) {
                            products = await Products.find({
                                $and: [
                                    {material: {$in: req.body.filterMaterials}},
                                    {'warehouse.sizes': {$in: filterSizes}},
                                    {'warehouse.colors': {$in: filterColors}},
                                    {'price.real_price': {$gte: minPrice}},
                                    {'price.real_price': {$lte: maxPrice}},
                                    {categoryId: {$in: categoryList}},
                                ],
                            })
                                .skip(limit * page - limit)
                                .limit(limit)
                                .sort({[field]: Number(criteria)})
                                .lean();
                        } else {
                            products = await Products.find({
                                $and: [
                                    {material: {$in: req.body.filterMaterials}},
                                    {'warehouse.sizes': {$in: filterSizes}},
                                    {'warehouse.colors': {$in: filterColors}},
                                    {'price.real_price': {$gte: minPrice}},
                                    {'price.real_price': {$lte: maxPrice}},
                                    {categoryId: {$in: categoryList}},
                                ],
                            })
                                .skip(limit * page - limit)
                                .limit(limit)
                                .lean();
                        }
                        countProducts = await Products.countDocuments({
                            $and: [
                                {material: {$in: req.body.filterMaterials}},
                                {'warehouse.sizes': {$in: filterSizes}},
                                {'warehouse.colors': {$in: filterColors}},
                                {'price.real_price': {$gte: minPrice}},
                                {'price.real_price': {$lte: maxPrice}},
                                {categoryId: {$in: categoryList}},
                            ],
                        });
                    } else {
                        if (field && criteria) {
                            products = await Products.find({
                                $and: [
                                    {'warehouse.sizes': {$in: filterSizes}},
                                    {'warehouse.colors': {$in: filterColors}},
                                    {'price.real_price': {$gte: minPrice}},
                                    {'price.real_price': {$lte: maxPrice}},
                                    {categoryId: {$in: categoryList}},
                                ],
                            })
                                .skip(limit * page - limit)
                                .limit(limit)
                                .sort({[field]: Number(criteria)})
                                .lean();
                        } else {
                            products = await Products.find({
                                $and: [
                                    {'warehouse.sizes': {$in: filterSizes}},
                                    {'warehouse.colors': {$in: filterColors}},
                                    {'price.real_price': {$gte: minPrice}},
                                    {'price.real_price': {$lte: maxPrice}},
                                    {categoryId: {$in: categoryList}},
                                ],
                            })
                                .skip(limit * page - limit)
                                .limit(limit)
                                .lean();
                        }

                        countProducts = await Products.countDocuments({
                            $and: [
                                {'warehouse.sizes': {$in: filterSizes}},
                                {'warehouse.colors': {$in: filterColors}},
                                {'price.real_price': {$gte: minPrice}},
                                {'price.real_price': {$lte: maxPrice}},
                                {categoryId: {$in: categoryList}},
                            ],
                        });
                    }

                    res.status(200).json({
                        success: true,
                        data: products,
                        pageCount: Math.ceil(countProducts / limit),
                        totalProducts:countProducts
                    });
                } else {
                    res.status(404).json({
                        success: false,
                        message: 'Không tìm thấy trang hoặc dữ liệu mong muốn',
                    });
                }
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Lỗi server ' + error,
                });
            }
        }
    }

    //[GET] api/product/by-collection/:collection
    //[GET] api/product/by-collection/:collection/:limit/:page
    async getByCollection(req, res) {
        if (!req.params.collection) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy trang hoặc dữ liệu mong muốn',
            });
        } else {
            let products;
            let countProducts;
            let filterColors = req.body.filterColors && req.body.filterColors .length > 0 ? req.body.filterColors : colors;
            let filterSizes = req.body.filterSizes && req.body.filterSizes .length > 0 ? req.body.filterSizes : sizes;
            let filterPrices = req.body.filterPrices && req.body.filterPrices .length > 0 ? req.body.filterPrices : prices;
            let minPrice = filterPrices[0].minValue;
            let maxPrice = filterPrices[0].maxValue;

            const limit = req.params.limit ? req.params.limit : 40;
            const page = req.params.page ? req.params.page : 1;
            const field = req.body.field;
            const criteria = req.body.criteria;

            for (let i = 0; i < filterPrices.length; i++) {
                if (filterPrices[i].minValue < minPrice) {
                    minPrice = filterPrices[i].minValue;
                }

                if (filterPrices[i].maxValue > maxPrice) {
                    maxPrice = filterPrices[i].maxValue;
                }
            }

            try {
                const collection = await Collections.findOne({slug: req.params.collection});

                if (collection) {
                    if (req.body.filterMaterials && req.body.filterMaterials.length > 0) {
                        if (!field && !criteria) {
                            products = await Products.find({
                                $and: [
                                    {material: {$in: req.body.filterMaterials}},
                                    {'warehouse.sizes': {$in: filterSizes}},
                                    {'warehouse.colors': {$in: filterColors}},
                                    {'price.real_price': {$gte: minPrice}},
                                    {'price.real_price': {$lte: maxPrice}},
                                    {collectionId: collection._id},
                                ],
                            })
                                .skip(limit * page - limit)
                                .limit(limit)
                                .sort({[field]: Number(criteria)})
                                .lean();
                        } else {
                            products = await Products.find({
                                $and: [
                                    {material: {$in: req.body.filterMaterials}},
                                    {'warehouse.sizes': {$in: filterSizes}},
                                    {'warehouse.colors': {$in: filterColors}},
                                    {'price.real_price': {$gte: minPrice}},
                                    {'price.real_price': {$lte: maxPrice}},
                                    {collectionId: collection._id},
                                ],
                            })
                                .skip(limit * page - limit)
                                .limit(limit)
                                .lean();
                        }
                        countProducts = await Products.countDocuments({
                            $and: [
                                {material: {$in: req.body.filterMaterials}},
                                {'warehouse.sizes': {$in: filterSizes}},
                                {'warehouse.colors': {$in: filterColors}},
                                {'price.real_price': {$gte: minPrice}},
                                {'price.real_price': {$lte: maxPrice}},
                                {collectionId: collection._id},
                            ],
                        });
                    } else {
                        if (!field && !criteria) {
                            products = await Products.find({
                                $and: [
                                    {'warehouse.sizes': {$in: filterSizes}},
                                    {'warehouse.colors': {$in: filterColors}},
                                    {'price.real_price': {$gte: minPrice}},
                                    {'price.real_price': {$lte: maxPrice}},
                                    {collectionId: collection._id},
                                ],
                            })
                                .skip(limit * page - limit)
                                .limit(limit)
                                .sort({[field]: Number(criteria)})
                                .lean();
                        } else {
                            products = await Products.find({
                                $and: [
                                    {'warehouse.sizes': {$in: filterSizes}},
                                    {'warehouse.colors': {$in: filterColors}},
                                    {'price.real_price': {$gte: minPrice}},
                                    {'price.real_price': {$lte: maxPrice}},
                                    {collectionId: collection._id},
                                ],
                            })
                                .skip(limit * page - limit)
                                .limit(limit)
                                .lean();
                        }

                        countProducts = await Products.countDocuments({
                            $and: [
                                {'warehouse.sizes': {$in: filterSizes}},
                                {'warehouse.colors': {$in: filterColors}},
                                {'price.real_price': {$gte: minPrice}},
                                {'price.real_price': {$lte: maxPrice}},
                                {collectionId: collection._id},
                            ],
                        });
                    }

                    res.status(200).json({
                        success: true,
                        data: products,
                        pageCount: Math.ceil(countProducts / limit),
                        totalProducts:countProducts
                    });
                } else {
                    res.status(404).json({
                        success: false,
                        message: 'Không tìm thấy trang hoặc dữ liệu mong muốn',
                    });
                }
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Lỗi server ' + error,
                });
            }
        }
    }

    //[GET] api/product/by-subject/:category
    async getBySubject(req, res) {
        if (!req.params.category) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy trang hoặc dữ liệu mong muốn',
            });
        } else {
            try {
                const category = await Categories.findOne({slug: req.params.category});
                if (category) {
                    const products = await Products.find({
                        $or: [
                            {categoryId: category._id},
                            {categoryId: {$in: category.childCategorires}},
                        ],
                    })
                        .limit(40)
                        .lean();
                    if (products) {
                        res.status(200).json({
                            success: true,
                            data: products,
                        });
                    } else {
                        res.status(500).json({
                            success: false,
                            message: 'Lỗi server không tìm thấy dữ liệu',
                        });
                    }
                } else {
                    res.status(404).json({
                        success: false,
                        message: 'Không tìm thấy trang hoặc dữ liệu mong muốn',
                    });
                }
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Lỗi server ' + error,
                });
            }
        }
    }

    //[GET] api/product/detail/:slug
    async getDetail(req, res) {
        if (req.params.slug) {
            try {
                const product = await Products.findOne({slug: req.params.slug});
                if (product) {
                    const productCategory = await Categories.findById(product.categoryId);
                    res.status(200).json({
                        success: true,
                        data: product,
                        productCategory: {
                            name: productCategory.name,
                            slug: productCategory.slug,
                        },
                    });
                } else {
                    res.status(500).json({
                        success: false,
                        message: 'Lỗi server không tìm thấy dữ liệu',
                    });
                }
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Lỗi server ' + error,
                });
            }
        } else {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy trang hoặc dữ liệu mong muốn',
            });
        }
    }

    //[GET] api/product/by-keyword/:keyword
    //[GET] api/product/by-keyword/:keyword/:multiply
    async getByKeyword(req, res) {
        const multiply = req.params.multiply ? req.params.multiply : 1;
        const limit = 40 * multiply;

        if (req.params.keyword) {
            const keyword = req.params.keyword;

            try {
                const products = await Products.find(
                    {$text: {$search: keyword}},
                    {score: {$meta: 'textScore'}},
                )
                    .limit(limit)
                    .sort({score: {$meta: 'textScore'}});
                if (products) {
                    res.status(200).json({
                        success: true,
                        data: products,
                    });
                } else {
                    res.status(500).json({
                        success: false,
                        message: 'Lỗi server không tìm thấy dữ liệu',
                    });
                }
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Lỗi server ' + error,
                });
            }
        } else {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy trang hoặc dữ liệu mong muốn',
            });
        }
    }
}

module.exports = new productApiController();
