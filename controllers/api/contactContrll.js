const Contacts = require('../../models/contactModel');

class ContactApiController {
    // [POST] api/contact/add
    async addContact(req, res) {
        const {name, email, content} = req.body;
        if (!name || !email || !content) {
            res.status(403).json({
                success: false,
                message: 'Vui lòng nhập đủ thông tin liên hệ',
            });
        } else {
            if (name.length > 255) {
                res.status(403).json({
                    success: false,
                    message: 'Họ và tên không được quá 255 ký tự',
                });
            } else {
                try {
                    const newContact = new Contacts(req.body);
                    newContact.save();
                    res.status(200).json({
                        success: true,
                        message: 'Gửi liên hệ thành công',
                    });
                } catch (error) {
                    res.status(500).json({
                        success: false,
                        message: 'Lỗi server ' + error,
                    });
                }
            }
        }
    }
}

module.exports = new ContactApiController();
