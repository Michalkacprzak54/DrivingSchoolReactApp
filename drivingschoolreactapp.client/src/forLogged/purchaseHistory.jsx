import { useState } from 'react';
import PurchaseData from './PurchaseData'; // Zakładając, że PurchaseData jest w tym samym folderze

const PurchaseHistory = () => {
    const [filter, setFilter] = useState("all");

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Twoje zamówienia</h2>

            <div className="mb-4">
                <h3>Filtrowanie</h3>
                <div className="btn-group" role="group">
                    <button
                        className={`btn ${filter === "all" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setFilter("all")}
                    >
                        Wszystkie
                    </button>

                    <button
                        className={`btn ${filter === "course" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setFilter("course")}
                    >
                        Kursy
                    </button>
                    <button
                        className={`btn ${filter === "service" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setFilter("service")}
                    >
                        Usługi
                    </button>
                </div>
            </div>

            {/* Renderowanie komponentu PurchaseData dla różnych typów */}
            {filter === "all" || filter === "course" ? (
                <PurchaseData serviceType="Kurs" title="Twoje kursy" />
            ) : null}

            {filter === "all" || filter === "service" ? (
                <PurchaseData serviceType="Usługa" title="Twoje usługi" />
            ) : null}
        </div>
    );
};

export default PurchaseHistory;
