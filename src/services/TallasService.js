import axios from 'axios';

const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const BASE_URL = `${API_ROOT}/api/tallas`;

class TallasService {

    getAllTallas () {
        return axios.get(BASE_URL);
    }
    getTallasById(id) {
        return axios.get(`${BASE_URL}/${id}`);
    }
    createTallas(tallas) {
        return axios.post(BASE_URL, tallas);
    }
    updateTallas(id, tallas) {
        return axios.put(`${BASE_URL}/${id}`, tallas);
    }
    deleteTallas(id) {
        return axios.delete(`${BASE_URL}/${id}`);
    }

}
export default new TallasService();
