import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:7056/api' // Adres backendu ASP.NET
});

// Dodaj interceptor do logowania informacji o nawi�zywaniu po��czenia
api.interceptors.request.use(request => {
    console.log("Nawi�zywanie po��czenia z API:", request.url);
    return request;
}, error => {
    console.error("B��d po��czenia z API:", error);
    return Promise.reject(error);
});

// Dodaj interceptor do obs�ugi odpowiedzi
api.interceptors.response.use(response => {
    console.log("Pomy�lnie otrzymano odpowied� z API:", response);
    return response;
}, error => {
    console.error("B��d odpowiedzi z API:", error);
    return Promise.reject(error);
});

// Funkcje eksportowane do obs�ugi kurs�w
export const getClients = () => api.get('/Client');
