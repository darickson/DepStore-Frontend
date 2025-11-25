import axios from 'axios';

const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const BASE_URL = `${API_ROOT}/api/metodo-envio`;

class MetodoEnvioService {

    getAllMetodoEnvio () {
        return axios.get(BASE_URL);
    }
    getMetodoEnvioById(id) {
        return axios.get(`${BASE_URL}/${id}`);
    }
    createMetodoEnvio(metodoEnvio) {
        return axios.post(BASE_URL, metodoEnvio);
    }
    updateMetodoEnvio(id, metodoEnvio) {
        return axios.put(`${BASE_URL}/${id}`, metodoEnvio);
    }
    deleteMetodoEnvio(id) {
        return axios.delete(`${BASE_URL}/${id}`);
    }

}
export default new MetodoEnvioService();
