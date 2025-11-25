import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API config
const API_BASE_URL = 'https://depbackend-fullstack.onrender.com/api/v1/productos';
const IMPORT_API_TOKEN = process.env.IMPORT_API_TOKEN || '';

// Local images directory
const IMG_DIR = path.join(__dirname, 'public', 'img');

function authHeaders() {
  return IMPORT_API_TOKEN ? { Authorization: `Bearer ${IMPORT_API_TOKEN}` } : {};
}

// Simple fuzzy match: check if filename contains key words from product name
function fuzzyMatch(productName, filename) {
  const nameWords = productName.toLowerCase().split(/[\s\-_]+/).filter(w => w.length > 2);
  const filenameWords = filename.toLowerCase().replace(/\.webp$/, '').split(/[\s\-_]+/).filter(w => w.length > 2);
  
  const matches = nameWords.filter(word => filenameWords.some(fw => fw.includes(word) || word.includes(fw)));
  return matches.length > 0 ? matches.length : 0;
}

async function syncImagesLocal() {
  try {
    console.log('📦 Obteniendo productos desde API...');
    const res = await axios.get(API_BASE_URL, { timeout: 15000 });
    const products = Array.isArray(res.data) ? res.data : [];
    console.log(`✅ Obtenidos ${products.length} productos\n`);

    // Get available images
    const images = fs.readdirSync(IMG_DIR).filter(f => f.endsWith('.webp'));
    console.log(`📁 Imágenes disponibles en public/img: ${images.length}`);
    images.forEach(img => console.log(`  - ${img}`));
    console.log('');

    // Build mapping
    const mapping = [];
    for (const product of products) {
      const productName = product.name || product.nombre || product.title || '';
      const currentImage = product.image || product.imagen || '';
      
      // Find best match
      let bestMatch = null;
      let bestScore = 0;
      
      for (const img of images) {
        const score = fuzzyMatch(productName, img);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = img;
        }
      }

      if (bestMatch) {
        const imagePath = `/img/${bestMatch}`;
        mapping.push({
          productId: product.id || product._id,
          productName,
          currentImage,
          newImage: imagePath,
          matchScore: bestScore,
          filename: bestMatch,
          needsUpdate: currentImage !== imagePath
        });
      } else {
        mapping.push({
          productId: product.id || product._id,
          productName,
          currentImage,
          newImage: null,
          matchScore: 0,
          filename: 'NO MATCH',
          needsUpdate: false
        });
      }
    }

    // Display mapping
    console.log('🔍 MAPEO PROPUESTO:');
    console.log('=====================================');
    mapping.forEach((m, i) => {
      if (m.newImage) {
        console.log(`${i + 1}. ${m.productName}`);
        console.log(`   Archivo: ${m.filename} (score: ${m.matchScore})`);
        console.log(`   Nueva imagen: ${m.newImage}`);
        if (m.needsUpdate) {
          console.log(`   ✅ SE ACTUALIZARÁ`);
        } else {
          console.log(`   ⏭️  YA TIENE ESTA IMAGEN`);
        }
      } else {
        console.log(`${i + 1}. ${m.productName}`);
        console.log(`   ❌ SIN COINCIDENCIA (verifica manualmente)`);
      }
      console.log('');
    });

    // Ask user to confirm
    const needsUpdate = mapping.filter(m => m.needsUpdate);
    console.log(`📊 RESUMEN: ${needsUpdate.length}/${mapping.length} productos se actualizarán`);
    console.log('');
    console.log('Para confirmar y aplicar los cambios, ejecuta:');
    console.log('  node sync-images-local.js --apply');
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

syncImagesLocal();
