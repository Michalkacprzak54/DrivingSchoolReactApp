import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../AuthContext';
import "../../components/navBarStyles.css";

class NavBarAdmin extends Component {
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
                    <Link to="/addLecturePage" className="navbar-brand">
                        <h1 className="logo">Panel administratora</h1>
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
                            {isLoggedIn && userRole === "admin" ? (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/addLecturePage">Wykłady</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/addPaymentPage">Płatności</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/employeePage">Instrukorzy</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/contactRequests">Zgłoszenia</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/changeUserPassword">Użytkownicy</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/servicesPage">Usługi</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link text-danger" to="/adminLogin">Wyloguj się</Link>
                                    </li>
                                </>
                            ) : (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/adminLogin">Zaloguj się</Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default NavBarAdmin;
