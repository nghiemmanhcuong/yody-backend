const Banners = require('../../models/bannersModel');

class bannerApiController {
    // [GET] api/banner/topbar
    async getTopbar(req, res) {
        try {
            const topbarBanner = await Banners.findOne({isTopbar: true});
            if (topbarBanner) {
                res.status(200).json({
                    success: true,
                    data: topbarBanner,
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

    // [GET] api/banner/slide-hero
    async getSlideHero(req, res) {
        try {
            const slideHeroBanner = await Banners.find({isSliderHero: true});
            if (slideHeroBanner) {
                res.status(200).json({
                    success: true,
                    data: slideHeroBanner,
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

    // [GET] api/banner/slide-bot
    async getSlideBot(req, res) {
        try {
            const slideBotBanner = await Banners.find({isSliderBot: true});
            if (slideBotBanner) {
                res.status(200).json({
                    success: true,
                    data: slideBotBanner,
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

    // [GET] api/banner/popular
    async getPopular(req, res) {
        try {
            const popularBanner = await Banners.find({isPopular: true});
            if (popularBanner) {
                res.status(200).json({
                    success: true,
                    data: popularBanner,
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

    // [GET] api/banner/hot
    async getHot(req, res) {
        try {
            const hotBanner = await Banners.find({isHot: true});
            if (hotBanner) {
                res.status(200).json({
                    success: true,
                    data: hotBanner,
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

module.exports = new bannerApiController();
