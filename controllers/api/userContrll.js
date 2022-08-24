const Users = require('../../models/userModel.js');

class UserController {
    // [PUT] api/user/like-product
    async likeProduct(req, res) {
        const {email, product} = req.body;
        try {
            const user = await Users.findOne({email: email});
            const index = user.favorite_products.findIndex((item) => item._id === product._id);
            if (index == -1) {
                await user.updateOne({$push: {favorite_products: product}});
                res.status(200).json({
                    success: true,
                    message: 'Thích sản phẩm thành công',
                });
            } else {
                res.status(403).json({
                    success: false,
                    message: 'Bạn đã thích sản phẩm này',
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi server ' + error,
            });
        }
    }

    // [PUT] api/user/unlike-product
    async unlikeProduct(req, res) {
        const {email, productId} = req.body;
        try {
            const user = await Users.findOne({email: email});
            const index = user.favorite_products.findIndex((item) => item._id === productId);
            if (index != -1) {
                const new_favorite_products = user.favorite_products.filter(
                    (item) => item._id != productId,
                );
                await user.updateOne({favorite_products: new_favorite_products});
                res.status(200).json({
                    success: true,
                    message: 'Bỏ thích sản phẩm thành công',
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi server ' + error,
            });
        }
    }

    // [POST] api/user/add-address
    async addAddress(req, res) {
        const {name, phone, address} = req.body.address;
        if (!name || !phone || !address) {
            res.status(403).json({
                success: false,
                message: 'Bạn chưa nhập tên, số điện thoại hoặc địa chỉ',
            });
        } else {
            try {
                const user = await Users.findOne({email: req.body.userEmail});
                await user.updateOne({$push: {addresses: req.body.address}});
                res.status(200).json({
                    success: true,
                    message: 'Thêm địa chỉ thành công',
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Lỗi server ' + error,
                });
            }
        }
    }

    // [DELETE] api/user/delete-address
    async deleteAddress(req, res) {
        try {
            const user = await Users.findOne({email: req.params.userEmail});
            const newUserAddresses = user.addresses.filter(
                (address) => address.id != req.params.addressId,
            );
            await user.updateOne({addresses: newUserAddresses});
            res.status(200).json({
                success: true,
                message: 'Xoá địa chỉ thành công',
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi server ' + error,
            });
        }
    }
}

module.exports = new UserController();
