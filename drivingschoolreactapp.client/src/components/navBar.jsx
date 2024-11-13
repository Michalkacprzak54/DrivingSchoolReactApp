import { Component } from "react";
import { Link } from "react-router-dom";
import { menuData } from "./menuData";
import "./navBarStyles.css";

class navBar extends Component {
    state = { clicked: false };

    handleMenuClick = () => {
        this.setState({ clicked: !this.state.clicked });
    };
    render() {
        return (
            <nav className="NavBarItems">
                <h1 className="logo">
                    React <i className="fab fa-react"></i>
                </h1>
                <div className="menu-icons" onClick={this.handleMenuClick}>
                    <i className={this.state.clicked ? "fas fa-times" : "fas fa-bars"}></i>
                </div>
                <ul className="nav-menu">
                    {menuData.map((item, index) => (
                        <li key={index} className={item.cName}>
                            <Link to={item.url}>{item.title}</Link>
                        </li>
                    ))}
                </ul>
            </nav>
        )
    }
}

export default navBar;