const Contacts = require('../models/contactModel');

class ContactController {
    // [GET] /contact
    async getView() {
        const limit = 10;
        const currPage = req.query.page ? req.query.page : 1;
        try {
            const contacts = await Contacts.find()
                .skip(limit * currPage - limit)
                .limit(limit)
                .lean();

            const countContact = await Contacts.countDocuments();

            res.render('layouts/contact/index', {
                contacts,
                pagination: {
                    page: currPage,
                    pageCount: Math.ceil(countContact / limit),
                },
                success: req.session.success,
            });
            req.session.success = null;
        } catch (error) {
            console.log('Có lỗi xảy ra', error);
        }
    }

    // [GET] contact/detail
    async getDetail(req, res) {
        const {id} = req.params;
        if (id) {
            try {
                const contact = await Contacts.findById(id).lean();
                if (contact) {
                    res.render('layouts/contact/detail', {
                        contact: contact,
                        title: 'Chi tiết đơn hàng',
                    });
                } else {
                    res.render('page/404');
                }
            } catch (error) {
                console.log('Có lỗi xảy ra', error);
            }
        } else {
            res.render('page/404');
        }
    }
}

module.exports = new ContactController();
