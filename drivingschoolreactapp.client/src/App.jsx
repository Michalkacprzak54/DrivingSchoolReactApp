import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ClientsList from './client/clientList';
import Service from './forAll/service';
import TheorySchedule from './forAll/schedule';
import LoginForm from './forAll/login';
import CartPage from './forAll/cart/cartPage';
import RegisterForm from './forAll/register';
import ProtectedRoute from './ProtectedRoute';
import './styles.css';
import NavBar from "./components/navBar"


function App() {
    return (

        <Router>
            <div className="App">
                <NavBar />
                <div className="content">
                    <Routes>
                        <Route path="/services" element={<Service />} />
                        <Route path="/schedule" element={<TheorySchedule />} />
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/register" element={<RegisterForm />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/clients" element={<ProtectedRoute><ClientsList /></ProtectedRoute>} />
                    </Routes>
                </div>

            </div>
        </Router>
    );
}

export default App;


