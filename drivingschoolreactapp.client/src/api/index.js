import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5254/api/';

export const ENDPOINTS = {
    ADMIN_LOGIN: "Admin/Login",
    CLIENT: "Client",
    CLIENT_LOGIN: "ClientLogin/Login",
    CLIENT_PASSWORD: "ClientLogin",
    CLIENT_REGISTER: "Client/Register",
    CLIENT_SERVICE: "ClientService",
    CONTACTREQUEST: "ContactRequest",
    ENTITLEMENT: "Entitlement",
    INVOICES: "Invoice",
    INSTRUCTOR: "Instructor",
    INSTRUCTOR_DATA: "InstructorDetails",
    INSTRUCTOR_ENTITLEMENTS: "InscrutorEntitlements",
    INSTRUCTOR_LOGIN: "InstructorDetails/Login",
    LECTURE_PRESENCE: "LecturePresences",
    PHOTO: "Photo",
    PRATICE: "Pratices",
    PRATICESCHEDULES: "PraticeSchedules",
    SERVICE: "Service",
    SERVICESCHEDULE: "ServiceSchedule",
    THEORYSCHEDULE: "TheorySchedules",
    TRAINEECOURSE: "TraineeCourse",
    VARIANTSERVICE: "VariantService",
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
        fetchByEmail: (email) => axios.get(url + email, { headers: getAuthHeader() }),
        create: (newRecord) => axios.post(url, newRecord, { headers: getAuthHeader() }),
        put: (id, data) => axios.put(url + id, data, {
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json',
                'Accept': '*/*'
            }
        }),
        update: (id, updateRecord) => axios.put(url + id, updateRecord, { headers: getAuthHeader() }),
        delete: (id) => axios.delete(url + id, { headers: getAuthHeader() }),
        login: (credentials) => axios.post(BASE_URL + ENDPOINTS.CLIENT_LOGIN, credentials),
        loginInstructor: (credentials) => axios.post(BASE_URL + ENDPOINTS.INSTRUCTOR_LOGIN, credentials),
        loginAdmin: (credentials) => axios.post(BASE_URL + ENDPOINTS.ADMIN_LOGIN, credentials),
        register: (registerData) => axios.post(url, registerData)
    };
};
