import React from "react";
import { FaCar, FaRoad, FaCheckCircle } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

export default function HomePage() {
    return (
        <div className="container text-center py-5">
            {/* Hero Section */}
            <div className="mb-5">
                <h1 className="display-4 fw-bold">Twoja Droga do Sukcesu na Drodze!</h1>
                <p className="lead text-muted">
                    Profesjonalne kursy prawa jazdy z doświadczonymi instruktorami.
                </p>
                <a href="/services" className="btn btn-primary btn-lg">
                    Zapisz się na kurs
                </a>
            </div>

            {/* About Section */}
            <div className="mb-5">
                <h2 className="fw-semibold">O naszej szkole</h2>
                <p className="text-muted">
                    Jesteśmy szkołą jazdy z wieloletnim doświadczeniem. Pomagamy kursantom zdobyć prawo jazdy w miłej i profesjonalnej atmosferze.
                </p>
            </div>

            {/* Course Offerings */}
            <div className="row text-center mb-5">
                <div className="col-md-4">
                    <div className="card p-4">
                        <FaCar className="display-4 text-primary mb-3" />
                        <h3 className="h5">Kurs podstawowy</h3>
                        <p className="text-muted">Pełne szkolenie teoretyczne i praktyczne.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card p-4">
                        <FaRoad className="display-4 text-success mb-3" />
                        <h3 className="h5">Jazdy doszkalające</h3>
                        <p className="text-muted">Dodatkowe godziny jazdy dla pewności na drodze.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card p-4">
                        <FaCheckCircle className="display-4 text-warning mb-3" />
                        <h3 className="h5">Indywidualne konsultacje</h3>
                        <p className="text-muted">Dostosowane lekcje dla lepszego przygotowania.</p>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-primary text-white p-5 rounded">
                <h2 className="fw-semibold">Gotowy na swoją jazdę?</h2>
                <p>Skontaktuj się z nami i rozpocznij kurs już dziś!</p>
                <a href="/contact" className="btn btn-light btn-lg">
                    Skontaktuj się
                </a>
            </div>
        </div>
    );
}
