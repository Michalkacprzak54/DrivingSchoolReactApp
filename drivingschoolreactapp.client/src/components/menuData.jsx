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
        /*icon: "fa-solid fa-house-user"*/
    },
    {
        title: "Harmonogram",
        url: "/schedule",
        cName: "nav-links",
        //icon: "fa-solid fa-house-user"
    },
    {
        title: "Logowanie",
        url: "/login",
        cName: "nav-links",
        //icon: "fa-solid fa-house-user"
    },
    {
        title: "Koszyk",
        url: "/cart",
        cName: "nav-links",
        icon: <FaShoppingCart />,
    },
    {
        title: "Zapis na kurs",
        url: "/pkk",
        cName: "nav-links",
        //icon: "fa-solid fa-house-user"
    },
    //{
    //    title: "Lista klientów",
    //    url: "/clients",
    //    cName: "nav-links",
    //    //icon: "fa-solid fa-house-user"
    //},
    //{
    //    title: "Rejestracja",
    //    url: "/register",
    //    cName: "nav-links",
    //    //icon: "fa-solid fa-house-user"
    //},
    //{
    //    title: "Praktyka harmonogram",
    //    url: "/praticeSchedule",
    //    cName: "nav-links",
    //    //icon: "fa-solid fa-house-user"
    //},
]