import './App.css';
import React, {useState, useEffect} from 'react';
import {BrowserRouter, Routes, Route, Link, Navigate, useLocation} from 'react-router-dom';

import StockPage from "./pages/StockPage";

function App() {
    return (
        <BrowserRouter>
            <>
                <Routes>
                    <Route path="/" element={<Navigate to="/stock"/>}/>
                    <Route path="/stock" element={<StockPage/>}/>
                </Routes>
            </>
        </BrowserRouter>
    );
}

export default App;
