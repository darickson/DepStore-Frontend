import axios from 'axios';

// Usar variable de entorno VITE_API_URL si existe, sino fallback a localhost:8080
const API_ROOT = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Intentar múltiples rutas posibles
const possibleEndpoints = [
    // Prioritize v1 Spanish endpoints used by the backend
    `${API_ROOT}/api/v1/productos`,
    `${API_ROOT}/api/v1/producto`,
    `${API_ROOT}/api/products`,
    `${API_ROOT}/api/producto`,
    `${API_ROOT}/api/Producto`,
];

let BASE_URL = possibleEndpoints[0]; // Default
let isConnected = false; // Bandera para saber si está conectado

// Datos de fallback locales (para demostración si API no responde)
let fallbackProducts = [
  { 
    id: 1, 
    name: 'Chaqueta Y2K Oversize', 
    price: 89.99, 
    categoria: 'Hombre', 
    stock: 15,
    description: 'Chaqueta streetwear con diseño oversize'
  },
  { 
    id: 2, 
    name: 'Pantalón Cargo Wide', 
    price: 65.99, 
    categoria: 'Mujer', 
    stock: 0,
    description: 'Pantalón cargo con bolsillos laterales'
  },
  { 
    id: 3, 
    name: 'Sudadera DEP Logo', 
    price: 54.99, 
    categoria: 'Hombre', 
    stock: 25,
    description: 'Sudadera cómoda con logo DEP'
  },
  { 
    id: 4, 
    name: 'Camiseta Básica', 
    price: 24.99, 
    categoria: 'Mujer', 
    stock: 40,
    description: 'Camiseta de algodón básica'
  },
  { 
    id: 5, 
    name: 'Jeans Skinny', 
    price: 79.99, 
    categoria: 'Infantil', 
    stock: 12,
    description: 'Jeans ajustados con diseño moderno'
  },
  { 
    id: 6, 
    name: 'Chamarra Bomber', 
    price: 99.99, 
    categoria: 'Hombre', 
    stock: 8,
    description: 'Chamarra bomber con acabado premium'
  },
  { 
    id: 7, 
    name: 'Vestido Casual', 
    price: 69.99, 
    categoria: 'Mujer', 
    stock: 5,
    description: 'Vestido casual para cualquier ocasión'
  }
];

// Productos pendientes de sincronizar (guardados localmente)
let pendingSync = {
  create: [],  // Productos a crear en la API
  update: [],  // Productos a actualizar en la API
  delete: []   // IDs a eliminar de la API
};

// Guardar pendingSync en localStorage para persistencia
const savePendingSync = () => {
  try {
    localStorage.setItem('dep_pendingSync', JSON.stringify(pendingSync));
    console.log('💾 Sincronización pendiente guardada en localStorage');
  } catch (e) {
    console.warn('⚠️ No se pudo guardar en localStorage:', e);
  }
};

const loadPendingSync = () => {
  try {
    const saved = localStorage.getItem('dep_pendingSync');
    if (saved) {
      pendingSync = JSON.parse(saved);
      console.log('📂 Sincronización pendiente cargada:', pendingSync);
    }
  } catch (e) {
    console.warn('⚠️ No se pudo cargar de localStorage:', e);
  }
};

class ProductoService {

