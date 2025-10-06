const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    price: Number,
    description: String,
    type: String,
    photo: String
});

const Item = mongoose.model("Item", itemSchema, "storage");

module.exports = Item;
