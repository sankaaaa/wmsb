import './App.css';
import React, {useState, useEffect} from 'react';
import {BrowserRouter, Routes, Route, Link, Navigate, useLocation} from 'react-router-dom';

import StockPage from "./pages/StockPage";
import OrdersPage from "./pages/OrdersPage";
import CreateOrderPage from "./pages/CreateOrderPage";
import LoginPage from "./pages/LoginPage";


function App() {
    return (
        <BrowserRouter>
            <>
                <Routes>
                    <Route path="/" element={<Navigate to="/stock"/>}/>
                    <Route path="/stock" element={<StockPage/>}/>
                    {<Route path="/orders" element={<OrdersPage />} />}
                    {<Route path="/create" element={<CreateOrderPage />} />}
                    {<Route path="/login" element={<LoginPage />} /> }
                </Routes>
            </>
        </BrowserRouter>
    );
}

export default App;
