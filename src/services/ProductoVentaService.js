import axios from 'axios';

const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const BASE_URL = `${API_ROOT}/api/producto-venta`;

class ProductoVentaService {

    getAllProductoVenta () {
        return axios.get(BASE_URL);
    }
    getProductoVentaById(id) {
        return axios.get(`${BASE_URL}/${id}`);
    }
    createProductoVenta(productoVenta) {
        return axios.post(BASE_URL, productoVenta);
    }
    updateProductoVenta(id, productoVenta) {
        return axios.put(`${BASE_URL}/${id}`, productoVenta);
    }
    deleteProductoVenta(id) {
        return axios.delete(`${BASE_URL}/${id}`);
    }

}
export default new ProductoVentaService();
