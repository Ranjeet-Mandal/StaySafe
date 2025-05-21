const express = require("express");
const app = express();
const users = require("./routes/users.js");
const post = require("./routes/post.js");

app.get("/",(req,res)=>{
    res.send("Hi , i am root");
})

app.use("/users", users);
app.use("/post", post);


app.listen("3000",()=>{
    console.log("the server is listening at port 3000");
})

