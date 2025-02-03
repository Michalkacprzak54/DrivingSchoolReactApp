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
import Footer from "./components/footer"
import CartPage from './forAll/cart/cartPage';
import PaymentPage from './forAll/cart/paymentPage';
import PkkTutorial from './forAll/pkkAndCourse';
import { AuthContext } from './AuthContext';
import PurchaseHistory from './forLogged/purchaseHistory';
import PurchaseDetails from './forLogged/purchaseDetails';
import PraticeSchedule from './forLogged/praticeSchedule'; 
import ServiceSchedule from './forLogged/serviceSchedule'; 
import StartCourse from './forLogged/startCourse'; 
import ContactPage from './forAll/contact';
import MyAccount from './myAccount/myAccount';
import UserProfile from './myAccount/userProfile';
import MyCourses from './forLogged/myCourses';
import CourseDetails from './forLogged/courseDetails';

import NavBarInstructor from "./instructor/components/navBarInstructor"
import InstructorLogin from './instructor/pages/instructorLoginPage';
import InstructorSchedule from './instructor/pages/instructorSchedule';
import AddEventPage from './instructor/pages/addEventPage';
import InstructorProfile from './instructor/pages/instructorProfile';

import NavBarAdmin from "./admin/components/navBarAdmin"
import AdminLogin from './admin/pages/adminLogin';
import EmployeePage from './admin/pages/employeePage';
import EmployeeDetails from './admin/pages/employeeDetails';
import AddEmployee from './admin/pages/addEmployee';
import EditEmployee from './admin/pages/editEmployee';
import ChangePasswordEmployee from './admin/pages/changePasswordEmployee';
import ContactRequests from './admin/pages/contactRequests';
import ServicesPage from './admin/pages/servicesPage';
import ServicePageDetails from './admin/pages/servicePageDetails';
import ServicePageAdd from './admin/pages/servicePageAdd';
import ServicePageEdit from './admin/pages/servicePageEdit';
import VariantPageAdd from './admin/pages/variantPageAdd';
import VariantPageEdit from './admin/pages/variantPageEdit';
import AddPaymentPage from './admin/pages/addPaymentPage';
import AddPaymentPageDetails from './admin/pages/addPaymentPageDetails';
import AddLecturePage from './admin/pages/addLecturePage';

import '/node_modules/bootstrap/dist/css/bootstrap.min.css';



