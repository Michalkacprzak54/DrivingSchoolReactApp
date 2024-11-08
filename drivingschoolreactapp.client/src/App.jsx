import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ClientsList from './client/clientList';
import Service from './forAll/service';
import TheorySchedule from './forAll/schedule';
import LoginForm from './forAll/login';

function App() {
    return (
        <Router>
            <nav>
                <ul>
                    <li><Link to="/clients">Lista klientów</Link></li>
                    <li><Link to="/services">Usługi</Link></li>
                    <li><Link to="/schedule">Harmonogram</Link></li>
                    <li><Link to="/login">Logowanie</Link></li>
                </ul>
            </nav>

            <Routes>
                <Route path="/clients" element={<ClientsList />} />
                <Route path="/services" element={<Service />} />
                <Route path="/login" element={<LoginForm />} />
            </Routes>
        </Router>
    );
}

export default App;
