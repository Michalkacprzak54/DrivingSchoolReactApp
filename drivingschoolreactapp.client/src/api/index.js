import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5254/api/';

export const ENDPOINTS = {
    CLIENT: 'Client',
    SERVICE: 'Service',
    PRATICE: 'Pratices',
    THEORYSCHEDULE: 'TheorySchedules',
    CLIENT_PASSWORD: 'ClientLogin',
    CLIENT_LOGIN: 'ClientLogin/Login',
    INSTRUCTOR_DATA: 'InstructorDetails',
    INSTRUCTOR_LOGIN: 'InstructorDetails/Login',
    CLIENT_REGISTER: 'Client/Register',
    CLIENT_SERVICE: 'ClientService',
    PRATICESCHEDULES: 'PraticeSchedules',
    TRAINEECOURSE: 'TraineeCourse',
    CONTACTREQUEST: 'ContactRequest',
};

export const createAPIEndpoint = (endpoint) => {
    let url = BASE_URL + endpoint + '/';

    const getAuthHeader = () => {
        const token = localStorage.getItem('jwtToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    return {
        fetchAll: () => axios.get(url, { headers: getAuthHeader() }),
        fetchById: (id) => axios.get(url + id, { headers: getAuthHeader() }),
        create: (newRecord) => axios.post(url, newRecord, { headers: getAuthHeader() }),
        update: (id, updateRecord) => axios.put(url + id, updateRecord, { headers: getAuthHeader() }),
        delete: (id) => axios.delete(url + id, { headers: getAuthHeader() }),
        login: (credentials) => axios.post(BASE_URL + ENDPOINTS.CLIENT_LOGIN, credentials),
        loginInstructor: (credentials) => axios.post(BASE_URL + ENDPOINTS.INSTRUCTOR_LOGIN, credentials),
        register: (registerData) => axios.post(url, registerData)
    };
};
