import axios from 'axios';

const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const BASE_URL = `${API_ROOT}/api/categorias`;

class CategoriaService {

    getAllCategoria () {
        return axios.get(BASE_URL);
    }
    getCategoriaById(id) {
        return axios.get(`${BASE_URL}/${id}`);
    }
    createCategoria(categoria) {
        return axios.post(BASE_URL, categoria);
    }
    updateCategoria(id, categoria) {
        return axios.put(`${BASE_URL}/${id}`, categoria);
    }
    deleteCategoria(id) {
        return axios.delete(`${BASE_URL}/${id}`);
    }

}
export default new CategoriaService();
