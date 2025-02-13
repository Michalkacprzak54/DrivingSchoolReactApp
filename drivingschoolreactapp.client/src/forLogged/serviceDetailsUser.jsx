import { useEffect, useState } from "react";
import { createAPIEndpoint, ENDPOINTS } from "../api/index";
import { useNavigate, useParams } from "react-router-dom";
import { getCookie } from "../utils/cookieUtils";
import 'bootstrap/dist/css/bootstrap.min.css';
import CenteredSpinner from "../components/centeredSpinner";

const ServiceDetailsUser = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('active'); // Domyślnie zakładka aktywnych jazd
    const navigate = useNavigate();
    const { purchaseId } = useParams();
    const clientId = getCookie("userId");

    useEffect(() => {
        if (!clientId) {
            navigate("/login");
            return;
        }
        fetchUserServices();
    }, [clientId]);

    const fetchUserServices = async () => {
        try {
            const response = await createAPIEndpoint(ENDPOINTS.SERVICESCHEDULE + "/byClientServiceId").fetchById(purchaseId);
            setServices(response.data);
        } catch (err) {
            setError(err.message || "Błąd podczas pobierania usług.");
        } finally {
            setLoading(false);
        }
    };

    const cancelLesson = async (idServiceSchedule) => {
        try {
            await createAPIEndpoint(ENDPOINTS.SERVICESCHEDULE).delete(idServiceSchedule);
            setServices(prev => prev.filter(service => service.idServiceSchedule !== idServiceSchedule));
            alert("Jazda została anulowana.");
        } catch (error) {
            setError("Błąd anulowania jazdy. Spróbuj ponownie później.");
        }
    };

    if (loading) {
        return <CenteredSpinner />;
    }

    

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
            <h1 className="text-center mb-5 fw-bold">Szczegóły Twoich Usług</h1>

            {error && (
                <div className="container my-4 p-3 text-center text-danger bg-light border border-danger rounded w-75">
                    <h4>Błąd: {error}</h4>
                </div>
            )}

            {/* Zakładki dla aktywnych i odbytych jazd */}
            <ul className="nav nav-tabs fs-4 w-75">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'active' ? 'active' : ''}`}
                        onClick={() => setActiveTab('active')}
                    >
                        Aktywne jazdy
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'completed' ? 'active' : ''}`}
                        onClick={() => setActiveTab('completed')}
                    >
                        Odbyte jazdy
                    </button>
                </li>
            </ul>

            <div className="tab-content mt-5 w-75">
                {/* Aktywne jazdy */}
                {activeTab === 'active' && (
                    <div>
                        {services.filter(service => service.idStatus === 1).length > 0 ? (
                            <ul className="list-group">
                                {services.filter(service => service.idStatus === 1).map((service) => {
                                    const schedule = service.praticeSchedule;
                                    return (
                                        <li key={service.idServiceSchedule} className="list-group-item p-4 shadow-lg rounded-lg mb-4">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h3 className="mb-3 text-primary">Jazda praktyczna</h3>
                                                <span className="badge bg-warning fs-5 p-2">Oczekuje</span>
                                            </div>
                                            <p className="fs-5"><strong>Data rezerwacji:</strong> {new Date(service.reservationDate).toLocaleString()}</p>
                                            <p className="fs-5"><strong>Data jazdy:</strong> {schedule.date} ({schedule.dayName})</p>
                                            <p className="fs-5"><strong>Godzina:</strong> {schedule.startDate} - {schedule.endDate}</p>
                                            <p className="fs-5"><strong>Instruktor:</strong> {schedule.instructor.instructorFirstName} {schedule.instructor.instructorLastName}</p>
                                            <button className="btn btn-danger btn-lg mt-3" onClick={() => cancelLesson(service.idServiceSchedule)}>Anuluj jazdę</button>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="text-center fs-4 text-muted">Brak aktywnych jazd.</p>
                        )}
                    </div>
                )}

                {/* Odbyte jazdy */}
                {activeTab === 'completed' && (
                    <div>
                        {services.filter(service => service.idStatus === 3).length > 0 ? (
                            <ul className="list-group">
                                {services.filter(service => service.idStatus === 3).map((service) => {
                                    const schedule = service.praticeSchedule;
                                    return (
                                        <li key={service.idServiceSchedule} className="list-group-item p-4 shadow-lg rounded-lg mb-4">
                                            <h3 className="mb-3 text-success">Odbyta jazda</h3>
                                            <p className="fs-5"><strong>Data rezerwacji:</strong> {new Date(service.reservationDate).toLocaleString()}</p>
                                            <p className="fs-5"><strong>Data jazdy:</strong> {schedule.date} ({schedule.dayName})</p>
                                            <p className="fs-5"><strong>Godzina:</strong> {schedule.startDate} - {schedule.endDate}</p>
                                            <p className="fs-5"><strong>Instruktor:</strong> {schedule.instructor.instructorFirstName} {schedule.instructor.instructorLastName}</p>
                                            <span className="badge bg-success fs-5 p-2">Zakończona</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="text-center fs-4 text-muted">Brak odbytych jazd.</p>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-5">
                <button className="btn btn-secondary btn-lg" onClick={() => navigate(-1)}>Powrót</button>
            </div>
        </div>
    );


};

export default ServiceDetailsUser;
