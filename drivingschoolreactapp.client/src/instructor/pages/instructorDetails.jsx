import { useEffect, useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";
import { getCookie } from '../../utils/cookieUtils';

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
        instructorTheory: false,
        entitlements: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const idInstructor = getCookie('instructorId');

    useEffect(() => {
        const fetchInstructorData = async () => {
            try {
                const instructorResponse = await createAPIEndpoint(ENDPOINTS.INSTRUCTOR_DATA).fetchById(idInstructor);
                const instructorData = instructorResponse.data;


                const entitlementsResponse = await createAPIEndpoint(ENDPOINTS.INSTRUCTOR_ENTITLEMENTS).fetchById(idInstructor);

                const entitlementsData = entitlementsResponse.data;

                setInstructorData({
                    instructorFirstName: instructorData.instructor.instructorFirstName,
                    instructorLastName: instructorData.instructor.instructorLastName,
                    instructorEmail: instructorData.instructor.instructorEmail,
                    instructorPhoneNumber: instructorData.instructor.instructorPhhoneNumber,
                    instructorPesel: instructorData.instructorPesel,
                    instructorBirthDay: instructorData.instructorBirthDay,
                    instructorStreet: instructorData.instructorStreet,
                    instructorHouseNumber: instructorData.instructorHouseNumber,
                    instructorFlatNumber: instructorData.instructorFlatNumber,
                    instructorCity: instructorData.city.cityName,
                    instructorZipCode: instructorData.zipCode.zipCodeNumber,
                    instructorPractice: instructorData.instructor.instructorPratice,
                    instructorTheory: instructorData.instructor.instructorTheory,
                    entitlements: entitlementsData 
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
            <div className="row row-cols-1 row-cols-md-2 g-4">
                <div className="col">
                    <div className="card h-100">
                        <div className="card-body">
                            <h5 className="card-title">Dane osobowe</h5>
                            <p><strong>Imię:</strong> {instructorData.instructorFirstName}</p>
                            <p><strong>Nazwisko:</strong> {instructorData.instructorLastName}</p>
                            <p><strong>Email:</strong> {instructorData.instructorEmail}</p>
                            <p><strong>Numer telefonu:</strong> {instructorData.instructorPhoneNumber}</p>
                            <p><strong>Data urodzenia:</strong> {instructorData.instructorBirthDay}</p>
                            <p><strong>PESEL:</strong> {instructorData.instructorPesel}</p>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card h-100">
                        <div className="card-body">
                            <h5 className="card-title">Adres</h5>
                            <p><strong>Ulica:</strong> {instructorData.instructorStreet}</p>
                            <p><strong>Numer domu:</strong> {instructorData.instructorHouseNumber}</p>
                            {instructorData.instructorFlatNumber && (
                                <p><strong>Numer mieszkania:</strong> {instructorData.instructorFlatNumber}</p>
                            )}
                            <p><strong>Miasto:</strong> {instructorData.instructorCity}</p>
                            <p><strong>Kod pocztowy:</strong> {instructorData.instructorZipCode}</p>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card h-100">
                        <div className="card-body">
                            <h5 className="card-title">Uprawnienia</h5>
                            <p><strong>Praktyka:</strong> {instructorData.instructorPractice ? 'Tak' : 'Nie'}</p>
                            <p><strong>Teoria:</strong> {instructorData.instructorTheory ? 'Tak' : 'Nie'}</p>

                            <h5 className="card-title mt-3">Szczegóły uprawnień</h5>
                            {instructorData.entitlements.length > 0 ? (
                                <ul>
                                    {instructorData.entitlements.map(entitlement => (
                                        <li key={entitlement.idInscrutorEntitlement}>
                                            <strong>Uprawnienie:</strong> Kat. {entitlement.entitlement.entitlementName},
                                            <strong> Data ważności:</strong> {entitlement.dateEntitlement}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Brak dodatkowych uprawnień</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default InstructorDetails;
