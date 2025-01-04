import { useEffect, useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../api/index";
import { getCookie } from '../cookieUtils';
import { useNavigate } from "react-router-dom";

const MyCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const clientId = getCookie("userId");

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await createAPIEndpoint(ENDPOINTS.CLIENT_SERVICE).fetchById(clientId);
                // Filter only courses
                const courseData = response.data.filter((purchase) => purchase.service.serviceType === "Kurs");
                setCourses(courseData);
            } catch (err) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [clientId]);

    const handleDetailsClick = (courseId) => {
        navigate(`/purchaseDetails/${courseId}`);
    };

    const orderedCourses = courses.filter((course) => course.status === "zamówiona");
    const inProgressCourses = courses.filter((course) => course.status === "w trakcie");
    const completedCourses = courses.filter((course) => course.status === "zakończona");

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Twoje kursy</h2>

            {inProgressCourses.length > 0 && (
                <div className="mb-4">
                    <h3>W trakcie realizacji</h3>
                    <ul className="list-group">
                        {inProgressCourses.map((course) => (
                            <li key={course.idClientService} className="list-group-item">
                                <p><strong>Nazwa:</strong> {course.service.serviceName}</p>
                                <p><strong>Data zakupu:</strong> {new Date(course.purchaseDate).toLocaleDateString()}</p>
                                <p><strong>Ilość:</strong> {course.quantity}</p>
                                <p><strong>Status:</strong> W trakcie realizacji</p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleDetailsClick(course.idClientService)}
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
                    {orderedCourses.map((course) => (
                        <li key={course.idClientService} className="list-group-item">
                            <p><strong>Nazwa:</strong> {course.service.serviceName}</p>
                            <p><strong>Data zakupu:</strong> {new Date(course.purchaseDate).toLocaleDateString()}</p>
                            <p><strong>Ilość:</strong> {course.quantity}</p>
                            <p><strong>Status:</strong> Zamówione</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => handleDetailsClick(course.idClientService)}
                            >
                                Szczegóły
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            

            {completedCourses.length > 0 && (
                <div className="mb-4">
                    <h3>Zrealizowane</h3>
                    <ul className="list-group">
                        {completedCourses.map((course) => (
                            <li key={course.idClientService} className="list-group-item">
                                <p><strong>Nazwa:</strong> {course.service.serviceName}</p>
                                <p><strong>Data zakupu:</strong> {new Date(course.purchaseDate).toLocaleDateString()}</p>
                                <p><strong>Ilość:</strong> {course.quantity}</p>
                                <p><strong>Status:</strong> Zakończone</p>
                                <p><strong>Uwagi:</strong> {course.notes}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MyCourses;
