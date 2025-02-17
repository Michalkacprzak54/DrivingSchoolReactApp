import { useEffect, useState } from "react";
import { createAPIEndpoint, ENDPOINTS } from "../api/index";
import { getCookie } from "../utils/cookieUtils";
import { useNavigate } from "react-router-dom";
import CenteredSpinner from "../components/centeredSpinner";

const MyCourses = () => {
    const [traineeCourses, setTraineeCourses] = useState([]);
    const [purchaseItems, setPurchaseItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const clientId = getCookie("userId");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Pobieranie kursów użytkownika z TraineeCourse
                const traineeResponse = await createAPIEndpoint(ENDPOINTS.TRAINEECOURSE).fetchById(clientId);
                setTraineeCourses(traineeResponse.data || []);

                // Pobieranie zakupionych kursów z ClientService
                const purchaseResponse = await createAPIEndpoint(ENDPOINTS.CLIENT_SERVICE).fetchById(clientId);
                const filteredItems = (purchaseResponse.data || [])
                    .filter((purchase) => purchase.service.serviceType === "Kurs")
                    .sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));

                setPurchaseItems(filteredItems);
            } catch (err) {
                setError(err.message || "Wystąpił błąd podczas pobierania danych");
            } finally {
                setLoading(false);
            }
        };

        if (clientId) {
            fetchData();
        }
    }, [clientId]);

    const handleDetailsClick = (idCourseDetails) => {
        navigate(`/courseDetails/${idCourseDetails}`);
    };

    // Filtrowanie kursów w trakcie z ilością większą niż wykorzystana
    const filteredPurchaseItems = purchaseItems.filter(
        (item) => (item.status === "w trakcie" && (item.quantity - item.howManyUsed) > 1) || item.status === "zamówiona"
    );

    const handleContactClick = () => {
        navigate(`/contact`);
    };


    const handleStartCourseClick = (purchaseDate, idVariantService) => {
        navigate(`/startCourse/${purchaseDate}/${idVariantService}`);
    };


    if (loading) return <CenteredSpinner />;
    if (error) return <p className="text-danger">Błąd: {error}</p>;

    return (
        <div className="container my-5">
            <h2 className="text-center my-4">Moje Kursy</h2>

            {/* Sekcja dla kursów użytkownika */}
            {traineeCourses.length > 0 ? (
                <div className="mb-4">
                    <h3>Aktywne kursy</h3>
                    <ul className="list-group">
                        {traineeCourses.map((course) => (
                            <li key={course.idTraineeCourse} className="list-group-item">
                                <p><strong>Kurs:</strong> {course.service.serviceName}</p>
                                <p><strong>Data rozpoczęcia:</strong> {new Date(course.startDate).toLocaleDateString()}</p>
                                <p><strong>Postęp praktyki:</strong> {course.courseDetails.praticeHoursCount} / {course.varinatService.numberPraticeHours} godzin</p>
                                <p><strong>Postęp teorii:</strong> {course.courseDetails.theoryHoursCount} / {course.varinatService.numberTheoryHours} godzin</p>
                                <button
                                    className="btn btn-primary mt-2"
                                    onClick={() => handleDetailsClick(course.courseDetails.idCourseDetails)}
                                >
                                    Szczegóły
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Brak aktywnych kursów.</p>
            )}

            {/* Sekcja dla zakupionych kursów - tylko kursy w trakcie i quantity - howManyUsed > 1 */}
            <h2 className="text-center my-4">Zakupione kursy</h2>

            {filteredPurchaseItems.length > 0 ? (
                <div className="mb-4">
                    <h3>Kursy zamówione / w trakcie</h3>
                    <ul className="list-group">
                        {filteredPurchaseItems.map((purchase) => (
                            <li key={purchase.idClientService} className="list-group-item">
                                <p><strong>Nazwa:</strong> {`${purchase.service.serviceName} - ${purchase.variantService.variant}`}</p>
                                <p><strong>Data zakupu:</strong> {new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                                <p><strong>Ilość:</strong> {purchase.quantity}</p>
                                <p><strong>Wykorzystano:</strong> {purchase.howManyUsed}</p>
                                <p><strong>Pozostało:</strong> {purchase.quantity - purchase.howManyUsed}</p>

                                {/* Dodane przyciski dla kursów zamówionych i w trakcie */}
                                {purchase.service.serviceType === "Kurs" && (
                                    <>
                                        <button className="btn btn-primary me-2" onClick={() => handleContactClick()}>
                                            Zapisy telefoniczne
                                        </button>
                                        <button
                                            className="btn btn-success"
                                            onClick={() => handleStartCourseClick(purchase.purchaseDate, purchase.variantService.idVariantService)}
                                        >
                                            Rozpocznij kurs
                                        </button>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Brak zamówionych kursów spełniających warunki.</p>
            )}

        </div>
    );
};

export default MyCourses;
