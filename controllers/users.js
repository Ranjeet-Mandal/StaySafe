const User = require("../models/user.js");
const passport = require("passport");


module.exports.renderSignUp = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signUp = async(req,res)=>{
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
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async (req, res, next) => {
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
}


module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
}