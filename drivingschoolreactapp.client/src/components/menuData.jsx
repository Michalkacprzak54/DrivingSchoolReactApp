import { FaShoppingCart, FaHouseUser } from 'react-icons/fa'; 

export const menuData = [
    {
        title: "Strona główna",
        url: "/",
        cName: "nav-links",
        icon: <FaHouseUser />
    },
    {
        title: "Usługi",
        url: "/services",
        cName: "nav-links",
    },
    {
        title: "Harmonogram",
        url: "/schedule",
        cName: "nav-links",
    },
    {
        title: "Zapis na kurs",
        url: "/pkk",
        cName: "nav-links",
    },
    {
        title: "Kontakt",
        url: "/contact",
        cName: "nav-links",
    },
    {
        title: "Moje konto",
        url: "/myAccount",
        cName: "nav-links",
    },
    {
        title: "Koszyk",
        url: "/cart",
        cName: "nav-links",
        icon: <FaShoppingCart />,
    },
]