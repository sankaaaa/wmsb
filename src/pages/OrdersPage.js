import React, {useEffect, useState} from "react";
import Navbar from "../components/Navbar";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:5000/api/orders")
            .then((res) => res.json())
            .then((data) => {
                setOrders(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching orders:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar/>

            <div className="max-w-5xl mx-auto mt-10 bg-white rounded-xl shadow-md p-6">
                <h1 className="text-2xl font-bold mb-6 text-[#981208]">📦 All orders</h1>

                {loading ? (
                    <p className="text-gray-600">...Loading orders</p>
                ) : orders.length === 0 ? (
                    <p className="text-gray-600">No orders found</p>
                ) : (
                    <ul className="space-y-4">
                        {orders.map((order) => (
                            <li
                                key={order._id}
                                className="border border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-lg font-bold text-[#660B05]">
                                        {order.customerName}
                                    </h2>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                            order.status === "new"
                                                ? "bg-yellow-200 text-yellow-800"
                                                : "bg-green-200 text-green-800"
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-700">
                                    <strong>Customer:</strong> {order.customerEmail}
                                </p>
                                <p className="text-sm text-gray-700">
                                    <strong>Provider:</strong> {order.providerEmail}
                                </p>

                                <div className="mt-2">
                                    <strong className="text-gray-800">Items:</strong>
                                    <ul className="ml-5 list-disc text-gray-700 text-sm">
                                        {order.products.map((p, idx) => (
                                            <li key={idx}>
                                                {p.name} — {p.quantity} × €{p.price}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex justify-between items-center mt-4">
                                    <span className="font-bold text-[#981208]">
                                        Total: €{order.totalPrice.toFixed(2)}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
