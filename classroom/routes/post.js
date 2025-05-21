const express = require("express");
const router = express.Router();

//Index
router.get("/",(req,res)=>{
    res.send("GET for posts");
})

//show 
router.get("//:id",(req,res)=>{
    res.send("POST for posts");
})

// show - users
router.post("/", (req,res)=>{
    res.send("Post for posts");
})

router.delete("//:id",(req,res)=>{
    res.send("Delete for post id");
});

module.exports = router;