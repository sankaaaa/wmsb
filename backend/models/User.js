const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    login: {type: String, required: true},
    password: {type: String, required: true},
});

module.exports = mongoose.model("User", orderSchema, "users");
