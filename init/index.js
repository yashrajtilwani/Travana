const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js"); 

main().then(() => {
    console.log("connection successful");
}).catch((err) => {console.log(err)});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

async function datainit(){
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=> ({
        ...obj,
        owner: "678fd45848db596e0df6460f"
    }));
    await Listing.insertMany(initData.data);

    console.log("data initialized");
}

datainit().catch((err) => {console.log(err)});