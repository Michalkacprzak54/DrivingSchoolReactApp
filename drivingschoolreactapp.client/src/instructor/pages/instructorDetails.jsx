import { useEffect, useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";
import { getCookie } from '../../cookieUtils';

const InstructorDetails = () => {
    const [instructorData, setInstructorData] = useState({
        instructorFirstName: '',
        instructorLastName: '',
        instructorEmail: '',
        instructorPhoneNumber: '',
        instructorPesel: '',
        instructorStreet: '',
        instructorHouseNumber: '',
        instructorFlatNumber: '',
        instructorCity: '',
        instructorZipCode: '',
        instructorPractice: false,
        instructorTheory: false
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const idInstructor = getCookie('instructorId');

    useEffect(() => {
        const fetchInstructorData = async () => {
            try {
                const response = await createAPIEndpoint(ENDPOINTS.INSTRUCTOR_DATA).fetchById(idInstructor);
                const data = response.data;

                setInstructorData({
                    instructorFirstName: data.instructor.instructorFirstName,
                    instructorLastName: data.instructor.instructorLastName,
                    instructorEmail: data.instructor.instructorEmail,
                    instructorPhoneNumber: data.instructor.instructorPhoneNumber,
                    instructorPesel: data.instructorPesel,
                    instructorStreet: data.instructorStreet,
                    instructorHouseNumber: data.instructorHouseNumber,
                    instructorFlatNumber: data.instructorFlatNumber,
                    instructorCity: data.city.cityName,
                    instructorZipCode: data.zipCode.zipCodeNumber,
                    instructorPractice: data.instructor.instructorPratice,
                    instructorTheory: data.instructor.instructorTheory
                });
            } catch (err) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchInstructorData();
    }, [idInstructor]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Moje dane</h2>
            <div className="mt-4">
                <div className="mb-3">
                    <label className="form-label">Imię</label>
                    <p>{instructorData.instructorFirstName}</p>
                </div>
                <div className="mb-3">
                    <label className="form-label">Nazwisko</label>
                    <p>{instructorData.instructorLastName}</p>
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <p>{instructorData.instructorEmail}</p>
                </div>
                <div className="mb-3">
                    <label className="form-label">Numer telefonu</label>
                    <p>{instructorData.instructorPhoneNumber}</p>
                </div>
                <div className="mb-3">
                    <label className="form-label">PESEL</label>
                    <p>{instructorData.instructorPesel}</p>
                </div>
                <div className="mb-3">
                    <label className="form-label">Ulica</label>
                    <p>{instructorData.instructorStreet}</p>
                </div>
                <div className="mb-3">
                    <label className="form-label">Numer domu</label>
                    <p>{instructorData.instructorHouseNumber}</p>
                </div>
                <div className="mb-3">
                    <label className="form-label">Numer mieszkania</label>
                    <p>{instructorData.instructorFlatNumber}</p>
                </div>
                <div className="mb-3">
                    <label className="form-label">Miasto</label>
                    <p>{instructorData.instructorCity}</p>
                </div>
                <div className="mb-3">
                    <label className="form-label">Kod pocztowy</label>
                    <p>{instructorData.instructorZipCode}</p>
                </div>
                <div className="mb-3">
                    <label className="form-label">Praktyka</label>
                    <p>{instructorData.instructorPractice ? 'Tak' : 'Nie'}</p>
                </div>
                <div className="mb-3">
                    <label className="form-label">Teoria</label>
                    <p>{instructorData.instructorTheory ? 'Tak' : 'Nie'}</p>
                </div>
            </div>
        </div>
    );
};

export default InstructorDetails;
