import { useEffect, useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";
import { getCookie } from '../cookieUtils';
import { useNavigate } from "react-router-dom";

const PurchaseHistory = () => {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("all");
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

    const filteredPurchases = purchases.filter((purchase) => {
        if (filter == 'active') return !purchase.isUsed;
        if (filter == 'course') return purchase.service.serviceType === 'Kurs';
        if (filter == 'service') return purchase.service.serviceType === 'Usługa';
        return true;
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Twoje zamówienia</h2>

            <div className="mb-4">
                <h3>Filtrowanie</h3>
                <div className="btn-group" role="group">
                    <button
                        className={`btn ${filter === "all" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setFilter("all")}
                    >
                        Wszystkie
                    </button>
                    <button
                        className={`btn ${filter === "active" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setFilter("active")}
                    >
                        Aktywne
                    </button>
                    <button
                        className={`btn ${filter === "course" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setFilter("course")}
                    >
                        Kursy
                    </button>
                    <button
                        className={`btn ${filter === "service" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setFilter("service")}
                    >
                        Usługi
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <h3>W trakcie realizacji</h3>
                <ul className="list-group">
                    {filteredPurchases
                        .filter((purchase) => !purchase.isUsed)
                        .map((purchase) => (
                            <li key={purchase.idClientService} className="list-group-item">
                                <p><strong>Nazwa:</strong> {purchase.service.serviceName}</p>
                                <p><strong>Data zakupu:</strong> {new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                                <p><strong>Ilość:</strong> {purchase.quantity}</p>
                                <p><strong>Status:</strong> {purchase.status}</p>
                                <p>Opcje:
                                    {purchase.onlineTheory && ' Teoria zdalnie'}
                                    {purchase.stationaryTheory && ' Teoria stacjonarnie'}
                                    {purchase.theoryCompleted && ' Teoria zaliczona'}
                                    {purchase.basicPractice && ', Podstawowa Praktyka'}
                                    {purchase.extendedPractice && ', Rozszerzona Praktyka'}
                                    {purchase.manual && ' Manualna skrzynia biegów'}
                                    {purchase.automatic && ' Automatyczna skrzynia biegów'}
                                </p>

                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleDetailsClick(purchase.idClientService)}
                                >
                                    Zapisz się
                                </button>
                            </li>
                        ))}
                </ul>
            </div>

            {filteredPurchases.some((purchase) => purchase.isUsed) && (
                <div className="mb-4">
                    <h3>Zrealizowane</h3>
                    <ul className="list-group">
                        {filteredPurchases
                            .filter((purchase) => purchase.isUsed)
                            .map((purchase) => (
                                <li key={purchase.idClientService} className="list-group-item">
                                    <p><strong>Nazwa:</strong> {purchase.service.serviceName}</p>
                                    <p><strong>Data zakupu:</strong> {new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                                    <p><strong>Ilość:</strong> {purchase.quantity}</p>
                                    <p><strong>Status:</strong> Zrealizowane</p>
                                    <p><strong>Uwagi:</strong> {purchase.notes}</p>
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PurchaseHistory;
