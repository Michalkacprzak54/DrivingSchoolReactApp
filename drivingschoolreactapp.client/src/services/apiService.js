import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:7056/api' // Adres DrivingSchoolAPI, czyli backendu API
});

// Dodaj interceptor do logowania informacji o nawi¹zywaniu po³¹czenia
api.interceptors.request.use(request => {
    console.log("Nawi¹zywanie po³¹czenia z API:", request.url);
    return request;
}, error => {
    console.error("B³¹d po³¹czenia z API:", error);
    return Promise.reject(error);
});

// Dodaj interceptor do obs³ugi odpowiedzi
api.interceptors.response.use(response => {
    console.log("Pomyœlnie otrzymano odpowiedŸ z API:", response);
    return response;
}, error => {
    console.error("B³¹d odpowiedzi z API:", error);
    return Promise.reject(error);
});

export const addClient = async (clientData) => {
    const response = await api.post('/Client', clientData); // Zmienna URL lub endpoint, np. '/api/clients'
    return response;
};
// Funkcje eksportowane do obs³ugi kursów
export const getClients = () => api.get('/Client');
