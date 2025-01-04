import { useEffect, useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";
import { useNavigate, useParams } from "react-router-dom";
import { getCookie } from '../cookieUtils';

const PurchaseDetails = () => {
    const [purchase, setPurchase] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { purchaseId } = useParams();
    const clientId = getCookie("userId");

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
    const handleStartCourseClick = (purchaseDate, idService) => {
        navigate(`/startCourse/${purchaseDate}/${idService}`);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Szczegóły zakupu</h2>

            {purchase ? (
                <div className="card p-4">
                    <p><strong>Nazwa usługi:</strong> {purchase.service.serviceName}</p>
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
                    <p>
                        <strong>Status:</strong>
                        {purchase.status === "w trakcie"
                            ? "W trakcie realizacji"
                            : purchase.status === "zamówiona"
                                ? "Zamówiona"
                                : purchase.status === "zakończona"
                                    ? "Zakończona"
                                    : "Nieznany status"}
                    </p>
                    <p><strong>Ile zostało:</strong> {purchase.quantity - purchase.howManyUsed}</p>

                    {purchase.status === "w trakcie" && purchase.service.serviceType === "Kurs" && (
                        <button
                            className="btn btn-info mt-3"
                            onClick={() => navigate(`/courseDetails/${clientId}`)}
                        >
                            Szczegóły kursu
                        </button>
                    )}

                    <div className="d-flex justify-content-start gap-3 mt-3">
                        {!purchase.isUsed && (
                            <>
                                {purchase.service.serviceType === "Usługa" ? (
                                    <>
                                        <button className="btn btn-primary" onClick={() => handleContactClick()}>Zapisy telefoniczne</button>
                                        <button className="btn btn-secondary" onClick={() => handleScheduleClick()}>Zobacz harmonogram</button>
                                    </>
                                ) : purchase.service.serviceType === "Kurs" ? (
                                    <>
                                        <button className="btn btn-primary" onClick={() => handleContactClick()}>Zapisy telefoniczne</button>
                                        <button className="btn btn-success" onClick={() => handleStartCourseClick(purchase.purchaseDate, purchase.service.idService)}>Rozpocznij kurs</button>
                                    </>
                                ) : null}
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <p>Nie znaleziono szczegółów zakupu.</p>
            )}
        </div>
    );
};

export default PurchaseDetails;
