import axios from 'axios';

const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const BASE_URL = `${API_ROOT}/api/rol`;

class RolService {

    getAllRol () {
        return axios.get(BASE_URL);
    }
    getRolById(id) {
        return axios.get(`${BASE_URL}/${id}`);
    }
    createRol(rol) {
        return axios.post(BASE_URL, rol);
    }
    updateRol(id, rol) {
        return axios.put(`${BASE_URL}/${id}`, rol);
    }
    deleteRol(id) {
        return axios.delete(`${BASE_URL}/${id}`);
    }

}
export default new RolService();
