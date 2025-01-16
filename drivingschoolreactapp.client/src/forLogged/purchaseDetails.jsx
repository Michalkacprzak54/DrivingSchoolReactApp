import { useEffect, useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";
import { useNavigate, useParams } from "react-router-dom";
import { getCookie } from '../utils/cookieUtils';

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
        navigate(`/serviceSchedule/${purchaseId}`);
    };
    const handleStartCourseClick = (purchaseDate, idVariantService) => {
        navigate(`/startCourse/${purchaseDate}/${idVariantService}`);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Szczegóły zakupu</h2>

            {purchase ? (
                <div className="card p-4 shadow">
                    <h4 className="mb-3">
                        <strong>Nazwa usługi:</strong> {purchase.service.serviceName}
                    </h4>
                    <p><strong>Data zakupu:</strong> {new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                    <p><strong>Wariant:</strong> {purchase.variantService.variant}</p>
                    <p><strong>Godziny teorii:</strong> {purchase.variantService.numberTheoryHours}</p>
                    <p><strong>Godziny praktyki:</strong> {purchase.variantService.numberPraticeHours}</p>
                    <p><strong>Ilość wykorzystanych:</strong> {purchase.howManyUsed} <strong>z </strong>  {purchase.quantity}</p>
                    <p><strong>Ilość:</strong> {purchase.quantity}</p>
                    <p>
                        <strong>Status:</strong>
                        <span className={`badge ${purchase.status === "w trakcie" ? "bg-info" : purchase.status === "zamówiona" ? "bg-warning" : "bg-success"} ms-2`}>
                            {purchase.status === "w trakcie"
                                ? "W trakcie realizacji"
                                : purchase.status === "zamówiona"
                                    ? "Zamówiona"
                                    : "Zakończona"}
                        </span>
                    </p>

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
                                            <button className="btn btn-success" onClick={() => handleStartCourseClick(purchase.purchaseDate, purchase.variantService.idVariantService)}>Rozpocznij kurs</button>
                                    </>
                                ) : null}
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <p className="text-center text-muted">Nie znaleziono szczegółów zakupu.</p>
            )}
        </div>
    );
};
export default PurchaseDetails;
