import { useEffect, useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";
import { useNavigate, useParams } from "react-router-dom";

const PurchaseDetails = () => {
    const [purchase, setPurchase] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { purchaseId } = useParams();

    useEffect(() => {
        if (!purchaseId) {
            navigate("/purchaseHistory");
            return;
        }

        const fetchPurchaseDetails = async () => {
            try {
                const response = await createAPIEndpoint(ENDPOINTS.CLIENT_SERVICE + '/service').fetchById(purchaseId);
                setPurchase(response.data);
            } catch (err) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchPurchaseDetails();
    }, [purchaseId]);

    const handleContactClick = () => {
        navigate(`/contact`);
    };
    const handleScheduleClick = () => {
        navigate(`/praticeSchedule`);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Szczegóły zakupu</h2>
            {purchase ? (
                <div>
                    <p><strong>Nazwa usługi:</strong> {purchase.service.serviceName}</p>
                    <p><strong>Data zakupu:</strong> {new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                    <p><strong>Ilość:</strong> {purchase.quantity}</p>
                    <p><strong>Status:</strong> {purchase.status}</p>
                    <p><strong>Uwagi:</strong> {purchase.notes}</p>
                    <p><strong>Zrealizowano:</strong> {purchase.isUsed ? "Tak" : "Nie"}</p>
                    <p><strong>Ile zostało:</strong> {purchase.quantity - purchase.howManyUsed}</p>
                    {purchase.service.serviceType === "Usługa" ? (
                        <div>
                            <button onClick={() => handleContactClick()}>Zapisy telefoniczne</button>
                            <button onClick={() => handleScheduleClick()}>Zobacz harmonogram</button>
                        </div>
                    ) : purchase.serviceType === "Kurs" ? (
                            <div>
                                <button onClick={() => handleContactClick()}>Zapisy telefoniczne</button>
                            {/*<button onClick={() => handleCourseDetailsClick()}>Szczegóły kursu</button>*/}
                            {/*<button onClick={() => handleStartCourseClick()}>Rozpocznij kurs</button>*/}
                        </div>
                    ) : null}
                    
                </div>
            ) : (
                <p>Nie znaleziono szczegółów zakupu.</p>
            )}
        </div>
    );
};

export default PurchaseDetails;
