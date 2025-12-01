import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import predefinedUsers from './data/predefinedUsers';
import UsuarioService from './services/UsuarioService';
import Navbar from './components/organisms/Navbar';
import Footer from './components/organisms/Footer';

const Noticias = () => (
  <div className="container my-5">
    <div className="text-center">
      <h1>📰 Noticias Tecnológicas</h1>
      <p>Últimas noticias del mundo tech...</p>
    </div>
  </div>
);

const SafeHome = React.lazy(() => import('./pages/user/Home'));
const SafeProducts = React.lazy(() => import('./pages/user/Products'));
const SafeProductDetail = React.lazy(() => import('./pages/user/ProductDetail'));
const SafeMiCuenta = React.lazy(() => import('./pages/user/MiCuenta'));
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts = React.lazy(() => import('./pages/admin/ProductsAdmin'));

const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="loading-container">Cargando...</div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login-safe" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user } = useAuth();
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    if (!user) {
      alert('⚠️ Debes iniciar sesión para agregar productos al carrito');
      window.location.href = '/login-safe';
      return;
    }

    console.log("🛒 Agregando al carrito:", producto.name);

    setCarrito(carritoActual => {
      const productoExistente = carritoActual.find(item => 
        item.id === producto.id && 
        item.tallaSeleccionada === producto.tallaSeleccionada &&
        item.colorSeleccionado === producto.colorSeleccionado
      );

      if (productoExistente) {
        return carritoActual.map(item =>
          item.id === producto.id && 
          item.tallaSeleccionada === producto.tallaSeleccionada &&
          item.colorSeleccionado === producto.colorSeleccionado
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [...carritoActual, { ...producto, cantidad: 1 }];
      }
    });

    alert(`✅ ${producto.name}${producto.tallaSeleccionada && producto.tallaSeleccionada !== 'Única' ? ` (Talla: ${producto.tallaSeleccionada})` : ''}${producto.colorSeleccionado && producto.colorSeleccionado !== 'Único' ? ` (Color: ${producto.colorSeleccionado})` : ''} agregado al carrito!`);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar carrito={carrito} />
        
        <main className="main-content">
          <React.Suspense fallback={<div className="text-center py-5">Cargando...</div>}>
            <Routes>
              <Route 
                path="/" 
                element={
                  <SafeHome 
                    carrito={carrito}
                    setCarrito={setCarrito}
                    agregarAlCarrito={agregarAlCarrito}
                  />
                } 
              />
              
              <Route 
                path="/products" 
                element={
                  <SafeProducts 
                    carrito={carrito}
                    setCarrito={setCarrito}
                    agregarAlCarrito={agregarAlCarrito}
                  />
                } 
              />
          
              <Route 
                path="/producto/:id" 
                element={
                  <SafeProductDetail 
                    agregarAlCarrito={agregarAlCarrito}
                  />
                } 
              />
              
              <Route 
                path="/admin/dashboard" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/products"
                element={
                  <AdminRoute>
                    <AdminProducts />
                  </AdminRoute>
                }
              />
              
              <Route path="/login-safe" element={<LoginSafe />} />

              <Route 
                path="/carrito" 
                element={
                  <ProtectedRoute>
                    <CarritoSafe carrito={carrito} setCarrito={setCarrito} />
                  </ProtectedRoute>
                } 
              />

              <Route path="/login" element={<LoginSafe />} />
              <Route path="/noticias" element={<Noticias />} />
              <Route path="/mi-cuenta" element={<ProtectedRoute><SafeMiCuenta /></ProtectedRoute>} />
            </Routes>
          </React.Suspense>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-container">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login-safe" replace />;
  }

  return children;
}

