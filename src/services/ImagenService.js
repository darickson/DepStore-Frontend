import axios from 'axios';

const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const BASE_URL = `${API_ROOT}/api/imagen`;

class ImagenService {

    getAllImagen () {
        return axios.get(BASE_URL);
    }
    getImagenById(id) {
        return axios.get(`${BASE_URL}/${id}`);
    }
    createImagen(imagen) {
        return axios.post(BASE_URL, imagen);
    }
    updateImagen(id, imagen) {
        return axios.put(`${BASE_URL}/${id}`, imagen);
    }
    deleteImagen(id) {
        return axios.delete(`${BASE_URL}/${id}`);
    }

}
export default new ImagenService();
