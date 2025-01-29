module.exports.saveRedirect = (req, res, next) => {
    let url = req.session.redirectUrl;
    if(url){
        res.locals.redirectUrl = url;
    } else {
        res.locals.redirectUrl = "/listings";
    }
    next();
}