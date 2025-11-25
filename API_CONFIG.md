## Configuración de API - DEP Frontend

### Variables de Entorno

El frontend usa la variable de entorno `VITE_API_URL` para apuntar a tu backend.

#### Archivo `.env` (Desarrollo Local)

```env
VITE_API_URL=http://localhost:8080
```

Si tu backend corre en un puerto o servidor diferente, actualiza este valor.

#### Ejemplos de URLs válidas:

- **Local**: `http://localhost:8080`
- **Render (backend remoto)**: `https://tu-app-backend.onrender.com`
- **Custom Domain**: `https://api.tudominio.com`
- **Con puerto custom**: `http://tu-servidor:3000`

### ¿Por qué faltan los productos?

El error "API no se encuentra" puede deberse a:

1. **Backend no está corriendo**
   - Verifica que tu servidor backend esté activo en `VITE_API_URL`
   - Prueba acceder a `VITE_API_URL/api/products` en el navegador

2. **URL incorrecta en `.env`**
   - Asegúrate que `VITE_API_URL` apunta al servidor correcto
   - Sin trailing slash (`/`) al final

3. **Endpoint incorrecto**
   - Todos los servicios usan endpoints bajo `/api/`
   - Confirma que tu backend tiene estas rutas:
     - `/api/products` - productos
     - `/api/usuario` - usuarios
     - `/api/venta` - ventas
     - `/api/categorias` - categorías
     - etc.

4. **CORS (Cross-Origin Resource Sharing)**
   - Tu backend debe permitir peticiones desde `http://localhost:5173` (dev)
   - En producción, debe permitir desde tu dominio frontend
   - Configura headers CORS en tu backend

### Endpoints Esperados

El frontend intenta acceder a estos endpoints. Verifica que existan en tu backend:

```
GET    {API_URL}/api/products          → Listar productos
POST   {API_URL}/api/products          → Crear producto
PUT    {API_URL}/api/products/:id      → Actualizar producto
DELETE {API_URL}/api/products/:id      → Eliminar producto

GET    {API_URL}/api/usuario           → Usuarios
GET    {API_URL}/api/venta             → Ventas
GET    {API_URL}/api/categorias        → Categorías
GET    {API_URL}/api/colores           → Colores
GET    {API_URL}/api/tallas            → Tallas
GET    {API_URL}/api/marca             → Marcas
GET    {API_URL}/api/metodo-pago       → Métodos de pago
GET    {API_URL}/api/metodo-envio      → Métodos de envío
GET    {API_URL}/api/imagen            → Imágenes
GET    {API_URL}/api/estado            → Estados
GET    {API_URL}/api/rol               → Roles
GET    {API_URL}/api/producto-venta    → Productos vendidos
```

### Testing Local

Para verificar si tu API funciona:

```bash
# En PowerShell (Windows)
Invoke-WebRequest -Uri "http://localhost:8080/api/products" -Method GET
```

O en el navegador: `http://localhost:8080/api/products`

### Después de cambiar `.env`

Reinicia el dev server para que los cambios se apliquen:

```bash
npm run dev
```

---

**¿Aún tienes errores?** Comparte:
1. La URL exacta de tu backend
2. El error exacto que ves en la consola del navegador (F12 → Console)
3. La respuesta de `http://localhost:8080/api/products` en el navegador
