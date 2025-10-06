const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    price: Number,
    description: String,
    type: String,
    photo: String
});

module.exports = mongoose.model("Item", itemSchema, "storage");
