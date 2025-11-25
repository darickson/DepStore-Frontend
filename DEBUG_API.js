/**
 * Script de Diagnóstico - API Configuration
 * Coloca esto en tu navegador (Console) para verificar la configuración
 */

// 1. Ver la variable de entorno
console.log('📋 VITE_API_URL:', import.meta.env.VITE_API_URL);

// 2. Ver URL que debería estar usando ProductoService
const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const BASE_URL = `${API_ROOT}/api/products`;
console.log('🔗 URL BASE de Productos:', BASE_URL);

// 3. Probar si el servidor responde
fetch(BASE_URL)
  .then(res => {
    console.log('✅ Servidor responde:', res.status, res.statusText);
    return res.json();
  })
  .then(data => {
    console.log('📦 Productos recibidos:', data);
  })
  .catch(err => {
    console.error('❌ Error conectando a API:', err.message);
    console.log('Intenta esto en tu terminal:');
    console.log(`curl ${BASE_URL}`);
  });
