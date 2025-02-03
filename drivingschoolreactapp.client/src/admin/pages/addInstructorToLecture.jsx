import { useState, useEffect } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";

const AddInstructorToLecture = ({ eventId, onClose, onInstructorAssigned }) => {
    const [instructors, setInstructors] = useState([]);
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchInstructors = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await createAPIEndpoint(ENDPOINTS.INSTRUCTOR).fetchAll();
            setInstructors(response.data);
        } catch (error) {
            console.error("Błąd podczas pobierania listy wykładowców:", error);
            setError("Błąd pobierania danych. Spróbuj ponownie później.");
        } finally {
            setLoading(false);
        }
    };

    const assignInstructor = async () => {
        if (!selectedInstructor) {
            alert("Proszę wybrać wykładowcę.");
            return;
        }

        try {
            await createAPIEndpoint(ENDPOINTS.THEORYSCHEDULE + `/${eventId}/assign-instructor`).update({ instructorId: selectedInstructor });
            alert("Wykładowca został przypisany pomyślnie!");
            onInstructorAssigned();
            onClose();
        } catch (error) {
            console.error("Błąd podczas przypisywania wykładowcy:", error);
            alert("Wystąpił błąd. Spróbuj ponownie.");
        }
    };

    useEffect(() => {
        fetchInstructors();
    }, []);

    if (loading) return <div>Ładowanie wykładowców...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Wybierz Wykładowcę</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <ul className="list-group">
                            {instructors.map((instructor) => (
                                <li
                                    key={instructor.id}
                                    className={`list-group-item ${selectedInstructor === instructor.idInstructor ? 'active' : ''}`}
                                    onClick={() => setSelectedInstructor(instructor.idInstructor)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {instructor.instructorFirstName} {instructor.instructorLastName}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Anuluj</button>
                        <button type="button" className="btn btn-primary" onClick={assignInstructor}>Zatwierdź</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddInstructorToLecture;