const Materials = require('../../models/materialModel');

class materialApiController {
    // [GET] api/material/popular
    async getPopular (req, res) {
        try {
            const popularMaterials = await Materials.find({}).limit(8).lean();
            if(popularMaterials) {
                res.status(200).json({
                    success: true, 
                    data: popularMaterials
                });
            }else {
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

    // [GET] api/material/all
    async getAll (req, res) {
        try {
            const popularMaterials = await Materials.find({}).lean();
            if(popularMaterials) {
                res.status(200).json({
                    success: true, 
                    data: popularMaterials
                });
            }else {
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
    
}

module.exports = new materialApiController();
