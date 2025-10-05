import React from "react";
import {Link, useLocation} from "react-router-dom";

const Navbar = () => {
    const location = useLocation();

    const links = [
        {path: "/stock", label: "Stock"},
        {path: "/orders", label: "All orders"},
        {path: "/create", label: "Create order"},
        {path: "/logout", label: "Log out"},
    ];

    return (
        <div>
            <div className="h-20 bg-red-950 flex items-center justify-center">
                <div className="text-white text-3xl font-bold font-['Craftwork_Grotesk']">
                    WMSB
                </div>
            </div>
            <div className="h-20 bg-[#660B05] flex items-center justify-center space-x-[300px]">
                {links.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`
              relative px-6 py-2 rounded-md 
              text-white text-[20px] font-bold font-['Craftwork_Grotesk'] transition-all duration-200
              ${isActive ? "bg-[#981208]" : "hover:bg-[#981208]/50"}
            `}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default Navbar;
