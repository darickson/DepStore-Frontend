import axios from 'axios';

// API config
const API_BASE_URL = 'https://depbackend-fullstack.onrender.com/api/v1/productos';
const IMPORT_API_TOKEN = process.env.IMPORT_API_TOKEN || '';

function authHeaders() {
  return IMPORT_API_TOKEN ? { Authorization: `Bearer ${IMPORT_API_TOKEN}` } : {};
}

// Generate placeholder image URL
function generatePlaceholderUrl(productName, productId) {
  // Use picsum.photos with seed for consistency
  const seed = productName.replace(/\s+/g, '-').toLowerCase();
  return `https://picsum.photos/seed/${seed}${productId}/800/600?random=${Math.random()}`;
}

async function syncImagesPlaceholder() {
  try {
    console.log('📦 Obteniendo productos desde API...');
    const res = await axios.get(API_BASE_URL, { timeout: 15000 });
    const products = Array.isArray(res.data) ? res.data : [];
    console.log(`✅ Obtenidos ${products.length} productos\n`);

    // Build mapping with placeholder URLs
    const mapping = [];
    console.log('🖼️  Generando URLs de placeholder...\n');
    
    for (const product of products) {
      const productName = product.name || product.nombre || product.title || '';
      const productId = product.id || product._id || '';
      const currentImage = product.image || product.imagen || '';
      
      const placeholderUrl = generatePlaceholderUrl(productName, productId);
      
      mapping.push({
        productId,
        productName,
        currentImage,
        newImage: placeholderUrl,
        needsUpdate: !currentImage || !currentImage.includes('picsum.photos')
      });
      
      console.log(`✅ ${productName}`);
      console.log(`   URL: ${placeholderUrl}\n`);
    }

    // Summary
    const needsUpdate = mapping.filter(m => m.needsUpdate);
    console.log('📊 RESUMEN:');
    console.log('=====================================');
    console.log(`Total productos: ${mapping.length}`);
    console.log(`Se actualizarán: ${needsUpdate.length}`);
    console.log('');
    console.log('Para aplicar los cambios, ejecuta:');
    console.log('  node sync-images-placeholder.js --apply');
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
        await new Promise(r => setTimeout(r, 300));
      }

      console.log('\n✅ COMPLETADO');
      console.log(`   Actualizados: ${updated}`);
      console.log(`   Fallidos: ${failed}`);
      console.log('\n🎉 Abre tu app en http://localhost:5173 para ver las imágenes cargadas!');
    }

  } catch (err) {
    console.error('💥 Error:', err.message);
    process.exit(1);
  }
}

syncImagesPlaceholder();
