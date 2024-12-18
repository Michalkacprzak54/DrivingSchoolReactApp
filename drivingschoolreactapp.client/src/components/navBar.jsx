import { Component } from "react";
import { Link } from "react-router-dom";
import { menuData } from "./menuData";
import { getCartCount } from "../forAll/cart/cartUtils"; 
import "./navBarStyles.css";

class navBar extends Component {
    state = {
        clicked: false,
        cartItemCount: 0 // Stan dla liczby produktów w koszyku
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

        // Możesz dodać listener, jeśli koszyk zmienia się w czasie rzeczywistym
        document.addEventListener("cartUpdated", this.updateCartCount);
    }

    componentWillUnmount() {
        // Usuń listener, aby uniknąć wycieków pamięci
        document.removeEventListener("cartUpdated", this.updateCartCount);
    }

    render() {
        return (
            <nav className="NavBarItems">
                <Link to="/" className="logo">
                    <h1 className="logo">
                        React <i className="fab fa-react"></i>
                    </h1>
                </Link>
                <div className="menu-icons" onClick={this.handleMenuClick}>
                    <i className={this.state.clicked ? "fas fa-times" : "fas fa-bars"}></i>
                </div>
                <ul className="nav-menu">
                    {menuData.map((item, index) => (
                        <li key={index} className={item.cName}>
                            <Link to={item.url}>
                                {item.icon && <span className="nav-icon">{item.icon}</span>}
                                {item.title}
                                {item.title === "Koszyk" && this.state.cartItemCount > 0 && (
                                    <span className="cart-count">{this.state.cartItemCount}</span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        );
    }
}

export default navBar;
