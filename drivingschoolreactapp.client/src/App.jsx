import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AddClientForm from './client/addClientForm';
import ClientsList from './client/clientsView';
import EditClientForm from './client/clientEdit';

function App() {
    return (
        <Router>
            <nav>
                <ul>
                    <li><Link to="/clients">Lista klient�w</Link></li>
                    <li><Link to="/add-client">Dodaj klienta</Link></li>
                </ul>
            </nav>

            <Routes>
                <Route path="/clients" element={<ClientsList />} />
                <Route path="/add-client" element={<AddClientForm />} />
                <Route path="/edit-client/:id" element={<EditClientForm />} />
            </Routes>
        </Router>
    );
}

export default App;
