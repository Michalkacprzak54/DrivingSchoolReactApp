import { Component } from "react";
import { Link } from "react-router-dom";
import { menuData } from "./menuData";
import { getCartCount } from "../forAll/cart/cartUtils";
import "./navBarStyles.css"; // Możesz dodać niestandardowe style, jeśli chcesz

class NavBar extends Component {
    state = {
        clicked: false,
        cartItemCount: 0,
        prevScrollPos: window.pageYOffset, // Pozycja scrolla na początku
        visible: true // Czy navbar jest widoczny
    };

    handleMenuClick = () => {
        this.setState({ clicked: !this.state.clicked });
    };

    updateCartCount = () => {
        const cartCount = getCartCount(); // Pobierz aktualną liczbę produktów w koszyku
        this.setState({ cartItemCount: cartCount });
    };

    componentDidMount() {
        this.updateCartCount(); // Zaktualizuj licznik przy pierwszym renderze

        // Dodaj nasłuchiwanie na zdarzenie scroll
        window.addEventListener("scroll", this.handleScroll);
    }

    componentWillUnmount() {
        // Usuń listener, aby uniknąć wycieków pamięci
        window.removeEventListener("scroll", this.handleScroll);
    }

    handleScroll = () => {
        const currentScrollPos = window.pageYOffset;
        const visible = this.state.prevScrollPos > currentScrollPos || currentScrollPos < 10;

        // Zaktualizuj stan na podstawie przewijania
        this.setState({
            prevScrollPos: currentScrollPos,
            visible
        });
    };

    render() {
        return (
            <nav className={`navbar navbar-expand-lg navbar-light bg-light fixed-top ${this.state.visible ? "" : "hidden"}`}>
                <div className="container">
                    <Link to="/" className="navbar-brand">
                        <h1 className="logo">Szkoła jazdy <i className="fab fa-react"></i></h1>
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded={this.state.clicked ? "true" : "false"} aria-label="Toggle navigation" onClick={this.handleMenuClick}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`collapse navbar-collapse ${this.state.clicked ? "show" : ""}`} id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            {menuData.map((item, index) => (
                                <li key={index} className="nav-item">
                                    <Link to={item.url} className="nav-link">
                                        {item.icon && <span className="nav-icon">{item.icon}</span>}
                                        {item.title}
                                        {item.title === "Koszyk" && this.state.cartItemCount > 0 && (
                                            <span className="cart-count">{this.state.cartItemCount}</span>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default NavBar;
