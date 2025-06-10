// if(process.env.NODE_ENV != "production"){
//     require('dotenv').config();
// }
// console.log(process.env.SECRET);


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/StaySafe';

const sessionOption = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => { 
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    // console.log(success);
    next();
});

// app.get("/demouser", async(req,res)=>{
//     let fakeUser = new User({
//         email: "rj@gmail.com",
//         username: "delta-student"
//     });

//     let registeredUser = await User.register(fakeUser, "helloWorld");
//     res.send(registeredUser);
// })

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public"))); // ✅ better

app.get("/", (req, res) => {
    res.send("Hello from express");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, () => {
    console.log("server is listening port at 8080");
});



// Uncomment this if you're using environment variables in production
// if (process.env.NODE_ENV !== "production") {
//     require("dotenv").config();
// }

// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");
// const ExpressError = require("./utils/ExpressError.js");
// const session = require("express-session");
// const flash = require("connect-flash");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");

// const listingRouter = require("./routes/listing.js");
// const reviewRouter = require("./routes/review.js");
// const userRouter = require("./routes/user.js");
// const User = require("./models/user.js");

// // ✅ MongoDB Connection
// const MONGO_URL = "mongodb://127.0.0.1:27017/StaySafe";

// async function main() {
//     await mongoose.connect(MONGO_URL);
// }
// main().then(() => {
//     console.log("✅ Connected to DB");
// }).catch(err => {
//     console.log("❌ Mongo Connection Error:", err);
// });

// // ✅ View Engine + Middleware Setup
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.engine("ejs", ejsMate);
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.use(express.static(path.join(__dirname, "public")));

// // ✅ Session Setup
// const sessionOptions = {
//     secret: "mysupersecretcode",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         httpOnly: true,
//         maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
//         expires: Date.now() + 1000 * 60 * 60 * 24 * 7
//     }
// };
// app.use(session(sessionOptions));
// app.use(flash());

// // ✅ Passport Setup
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// // ✅ Global Middleware for Flash + User Info
// app.use((req, res, next) => {
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     res.locals.currUser = req.user; // Used in views/middleware
//     next();
// });

// // ✅ Routes
// app.get("/", (req, res) => {
//     res.send("Hello from Express!");
// });
// app.use("/listings", listingRouter);
// app.use("/listings/:id/reviews", reviewRouter);
// app.use("/", userRouter);

// // ✅ Error Handler
// app.use((err, req, res, next) => {
//     const { statusCode = 500, message = "Something went wrong!" } = err;
//     res.status(statusCode).render("error.ejs", { message });
// });

// // ✅ Start Server
// app.listen(8080, () => {
//     console.log("🚀 Server running on http://localhost:8080");
// });
