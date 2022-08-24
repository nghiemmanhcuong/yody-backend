const Collections = require('../../models/collectionModel');

class collectionApiController {
    // [GET] api/collection/all
    async getAll(req, res) {
        try {
            const collections = await Collections.find({});
            if (collections) {
                res.status(200).json({
                    success: true,
                    data: collections,
                });
            } else {
                res.status(500).json({
                    success: false, 
                    message: 'Không tìm thấy dữ liệu'
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false, 
                message: 'Lỗi server ' + error
            });
        }
    }

    // [GET] api/collection/by-slug/:slug
    async getBySlug(req, res) {
        const slug = req.params.slug;

        if (!slug) {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy dữ liệu mong muốn',
            });
        } else {
            try {
                const collection = await Collections.findOne({slug: slug});

                if (collection) {
                    res.status(200).json({
                        success: true,
                        data: collection
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

module.exports = new collectionApiController();
