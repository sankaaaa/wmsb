import React, {useEffect, useState} from "react";
import Navbar from "../components/Navbar";

const StockPage = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/items")
            .then((res) => res.json())
            .then((data) => setItems(data))
            .catch((err) => console.error("Fetch error:", err));
    }, []);

    return (
        <div>
            <Navbar/>
            <div className="h-20 bg-[#981208] flex items-center pl-[60px] pr-[20px]">
                <div className="flex space-x-40">
                    <label className="flex items-center space-x-2 text-white text-[20px] font-bold font-['Craftwork_Grotesk'] cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 accent-white" />
                        <span>Alcohol drinks</span>
                    </label>

                    <label className="flex items-center space-x-2 text-white text-[20px] font-bold font-['Craftwork_Grotesk'] cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 accent-white" />
                        <span>Soft drinks</span>
                    </label>

                    <label className="flex items-center space-x-2 text-white text-[20px] font-bold font-['Craftwork_Grotesk'] cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 accent-white" />
                        <span>Stuff</span>
                    </label>
                </div>

                <input
                    type="text"
                    placeholder="Search"
                    className="ml-auto mr-[80px] px-4 py-2 rounded-md text-black text-[16px] focus:outline-none"
                />
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
