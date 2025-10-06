import React, {useEffect, useState} from "react";
import Navbar from "../components/Navbar";

const StockPage = () => {
    const [items, setItems] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/items")
            .then((res) => res.json())
            .then((data) => setItems(data))
            .catch((err) => console.error("Fetch error:", err));
    }, []);

    const handleFilterChange = (type) => {
        setSelectedTypes((prev) =>
            prev.includes(type)
                ? prev.filter((t) => t !== type)
                : [...prev, type]
        );
    };

    const filteredItems =
        selectedTypes.length === 0
            ? items
            : items.filter((item) => selectedTypes.includes(item.type));

    return (
        <div>
            <Navbar/>
            <div className="h-20 bg-[#981208] flex items-center pl-[60px] pr-[20px]">
                <div className="flex space-x-[120px]">
                    {[
                        {label: "Beers", type: "beer"},
                        {label: "Wines", type: "wine"},
                        {label: "Strong alcohol", type: "strong"},
                        {label: "Soft drinks", type: "soft"},
                        {label: "Stuff", type: "stuff"},
                    ].map(({label, type}) => (
                        <label
                            key={type}
                            className="flex items-center space-x-2 text-white text-[17px] font-bold font-['Craftwork_Grotesk'] cursor-pointer"
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
                </div>

                <input
                    type="text"
                    placeholder="Search"
                    className="ml-auto mr-[80px] px-4 py-2 rounded-md text-black text-[16px] focus:outline-none"
                />
            </div>

            <ul className="space-y-2">
                {filteredItems.map((item) => (
                    <li
                        key={item._id}
                        className="pl-[60px] flex items-center justify-between bg-gray-200 p-4 pt-[20px] pb-[20px] rounded-md"
                    >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div
                                className="w-[80px] h-[80px] bg-white flex items-center justify-center overflow-hidden rounded-md">
                                {item.photo ? (
                                    <img
                                        src={item.photo}
                                        alt={item.name}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <span className="text-gray-500 text-xs">No image</span>
                                )}
                            </div>

                            <div className="break-words">
                                <h3 className="font-bold text-[20px] truncate">{item.name}</h3>
                                <p className="text-sm text-gray-700 truncate">
                                    {item.description}
                                </p>
                            </div>
                        </div>

                        <div className="w-[100px] flex-shrink-0 text-center mr-[50px]">
                            <span className="font-semibold">Price: €{item.price}</span>
                        </div>

                        <div className="w-[100px] flex-shrink-0 text-center mr-[50px]">
                            <span
                                className={`font-semibold ${
                                    item.quantity < 20 ? "text-red-600 font-bold" : "text-gray-800"
                                }`}
                            >
                                Amount: {item.quantity}</span>
                        </div>

                        <button className="mr-[50px] bg-[#660B05] text-white px-4 py-2 rounded-md hover:bg-red-700">
                            Add to order
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StockPage;
