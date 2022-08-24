const Blogs = require('../../models/blogModel');
const BlogCategories = require('../../models/blogCategoryModel');

class blogApiController {
    // [GET] api/blog/popular/:limit
    async getPopular(req, res) {
        const limit = req.params.limit ? req.params.limit : 10;

        try {
            const popularBlogs = await Blogs.find({isPopular: true}).limit(limit);
            if (popularBlogs) {
                res.status(200).json({
                    success: true,
                    data: popularBlogs,
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

    // [GET] api/blog/detail/:slug
    async getDetail(req, res) {
        if (!req.params.slug) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy dữ liệu hoặc trang mong muốn',
            });
        }else {
            try {
                const blog = await Blogs.findOne({slug: req.params.slug});
                if (blog) {
                    res.status(200).json({
                        success: true,
                        data: blog,
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

    // [GET] api/blog/by-category/:category/:limit
    async getByCategory(req, res) {
        if (!req.params.category || !req.params.limit) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy dữ liệu hoặc trang mong muốn',
            });
        } else {
            try {
                let blogs;
                const blogCategory = await BlogCategories.findOne({slug: req.params.category});
                if (blogCategory.isParent) {
                    blogs = await Blogs.find({
                        $or: [
                            {blog_category: blogCategory._id},
                            {blog_category: {$in: blogCategory.childCategorires}},
                        ],
                    }).limit(req.params.limit);
                } else {
                    blogs = await Blogs.find({blog_category: blogCategory._id}).limit(
                        req.params.limit,
                    );
                }
                if (blogs) {
                    res.status(200).json({
                        success: true,
                        data: blogs,
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

    async getByCategoryPopular(req, res) {
        if (!req.params.category) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy dữ liệu hoặc trang mong muốn',
            });
        } else {
            try {
                let blogs;
                const blogCategory = await BlogCategories.findOne({slug: req.params.category});
                if (blogCategory.isParent) {
                    blogs = await Blogs.find({
                        $and: [
                            {
                                $or: [
                                    {blog_category: blogCategory._id},
                                    {blog_category: {$in: blogCategory.childCategorires}},
                                ],
                            },
                            {
                                isPopular: true,
                            },
                        ],
                    }).limit(3);
                } else {
                    blogs = await Blogs.find({
                        $and: [{blog_category: blogCategory._id}, {isPopular: true}],
                    }).limit(3);
                }
                if (blogs) {
                    res.status(200).json({
                        success: true,
                        data: blogs,
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

module.exports = new blogApiController();
