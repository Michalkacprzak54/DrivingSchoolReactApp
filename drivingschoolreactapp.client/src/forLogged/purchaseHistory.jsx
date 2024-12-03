import { useEffect, useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";
import { getCookie } from '../cookieUtils';
import { useNavigate } from "react-router-dom";

const PurchaseHistory = () => {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 
    const token = getCookie("jwtToken");
    const clientId = getCookie("userId");

    useEffect(() => {
        if (!clientId || !token) {
            navigate("/login"); 
            return;
        }

        const fetchPurchases = async () => {
            try {
                const response = await createAPIEndpoint(ENDPOINTS.CLIENT_SERVICE).fetchById(clientId);
                setPurchases(response.data);
            } catch (err) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchPurchases();
    }, [clientId, navigate]);


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Purchases for Client {clientId}</h2>
            <ul>
                {purchases.map((purchase) => (
                    <li key={purchase.idClientService}>
                        <p><strong>Service:</strong> {purchase.service.serviceName}</p>
                        <p><strong>Purchase Date:</strong> {new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                        <p><strong>Quantity:</strong> {purchase.quantity}</p>
                        <p><strong>Status:</strong> {purchase.status}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PurchaseHistory;