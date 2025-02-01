const mongoose = require("mongoose");
const initData = require("./updatedData.js");
const Listing = require("../models/listing.js"); 

main().then(() => {
    console.log("connection successful");
}).catch((err) => {console.log(err)});

async function main(){
    await mongoose.connect("mongodb+srv://pythgclb:pBOdnzs8V4bxmcKJ@cluster0.he2oi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
}

async function datainit(){
    await Listing.deleteMany({});
    //initData.data = initData.data.map((obj)=> ({
    //    ...obj,
    //    owner: "678fd45848db596e0df6460f"
    //}));
    await Listing.insertMany(initData.data);

    console.log("data initialized");
}

datainit().catch((err) => {console.log(err)});