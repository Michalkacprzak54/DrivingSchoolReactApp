import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Service from './forAll/service';
import ServiceDetails from './forAll/serviceDetails';
import TheorySchedule from './forAll/schedule';
import LoginForm from './forAll/login';
import RegisterForm from './forAll/register';
import ProtectedRoute from './ProtectedRoute';
import './styles.css';
import NavBarUser from "./components/navBar"
import NavBarInstructor from "./instructor/components/navBarInstructor"
import Footer from "./components/footer"
import CartPage from './forAll/cart/cartPage';
import PaymentPage from './forAll/cart/paymentPage';
import PkkTutorial from './forAll/pkkAndCourse';
import { AuthContext } from './AuthContext';
import PurchaseHistory from './forLogged/purchaseHistory';
import PurchaseDetails from './forLogged/purchaseDetails';
import PraticeSchedule from './forLogged/praticeSchedule'; 
import StartCourse from './forLogged/startCourse'; 
import ContactPage from './forAll/contact';
import MyAccount from './myAccount/myAccount';
import UserProfile from './myAccount/userProfile';
import MyCourses from './forLogged/myCourses';
import CourseDetails from './forLogged/courseDetails';
import InstructorLogin from './instructor/pages/instructorLoginPage';
import '/node_modules/bootstrap/dist/css/bootstrap.min.css';



const App = () => {
    const { isLoggedIn, userRole } = useContext(AuthContext); // Uzyskujemy userRole z kontekstu

    return (
            <Router>
                <div className="d-flex flex-column min-vh-100">
                    {isLoggedIn && userRole === 'instructor' ? <NavBarInstructor /> : <NavBarUser />}

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
                            <Route path="/praticeSchedule/:IdCourseDetails" element={<ProtectedRoute> <PraticeSchedule /> </ProtectedRoute>} />
                            <Route path="/userProfile" element={<ProtectedRoute> <UserProfile /> </ProtectedRoute>} />
                            <Route path="/myCourses" element={<ProtectedRoute> <MyCourses /> </ProtectedRoute>} />
                            <Route path="/courseDetails/:idClient" element={<ProtectedRoute> <CourseDetails /> </ProtectedRoute>} />
                            <Route path="/startCourse/:purchaseDate/:idService" element={<ProtectedRoute> <StartCourse /> </ProtectedRoute>} />
                            <Route path="/instructorLogin" element={<InstructorLogin />} />
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </Router>
    );
}

export default App;


