# 📦 Guía: Importar Productos a tu Backend

## Opción 1: Importar usando Postman o cURL (Recomendado)

### Con Postman:
1. Abre Postman
2. Nueva request: **POST**
3. URL: `https://depbackend-fullstack.onrender.com/api/products` (o tu URL)
4. En **Body** → **raw** → **JSON**
5. Copia el contenido de `products-seed.json`
6. Envía varios requests, uno por cada producto

### Con cURL:
```bash
curl -X POST https://depbackend-fullstack.onrender.com/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Baggy Jeans Negro Y2K",
    "description": "...",
    "price": 34990,
    "stock": 15
  }'
```

---

## Opción 2: Script Node.js (Bulk Import)

Crea `import-products.js` en tu backend:

```javascript
const axios = require('axios');
const products = require('./products-seed.json');

const API_URL = 'https://depbackend-fullstack.onrender.com/api/products';

async function importProducts() {
  try {
    for (const product of products) {
      const response = await axios.post(API_URL, product);
      console.log(`✅ Importado: ${product.name}`);
    }
    console.log('🎉 ¡Todos los productos importados!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

importProducts();
```

Ejecuta: `node import-products.js`

---

## Opción 3: MongoDB Import (Si usas MongoDB)

Si tu backend usa MongoDB, puedes importar directamente:

```bash
mongoimport --uri "mongodb://user:password@host/database" \
  --collection productos \
  --file products-seed.json \
  --jsonArray
```

---

## Opción 4: Administrador de Base de Datos

Si tienes acceso directo a tu BD:

1. **MongoDB Atlas**: 
   - Ve a Collections
   - Clic en "Insert Document"
   - Copia cada producto del JSON

2. **PostgreSQL/MySQL**:
   - Ejecuta INSERT manual o usa un admin tool

---

## ✅ Verificar que se importaron:

```bash
GET https://depbackend-fullstack.onrender.com/api/products
```

Deberías ver un array con los 20 productos.

---

## 🔄 Ahora en el Frontend:

- El frontend automaticamente cargará los productos del backend
- Cuando el admin cree/edite, se guardarán en la API
- Los usuarios verán los productos actualizados en tiempo real

---

## 📝 Notas:

- El archivo `products-seed.json` tiene todos los 20 productos con stock
- Están listos para importar directamente a tu API
- Si tu API espera campos diferentes, ajusta el JSON según tu schema
- Si necesitas sincronizar cambios, el frontend tiene sistema de localStorage para offline