    async getAllProducto() {
        // Intentar con diferentes endpoints (máximo 3 reintentos)
        for (let attempt = 1; attempt <= 3; attempt++) {
            for (const endpoint of possibleEndpoints) {
                try {
                    console.log(`🔄 Intento ${attempt}/3: Conectando a ${endpoint}...`);
                    const response = await axios.get(endpoint, { 
                        timeout: 15000 // 15 segundos para Render
                    });
                    BASE_URL = endpoint; // Guardar el endpoint que funciona
                    isConnected = true;
                    console.log(`✅ Conectado exitosamente a: ${endpoint}`);
                    console.log(`📦 Productos cargados: ${response.data?.length || 0}`);
                    
                    // Si se conectó, sincronizar datos pendientes
                    this.syncPendingData();
                    
                    // Retornar respuesta con formato consistente
                    return {
                        data: Array.isArray(response.data) ? response.data : response.data?.data || [],
                        status: response.status,
                        isLocal: false
                    };
                } catch (err) {
                    const status = err.response?.status || err.code;
                    console.log(`⚠️ Error intento ${attempt} (${status}): ${endpoint}`);
                    continue;
                }
            }
            
            // Esperar antes del siguiente intento
            if (attempt < 3) {
                console.log(`⏳ Esperando 3 segundos antes de reintentar...`);
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }
        
        // Si ningún endpoint funciona, usar datos de fallback
        console.warn('⚠️ No se pudo conectar a API después de 3 intentos. Usando datos locales.');
        isConnected = false;
        
        // Cargar datos pendientes
        loadPendingSync();
        
        // Combinar fallback + pendientes locales
        const allProducts = [...fallbackProducts, ...pendingSync.create];
        console.log(`📂 Modo local: ${allProducts.length} productos disponibles`);
        
        return { 
            data: allProducts,
            status: 200,
            isLocal: true,
            pendingSync: Object.keys(pendingSync).some(k => pendingSync[k].length > 0)
        };
    }

    async syncPendingData() {
        loadPendingSync();
        
        if (!isConnected) {
            console.log('⚠️ No hay conexión para sincronizar');
            return;
        }

        console.log('🔄 Sincronizando datos pendientes...');
        let synced = 0;

        // Sincronizar creaciones pendientes
        for (const product of pendingSync.create) {
            try {
                console.log(`📤 Creando en API: ${product.name}`);
                await axios.post(BASE_URL, product);
                synced++;
            } catch (err) {
                console.warn(`❌ Error creando ${product.name}:`, err.message);
            }
        }

        // Sincronizar actualizaciones pendientes
        for (const update of pendingSync.update) {
            try {
                console.log(`📤 Actualizando en API: ${update.id}`);
                await axios.put(`${BASE_URL}/${update.id}`, update.data);
                synced++;
            } catch (err) {
                console.warn(`❌ Error actualizando ${update.id}:`, err.message);
            }
        }

        // Sincronizar eliminaciones pendientes
        for (const id of pendingSync.delete) {
            try {
                console.log(`📤 Eliminando en API: ${id}`);
                await axios.delete(`${BASE_URL}/${id}`);
                synced++;
            } catch (err) {
                console.warn(`❌ Error eliminando ${id}:`, err.message);
            }
        }

        // Limpiar si todo se sincronizó
        if (synced > 0) {
            console.log(`✅ ${synced} cambios sincronizados a la API`);
            pendingSync = { create: [], update: [], delete: [] };
            savePendingSync();
        }
    }

    getProductoById(id) {
        return axios.get(`${BASE_URL}/${id}`, { timeout: 10000 });
    }

    async createProducto(producto) {
        // Si está conectado a API, intentar crear directamente
        if (isConnected) {
            try {
                return await axios.post(BASE_URL, producto, { timeout: 10000 });
            } catch (err) {
                console.warn('⚠️ Fallando POST a API, guardando localmente');
            }
        }

        // Si no está conectado o falló, guardar localmente
        console.log('💾 Guardando localmente (sin API):', producto);
        const newProduct = {
            id: Date.now(), // Usar timestamp como ID temporal
            ...producto,
            isLocalOnly: true // Marcar como solo local
        };
        fallbackProducts = [newProduct, ...fallbackProducts];
        
        // Guardar en pendingSync para sincronizar luego
        pendingSync.create.push(newProduct);
        savePendingSync();
        
        return { 
            data: newProduct, 
            status: 201,
            isLocal: true 
        };
    }

    async updateProducto(id, producto) {
        // Si está conectado a API, intentar actualizar directamente
        if (isConnected) {
            try {
                return await axios.put(`${BASE_URL}/${id}`, producto, { timeout: 10000 });
            } catch (err) {
                console.warn('⚠️ Fallando PUT a API, guardando localmente');
            }
        }

        // Si no está conectado o falló, actualizar localmente
        console.log('💾 Actualizando localmente (sin API):', id, producto);
        fallbackProducts = fallbackProducts.map(p => 
            (p.id === id || p._id === id) ? { ...p, ...producto } : p
        );
        
        // Guardar en pendingSync para sincronizar luego
        const existing = pendingSync.update.findIndex(u => u.id === id);
        if (existing >= 0) {
            pendingSync.update[existing].data = { ...pendingSync.update[existing].data, ...producto };
        } else {
            pendingSync.update.push({ id, data: producto });
        }
        savePendingSync();
        
        return { 
            data: { id, ...producto }, 
            status: 200,
            isLocal: true 
        };
    }

    async deleteProducto(id) {
        // Si está conectado a API, intentar eliminar directamente
        if (isConnected) {
            try {
                return await axios.delete(`${BASE_URL}/${id}`, { timeout: 10000 });
            } catch (err) {
                console.warn('⚠️ Fallando DELETE a API, eliminando localmente');
            }
        }

        // Si no está conectado o falló, eliminar localmente
        console.log('🗑️ Eliminando localmente (sin API):', id);
        fallbackProducts = fallbackProducts.filter(p => (p.id !== id && p._id !== id));
        
        // Guardar en pendingSync para sincronizar luego
        if (!pendingSync.delete.includes(id)) {
            pendingSync.delete.push(id);
        }
        savePendingSync();
        
        return { 
            status: 200,
            isLocal: true 
        };
    }

    // Método público para revisar cambios pendientes
    getPendingSync() {
        loadPendingSync();
        return pendingSync;
    }

    // Método público para revisar estado de conexión
    isAPIConnected() {
        return isConnected;
    }
}

export default new ProductoService();