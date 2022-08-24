const Infos = require('../../models/infoModel');

class infoApiController {
    // [GET] api/info/
    async getInfo(req, res) {
        try {
            const infos = await Infos.findOne({});
            if (infos) {
                res.status(200).json({
                    success: true,
                    data: infos,
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
}

module.exports = new infoApiController();
