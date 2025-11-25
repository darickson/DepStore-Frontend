import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar base y endpoint (usar VITE_API_URL si está definido)
const BASE_URL = process.env.VITE_API_URL || 'https://depbackend-fullstack.onrender.com';
const API_URL = `${BASE_URL}/api/v1/productos`;
const possibleEndpoints = [API_URL];

// TOKEN opcional para APIs que requieran Authorization: Bearer
const IMPORT_API_TOKEN = process.env.IMPORT_API_TOKEN || process.env.VITE_API_TOKEN || '';

function authHeaders() {
  return IMPORT_API_TOKEN ? { Authorization: `Bearer ${IMPORT_API_TOKEN}` } : {};
}

// Leer el archivo JSON
const productsPath = path.join(__dirname, 'products-seed.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log(`📦 Preparando importar ${products.length} productos...`);
console.log(`🌐 URL Base: ${BASE_URL}`);
console.log('Intentando encontrar el endpoint correcto...\n');

async function findCorrectEndpoint() {
  // Quick connectivity check to the base URL
  try {
    const baseResp = await axios.get(BASE_URL, { timeout: 5000 });
    console.log(`🔎 Base URL reachable: ${BASE_URL} (status ${baseResp.status})\n`);
  } catch (err) {
    console.log(`⚠️  No se pudo conectar al host base ${BASE_URL} - ${err.code || ''} ${err.message}`);
    console.log('Continuo intentando endpoints específicos...\n');
  }

  for (const endpoint of possibleEndpoints) {
    try {
      const response = await axios.post(endpoint, products[0], {
        timeout: 5000,
        headers: { 'Content-Type': 'application/json', ...authHeaders() }
      });
      console.log(`✅ Endpoint encontrado: ${endpoint}\n`);
      return endpoint;
    } catch (error) {
      const status = error.response?.status;
      const code = error.code || 'no-code';
      const msg = error.message || 'no-message';
      console.log(`❌ ${endpoint} - status: ${status ?? 'no-response'} - code: ${code} - msg: ${msg}`);
      // If server returned 400 (validation), try posting with payload variants to see which shape it accepts
      if (error.response && [400, 422].includes(error.response.status)) {
        try {
          console.log(`   🔁 Intentando variantes de payload en ${endpoint} debido a ${error.response.status}`);
          const vr = await tryPostWithVariants(endpoint, products[0]);
          if (vr && vr.status && vr.status < 400) {
            console.log(`✅ Variante aceptada en endpoint: ${endpoint}\n`);
            return endpoint;
          }
        } catch (e) {
          console.log(`   ⚠️ Error probando variantes en ${endpoint}: ${e.message}`);
        }
      }
      if (error.response && error.response.data) {
        console.log('   Response body:', JSON.stringify(error.response.data));
      } else {
        console.log('   No response received from server.');
      }
    }
  }
  return null;
}

async function importProducts(endpoint) {
  console.log(`📦 Importando ${products.length} productos a: ${endpoint}\n`);

  let imported = 0;
  let failed = 0;
    const failureLog = [];

  for (const product of products) {
    try {
      // Try several payload variants to handle different API schemas
      const resp = await tryPostWithVariants(endpoint, product);
      if (resp && resp.status && resp.status < 400) {
        imported++;
        console.log(`✅ [${imported}/${products.length}] ${product.name}`);
      } else {
        failed++;
        console.log(`❌ [${imported + failed}/${products.length}] ${product.name} - No se recibió respuesta exitosa`);
        failureLog.push({ product: product.name, reason: 'no-success-response' });
      }
    } catch (error) {
      failed++;
      const errorMsg = error.response?.data || error.message;
      console.log(`❌ [${imported + failed}/${products.length}] ${product.name}`);
      console.log(`   Error: ${JSON.stringify(errorMsg)}\n`);
      failureLog.push({ product: product.name, error: errorMsg });
    }
  }

  console.log('\n-------------------------------------------');
  console.log(`🎉 Importación completada!`);
  console.log(`✅ Importados: ${imported}`);
  console.log(`❌ Fallidos: ${failed}`);
  console.log(`📊 Total: ${imported + failed}/${products.length}`);
  
  if (failed === 0) {
    console.log('\n🚀 ¡Todos los productos están en tu API!');
  }
  // Save failures for inspection
  if (failureLog.length > 0) {
    try {
      const outPath = path.join(__dirname, 'import-failures.json');
      fs.writeFileSync(outPath, JSON.stringify(failureLog, null, 2), 'utf8');
      console.log(`\n📝 Fallos guardados en: ${outPath}`);
    } catch (e) {
      console.warn('⚠️ No se pudo guardar import-failures.json:', e.message);
    }
  }
}

// Helpers: try POSTing several payload shapes
async function tryPostWithVariants(endpoint, product) {
  const baseVariants = buildPayloadVariants(product);
  const variants = buildWrapperVariants(baseVariants);
  for (let i = 0; i < variants.length; i++) {
    const body = variants[i];
    try {
      console.log(`   ➤ Intentando variante ${i + 1}/${variants.length}`);
      const response = await axios.post(endpoint, body, {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json', ...authHeaders() }
      });
      return response;
    } catch (err) {
      const status = err.response?.status;
      console.log(`   ✖ Variante ${i + 1} fallo - status: ${status ?? 'no-response'} - ${err.message}`);
      if (err.response && err.response.data) console.log('     body:', JSON.stringify(err.response.data));
    }
  }
  return null;
}

function buildPayloadVariants(p) {
  const original = p;

  const spanish = {
    nombre: p.name,
    descripcion: p.description,
    precio: p.price,
    precioOriginal: p.originalPrice ?? null,
    imagen: p.image,
    categoria: p.categoria ?? p.category,
    tipo: p.tipo ?? p.type,
    oferta: p.oferta ?? false,
    stock: p.stock ?? 0,
    tallas: p.tallas ?? p.sizes,
    colores: p.colores ?? p.colors,
    estilo: p.estilo ?? p.style
  };

  const english = {
    name: p.name,
    title: p.name,
    description: p.description,
    price: p.price,
    originalPrice: p.originalPrice ?? null,
    image: p.image,
    category: p.categoria ?? p.category,
    type: p.tipo ?? p.type,
    onSale: p.oferta ?? false,
    stock: p.stock ?? 0,
    sizes: p.tallas ?? p.sizes,
    colors: p.colores ?? p.colors,
    style: p.estilo ?? p.style
  };

  const imagesVariant = { ...english, images: Array.isArray(p.images) ? p.images : [p.image] };
  // Variantes adicionales: ids o objetos anidados que algunos backends esperan
  const spanishWithCategoriaId = { ...spanish, categoriaId: p.categoriaId ?? null };
  const spanishNestedCategoria = { ...spanish, categoria: { nombre: p.categoria ?? p.category } };
  const englishWithCategoryId = { ...english, categoryId: p.categoryId ?? null };
  const englishNestedCategory = { ...english, category: { name: p.categoria ?? p.category } };

  // Small normalization: ensure price is number and stock is integer
  const normalizeNums = obj => ({
    ...obj,
    price: obj.price ? Number(obj.price) : 0,
    originalPrice: obj.originalPrice ? Number(obj.originalPrice) : obj.originalPrice,
    stock: obj.stock ? parseInt(obj.stock, 10) : 0
  });

  const variants = [original, spanish, english, imagesVariant, spanishWithCategoriaId, spanishNestedCategoria, englishWithCategoryId, englishNestedCategory].map(normalizeNums);

  return variants;
}

// Additional wrapper/minimal variants to try when backend expects a different root key
function buildWrapperVariants(baseVariants) {
  const wrapped = [];
  for (const v of baseVariants) {
    wrapped.push(v); // as-is
    wrapped.push({ producto: v });
    wrapped.push({ product: v });
    wrapped.push({ data: v });
    // minimal shapes
    wrapped.push({ name: v.name || v.nombre, price: v.price || v.precio });
    wrapped.push({ nombre: v.nombre || v.name, precio: v.precio || v.price });
  }
  // dedupe by JSON string
  const seen = new Set();
  const dedup = [];
  for (const w of wrapped) {
    const key = JSON.stringify(w);
    if (!seen.has(key)) {
      seen.add(key);
      dedup.push(w);
    }
  }
  return dedup;
}

// Ejecutar importación
(async () => {
  try {
    const correctEndpoint = await findCorrectEndpoint();
    
    if (!correctEndpoint) {
      console.error('\n💥 No se encontró un endpoint válido.');
      console.error('Verifica la URL de tu backend y los endpoints disponibles.');
      process.exit(1);
    }
    
    await importProducts(correctEndpoint);
  } catch (error) {
    console.error('💥 Error crítico:', error.message);
    process.exit(1);
  }
})();
