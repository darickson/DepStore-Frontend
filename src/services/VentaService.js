import axios from 'axios';

const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const BASE_URL = `${API_ROOT}/api/venta`;

class VentaService {

    getAllVenta () {
        return axios.get(BASE_URL);
    }
    getVentaById(id) {
        return axios.get(`${BASE_URL}/${id}`);
    }
    createVenta(venta) {
        return axios.post(BASE_URL, venta);
    }
    updateVenta(id, venta) {
        return axios.put(`${BASE_URL}/${id}`, venta);
    }
    deleteVenta(id) {
        return axios.delete(`${BASE_URL}/${id}`);
    }

}
export default new VentaService();
