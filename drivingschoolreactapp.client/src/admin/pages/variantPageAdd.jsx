import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createAPIEndpoint, ENDPOINTS } from "../../api/index";

function VariantPageAdd() {
    const { IdService } = useParams(); // Pobranie ID usługi z URL
    const navigate = useNavigate();

    const [variant, setVariant] = useState({
        idService: IdService, // Po prostu przekazujemy wartość z useParams
        variant: "",
        numberTheoryHours: 0,
        numberPraticeHours: 0,
        price: 0,
        theoryDone: true,
        isPublished: false,
    });

    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const updatedValue = type === "checkbox" ? checked : value;

        setVariant((prev) => {
            const newState = {
                ...prev,
                [name]: type === "number" ? Number(updatedValue) : updatedValue,
            };

            // Automatycznie ustaw theoryDone = false, jeśli numberPraticeHours > 0
            if (name === "numberPraticeHours" && Number(updatedValue) > 0) {
                newState.theoryDone = false;
            }

            return newState;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            idService: variant.idService,
            variant: variant.variant,
            numberTheoryHours: parseInt(variant.numberTheoryHours, 10) || 0,
            numberPraticeHours: parseInt(variant.numberPraticeHours, 10) || 0,
            price: parseFloat(variant.price) || 0,
            theoryDone: variant.theoryDone,
            isPublished: variant.isPublished,
        };

        try {
            await createAPIEndpoint(ENDPOINTS.VARIANTSERVICE).create(payload);
            navigate(`/servicePageDetails/${IdService}`);
        } catch (err) {
            console.error("Błąd dodawania wariantu:", err);
            setError("Wystąpił błąd. Spróbuj ponownie.");
        }
    };

    return (
        <div className="container mt-4">
            <h2>Dodaj nowy wariant</h2>

            {error && <p className="alert alert-danger">{error}</p>}

            <form onSubmit={handleSubmit} className="card p-4 shadow">
                <div className="mb-3">
                    <label className="form-label">Nazwa wariantu</label>
                    <input
                        type="text"
                        className="form-control"
                        name="variant"
                        value={variant.variant}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Liczba godzin teorii</label>
                    <input
                        type="number"
                        className="form-control"
                        name="numberTheoryHours"
                        value={variant.numberTheoryHours}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Liczba godzin praktyki</label>
                    <input
                        type="number"
                        className="form-control"
                        name="numberPraticeHours"
                        value={variant.numberPraticeHours}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Cena (zł)</label>
                    <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={variant.price}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-check mb-3">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="isPublished"
                        name="isPublished"
                        checked={variant.isPublished}
                        onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="isPublished">
                        Opublikowany
                    </label>
                </div>

                <div className="d-flex justify-content-between">
                    <button type="submit" className="btn btn-success">Dodaj wariant</button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Anuluj</button>
                </div>
            </form>
        </div>
    );
}

export default VariantPageAdd;
