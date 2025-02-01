const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp:{
        type: Number,
    },
    username:{
        type: String,
        required: true
    },
    createdAt: { type: Date, default: Date.now, expires: 60 * 10 }
});

module.exports.Verification = mongoose.model("Verification", verificationSchema);