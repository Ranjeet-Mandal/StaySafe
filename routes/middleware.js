// module.exports.isLoggedIn = (req,res,next)=>{
//     // console.log(req.path,"..",req.originalUrl);
//     if(!req.isAuthenticated()){
//         req.session.redirectUrl = req.originalUrl;
//      req.flash("error","you must be logged in to create listing");
//     return res.redirect("/login");
//     }
//     next();
// } 

// module.exports.saveRedirectUrl = (req,res,next)=>{
//     if(req.session.redirectUrl){
//         res.locals.redirectUrl = req.session.redirectUrl;
//     }
//     function saveRedirectUrl(req, res, next) {
//   if (req.session.returnTo) {
//     res.locals.redirectUrl = req.session.returnTo;
//     delete req.session.returnTo;
//   }
//   next();
// }
// }

// Check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a listing");
        return res.redirect("/login");
    }
    next();
};

// Save the URL user wanted to visit before login
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        delete req.session.redirectUrl; // Clean up after using
    }
    next();
};
