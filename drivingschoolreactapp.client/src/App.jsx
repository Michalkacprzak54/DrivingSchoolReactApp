﻿//import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Service from './forAll/service';
import ServiceDetails from './forAll/serviceDetails';
import TheorySchedule from './forAll/schedule';
import LoginForm from './forAll/login';
import RegisterForm from './forAll/register';
import ProtectedRoute from './ProtectedRoute';
import './styles.css';
import NavBar from "./components/navBar"
import Footer from "./components/footer"
import CartPage from './forAll/cart/cartPage';
import PaymentPage from './forAll/cart/paymentPage';
import PkkTutorial from './forAll/pkkAndCourse';
import { AuthProvider } from './AuthContext'; 
import PurchaseHistory from './forLogged/purchaseHistory';
import PurchaseDetails from './forLogged/purchaseDetails';
import PraticeSchedule from './forLogged/praticeSchedule'; 
import StartCourse from './forLogged/startCourse'; 
import ContactPage from './forAll/contact';
import MyAccount from './myAccount/myAccount';
import '/node_modules/bootstrap/dist/css/bootstrap.min.css';


function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="d-flex flex-column min-vh-100">
                    <NavBar />
                    <div className="flex-grow-1">

                        <Routes>
                            <Route path="/services" element={<Service />} />
                            <Route path="/service/:idService" element={<ServiceDetails />} />
                            <Route path="/schedule" element={<TheorySchedule />} />
                            <Route path="/login" element={<LoginForm />} />
                            <Route path="/register" element={<RegisterForm />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/pkk" element={<PkkTutorial />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/purchaseDetails/:purchaseId" element={<PurchaseDetails />} />
                            <Route path="/payment" element={<ProtectedRoute> <PaymentPage /> </ProtectedRoute>} />
                            <Route path="/myAccount" element={<ProtectedRoute> <MyAccount /> </ProtectedRoute>} />
                            <Route path="/purchaseHistory" element={<ProtectedRoute> <PurchaseHistory /> </ProtectedRoute>} />
                            <Route path="/praticeSchedule" element={<ProtectedRoute> <PraticeSchedule /> </ProtectedRoute>} />
                            <Route path="/startCourse/:purchaseDate/:idService" element={<ProtectedRoute> <StartCourse /> </ProtectedRoute>} />
                        </Routes>
                    </div>
                    <Footer /> 
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;


