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
                    <label
                        className="flex items-center space-x-2 text-white text-[20px] font-bold font-['Craftwork_Grotesk'] cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 accent-white"/>
                        <span>Alcohol drinks</span>
                    </label>

                    <label
                        className="flex items-center space-x-2 text-white text-[20px] font-bold font-['Craftwork_Grotesk'] cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 accent-white"/>
                        <span>Soft drinks</span>
                    </label>

                    <label
                        className="flex items-center space-x-2 text-white text-[20px] font-bold font-['Craftwork_Grotesk'] cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 accent-white"/>
                        <span>Stuff</span>
                    </label>
                </div>

                <input
                    type="text"
                    placeholder="Search"
                    className="ml-auto mr-[80px] px-4 py-2 rounded-md text-black text-[16px] focus:outline-none"
                />
            </div>

            <ul className="space-y-2">
                {items.map((item) => (
                    <li
                        key={item._id}
                        className="pl-[60px] flex items-center justify-between bg-gray-200 p-4 pt-[20px] pb-[20px] rounded-md"
                    >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="w-16 h-16 bg-white flex items-center justify-center">
                                photo
                            </div>

                            <div className="break-words">
                                <h3 className="font-bold text-[20px] truncate">{item.name}</h3>
                                <p className="text-sm text-gray-700 truncate">{item.description}</p>
                            </div>
                        </div>

                        <div className="w-[100px] flex-shrink-0 text-center mr-[50px]">
                            <span className="font-semibold">Price: €{item.price}</span>
                        </div>

                        <div className="w-[100px] flex-shrink-0 text-center mr-[50px]">
                            <span className="font-semibold">Amount: {item.quantity}</span>
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
