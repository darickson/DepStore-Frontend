import axios from 'axios';

const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const BASE_URL = `${API_ROOT}/api/metodo-pago`;

class MetodoPagoService {

    getAllMetodoPago () {
        return axios.get(BASE_URL);
    }
    getMetodoPagoById(id) {
        return axios.get(`${BASE_URL}/${id}`);
    }
    createMetodoPago(metodoPago) {
        return axios.post(BASE_URL, metodoPago);
    }
    updateMetodoPago(id, metodoPago) {
        return axios.put(`${BASE_URL}/${id}`, metodoPago);
    }
    deleteMetodoPago(id) {
        return axios.delete(`${BASE_URL}/${id}`);
    }

}
export default new MetodoPagoService();
