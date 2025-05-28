const express = require("express");
const app = express();
const users = require("./routes/users.js");
const post = require("./routes/post.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.set((req,res,next)=>{
    res.locals.succesMsg = req.flash("success"); 
    res.locals.errorMsg = req.flash("error");
    next();
})

const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
}


app.use(session(sessionOptions));
app.use(flash());

app.get("/register",(req,res)=>{
    let {name = "anonymous"} = req.query;
    req.session.name = name;
  
    if(name==="anonymous"){
         req.flash("error", "user not registered!");
    }else{
        req.flash("success", "user registered successfuly");
    }
    res.redirect('/hello');
})

app.get("/hello",(req,res)=>{
    // console.log(req.flash("success"));
    

    res.render("page.ejs", {name: req.session.name, msg: req.flash("success")});
})






// app.use(session({secret: "mysupersecretstring", resave: false, saveUninitialized: true}));

 
// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`the sent ${req.session.count} times`);
// })

// app.get("/test",(req,res)=>{
//     res.send("test succesful");
// });



app.listen("3000",()=>{
    console.log("the server is listening at port 3000");
})











// const secretcode = "mySuperSecret123";

// app.use(cookieParser(secretcode));

// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("made-in", "India", {signed:true});
//     res.send("signed cookie sent");
// })

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
// })

// app.get("/getcokies",(req,res)=>{
//     res.cookie("greet", "hello");
//     res.cookie("madeIn", "India");
//     res.send("send some cokies");
// })

// app.get("/greet",(req,res)=>{
//     let {Name = "anonymous"} = req.cookies;
//     res.send(`HI ${Name}`);
// })

// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("Hi , i am root");
// })

// app.use("/users", users);
// app.use("/post", post);



