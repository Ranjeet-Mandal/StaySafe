const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("./middleware.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup", wrapAsync(async(req,res)=>{
    try{
        let {username,email,password} = req.body;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "welcome to StaySafe");
        res.redirect("/listings");
    })

    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}))

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

// router.post("/login",saveRedirectUrl, passport.authenticate("local",{
//     failureRedirect: "/login",
//     failureFlash: true,

// }),
    
//     async(req,res)=>{
//         req.flash("success","Welcome back to StaySafe");
//         let redirectUrl = res.locals.redirectUrl || "/listings";
//         res.redirect(redirectUrl);
// })
router.post("/login", async (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash("error", "Invalid username or password");
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome back to StaySafe");
      return res.redirect("/listings");
    });
  })(req, res, next);
});


router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
})

module.exports = router;