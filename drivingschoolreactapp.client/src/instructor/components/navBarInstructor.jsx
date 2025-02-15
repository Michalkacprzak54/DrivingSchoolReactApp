import React, { useContext, Component } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import "../../components/navBarStyles.css";

class NavBarInstructor extends Component {
    static contextType = AuthContext;

    state = {
        clicked: false,
        prevScrollPos: window.pageYOffset,
        visible: true
    };

    handleMenuClick = () => {
        this.setState({ clicked: !this.state.clicked });
    };

    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }

    handleScroll = () => {
        const currentScrollPos = window.pageYOffset;
        const visible = this.state.prevScrollPos > currentScrollPos || currentScrollPos < 10;

        this.setState({
            prevScrollPos: currentScrollPos,
            visible
        });
    };

    render() {
        const { isLoggedIn, userRole } = this.context;

        return (
            <nav className={`navbar navbar-expand-lg navbar-light bg-light fixed-top ${this.state.visible ? "" : "hidden"}`}>
                <div className="container">
                    <Link to="/instructorSchedule" className="navbar-brand">
                        <h1 className="logo">Panel instruktora</h1>
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded={this.state.clicked ? "true" : "false"}
                        aria-label="Toggle navigation"
                        onClick={this.handleMenuClick}
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`collapse navbar-collapse ${this.state.clicked ? "show" : ""}`} id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            {isLoggedIn && userRole === "instructor" ? (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/instructorSchedule">Panel Instruktora</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/addEventPage">Dodaj Harmonogram</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/instructorProfile">Profil</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/internalExamPage">Egzamin wewnętrzny</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/clientDocumentsPage">Dokumenty</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link text-danger" to="/instructorLogin">Wyloguj się</Link>
                                    </li>
                                </>
                            ) : (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Zaloguj się</Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default NavBarInstructor;
