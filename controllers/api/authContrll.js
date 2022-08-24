const Users = require('../../models/userModel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
    // [POST] api/auth/register
    async register(req, res) {
        const {name, surname, email, phone, password} = req.body;
        if (!name || !surname || !email || !phone || !password) {
            res.status(403).json({
                success: false,
                message: 'nhập không đủ thông tin',
            });
        } else {
            try {
                const userCheck = await Users.findOne({email: email});
                if (userCheck) {
                    res.status(403).json({
                        success: false,
                        message: 'Email đã được sử dụng vui lòng chọn email khác',
                    });
                } else {
                    const userData = req.body;
                    const salt = await bcrypt.genSalt(10);
                    const hashPassword = await bcrypt.hash(password, salt);
                    userData.password = hashPassword;
                    const newUser = new Users(userData);

                    const user = await newUser.save();

                    const token = jwt.sign(
                        {
                            id: user._id,
                        },
                        process.env.JWT_KEY,
                    );

                    res.status(200).json({
                        success: true,
                        message: 'Đăng ký tài khoản thành công',
                        user: {
                            _id: newUser._id,
                            name: newUser.name,
                            surname: newUser.surname,
                            email: newUser.email,
                            addresses: newUser.addresses,
                            favorite_products: newUser.favorite_products,
                            token,
                        },
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

    // [POST] api/auth/login
    async login(req, res) {
        const {email, password} = req.body;
        if (!email || !password) {
            res.status(403).json({
                success: false,
                message: 'Chưa nhập email hoặc mật khẩu',
            });
        } else {
            try {
                const user = await Users.findOne({email: email});
                if (user) {
                    const validity = await bcrypt.compare(password, user.password);
                    if (validity) {
                        const token = jwt.sign(
                            {
                                id: user._id,
                            },
                            process.env.JWT_KEY,
                        );

                        const {password, ...userInfo} = user._doc;

                        res.status(200).json({
                            success: true,
                            message: 'Đăng nhập thành công',
                            user: userInfo,
                            token,
                        });
                    } else {
                        res.status(403).json({
                            success: false,
                            message: 'Sai thông tin tài khoản hoặc mật khẩu',
                        });
                    }
                } else {
                    res.status(403).json({
                        success: false,
                        message: 'Sai thông tin tài khoản hoặc mật khẩu',
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

    // [PUT] api/auth/change-password
    async changePassword(req, res) {
        const {oldPassword, newPassword,email} = req.body;

        if (!oldPassword || !newPassword) {
            res.status(403).json({
                success: false,
                message: 'Vui lòng nhập đủ thông tin',
            });
        } else {
            try {
                const user = await Users.findOne({email: email});
                if (user) {
                    const validity = await bcrypt.compare(oldPassword, user.password);
                    if (validity) {
                        const salt = await bcrypt.genSalt(10);
                        const hashPassword = await bcrypt.hash(newPassword, salt);
                        await Users.updateOne(
                            {email: email},
                            {$set: {password: hashPassword}},
                        );
                        res.status(200).json({
                            success: true,
                            message: 'Đổi mật khẩu thành công'
                        })
                    } else {
                        res.status(403).json({
                            success: false,
                            message: 'Mật khẩu cũ không chính xác',
                        });
                    }
                } else {
                    res.status(404).json({
                        success: false,
                        message: 'Tạm thời không tìm thấy yêu cầu của bạn vui lòng quay lại sau',
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

module.exports = new AuthController();
