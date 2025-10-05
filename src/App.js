import './App.css';
import React, {useState, useEffect} from 'react';
import {BrowserRouter, Routes, Route, Link, Navigate, useLocation} from 'react-router-dom';

import MainPage from "./pages/MainPage";

function App() {
    return (
        <BrowserRouter>
            <>
                <Routes>
                    <Route path="/" element={<Navigate to="/main"/>}/>
                    <Route path="/main" element={<MainPage/>}/>
                </Routes>
            </>
        </BrowserRouter>
    );
}

export default App;