const App = () => {
    const { isLoggedIn, userRole } = useContext(AuthContext); // Uzyskujemy userRole z kontekstu

    return (
            <Router>
                <div className="d-flex flex-column min-vh-100">
                {isLoggedIn ? (
                    userRole === 'instructor' ? (
                        <NavBarInstructor />
                    ) : userRole === 'admin' ? (
                        <NavBarAdmin />
                    ) : (
                        <NavBarUser />
                    )
                ) : (
                    <NavBarUser />
                )}

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

                        {/* Trasy dla zalogowanych użytkowników */}
                        <Route path="/payment" element={<ProtectedRoute requiredRole="client"><PaymentPage /></ProtectedRoute>} />
                        <Route path="/myAccount" element={<ProtectedRoute requiredRole="client"><MyAccount /></ProtectedRoute>} />
                        <Route path="/purchaseHistory" element={<ProtectedRoute requiredRole="client"><PurchaseHistory /></ProtectedRoute>} />
                        <Route path="/purchaseDetails/:purchaseId" element={<ProtectedRoute requiredRole="client"><PurchaseDetails /></ProtectedRoute>} />
                        <Route path="/praticeSchedule/:IdCourseDetails/:CategoryName" element={<ProtectedRoute requiredRole="client"><PraticeSchedule /></ProtectedRoute>} />
                        <Route path="/serviceSchedule/:purchaseId" element={<ProtectedRoute requiredRole="client"><ServiceSchedule /></ProtectedRoute>} />
                        <Route path="/userProfile" element={<ProtectedRoute requiredRole="client"><UserProfile /></ProtectedRoute>} />
                        <Route path="/myCourses" element={<ProtectedRoute requiredRole="client"><MyCourses /></ProtectedRoute>} />
                        <Route path="/courseDetails/:idClient" element={<ProtectedRoute requiredRole="client"><CourseDetails /></ProtectedRoute>} />
                        <Route path="/startCourse/:purchaseDate/:idVariantService" element={<ProtectedRoute requiredRole="client"><StartCourse /></ProtectedRoute>} />


                        {/* Trasy dla instruktorów */}
                        <Route path="/instructorLogin" element={<InstructorLogin />} />
                        <Route path="/instructorSchedule" element={
                            <ProtectedRoute requiredRole="instructor">
                                <InstructorSchedule />
                            </ProtectedRoute>
                        } />
                        <Route path="/addEventPage" element={
                            <ProtectedRoute requiredRole="instructor">
                                <AddEventPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/instructorProfile" element={
                            <ProtectedRoute requiredRole="instructor">
                                <InstructorProfile />
                            </ProtectedRoute>
                        } />

                        {/* Trasy dla admina */}

                        <Route path="/adminLogin" element={<AdminLogin />} />
                        <Route path="/employeePage" element={
                            <ProtectedRoute requiredRole="admin">
                                <EmployeePage />
                            </ProtectedRoute>
                        } />
                        <Route path="/employeeDetails/:IdEmployee" element={
                            <ProtectedRoute requiredRole="admin">
                                <EmployeeDetails />
                            </ProtectedRoute>
                        } />
                        <Route path="/addEmployee" element={
                            <ProtectedRoute requiredRole="admin">
                                <AddEmployee />
                            </ProtectedRoute>
                        } />
                        <Route path="/editEmployee/:IdEmployee" element={
                            <ProtectedRoute requiredRole="admin">
                                <EditEmployee />
                            </ProtectedRoute>
                        } />
                        <Route path="/changePasswordEmployee/:IdEmployee" element={
                            <ProtectedRoute requiredRole="admin">
                                <ChangePasswordEmployee />
                            </ProtectedRoute>
                        } />
                        <Route path="/contactRequests" element={
                            <ProtectedRoute requiredRole="admin">
                                <ContactRequests/>
                            </ProtectedRoute>
                        } />
                        <Route path="/servicesPage" element={
                            <ProtectedRoute requiredRole="admin">
                                <ServicesPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/servicePageDetails/:IdService" element={
                            <ProtectedRoute requiredRole="admin">
                                <ServicePageDetails />
                            </ProtectedRoute>
                        } />
                        <Route path="/servicePageAdd" element={
                            <ProtectedRoute requiredRole="admin">
                                <ServicePageAdd />
                            </ProtectedRoute>
                        } />
                        <Route path="/servicePageEdit/:IdService" element={
                            <ProtectedRoute requiredRole="admin">
                                <ServicePageEdit />
                            </ProtectedRoute>
                        } />
                        <Route path="/variantPageAdd/:IdService" element={
                            <ProtectedRoute requiredRole="admin">
                                <VariantPageAdd />
                            </ProtectedRoute>
                        } />
                        <Route path="/variantPageEdit/:IdVariantService/:IdService" element={
                            <ProtectedRoute requiredRole="admin">
                                <VariantPageEdit />
                            </ProtectedRoute>
                        } />
                        <Route path="/addPaymentPage" element={
                            <ProtectedRoute requiredRole="admin">
                                <AddPaymentPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/addPaymentPageDetails/:IdInvoice" element={
                            <ProtectedRoute requiredRole="admin">
                                <AddPaymentPageDetails />
                            </ProtectedRoute>
                        } />
                        <Route path="/addLecturePage" element={
                            <ProtectedRoute requiredRole="admin">
                                <AddLecturePage />
                            </ProtectedRoute>
                        } />

                    </Routes>
                    </div>
                    <Footer />
                </div>
            </Router>
    );
}

export default App;


