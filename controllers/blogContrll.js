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
            title: 'B??i vi???t',
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
                    title: 'Th??m b??i vi???t',
                    errors: req.session.errors,
                    success: req.session.success,
                    data: req.session.data,
                    blogCategories
                });
                req.session.errors = null;
                req.session.success = null;
                req.session.data = null; 
            }else {
                req.session.error = 'C?? l???i khi x???y ra';
                res.redirect('/blog');
            }  

        } catch (error) {
            req.session.error = 'C?? l???i khi x???y ra';
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
                    title: 'S???a b??i vi???t',
                    errors: req.session.errors,
                    blogCategories,
                    blog
                });
                req.session.errors = null;
            }else {
                req.session.error = 'C?? l???i khi x???y ra';
                res.redirect('/blog');
            }  

        } catch (error) {
            req.session.error = 'C?? l???i khi x???y ra';
            res.redirect('/blog');
        }
    }

    // store
    // [POST] blog/store-add
    async storeAdd(req, res) {
        const errors = {};
        let {title,blog_category,description,content,author,isPopular} = req.body;

        if(!title) {
            errors.title = 'Vui l??ng nh???p ti??u ????? b??i vi???t';
        }else {
            if(title.length > 500) {
                errors.title = 'Ti??u ????? b??i vi???t kh??ng ???????c qu?? 500 k?? t???';
            }
        }

        if(!blog_category) {
            errors.blog_category = 'Vui ch???n danh m???c b??i vi???t';
        }

        if(!description) {
            errors.description = 'Vui l??ng nh???p m?? t??? b??i vi???t';
        }else {
            if(description.length > 1000) {
                errors.description = 'M?? t??? b??i vi???t kh??ng ???????c qu?? 1000 k?? t???';
            }
        }

        if(!content) {
            errors.content = 'Vui l??ng nh???p n???i dung b??i vi???t';
        }

        if(!author) {
            errors.author = 'Vui l??ng nh???p t??c gi??? b??i vi???t';
        }else {
            if(author.length > 100) {
                errors.author = 'T??c gi??? b??i vi???t kh??ng ???????c qu?? 100 k?? t???';
            }
        }

        if(!req.file) {
            errors.image = 'Vui l??ng nh???p ???nh b??i vi???t';
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
                req.session.success = 'Th??m b??i vi???t th??nh c??ng';
                res.redirect('/blog/add');  
            } catch (error) {
                req.session.error =
                'C?? l???i khi th???c hi???n th??m b??i vi???t vui l??ng th??m l???i ho???c li??n h??? qu???n tr??? vi??n';
                res.redirect('/blog/add');
            }
        }
    }

    // [POST] blog/store-edit/:id
    async storeEdit(req, res) {
        const errors = {};
        let {title,img,blog_category,description,content,author,isPopular} = req.body;

        if(!title) {
            errors.title = 'Vui l??ng nh???p ti??u ????? b??i vi???t';
        }else {
            if(title.length > 500) {
                errors.title = 'Ti??u ????? b??i vi???t kh??ng ???????c qu?? 500 k?? t???';
            }
        }

        if(!blog_category) {
            errors.blog_category = 'Vui ch???n danh m???c b??i vi???t';
        }

        if(!description) {
            errors.description = 'Vui l??ng nh???p m?? t??? b??i vi???t';
        }else {
            if(description.length > 1000) {
                errors.description = 'M?? t??? b??i vi???t kh??ng ???????c qu?? 1000 k?? t???';
            }
        }

        if(!content) {
            errors.content = 'Vui l??ng nh???p n???i dung b??i vi???t';
        }

        if(!author) {
            errors.author = 'Vui l??ng nh???p t??c gi??? b??i vi???t';
        }else {
            if(author.length > 100) {
                errors.author = 'T??c gi??? b??i vi???t kh??ng ???????c qu?? 100 k?? t???';
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
                    
                req.session.success = 'S???a b??i vi???t th??nh c??ng';
                res.redirect('/blog');  
            } catch (error) {
                req.session.error = 'C?? l???i x???y ra';
                res.redirect('/blog');
            }
        }
    }

    //[DELETE] blog/store-delete/:id
    async storeDelete(req, res) {
        try {
            await Blogs.deleteOne({_id: req.params.id});
            req.session.success = 'Xo?? b??i vi???t th??nh c??ng';
            res.redirect('/blog');
        } catch (error) {
            req.session.error =
                'C?? l???i khi th???c hi???n xo?? b??i vi???t vui l??ng xo?? l???i ho???c li??n h??? qu???n tr??? vi??n';
            res.redirect('/blog');
        }
    }
}

module.exports = new blogController();
