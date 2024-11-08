import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ClientsList from './client/clientList';
import Service from './forAll/service';
import TheorySchedule from './forAll/schedule';

function App() {
    return (
        <Router>
            <nav>
                <ul>
                    <li><Link to="/clients">Lista klientów</Link></li>
                    <li><Link to="/services">Usługi</Link></li>
                    <li><Link to="/schedule">Harmonogram</Link></li>
                </ul>
            </nav>

            <Routes>
                <Route path="/clients" element={<ClientsList />} />
                <Route path="/services" element={<Service />} />
                <Route path="/schedule" element={<TheorySchedule />} />
            </Routes>
        </Router>
    );
}

export default App;
