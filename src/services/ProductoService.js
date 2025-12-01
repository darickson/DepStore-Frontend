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
    name: "Baggy Jeans Negro Y2K",
    description: "Experimenta la libertad del estilo urbano con nuestros Baggy Jeans. Con un corte holgado que te brinda máximo comfort y movilidad, perfectos para todo el día. Ideales para crear looks Y2K auténticos con esa esencia streetwear que buscas. ¡Siéntete cómodo y a la moda simultáneamente!",
    price: 34990,
    originalPrice: 45990,
    image: "/img/Baggy.webp",
    categoria: "unisex",
    tipo: "Ropa",
    oferta: true,
    stock: 15,
    tallas: ["44", "46", "48", "50"],
    colores: ["Negro"],
    estilo: "Pantalones"
  },
  {
    id: 2,
    name: "Baggy Gris",
    description: "Cargos oversize con múltiples bolsillos",
    price: 19000,
    image: "/img/BaggyPlomo.webp",
    categoria: "unisex",
    tipo: "Ropa",
    stock: 12,
    tallas: ["44", "46", "48", "50"],
    colores: ["Gris"],
    estilo: "Pantalones"
  },
  {
    id: 3,
    name: "Chaqueta Y2K",
    description:"Chaqueta Y2K con diseño oversize en dos colores vibrantes que se adaptan a tu estilo único. Corte relajado perfecto para capas, con detalles vintage que evocan la auténtica moda urbana. ¡Haz una declaración de estilo con esta pieza esencial!",
    price: 24990,
    image: "/img/Chaquetay2k.webp",
    categoria: "unisex",
    tipo: "Ropa",
    stock: 8,
    tallas: ["S", "M", "L", "XL"],
    colores: ["Gris", "Negro", "Morado"],
    estilo: "Chaqueta"
  },
  {
    id: 4,
    name: "Corta Viento",
    description: "Cortavientos en un morado vibrante y eléctrico. Ligero, funcional y con un color audaz que destaca en cualquier aventura urbana o al aire libre.",
    price: 39990,
    originalPrice: 49990,
    image: "/img/Cortaviento.webp",
    categoria: "unisex",
    tipo: "Ropa",
    oferta: true,
    stock: 20,
    tallas: ["S", "M", "L", "XL", "XXL"],
    colores: ["Negro"],
    estilo: "Chaqueta"
  },
  {
    id: 5,
    name: "Camiseta Roja",
    description: "Polo estilo Y2K en un intenso color rojo pasión. Presenta un corte un poco más holgado y detalles clásicos de la era, como un botón de metal pulido y un pequeño logo bordado en el pecho. Ideal para un outfit retro.",
    price: 17990,
    image: "/img/PoleraRoja.webp",
    categoria: "unisex",
    tipo: "Ropa",
    stock: 25,
    tallas: ["S", "M", "L", "XL"],
    colores: ["Rojo"],
    estilo: "Poleras"
  },
  {
    id: 6,
    name: "Polera Gris",
    description: "Polera estilo urbano en gris grafito con mangas negras. Un diseño minimalista y contrastante, perfecto para un look casual y moderno. Corte cómodo y versátil.",
    price: 17990,
    originalPrice: 25990,
    image: "/img/PoleraGris.webp",
    categoria: "unisex",
    tipo: "Ropa",
    oferta: true,
    stock: 18,
    tallas: ["S", "M", "L", "XL"],
    colores: ["Gris"],
    estilo: "techwear"
  },
  {
    id: 7,
    name: "Poleron Blanco",
    description: "Polerón blanco algodón, suave y cómodo. Perfecto para días relajados o para capas en outfits casuales. Fresco, ligero y fácil de combinar.",
    price: 34990,
    image: "/img/PoleronBlanco.webp",
    categoria: "unisex",
    tipo: "chaquetas",
    stock: 10,
    tallas: ["S", "M", "L", "XL"],
    colores: ["Blanco"],
    estilo: "grunge"
  },
  {
    id: 8,
    name: "DC Black Sabbath",
    description: "Camiseta con gráfico iconic de Black Sabbath, perfect para fans de metal y rock clásico.",
    price: 22990,
    image: "/img/dc black sabbath.webp",
    categoria: "unisex",
    tipo: "Ropa",
    stock: 14,
    tallas: ["S", "M", "L", "XL"],
    colores: ["Negro"],
    estilo: "Poleras"
  },
  {
    id: 9,
    name: "DC Slayer",
    description: "Camiseta DC con diseño Slayer, ideal para amantes del metal.",
    price: 22990,
    image: "/img/dc-slayer.webp",
    categoria: "unisex",
    tipo: "Ropa",
    stock: 11,
    tallas: ["S", "M", "L", "XL"],
    colores: ["Negro"],
    estilo: "Poleras"
  },
  {
    id: 10,
    name: "DC Comand",
    description: "Camiseta DC Command con diseño exclusivo.",
    price: 22990,
    image: "/img/dcComand.webp",
    categoria: "unisex",
    tipo: "Ropa",
    stock: 9,
    tallas: ["S", "M", "L", "XL"],
    colores: ["Negro"],
    estilo: "Poleras"
  },
  {
    id: 11,
    name: "DC Mujer",
    description: "Camiseta DC diseñada especialmente para mujer.",
    price: 22990,
    image: "/img/DC-Mujer.webp",
    categoria: "mujer",
    tipo: "Ropa",
    stock: 16,
    tallas: ["XS", "S", "M", "L", "XL"],
    colores: ["Negro"],
    estilo: "Poleras"
  },
  {
    id: 12,
    name: "Miniskirt",
    description: "Minifaldaurbana con estilo Y2K, perfecta para looks atrevidos.",
    price: 24990,
    image: "/img/Miniskirt.webp",
    categoria: "mujer",
    tipo: "Ropa",
    stock: 7,
    tallas: ["XS", "S", "M", "L"],
    colores: ["Negro"],
    estilo: "Faldas"
  },
  {
    id: 13,
    name: "Pink Denim",
    description: "Jeans rosa pastel con corte moderno y detalles vintage.",
    price: 39990,
    image: "/img/Pinkdenim.webp",
    categoria: "mujer",
    tipo: "Ropa",
    stock: 5,
    tallas: ["24", "26", "28", "30"],
    colores: ["Rosa"],
    estilo: "Pantalones"
  },
  {
    id: 14,
    name: "Short Cargo",
    description: "Short cargo con bolsillos laterales, cómodo para verano.",
    price: 26990,
    image: "/img/ShortCargo.webp",
    categoria: "unisex",
    tipo: "Ropa",
    stock: 13,
    tallas: ["S", "M", "L", "XL"],
    colores: ["Gris", "Negro"],
    estilo: "Shorts"
  },
  {
    id: 15,
    name: "Vestido Azul",
    description: "Vestido azul marino con corte elegante y cómodo.",
    price: 49990,
    image: "/img/VestidoAzul.webp",
    categoria: "mujer",
    tipo: "Ropa",
    stock: 6,
    tallas: ["S", "M", "L", "XL"],
    colores: ["Azul"],
    estilo: "Vestidos"
  },
  {
    id: 16,
    name: "Vestido Negro",
    description: "Vestido negro clásico, ideal para cualquier ocasión.",
    price: 49990,
    image: "/img/VestidoNegro.webp",
    categoria: "mujer",
    tipo: "Ropa",
    stock: 8,
    tallas: ["S", "M", "L", "XL"],
    colores: ["Negro"],
    estilo: "Vestidos"
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

    async getProductoById(id) {
      try {
        const resp = await axios.get(`${BASE_URL}/${id}`, { timeout: 10000 });
        if (resp && resp.data) return resp;
      } catch (err) {
        console.warn('⚠️ Error obteniendo producto por id desde API:', err.message);
      }

      // Fallback: buscar en productos locales almacenados en memoria
      try {
        const found = fallbackProducts.find(p => String(p.id) === String(id) || String(p._id) === String(id));
        if (found) {
          return { data: found, status: 200, isLocal: true };
        }
      } catch (err) {
        console.warn('⚠️ Error buscando producto en fallback local:', err.message);
      }

      // No encontrado: rechazar para que el llamador maneje el error
      return Promise.reject({ message: 'Producto no encontrado' });
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