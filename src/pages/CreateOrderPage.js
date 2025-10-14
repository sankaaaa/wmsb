import React from "react";
import {useNavigate} from "react-router-dom";
import Navbar from "../components/Navbar";

const CreateOrderPage = () => {
    const navigate = useNavigate();
    const [cart, setCart] = React.useState([]);

    React.useEffect(() => {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch("http://localhost:5000/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ products: cart }),
        })
            .then((res) => res.json())
            .then((data) => {
                alert("Order created successfully!");
                localStorage.removeItem("cart");
                setCart([]);
                navigate("/stock");
            })
            .catch((err) => console.error("Order creation failed:", err));
    };


    return (
        <div>
            <Navbar/>
            <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-10">
                <div className="bg-white p-8 rounded-xl shadow-md w-[600px]">
                    <h1 className="text-2xl font-bold mb-4 text-center text-[#981208]">
                        Create Order
                    </h1>

                    {cart.length === 0 ? (
                        <p className="text-center text-gray-600">
                            Your cart is empty. Please go back and add items
                        </p>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <ul className="space-y-2 mb-6">
                                {cart.map((item) => (
                                    <li
                                        key={item._id}
                                        className="flex justify-between border-b pb-2"
                                    >
                                        <span>{item.name}</span>
                                        <span>
                    {item.quantity} × €{item.price} ={" "}
                                            <strong>€{(item.price * item.quantity).toFixed(2)}</strong>
                  </span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mb-4">
                                <label className="block font-semibold mb-1">Your name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border rounded-md px-3 py-2"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block font-semibold mb-1">Delivery address</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border rounded-md px-3 py-2"
                                    placeholder="Enter your address"
                                />
                            </div>

                            <div className="text-right">
                                <button
                                    type="submit"
                                    className="bg-[#981208] text-white px-6 py-2 rounded-md hover:bg-red-700"
                                >
                                    Submit order
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateOrderPage;