function LoginSafe() {
  const [isLogin, setIsLogin] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    nombre: '',
    email: '',
    password: '',
    telefono: ''
  });

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const usuariosPredefinidos = predefinedUsers;

      const emailValido = 
        formData.email.includes('duoc') || 
        formData.email.includes('profesorduoc') ||
        formData.email.includes('dep');
      
      if (!emailValido) {
        alert('❌ Solo se permiten emails de DUOC o DEP (debe contener "duoc", "profesorduoc" o "dep")');
        setLoading(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      let userData;
      
      const usuarioPredefinido = usuariosPredefinidos.find(
        u => u.email === formData.email && u.password === formData.password
      );

      if (usuarioPredefinido) {
        userData = {
          id: Date.now(),
          nombre: usuarioPredefinido.nombre,
          email: usuarioPredefinido.email,
          rol: usuarioPredefinido.rol,
          tipo: 'pre-definido',
          fechaRegistro: new Date().toISOString()
        };
      } else if (isLogin) {
        const users = JSON.parse(localStorage.getItem('depUsers') || '[]');
        const userFound = users.find(u => u.email === formData.email && u.password === formData.password);
        
        if (!userFound) {
          alert('❌ Email o contraseña incorrectos');
          setLoading(false);
          return;
        }
        
        userData = {
          id: userFound.id,
          nombre: userFound.nombre,
          email: userFound.email,
          telefono: userFound.telefono,
          rol: 'user',
          tipo: 'registrado',
          fechaRegistro: userFound.fechaRegistro
        };
      } else {
        const users = JSON.parse(localStorage.getItem('depUsers') || '[]');
        const userExists = users.find(u => u.email === formData.email);
        if (userExists) {
          alert('❌ El email ya está registrado (local)');
          setLoading(false);
          return;
        }

        const newUserPayload = {
          nombre: formData.nombre,
          email: formData.email,
          password: formData.password,
          telefono: formData.telefono || ''
        };

        try {
          const resp = await UsuarioService.createUsuario(newUserPayload);
          const created = resp?.data || resp?.data?.data || resp;
          const createdId = created?.id || created?._id || Date.now();

          userData = {
            id: createdId,
            nombre: created?.nombre || newUserPayload.nombre,
            email: created?.email || newUserPayload.email,
            telefono: created?.telefono || newUserPayload.telefono || '',
            rol: created?.rol || 'user',
            tipo: 'nuevo',
            fechaRegistro: created?.fechaRegistro || new Date().toISOString()
          };
        } catch (err) {
          console.warn('Fallo crear usuario en backend, guardando localmente', err?.message || err);

          const newUser = {
            id: Date.now(),
            nombre: formData.nombre,
            email: formData.email,
            password: formData.password,
            telefono: formData.telefono,
            fechaRegistro: new Date().toISOString()
          };

          users.push(newUser);
          localStorage.setItem('depUsers', JSON.stringify(users));

          userData = {
            id: newUser.id,
            nombre: newUser.nombre,
            email: newUser.email,
            telefono: newUser.telefono,
            rol: 'user',
            tipo: 'nuevo',
            fechaRegistro: newUser.fechaRegistro
          };
        }
      }
      
      login(userData);
      alert(`✅ ¡Bienvenido a DEP URBAN, ${userData.nombre}!`);
      
      if (userData.rol === 'admin') {
        window.location.href = '/admin/dashboard';
      } else {
        window.location.href = '/';
      }
      
      setLoading(false);

    } catch (error) {
      alert(`❌ Error: ${error}`);
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-dark text-white text-center">
              <h3 className="mb-0">
                {isLogin ? '🔐 INICIAR SESIÓN DEP' : '📝 REGISTRARSE EN DEP'}
              </h3>
              <small className="text-warning">Solo emails DUOC y DEP</small>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="mb-3">
                    <label className="form-label">Nombre completo</label>
                    <input 
                      type="text" 
                      name="nombre"
                      className="form-control" 
                      placeholder="Tu nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}
                
                <div className="mb-3">
                  <label className="form-label">Email DUOC o DEP</label>
                  <input 
                    type="email" 
                    name="email"
                    className="form-control" 
                    placeholder="usuario@duoc.cl o usuario@dep.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <div className="form-text text-warning">
                    Solo se permiten emails que contengan "duoc", "profesorduoc" o "dep"
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input 
                    type="password" 
                    name="password"
                    className="form-control" 
                    placeholder="••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                {!isLogin && (
                  <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input 
                      type="tel" 
                      name="telefono"
                      className="form-control" 
                      placeholder="+56 9 1234 5678"
                      value={formData.telefono}
                      onChange={handleChange}
                    />
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn btn-dark w-100 py-2"
                  disabled={loading}
                >
                  {loading ? 'Cargando...' : (isLogin ? 'INGRESAR' : 'REGISTRARSE')}
                </button>
              </form>
              
              <div className="text-center mt-3">
                <p className="text-muted">
                  {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
                  <button 
                    type="button"
                    className="btn btn-link p-0"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? 'Regístrate' : 'Inicia sesión'}
                  </button>
                </p>
              </div>

              <div className="mt-4">
                <div className="alert alert-info">
                  <h6>👥 Usuarios de Prueba:</h6>
                  <small>
                    <strong>Admins DEP:</strong> admin@dep.com (admin123) | 
                    dar.cerna@dep.com (Dep2411) | e.arias@dep.com (Dep2411)<br/>
                    <strong>Usuarios:</strong> cliente@dep.com (cliente123) | 
                    alumno@duoc.cl (alumno123)
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CarritoSafe({ carrito, setCarrito }) {
  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const total = carrito.reduce((sum, item) => sum + (item.price * item.cantidad), 0);

  return (
    <div className="container py-5 maximum-width">
      <h1 className="text-center mb-4 display-4">🛒 TU CARRITO DEP</h1>
      
      {carrito.length === 0 ? (
        <div className="text-center py-5">
          <h4>Tu carrito está vacío</h4>
          <p className="text-muted">Agrega algunos productos para continuar</p>
          <Link to="/products" className="btn btn-dark btn-lg">Comenzar a Comprar</Link>
        </div>
      ) : (
        <div>
          {carrito.map(item => (
            <div key={`${item.id}-${item.tallaSeleccionada}-${item.colorSeleccionado}`} className="card mb-3 shadow-sm">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5>{item.name}</h5>
                  <p className="mb-0">${item.price.toLocaleString()} x {item.cantidad}</p>
                  <small className="text-muted">
                    {item.categoria} • {item.tipo}
                    {item.tallaSeleccionada && item.tallaSeleccionada !== 'Única' && (
                      <span className="ms-2 fw-bold text-dark">| Talla: {item.tallaSeleccionada}</span>
                    )}
                    {item.colorSeleccionado && item.colorSeleccionado !== 'Único' && (
                      <span className="ms-2 fw-bold text-dark">| Color: {item.colorSeleccionado}</span>
                    )}
                  </small>
                </div>
                <div>
                  <span className="fw-bold me-3 fs-5">
                    ${(item.price * item.cantidad).toLocaleString()}
                  </span>
                  <button 
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => eliminarDelCarrito(item.id)}
                  >
                    ❌ Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="text-end display-6">Total: ${total.toLocaleString()}</h4>
            </div>
          </div>
          
          <div className="d-flex justify-content-between mt-4">
            <button className="btn btn-outline-dark btn-lg" onClick={vaciarCarrito}>
              🗑️ Vaciar Carrito
            </button>
            <button className="btn btn-success btn-lg">💳 Proceder al Pago</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
