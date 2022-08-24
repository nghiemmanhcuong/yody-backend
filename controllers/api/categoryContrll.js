const {Promise} = require('mongoose');
const Categories = require('../../models/categoryModel');

class categoryApiController {
    // [GET] api/category/by-subject/:subject
    async getBySubject(req, res) {
        const subject = req.params.subject;

        if (!subject) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy dữ liệu mong muốn',
            });
        } else {
            try {
                let resultCategories = [];
                const categories = await Categories.find({$and:[{category: subject},{isParent:true}]});

                if (categories) {
                    for (const category of categories) {
                        let childCategorires = await Promise.all(
                            category.childCategorires.map((childId) => {
                                return Categories.findById(childId).lean();
                            }),
                        );

                        childCategorires = childCategorires.map((childCategory) => {
                            return {
                                name: childCategory.name,
                                slug: childCategory.slug,
                                attributes: childCategory.attributes,
                            };
                        });

                        category.childCategorires = childCategorires;
                        resultCategories.push(category);
                    }

                    resultCategories = resultCategories.map((category) => {
                        return {
                            name: category.name,
                            slug: category.slug,
                            childCategorires: category.childCategorires,
                            isParent: category.isParent,
                        };
                    });

                    res.status(200).json({
                        success: true,
                        data: resultCategories,
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

    // [GET] api/category/in-navigation
    async getInNavigation(req, res) {
        try {
            const categoriesInNavigation = await Categories.find({category: 'navigation'});
            if (categoriesInNavigation) {
                res.status(200).json({
                    success: true,
                    data: categoriesInNavigation,
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

    // [GET] api/category/popular/:subject
    async getPopular(req, res) {
        const subject = req.params.subject;

        if (!subject) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy dữ liệu mong muốn',
            });
        } else {
            try {
                const categories = await Categories.find({
                    $and: [{category: subject}, {isPopular: true}],
                }).limit(10);

                if (categories) {
                    res.status(200).json({
                        success: true,
                        data: categories,
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

    // [GET] api/category/parent-popular/:subject
    async getParentPopular(req, res) {
        const subject = req.params.subject;

        if (!subject) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy dữ liệu mong muốn',
            });
        } else {
            try {
                const categories = await Categories.find({
                    $and: [{category: subject},{isParent: true}],
                }).limit(7);

                if (categories) {
                    res.status(200).json({
                        success: true,
                        data: categories,
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

    // [GET] api/category/by-slug/:slug
    async getBySlug(req, res) {
        const slug = req.params.slug;

        if (!slug) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy dữ liệu mong muốn',
            });
        } else {
            try {
                const category = await Categories.findOne({slug: slug});
                const childrens =  await Categories.find({_id:{$in: category.childCategorires}}).limit(3);

                if (category) {
                    res.status(200).json({
                        success: true,
                        data: category,
                        childrens: childrens,
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
}

module.exports = new categoryApiController();
