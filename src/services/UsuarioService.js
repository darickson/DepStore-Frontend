// services/UsuarioService.js
import axios from 'axios';

const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const BASE_URL = `${API_ROOT}/api/usuario`;

class UsuarioService {
    getAllUsuario() {
        return axios.get(BASE_URL);
    }
    getUsuarioById(id) {
        return axios.get(`${BASE_URL}/${id}`);
    }
    createUsuario(usuario) {
        return axios.post(BASE_URL, usuario);
    }
    updateUsuario(id, usuario) {
        return axios.put(`${BASE_URL}/${id}`, usuario);
    }
    deleteUsuario(id) {
        return axios.delete(`${BASE_URL}/${id}`);
    }
    // Nuevo método para login
    loginUsuario(credenciales) {
        return axios.post(`${BASE_URL}/login`, credenciales);
    }
}

export default new UsuarioService();