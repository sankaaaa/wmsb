const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    providerEmail: { type: String, required: true },
    products: [
        {
            name: String,
            price: Number,
            quantity: Number,
        },
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "new" },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema, "orders");
