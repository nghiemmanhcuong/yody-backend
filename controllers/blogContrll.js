const Blogs = require('../models/blogModel');
const BlogCategories = require('../models/blogCategoryModel');
const handlePaginationHref = require('../utils/handlePaginationHref');

class blogController {
    // [GET] blog/
    async getView(req, res) {
        let blogs;
        let countBlogs;
        const limit = 10;
        const currPage = req.query.page ? req.query.page : 1;
        const keyword = req.query.keyword;
        const field = req.query.field;
        const criteria = req.query.criteria;

        if (keyword) {
            if (field && criteria) {
                const result = await Blogs.find({
                    $text: {$search: keyword},
                })
                    .skip(limit * currPage - limit)
                    .limit(limit)
                    .sort({field: criteria})
                    .lean();
                blogs = result;
            } else {
                const result = await Blogs.find({
                    $text: {$search: keyword},
                })
                    .skip(limit * currPage - limit)
                    .limit(limit)
                    .lean();
                blogs = result;
            }
            const resultCount = await Blogs.countDocuments({
                $text: {$search: keyword},
            });
            countBlogs = resultCount;
        } else {
            if (field && criteria) {
                const result = await Blogs.find({isParent: true})
                    .sort({[field]: Number(criteria)})
                    .skip(limit * currPage - limit)
                    .limit(limit)
                    .allowDiskUse(true)
                    .lean();
                blogs = result;
            } else {
                const result = await Blogs.find({isParent: true})
                    .skip(limit * currPage - limit)
                    .limit(limit)
                    .lean();
                blogs = result;
            }

            const resultCount = await Blogs.countDocuments({isParent: true});
            countBlogs = resultCount;
        }

        res.render('layouts/blog/index', {
            title: 'Bài viết',
            blogs,
            keyword,
            field,
            criteria,
            pagination: {
                page: currPage,
                pageCount: Math.ceil(countBlogs / limit),
            },
            href: handlePaginationHref(keyword, field, criteria),
            error: req.session.error,
            success: req.session.success,
        });
        req.session.error = null;
        req.session.success = null;
    }

    // [GET] blog/add
    async addView(req, res) {
        try {
            const blogCategories = await BlogCategories.find({}).lean();
            if(blogCategories) {
                res.render('layouts/blog/add', {
                    title: 'Thêm bài viết',
                    errors: req.session.errors,
                    success: req.session.success,
                    data: req.session.data,
                    blogCategories
                });
                req.session.errors = null;
                req.session.success = null;
                req.session.data = null; 
            }else {
                req.session.error = 'Có lỗi khi xảy ra';
                res.redirect('/blog');
            }  

        } catch (error) {
            req.session.error = 'Có lỗi khi xảy ra';
            res.redirect('/blog');
        }
    }

    // [GET] blog/edit/:id
    async editView(req, res) {
        try {
            const blogCategories = await BlogCategories.find({}).lean();
            const blog = await Blogs.findById(req.params.id).lean();

            if(blogCategories) {
                res.render('layouts/blog/edit', {
                    title: 'Sửa bài viết',
                    errors: req.session.errors,
                    blogCategories,
                    blog
                });
                req.session.errors = null;
            }else {
                req.session.error = 'Có lỗi khi xảy ra';
                res.redirect('/blog');
            }  

        } catch (error) {
            req.session.error = 'Có lỗi khi xảy ra';
            res.redirect('/blog');
        }
    }

    // store
    // [POST] blog/store-add
    async storeAdd(req, res) {
        const errors = {};
        let {title,blog_category,description,content,author,isPopular} = req.body;

        if(!title) {
            errors.title = 'Vui lòng nhập tiêu đề bài viết';
        }else {
            if(title.length > 500) {
                errors.title = 'Tiêu đề bài viết không được quá 500 ký tự';
            }
        }

        if(!blog_category) {
            errors.blog_category = 'Vui chọn danh mục bài viết';
        }

        if(!description) {
            errors.description = 'Vui lòng nhập mô tả bài viết';
        }else {
            if(description.length > 1000) {
                errors.description = 'Mô tả bài viết không được quá 1000 ký tự';
            }
        }

        if(!content) {
            errors.content = 'Vui lòng nhập nội dung bài viết';
        }

        if(!author) {
            errors.author = 'Vui lòng nhập tác giả bài viết';
        }else {
            if(author.length > 100) {
                errors.author = 'Tác giả bài viết không được quá 100 ký tự';
            }
        }

        if(!req.file) {
            errors.image = 'Vui lòng nhập ảnh bài viết';
        }else {
            if(req.error) {
                errors.image = req.error;
            }
        }

        if(Object.entries(errors).length > 0) {
            req.session.errors = errors;
            req.session.data = req.body;
            res.redirect('/blog/add');
        }else {
            try {
                const formData = req.body;
                formData.image = req.file.path;
                if(isPopular){
                    formData.isPopular = true;
                }

                const newBlog = new Blogs(formData);
                await newBlog.save();
                req.session.success = 'Thêm bài viết thành công';
                res.redirect('/blog/add');  
            } catch (error) {
                req.session.error =
                'Có lỗi khi thực hiện thêm bài viết vui lòng thêm lại hoặc liên hệ quản trị viên';
                res.redirect('/blog/add');
            }
        }
    }

    // [POST] blog/store-edit/:id
    async storeEdit(req, res) {
        const errors = {};
        let {title,img,blog_category,description,content,author,isPopular} = req.body;

        if(!title) {
            errors.title = 'Vui lòng nhập tiêu đề bài viết';
        }else {
            if(title.length > 500) {
                errors.title = 'Tiêu đề bài viết không được quá 500 ký tự';
            }
        }

        if(!blog_category) {
            errors.blog_category = 'Vui chọn danh mục bài viết';
        }

        if(!description) {
            errors.description = 'Vui lòng nhập mô tả bài viết';
        }else {
            if(description.length > 1000) {
                errors.description = 'Mô tả bài viết không được quá 1000 ký tự';
            }
        }

        if(!content) {
            errors.content = 'Vui lòng nhập nội dung bài viết';
        }

        if(!author) {
            errors.author = 'Vui lòng nhập tác giả bài viết';
        }else {
            if(author.length > 100) {
                errors.author = 'Tác giả bài viết không được quá 100 ký tự';
            }
        }

        if(Object.entries(errors).length > 0) {
            req.session.errors = errors;
            req.session.data = req.body;
            res.redirect('/blog/edit/' + req.params.id);
        }else {
            try {
                const formData = req.body;
                if(!req.file) {
                    formData.image = img;
                }else {
                    if(req.error) {
                        errors.image = req.error;
                    }else {
                        formData.image = req.file.path;
                    }
                }

                if(isPopular){
                    formData.isPopular = true;
                }

                await Blogs.updateOne({_id:req.params.id}, formData);    
                    
                req.session.success = 'Sửa bài viết thành công';
                res.redirect('/blog');  
            } catch (error) {
                req.session.error = 'Có lỗi xảy ra';
                res.redirect('/blog');
            }
        }
    }

    //[DELETE] blog/store-delete/:id
    async storeDelete(req, res) {
        try {
            await Blogs.deleteOne({_id: req.params.id});
            req.session.success = 'Xoá bài viết thành công';
            res.redirect('/blog');
        } catch (error) {
            req.session.error =
                'Có lỗi khi thực hiện xoá bài viết vui lòng xoá lại hoặc liên hệ quản trị viên';
            res.redirect('/blog');
        }
    }
}

module.exports = new blogController();
