const express = require("express");
const router = express.Router();


//Index-users
router.get("/users",(req,res)=>{
    res.send("GET for users");
})

//show -users
router.get("/users/:id",(req,res)=>{
    res.send("POST for users");
})

// show - users
router.post("/users", (req,res)=>{
    res.send("Post for users");
})

//delete routes
router.delete("/users/:id",(req,res)=>{
    res.send("Delete for users Id");
})

module.exports = router;
