import { useEffect, useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";
import { getCookie } from '../cookieUtils';
import { useNavigate } from "react-router-dom";

const PurchaseHistory = () => {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 
    const clientId = getCookie("userId");

    useEffect(() => {

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


    const handleDetailsClick = (purchaseId) => {
        navigate(`/purchaseDetails/${purchaseId}`);
    };

    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Twoje zamówienia</h2>

            <h3>W trakcie realizacji</h3>
            <ul>
                {purchases
                    .filter((purchase) => !purchase.isUsed)
                    .map((purchase) => (
                        <li key={purchase.idClientService}>
                            <p><strong>Nazwa:</strong> {purchase.service.serviceName}</p>
                            <p><strong>Data zakupu:</strong> {new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                            <p><strong>Ilość:</strong> {purchase.quantity}</p>
                            <p><strong>Status:</strong> {purchase.status}</p>
                            <p>Opcje:
                                {purchase.onlineTheory && 'Teoria zdalnie'}
                                {purchase.stationaryTheory && 'Teoria stacjonarnie'}
                                {purchase.theoryCompleted && 'Teoria zaliczona'}
                                {purchase.basicPractice && ', Podstawowa Praktyka'}
                                {purchase.extendedPractice && ', Rozszerzona Praktyka'}
                                {purchase.manual && 'Manualna skrzynia biegów'}
                                {purchase.automatic && 'Automatyczna skrzynia biegów'}
                            </p>

   
                            <button onClick={() => handleDetailsClick(purchase.idClientService)}>Zapisz się</button>
                        </li>
                    ))}
            </ul>

            {purchases.some((purchase) => purchase.isUsed) && (
                <>
                    <h3>Zrealizowane</h3>
                    <ul>
                        {purchases
                            .filter((purchase) => purchase.isUsed)
                            .map((purchase) => (
                                <li key={purchase.idClientService}>
                                    <p><strong>Nazwa:</strong> {purchase.service.serviceName}</p>
                                    <p><strong>Data zakupu:</strong> {new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                                    <p><strong>Ilość:</strong> {purchase.quantity}</p>
                                    <p><strong>Status:</strong> Zrealizowane</p>
                                    <p><strong>Uwagi:</strong> {purchase.notes}</p>
                                </li>
                            ))}
                    </ul>
                </>
            )}
        </div>
    );

};

export default PurchaseHistory;