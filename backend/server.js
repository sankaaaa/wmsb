const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const Item = require("./models/Item");
const Order = require("./models/Order");
const User = require("./models/User");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const streamBuffers = require("stream-buffers");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("✅ Connected to MongoDB Atlas");
    })
    .catch(err => console.error("❌ DB connection error:", err));

// ====================== ITEMS ======================
app.get("/api/items", async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
});

app.post("/api/items", async (req, res) => {
    try {
        const newItem = new Item(req.body);
        const savedItem = await newItem.save();
        res.json(savedItem);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
});

// ====================== USERS ======================
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Failed to fetch users"});
    }
})

// ====================== ORDERS ======================
app.get("/api/orders", async (req, res) => {
    try {
        const orders = await Order.find().sort({createdAt: -1});
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Failed to fetch orders"});
    }
});
app.post("/api/orders", async (req, res) => {
    try {
        const {customerName, customerEmail, providerEmail, products, totalPrice, comment} = req.body;

        if (!customerName || !customerEmail || !providerEmail || !products || !totalPrice) {
            return res.status(400).json({message: "Missing required fields"});
        }

        const order = new Order({customerName, customerEmail, providerEmail, products, totalPrice, comment});
        const savedOrder = await order.save();


        //нодмейлер
        const transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const htmlTable = `
            <h2>New Order from ${customerName}</h2>
            <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price (€)</th>
                        <th>Total (€)</th>
                    </tr>
                </thead>
                <tbody>
                    ${products.map(p => `
                        <tr>
                            <td>${p.name}</td>
                            <td>${p.quantity}</td>
                            <td>${p.price.toFixed(2)}</td>
                            <td>${(p.price * p.quantity).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <p><strong>Total: €${totalPrice.toFixed(2)}</strong></p>
            ${comment ? `<p><strong>Comment:</strong> ${comment}</p>` : ''}
        `;

        //pdf генерація
        const doc = new PDFDocument();
        const pdfBuffer = new streamBuffers.WritableStreamBuffer();
        doc.pipe(pdfBuffer);

        doc.fontSize(18).text(`Order from ${customerName}`, {align: 'center'});
        doc.moveDown();

        products.forEach(p => {
            doc.fontSize(12).text(`${p.name} — ${p.quantity} × €${p.price.toFixed(2)} = €${(p.price * p.quantity).toFixed(2)}`);
        });
        doc.moveDown();
        doc.fontSize(14).text(`Total: €${totalPrice.toFixed(2)}`);
        if (comment) {
            doc.moveDown();
            doc.fontSize(12).text(`Comment: ${comment}`);
        }
        doc.end();

        pdfBuffer.on('finish', async () => {
            const pdfData = pdfBuffer.getContents();
            await transporter.sendMail({
                from: `"${customerName}" <${process.env.EMAIL_USER}>`,
                to: providerEmail,
                replyTo: customerEmail,
                subject: `New Order from ${customerName}`,
                html: htmlTable,
                attachments: [
                    {filename: `order-${savedOrder._id}.pdf`, content: pdfData}
                ]
            });

            res.status(201).json(savedOrder);
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Failed to create order or send email"});
    }
});

// ====================== SERVER ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
