const regexPatterns = {
    firstName: /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]{1,50}$/u, // Imię - pierwsza wielka litera
    lastName: /^[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]{1,50}$/u, // Nazwisko - pierwsza wielka litera
    phoneNumber: /^(\+48)?\s?\d{3}\s?\d{3}\s?\d{3}$/, // Polski numer telefonu
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, // Min. 8 znaków, 1 litera, 1 cyfra
    zipCode: /^\d{2}-\d{3}$/, // Kod pocztowy (np. 00-123)
    city: /^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż\s-]{2,50}$/u, // Miasto
    street: /^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż\s-]{2,50}$/u, // Ulica
    houseNumber: /^[0-9]+[A-Za-z]?$/, // Numer domu
    flatNumber: /^[0-9]*$/, // Numer mieszkania (opcjonalne)
};

export default regexPatterns;
