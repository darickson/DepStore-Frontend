## Estructura de Carpetas - Frontend DEP

La estructura del proyecto se divide en dos áreas principales: **Admin** y **User**.

### `/src/pages/admin/`
- **Dashboard.jsx** - Panel principal de administración
- **ProductsAdmin.jsx** - Gestión de productos (CRUD)
- **Inventory.jsx** *(próximamente)* - Vista de inventario por producto
- **SalesHistory.jsx** *(próximamente)* - Historial de ventas y transacciones
- **/components/** - Componentes reutilizables específicos del admin
  - AdminProductForm.jsx - Formulario para crear/editar productos
  - *Otros componentes admin...*
- **/data/** - Datos y configuración de admin
  - adminData.js - Datos estáticos para tablas/paneles

### `/src/pages/user/`
- **Home.jsx** - Página principal
- **Products.jsx** - Listado de productos (tienda)
- **ProductDetail.jsx** - Detalle de un producto individual
- **Carrito.jsx** - Carrito de compras
- **PagoForm.jsx** - Formulario de pago
- **MiCuenta.jsx** - Perfil del usuario
- **Login.jsx** - Página de inicio de sesión
- **Blogs.jsx**, **Noticias.jsx**, **Contact.jsx** - Páginas informativas
- **RopaHombre.jsx**, **RopaMujer.jsx**, **RopaInfantil.jsx** - Categorías de ropa
- **/components/** - Componentes reutilizables específicos del user
- **/data/** - Datos específicos de user (si aplica)

### `/src/components/` (Compartidos)
- **/atoms/** - Componentes básicos (Button, Input, Text, Badge, Image)
- **/molecules/** - Componentes compuestos (CardBody, DynamicForm, etc.)
- **/organisms/** - Componentes grandes (Navbar, Footer, ProductCard)
- **/templates/** - Plantillas (Section)

### `/src/contexts/`
- **AuthContext.jsx** - Gestión de autenticación y roles (admin/user)

### `/src/services/`
- Servicios de API (ProductoService, UsuarioService, VentaService, etc.)

### `/src/data/`
- **predefinedUsers.js** - Usuarios predefinidos para login
- **Products.js** - Datos de productos

---

## Flujo de Acceso

### Usuarios (User)
- Acceden a `/` → Home
- Navegan por `/products` → ProductList
- Pueden ver `/producto/:id` → ProductDetail
- Carrito en `/carrito`
- Login en `/login-safe` → redirige a `/` si es exitoso

### Administradores (Admin)
- Después de login, acceden a `/admin/dashboard` → Dashboard
- Desde ahí pueden ir a:
  - `/admin/products` → Gestionar productos (CRUD)
  - `/admin/inventory` *(próximamente)* → Ver stock
  - `/admin/sales-history` *(próximamente)* → Ver ventas

---

## Rutas Protegidas

Las rutas bajo `/admin/*` están protegidas por `AdminRoute` que verifica:
- Usuario autenticado (`useAuth()`)
- Usuario con rol `admin` (`isAdmin === true`)
- Si no cumple, redirige a `/`

---

## Próximos Pasos

1. ✅ Crear estructura de carpetas admin/user
2. ⏳ Implementar Vista de Inventario (`Inventory.jsx`)
3. ⏳ Implementar Historial de Ventas (`SalesHistory.jsx`)
4. ⏳ Mejorar UI/UX (modales, validaciones, upload de imágenes)
5. ⏳ Conectar variables de entorno (VITE_API_URL)
