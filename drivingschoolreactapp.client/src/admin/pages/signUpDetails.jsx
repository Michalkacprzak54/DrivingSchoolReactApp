import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";
import "bootstrap/dist/css/bootstrap.min.css";
import CenteredSpinner from "../../components/centeredSpinner";
import { Modal, Button } from "react-bootstrap";
import regexPatterns from "../../utils/regexPatterns";
import { useNavigate } from "react-router-dom";

function SignUpDetails() {
    const { idClient, isAdult } = useParams();
    const isAdultBool = isAdult === "true";
    const [clientServices, setClientServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [pesel, setPesel] = useState("");
    const [pkk, setPkk] = useState("");
    const [parentalConsent, setParentalConsent] = useState(false);
    const [medicalCheck, setMedicalCheck] = useState(false);
    const [notes, setNotes] = useState("");
    const [idVariantService, setIdVariantService] = useState(null);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [purchaseDate, setPurchaseDate] = useState("");
    const navigate = useNavigate();

    useEffect(() => {

        const fetchClientServices = async () => {
            try {
                const response = await createAPIEndpoint(ENDPOINTS.CLIENT_SERVICE).fetchById(idClient);
                if (response.data) {
                    const filteredServices = response.data.filter(
                        service => service.service.serviceType === "Kurs" && service.status.toLowerCase() === "zamówiona"
                    );
                    setClientServices(filteredServices);
                } else {
                    setClientServices([]);
                }
            } catch (err) {
                console.error(err);
                setError("Błąd podczas pobierania danych usług klienta.");
            } finally {
                setLoading(false);
            }
        };

        fetchClientServices();
    }, [idClient]);

    const handleStartCourse = (idVariant, purchaseDate) => {
        setIdVariantService(idVariant);
        setPurchaseDate(purchaseDate);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowModal(false);
        setError(null);

        if (!regexPatterns.pesel.test(pesel)) {
            setError("PESEL musi składać się z dokładnie 11 cyfr.");
            return;
        }

        if (!regexPatterns.pkk.test(pkk)) {
            setError("PKK musi składać się z dokładnie 26 znaków.");
            return;
        }

        const traineeCourseData = {
            client: {
                idClient: idClient
            },
            varinatService: {
                idVariantService: idVariantService
            },
            startDate: startDate,
            endDate: null,
            status: {
                idStatus: 2
            },
            purchaseDate: purchaseDate,
            pesel: pesel,
            pkk: pkk,
            medicalCheck: medicalCheck,
            parentalConsent: !isAdult ? parentalConsent : null,
            notes: notes || null

        };
        /*console.log('Sending data:', traineeCourseData);*/


        try {

            const response = await createAPIEndpoint(ENDPOINTS.TRAINEECOURSE).create(traineeCourseData);

            if (response.status === 200) {
                alert('Kurs rozpoczęty pomyślnie!');
                setPesel('');
                setPkk('');
                setMedicalCheck(false);
                setParentalConsent(false);
                setNotes('');
                //navigate('/');
            } else {
                alert(`Wystąpił błąd: ${response.data.message || 'Spróbuj ponownie.'}`);
            }
        } catch (error) {
            if (error.response) {

                alert(`Błąd serwera: ${error.response.data.message || 'Spróbuj ponownie.'}`);
            } else if (error.request) {

                alert('Brak odpowiedzi serwera. Sprawdź swoje połączenie.');
            } else {

                alert(`Wystąpił błąd: ${error.message}`);
            }
        }


    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Szczegóły Usług Klienta</h2>

            {loading && <CenteredSpinner />}
            {error && <p className="alert alert-danger">{error}</p>}
            {!loading && clientServices.length === 0 && <p className="text-center">Brak dostępnych kursów.</p>}

            {!loading && clientServices.length > 0 && (
                <>
                    <table className="table table-hover table-bordered">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Usługa</th>
                                <th>Typ</th>
                                <th>Miejsce</th>
                                <th>Wariant</th>
                                <th>Teoria</th>
                                <th>Praktyka</th>
                                <th>Cena</th>
                                <th>Status</th>
                                <th>Data Zakupu</th>
                                <th>Akcje</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientServices.map((service, index) => (
                                <tr key={service.idClientService}>
                                    <td>{index + 1}</td>
                                    <td>{service.service.serviceName}</td>
                                    <td>{service.service.serviceType}</td>
                                    <td>{service.service.servicePlace}</td>
                                    <td>{service.variantService.variant}</td>
                                    <td>{service.variantService.numberTheoryHours}h</td>
                                    <td>{service.variantService.numberPraticeHours}h</td>
                                    <td>{service.variantService.price} zł</td>
                                    <td>{service.status}</td>
                                    <td>{new Date(service.purchaseDate).toLocaleDateString()}</td>
                                    <td>
                                        <Button
                                            variant="primary"
                                            onClick={() => handleStartCourse(service.variantService.idVariantService, service.purchaseDate)}
                                        >
                                            Rozpocznij Kurs
                                        </Button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Rozpocznij Kurs</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="pesel" className="form-label">PESEL:</label>
                            <input type="text" className="form-control" id="pesel" value={pesel} onChange={(e) => setPesel(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="pkk" className="form-label">PKK:</label>
                            <input type="text" className="form-control" id="pkk" value={pkk} onChange={(e) => setPkk(e.target.value)} required />
                        </div>
                        {!isAdultBool && (
                            <div className="mb-3 form-check">
                                <input type="checkbox" className="form-check-input" id="parentalConsent" checked={parentalConsent} onChange={(e) => setParentalConsent(e.target.checked)} required />
                                <label htmlFor="parentalConsent" className="form-check-label">Zgoda rodzica</label>
                            </div>
                        )}
                        <div className="mb-3 form-check">
                            <input type="checkbox" className="form-check-input" id="medicalCheck" checked={medicalCheck} onChange={(e) => setMedicalCheck(e.target.checked)} />
                            <label htmlFor="medicalCheck" className="form-check-label">Badania lekarskie</label>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="notes" className="form-label">Uwagi:</label>
                            <textarea id="notes" className="form-control" value={notes} onChange={(e) => setNotes(e.target.value)} />
                        </div>
                        <Button type="submit" variant="primary">Rozpocznij Kurs</Button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default SignUpDetails;
