const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const Item = require("./models/Item");
const Order = require("./models/Order");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(async () => {
        console.log("✅ Connected to MongoDB Atlas");

        const count = await Item.countDocuments();
        console.log(`Documents in collection 'storage': ${count}`);
    })
    .catch(err => console.error("❌ DB connection error:", err));

app.get("/api/items", async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

app.post("/api/items", async (req, res) => {
    try {
        const newItem = new Item(req.body);
        const savedItem = await newItem.save();
        res.json(savedItem);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

app.post("/api/orders", async (req, res) => {
    try {
        const { customerName, customerEmail, providerEmail, products, totalPrice } = req.body;

        if (!customerName || !customerEmail || !providerEmail || !products || !totalPrice) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const order = new Order({
            customerName,
            customerEmail,
            providerEmail,
            products,
            totalPrice,
        });

        const savedOrder = await order.save();

        res.status(201).json(savedOrder);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create order" });
    }
});

app.get("/api/orders", async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
