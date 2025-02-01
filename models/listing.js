const mongoose = require("mongoose");
const Review  = require("./review");
const {Schema} = mongoose;

const listingSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String
    },
    image:{
        url: String,
        filename: String
    },
    price:{
        type: Number
    },
    location:{
        type: String
    },
    country:{
        type: String
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    coordinate:{
        latitude:{
            type:Number,
            reduired: true
        },
        longitude:{
            type:Number,
            reduired: true
        }
    },
    filter:{
        type: String,
        enum: ["default", "beach", "castle", "arctic", "views", "windmill", "pool", "farm", "treehouse", "island", "camping", "boathouse", "dome"],
        default: "default"
    },
    trendScore:{
        type: Number,
        default: 0
    }
});

listingSchema.post("findOneAndDelete", async(data) =>{
    if(data.reviews.length){
        await Review.deleteMany({_id: {$in: data.reviews}});
    }
});

const Listing = new mongoose.model("Listing", listingSchema);
module.exports = Listing;