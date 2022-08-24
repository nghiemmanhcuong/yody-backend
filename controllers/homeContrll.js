class HomeController {
    async getView(req, res) {
        try {
            res.render('layouts/home/index')
        } catch (error) {
            console.log('Có lỗi',error);
        }
    }
}

module.exports = new HomeController();