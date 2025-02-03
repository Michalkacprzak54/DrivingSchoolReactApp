import { useState, useEffect } from 'react';
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";

const AddInstructorToLecture = ({ eventId, onClose, onInstructorAssigned }) => {
    const [instructors, setInstructors] = useState([]);
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentEvent, setCurrentEvent] = useState(null);

    const fetchInstructorsAndSchedules = async () => {
        setLoading(true);
        setError(null);
        try {
            const [instructorRes, theoryRes, practiceRes] = await Promise.all([
                createAPIEndpoint(ENDPOINTS.INSTRUCTOR).fetchAll(),
                createAPIEndpoint(ENDPOINTS.THEORYSCHEDULE).fetchAll(),
                createAPIEndpoint(ENDPOINTS.PRATICESCHEDULES).fetchAll()
            ]);

            const instructorsData = instructorRes.data;
            const theorySchedules = theoryRes.data;
            const practiceSchedules = practiceRes.data;

            const currentEventData = theorySchedules.find(event => event.idTheorySchedule === eventId);
            setCurrentEvent(currentEventData);

            const filteredInstructors = instructorsData.filter(instructor => {
                const hasConflict = [...theorySchedules, ...practiceSchedules].some(schedule => {
                    const startHour = schedule.startHour || schedule.startDate;
                    const endHour = schedule.endHour || schedule.endDate;

                    return (
                        schedule.idInstructor === instructor.idInstructor &&
                        schedule.date === currentEventData.date &&
                        ((startHour <= currentEventData.endHour && endHour >= currentEventData.startHour))
                    );
                });
                return !hasConflict;
            });

            setInstructors(filteredInstructors);
        } catch (error) {
            console.error("Błąd podczas pobierania danych:", error);
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
            const updatedEvent = {
                idTheorySchedule: currentEvent.idTheorySchedule, 
                idInsctructor: selectedInstructor                 
            };
            await createAPIEndpoint(ENDPOINTS.THEORYSCHEDULE).update(currentEvent.idTheorySchedule, updatedEvent);

            alert("Wykładowca został przypisany pomyślnie!");
            onInstructorAssigned();
            onClose();
        } catch (error) {
            console.error("Błąd podczas przypisywania wykładowcy:", error);
            alert("Wystąpił błąd. Spróbuj ponownie.");
        }
    };

    useEffect(() => {
        fetchInstructorsAndSchedules();
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
                            {instructors.length > 0 ? (
                                instructors.map((instructor) => (
                                    <li
                                        key={instructor.idInstructor}
                                        className={`list-group-item ${selectedInstructor === instructor.idInstructor ? 'active' : ''}`}
                                        onClick={() => setSelectedInstructor(instructor.idInstructor)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {instructor.instructorFirstName} {instructor.instructorLastName}
                                    </li>
                                ))
                            ) : (
                                <p>Brak dostępnych wykładowców na ten termin.</p>
                            )}
                        </ul>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Anuluj</button>
                        <button type="button" className="btn btn-primary" onClick={assignInstructor} disabled={!selectedInstructor}>Zatwierdź</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddInstructorToLecture;
