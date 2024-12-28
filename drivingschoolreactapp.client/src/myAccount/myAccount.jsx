import React, { useContext } from 'react';
import { AuthContext } from '../authContext';
import { useNavigate } from 'react-router-dom';
/*import PurchaseHistory from './PurchaseHistory';*/
//import Profile from './Profile';
//import Settings from './Settings';
//import MyCourse from './MyCourse';

const MyAccount = () => {
    const { isLoggedIn, userId } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!isLoggedIn) {
        navigate('/login');
    }

    return (
        <div>
            <h1>Moje Konto</h1>
            <nav>
                <ul>
                    <li><button onClick={() => navigate(`/purchaseHistory`)}>Historia zakupów</button></li>
                    <li><button onClick={() => navigate(`/praticeSchedule`)}>Harmonogram praktyk</button></li>
                    {/*<li><button onClick={() => navigate(`/settings`)}>Ustawienia</button></li>*/}
                </ul>
            </nav>
        </div>
    );
};

export default MyAccount;
