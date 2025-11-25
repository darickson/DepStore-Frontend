import axios from 'axios';

const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const BASE_URL = `${API_ROOT}/api/estado`;

class EstadoService {

    getAllEstado () {
        return axios.get(BASE_URL);
    }
    getEstadoById(id) {
        return axios.get(`${BASE_URL}/${id}`);
    }
    createEstado(estado) {
        return axios.post(BASE_URL, estado);
    }
    updateEstado(id, estado) {
        return axios.put(`${BASE_URL}/${id}`, estado);
    }
    deleteEstado(id) {
        return axios.delete(`${BASE_URL}/${id}`);
    }

}
export default new EstadoService();
