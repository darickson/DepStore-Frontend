import axios from 'axios';

// API config
const API_BASE_URL = 'https://depbackend-fullstack.onrender.com/api/v1/productos';
const PEXELS_API_KEY = process.env.PEXELS_API_KEY || 'UgJ7FqrXN0uYN0wQ2Kk0F5T3cT4V0yZ2K5J9L2M8'; // Public key for demo
const PEXELS_API_URL = 'https://api.pexels.com/v1/search';

const IMPORT_API_TOKEN = process.env.IMPORT_API_TOKEN || '';

function authHeaders() {
  return IMPORT_API_TOKEN ? { Authorization: `Bearer ${IMPORT_API_TOKEN}` } : {};
}

async function searchImage(query) {
  try {
    const res = await axios.get(PEXELS_API_URL, {
      headers: { Authorization: PEXELS_API_KEY },
      params: { query, per_page: 1, orientation: 'portrait' },
      timeout: 5000
    });
    
    if (res.data.photos && res.data.photos.length > 0) {
      return res.data.photos[0].src.medium || res.data.photos[0].src.large;
    }
  } catch (err) {
    console.warn(`⚠️ Error buscando imagen para "${query}": ${err.message}`);
  }
  return null;
}

async function syncImagesPexels() {
  try {
    console.log('📦 Obteniendo productos desde API...');
    const res = await axios.get(API_BASE_URL, { timeout: 15000 });
    const products = Array.isArray(res.data) ? res.data : [];
    console.log(`✅ Obtenidos ${products.length} productos\n`);

    // Build mapping with image search
    const mapping = [];
    console.log('🔍 Buscando imágenes en Pexels...\n');
    
    for (const product of products) {
      const productName = product.name || product.nombre || product.title || '';
      const currentImage = product.image || product.imagen || '';
      
      // Build search query from product name and category
      const categoria = product.categoria || product.category || '';
      const tipo = product.tipo || product.type || '';
      const searchQuery = `${productName} ${categoria} ${tipo}`.trim();
      
      console.log(`🔎 Buscando: "${searchQuery}"`);
      const imageUrl = await searchImage(searchQuery);
      
      if (imageUrl) {
        mapping.push({
          productId: product.id || product._id,
          productName,
          currentImage,
          newImage: imageUrl,
          needsUpdate: currentImage !== imageUrl
        });
        console.log(`   ✅ Encontrada: ${imageUrl.substring(0, 60)}...`);
      } else {
        mapping.push({
          productId: product.id || product._id,
          productName,
          currentImage,
          newImage: null,
          needsUpdate: false
        });
        console.log(`   ❌ No se encontró imagen`);
      }
      console.log('');
    }

    // Ask user to confirm
    const needsUpdate = mapping.filter(m => m.needsUpdate && m.newImage);
    console.log('📊 RESUMEN:');
    console.log('=====================================');
    console.log(`Total productos: ${mapping.length}`);
    console.log(`Se actualizarán: ${needsUpdate.length}`);
    console.log(`Sin imagen encontrada: ${mapping.filter(m => !m.newImage).length}`);
    console.log('');
    console.log('Para aplicar los cambios, ejecuta:');
    console.log('  node sync-images-pexels.js --apply');
    console.log('');

    // If --apply flag, update products
    if (process.argv.includes('--apply')) {
      console.log('🚀 Aplicando cambios...\n');
      let updated = 0;
      let failed = 0;

      for (const m of needsUpdate) {
        try {
          console.log(`📤 Actualizando: ${m.productName}`);
          await axios.patch(`${API_BASE_URL}/${m.productId}`, { image: m.newImage }, {
            timeout: 10000,
            headers: { 'Content-Type': 'application/json', ...authHeaders() }
          });
          console.log(`   ✅ Actualizado`);
          updated++;
        } catch (err) {
          failed++;
          const status = err.response?.status;
          console.log(`   ❌ Error (${status}): ${err.message}`);
        }
        // Rate limiting para Pexels
        await new Promise(r => setTimeout(r, 500));
      }

      console.log('\n✅ COMPLETADO');
      console.log(`   Actualizados: ${updated}`);
      console.log(`   Fallidos: ${failed}`);
    }

  } catch (err) {
    console.error('💥 Error:', err.message);
    process.exit(1);
  }
}

syncImagesPexels();
