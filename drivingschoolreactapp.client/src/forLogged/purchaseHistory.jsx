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
        if (!clientId) {
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


    const handleOnlineClick = (purchaseId) => {
        console.log(`Online button clicked for purchase ID: ${purchaseId}`);
    };

    // Funkcja obsługująca kliknięcie przycisku "kontakt"
    const handleContactClick = (purchaseId) => {
        navigate("/contact");
        console.log(`Contact button clicked for purchase ID: ${purchaseId}`);
    };
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Twoje zamówienia</h2>

            <h3>W trakcie realizacji</h3>
            <ul>
                {purchases
                    .filter((purchase) => purchase.status === "zamówiona")
                    .map((purchase) => (
                        <li key={purchase.idClientService}>
                            <p><strong>Nazwa:</strong> {purchase.service.serviceName}</p>
                            <p><strong>Data zakupu:</strong> {new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                            <p><strong>Ilość:</strong> {purchase.quantity}</p>
                            <p><strong>Status:</strong> {purchase.status}</p>
                            <p><strong>Uwagi:</strong> {purchase.notes}</p>

   
                            <button onClick={() => handleOnlineClick(purchase.idClientService)}>Zapis online</button>
                            <button onClick={() => handleContactClick(purchase.idClientService)}>Zapis telefonicznie</button>
                        </li>
                    ))}
            </ul>

            {purchases.some((purchase) => purchase.status !== "zamówiona") && (
                <>
                    <h3>Zrealizowane</h3>
                    <ul>
                        {purchases
                            .filter((purchase) => purchase.status !== "zamówiona")
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