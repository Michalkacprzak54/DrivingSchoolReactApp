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
import CartPage from './forAll/cart/cartPage';
import PaymentPage from './forAll/cart/paymentPage';
import PkkTutorial from './forAll/pkkAndCourse';
import { AuthProvider } from './AuthContext'; 
import PurchaseHistory from './forLogged/purchaseHistory';
import PraticeSchedule from './forLogged/praticeSchedule'; 

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <NavBar />
                    <div className="content">
                        <Routes>
                            <Route path="/services" element={<Service />} />
                            <Route path="/schedule" element={<TheorySchedule />} />
                            <Route path="/login" element={<LoginForm />} />
                            <Route path="/register" element={<RegisterForm />} />
                            {/*<Route path="/clients" element={<ProtectedRoute> <ClientsList/> </ProtectedRoute>} />*/}
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/pkk" element={<PkkTutorial />} />
                            <Route path="/payment" element={<ProtectedRoute> <PaymentPage /> </ProtectedRoute>} />
                            <Route path="/purchaseHistory" element={<ProtectedRoute> <PurchaseHistory /> </ProtectedRoute>} />
                            <Route path="/praticeSchedule" element={<ProtectedRoute> <PraticeSchedule /> </ProtectedRoute>} />
                        </Routes>
                    </div>

                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;


