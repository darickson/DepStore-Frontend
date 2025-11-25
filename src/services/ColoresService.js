import axios from 'axios';

const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const BASE_URL = `${API_ROOT}/api/colores`;

class ColoresService {

    getAllColores () {
        return axios.get(BASE_URL);
    }
    getColoresById(id) {
        return axios.get(`${BASE_URL}/${id}`);
    }
    createColores(colores) {
        return axios.post(BASE_URL, colores);
    }
    updateColores(id, colores) {
        return axios.put(`${BASE_URL}/${id}`, colores);
    }
    deleteColores(id) {
        return axios.delete(`${BASE_URL}/${id}`);
    }

}
export default new ColoresService();
