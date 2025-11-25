import axios from 'axios';

const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const BASE_URL = `${API_ROOT}/api/marca`;

class MarcaService {

    getAllMarca () {
        return axios.get(BASE_URL);
    }
    getMarcaById(id) {
        return axios.get(`${BASE_URL}/${id}`);
    }
    createMarca(marca) {
        return axios.post(BASE_URL, marca);
    }
    updateMarca(id, marca) {
        return axios.put(`${BASE_URL}/${id}`, marca);
    }
    deleteMarca(id) {
        return axios.delete(`${BASE_URL}/${id}`);
    }

}
export default new MarcaService();
