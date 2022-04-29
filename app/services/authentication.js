exports.ensureAuthenticated = (req,res,next) => {
    if(req.isAuthenticated()) {
        next();
    }
    else{
        req.flash('error_msg' , 'please login to view this resource');
        //req.session.returnTo = req.originalUrl;
        res.redirect('/users/login');
    }
}