import axios from 'axios';

const BASE_URL = 'https://localhost:7056/api/';

export const ENDPOINTS = {
    CLIENT: 'Client',
    SERVICE: 'Service',
    THEORYSCHEDULE: 'TheorySchedules',
}

export const createAPIEndpoint = endpoint => {

    let url = BASE_URL + endpoint + '/';

    return {
        fetchAll: () => axios.get(url),
        fetchById: id => axios.get(url + id),
        create: newRecord => axios.post(url, newRecord),
        update: (id, updateRecord) => axios.put(url + id, updateRecord),
        delete: id => axios.delete(url + id),
        
    }
}