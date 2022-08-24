
class pageController {
    //[GET] /page/error
    async error(req, res) {
        res.render('page/error',{
            error:req.session.error
        });
        req.session.error = null;
    }

    //[GET] /page/404
    async pageNotFound(req, res) {
        res.render('page/404');
    }
}

module.exports = new pageController();