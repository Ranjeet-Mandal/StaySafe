const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb+srv://Ranjeet:Ranjeet2025@cluster0.3bsqu0n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})

async function main(){
   await mongoose.connect(MONGO_URL);
}

const initDB = async ()=>{
    await Listing.deleteMany({});
   initData.data =  initData.data.map((obj)=>({...obj, owner: "683706fc5ccdad797f395f29"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}
initDB();