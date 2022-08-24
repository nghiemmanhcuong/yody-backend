const BlogCategories = require('../../models/blogCategoryModel');

class blogCategoryController {
    // [GET] api/blog-category/all
    async getAll(req, res) {
        try {
            let resultBlogCategories = [];
            const blogCategories = await BlogCategories.find({isParent: true});

            if (blogCategories) {
                for (const blogCategory of blogCategories) {
                    let childCategorires = await Promise.all(
                        blogCategory.childCategorires.map((childId) => {
                            return BlogCategories.findById(childId).lean();
                        }),
                    );

                    childCategorires = childCategorires.map((childCategory) => {
                        return {
                            name: childCategory.name,
                            slug: childCategory.slug,
                        };
                    });

                    blogCategory.childCategorires = childCategorires;
                    resultBlogCategories.push(blogCategory);
                }

                resultBlogCategories = resultBlogCategories.map((category) => {
                    return {
                        name: category.name,
                        slug: category.slug,
                        childCategorires: category.childCategorires,
                    };
                });

                res.status(200).json({
                    success: true,
                    data: resultBlogCategories,
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

module.exports = new blogCategoryController();
