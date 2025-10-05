import React, { useEffect, useState } from "react";

const StockPage = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/items")
            .then((res) => res.json())
            .then((data) => setItems(data))
            .catch((err) => console.error("Fetch error:", err));
    }, []);

    return (
        <div className="p-4">
            <h1>📦 Склад (Storage)</h1>
            <div className="p-6 bg-gray-100 min-h-screen">
                <h1 className="text-3xl font-bold text-blue-500">Склад</h1>
            </div>

            <ul>
                {items.map((item) => (
                    <li key={item._id}>
                        <strong>{item.name}</strong> — {item.quantity} шт. — ${item.price}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StockPage;
