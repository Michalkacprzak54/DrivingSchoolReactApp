import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ClientsList from './client/clientList';
import Service from './forAll/service';
import TheorySchedule from './forAll/schedule';
import LoginForm from './forAll/login';
import RegisterForm from './forAll/register';
import ProtectedRoute from './ProtectedRoute';
import './styles.css';
import NavBar from "./components/navBar"


function App() {
    return (

        <Router>
            <div className="App">
                <NavBar />
                <Routes>
                    <Route path="/services" element={<Service />} />
                    <Route path="/schedule" element={<TheorySchedule />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/clients" element={<ProtectedRoute><ClientsList /></ProtectedRoute>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;


