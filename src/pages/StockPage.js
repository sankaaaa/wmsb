import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Navbar from "../components/Navbar";

const StockPage = () => {
    const [items, setItems] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [lowStockOnly, setLowStockOnly] = useState(false);

    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem("cart");
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Error reading cart from localStorage:", e);
            return [];
        }
    });

    const [showCartPopup, setShowCartPopup] = useState(false);
    const [showQuantityPopup, setShowQuantityPopup] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const navigate = useNavigate();

    useEffect(() => {
        try {
            localStorage.setItem("cart", JSON.stringify(cart));
        } catch (e) {
            console.error("Error writing cart to localStorage:", e);
        }
    }, [cart]);

    useEffect(() => {
        fetch("http://localhost:5000/api/items")
            .then((res) => res.json())
            .then((data) => setItems(data))
            .catch((err) => console.error("Fetch error:", err));
    }, []);

    const handleFilterChange = (type) => {
        setSelectedTypes((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        );
    };

    const filteredItems = items.filter((item) => {
        const matchesType =
            selectedTypes.length === 0 || selectedTypes.includes(item.type);
        const matchesStock = !lowStockOnly || item.quantity < 20;
        return matchesType && matchesStock;
    });

    const handleAddToCart = (item) => {
        setSelectedItem(item);
        setQuantity(1);
        setShowQuantityPopup(true);
    };

    const handleConfirmAdd = () => {
        if (!selectedItem) return;

        setCart((prevCart) => {
            const existing = prevCart.find((p) => p._id === selectedItem._id);

            if (existing) {
                return prevCart.map((p) =>
                    p._id === selectedItem._id ? {...p, quantity: p.quantity + quantity} : p
                );
            } else {
                return [...prevCart, {...selectedItem, quantity}];
            }
        });

        setShowQuantityPopup(false);
    };

    const handleChangeQuantity = (id, delta) => {
        setCart((prevCart) =>
            prevCart
                .map((item) =>
                    item._id === id ? {...item, quantity: Math.max(item.quantity + delta, 0)} : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div>
            <Navbar/>

            <div className="h-20 bg-[#981208] flex items-center pl-[60px] pr-[15px] relative">
                <div className="flex space-x-[80px]">
                    {[
                        {label: "Beers", type: "beer"},
                        {label: "Wines", type: "wine"},
                        {label: "Strong alcohol", type: "strong"},
                        {label: "Soft drinks", type: "soft"},
                        {label: "Stuff", type: "stuff"},
                    ].map(({label, type}) => (
                        <label
                            key={type}
                            className="flex items-center space-x-2 text-white text-[17px] font-bold cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={selectedTypes.includes(type)}
                                onChange={() => handleFilterChange(type)}
                                className="w-5 h-5 accent-white"
                            />
                            <span>{label}</span>
                        </label>
                    ))}
                    <label className="flex items-center space-x-2 text-white text-[17px] font-bold cursor-pointer">
                        <input
                            type="checkbox"
                            checked={lowStockOnly}
                            onChange={() => setLowStockOnly(!lowStockOnly)}
                            className="w-5 h-5 accent-white"
                        />
                        <span>Low quantity</span>
                    </label>
                </div>

                <div className="ml-auto flex items-center gap-4 mr-[60px]">
                    <input
                        type="text"
                        placeholder="Search"
                        className="px-4 py-2 rounded-md text-black text-[16px] focus:outline-none"
                    />
                    <button
                        onClick={() => setShowCartPopup(true)}
                        className="relative bg-white text-[#981208] rounded-full p-2 hover:bg-gray-100 transition"
                        title="View Cart"
                    >
                        <span className="text-2xl">🛒</span>
                        {cart.length > 0 && (
                            <span
                                className="absolute -top-1 -right-1 bg-[#981208] text-white text-xs rounded-full px-[6px]">
                {cart.length}
              </span>
                        )}
                    </button>
                </div>
            </div>

            <div className="flex justify-center bg-gray-100">
                <ul className="space-y-2 mt-4 min-w-[1300px]">
                    {filteredItems.map((item) => (
                        <li
                            key={item._id}
                            className="pl-[40px] flex items-center justify-between bg-white border border-gray-300 p-4 rounded-md"
                        >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div
                                    className="w-[90px] h-[90px] bg-white flex items-center justify-center overflow-hidden rounded-md">
                                    {item.photo ? (
                                        <img src={item.photo} alt={item.name} className="object-cover w-full h-full"/>
                                    ) : (
                                        <span className="text-gray-500 text-xs">No image</span>
                                    )}
                                </div>

                                <div className="break-words">
                                    <h3 className="font-bold text-[20px] truncate">{item.name}</h3>
                                    <p className="text-sm text-gray-700 truncate">{item.description}</p>
                                </div>
                            </div>

                            <div className="w-[100px] flex-shrink-0 text-center mr-[50px]">
                                <span className="font-semibold">€{item.price}</span>
                            </div>

                            <div className="w-[100px] flex-shrink-0 text-center mr-[50px]">
                    <span
                        className={`font-semibold ${item.quantity < 20 ? "text-red-600 font-bold" : "text-gray-800"}`}
                    >
                        Amount: {item.quantity}
                    </span>
                            </div>

                            <button
                                onClick={() => handleAddToCart(item)}
                                className="mr-[50px] bg-[#660B05] text-white px-4 py-2 rounded-md hover:bg-red-700"
                            >
                                Add to order
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {showQuantityPopup && selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 shadow-lg w-[400px]">
                        <h2 className="text-xl font-bold mb-2">{selectedItem.name}</h2>
                        <p className="mb-4 text-gray-600">Quantity to add:</p>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            className="border p-2 rounded-md w-full mb-4"
                        />
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setShowQuantityPopup(false)}
                                    className="px-4 py-2 bg-gray-300 rounded-md">
                                Cancel
                            </button>
                            <button onClick={handleConfirmAdd} className="px-4 py-2 bg-[#981208] text-white rounded-md">
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showCartPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 shadow-lg w-[450px] max-h-[80vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">🛒 Your order</h2>

                        {cart.length === 0 ? (
                            <p className="text-gray-600 text-center">Your cart is empty.</p>
                        ) : (
                            <>
                                <ul className="space-y-2 mb-4">
                                    {cart.map((p) => (
                                        <li key={p._id} className="flex justify-between items-center border-b pb-2">
                                            <span className="font-semibold w-[150px] truncate">{p.name}</span>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleChangeQuantity(p._id, -1)}
                                                        className="px-2 py-1 bg-gray-300 rounded">
                                                    -
                                                </button>
                                                <span className="w-[30px] text-center">{p.quantity}</span>
                                                <button onClick={() => handleChangeQuantity(p._id, 1)}
                                                        className="px-2 py-1 bg-gray-300 rounded">
                                                    +
                                                </button>
                                            </div>
                                            <span className="font-semibold">€{(p.price * p.quantity).toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="text-right font-bold text-lg border-t pt-3">Total:
                                    €{totalPrice.toFixed(2)}</div>
                            </>
                        )}

                        <div className="flex justify-end gap-3 mt-4">
                            <button onClick={() => setShowCartPopup(false)}
                                    className="px-4 py-2 bg-gray-300 rounded-md">
                                Close
                            </button>
                            {cart.length > 0 && (
                                <button
                                    onClick={() => {
                                        setShowCartPopup(false);
                                        navigate("/create");
                                    }}
                                    className="px-4 py-2 bg-[#981208] text-white rounded-md"
                                >
                                    Create order
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StockPage;
