import { useEffect, useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";
import { getCookie } from '../utils/cookieUtils';
import { useNavigate } from "react-router-dom";
import CenteredSpinner from '../components/centeredSpinner';

const PurchaseData = ({ serviceType, title }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const clientId = getCookie("userId");

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await createAPIEndpoint(ENDPOINTS.CLIENT_SERVICE).fetchById(clientId);
                const filteredItems = response.data
                    .filter((purchase) => purchase.service.serviceType === serviceType)
                    .sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)); // Sortowanie malejące według daty
                setItems(filteredItems);
            } catch (err) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [clientId, serviceType]);

    const handleDetailsClick = (id) => {
        navigate(`/purchaseDetails/${id}`);
    };

    const orderedItems = items.filter((item) => item.status === "zamówiona");
    const inProgressItems = items.filter((item) => item.status === "w trakcie");
    const completedItems = items.filter((item) => item.status === "zakończona");

    if (loading) return <CenteredSpinner/>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">{title}</h2>

            {inProgressItems.length > 0 && (
                <div className="mb-4">
                    <h3>W trakcie realizacji</h3>
                    <ul className="list-group">
                        {inProgressItems.map((item) => (
                            <li key={item.idClientService} className="list-group-item">
                                <p><strong>Nazwa:</strong> {item.service.serviceName + " - " + item.variantService.variant}</p>
                                <p><strong>Data zakupu:</strong> {new Date(item.purchaseDate).toLocaleDateString()}</p>
                                <p><strong>Ilość:</strong> {item.quantity}</p>
                                <p><strong>Całkowita cena:</strong> {(item.variantService.price * item.quantity).toFixed(2)} PLN</p>
                                <p><strong>Status:</strong> W trakcie realizacji</p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleDetailsClick(item.idClientService)}
                                >
                                    Szczegóły
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="mb-4">
                <h3>Zamówione</h3>
                <ul className="list-group">
                    {orderedItems.map((item) => (
                        <li key={item.idClientService} className="list-group-item">
                            <p><strong>Nazwa:</strong> {item.service.serviceName + " - " + item.variantService.variant}</p>
                            <p><strong>Data zakupu:</strong> {new Date(item.purchaseDate).toLocaleDateString()}</p>
                            <p><strong>Ilość:</strong> {item.quantity}</p>
                            <p><strong>Całkowita cena:</strong> {(item.variantService.price * item.quantity).toFixed(2)} PLN</p>
                            <p><strong>Status:</strong> Zamówione</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => handleDetailsClick(item.idClientService)}
                            >
                                Szczegóły
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {completedItems.length > 0 && (
                <div className="mb-4">
                    <h3>Zrealizowane</h3>
                    <ul className="list-group">
                        {completedItems.map((item) => (
                            <li key={item.idClientService} className="list-group-item">
                                <p><strong>Nazwa:</strong> {item.service.serviceName + " - " + item.variantService.variant}</p>
                                <p><strong>Data zakupu:</strong> {new Date(item.purchaseDate).toLocaleDateString()}</p>
                                <p><strong>Ilość:</strong> {item.quantity}</p>
                                <p><strong>Całkowita cena:</strong> {(item.variantService.price * item.quantity).toFixed(2)} PLN</p>
                                <p><strong>Status:</strong> Zakończone</p>
                                <p><strong>Uwagi:</strong> {item.notes}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PurchaseData;
