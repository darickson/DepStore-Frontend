import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Text from "../../components/atoms/Text";
import Button from "../../components/atoms/Button";

const MiCuenta = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [mensaje, setMensaje] = useState({ show: false, titulo: "", texto: "" });

  useEffect(() => {
    const usuarioActivo = localStorage.getItem('isLoggedIn') === 'true';
    if (usuarioActivo) {
      setUsuario({ 
        nombre: localStorage.getItem('userNombre') || 'Usuario DEP',
        email: localStorage.getItem('userEmail') || 'usuario@dep.com'
      });
    } else {
      mostrarMensaje("ℹ️ Información", "No hay usuario iniciado. Redirigiendo al login...");
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [navigate]);

  const cerrarSesion = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userNombre");

    mostrarMensaje("👋 Sesión Cerrada", "Has cerrado sesión en DEP URBAN correctamente");
    
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const mostrarMensaje = (titulo, texto) => {
    setMensaje({ show: true, titulo, texto });
  };

  const cerrarModal = () => {
    setMensaje({ ...mensaje, show: false });
  };

  if (!usuario) {
    return (
      <div className="container my-5 text-center">
        <Text variant="h4">🔄 Cargando...</Text>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow border-0">
            <div className="card-header bg-dark text-white text-center py-3">
              <Text variant="h4" className="mb-0">👤 MI CUENTA DEP</Text>
            </div>
            <div className="card-body p-4">
              {mensaje.show && (
                <div className="alert alert-info text-center">
                  <Text variant="h6" className="mb-1">{mensaje.titulo}</Text>
                  <Text variant="p" className="mb-0">{mensaje.texto}</Text>
                </div>
              )}
              
              <div className="text-center mb-4">
                <div 
                  className="bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center text-white mb-3"
                  style={{ 
                    width: '100px', 
                    height: '100px', 
                    fontSize: '2.5rem',
                    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
                  }}
                >
                  {usuario.nombre.charAt(0).toUpperCase()}
                </div>
                <Text variant="h4" className="fw-bold">{usuario.nombre}</Text>
                <Text variant="p" className="text-muted">{usuario.email}</Text>
              </div>

              <div className="mb-4">
                <Text variant="h5" className="text-muted mb-3">📊 Información de la cuenta</Text>
                <div className="d-flex justify-content-between border-bottom py-2">
                  <Text variant="p" className="mb-0">👤 Nombre:</Text>
                  <Text variant="p" className="fw-bold mb-0">{usuario.nombre}</Text>
                </div>
                <div className="d-flex justify-content-between border-bottom py-2">
                  <Text variant="p" className="mb-0">📧 Email:</Text>
                  <Text variant="p" className="fw-bold mb-0">{usuario.email}</Text>
                </div>
                <div className="d-flex justify-content-between border-bottom py-2">
                  <Text variant="p" className="mb-0">🟢 Estado:</Text>
                  <Text variant="p" className="fw-bold text-success mb-0">Activo</Text>
                </div>
                <div className="d-flex justify-content-between border-bottom py-2">
                  <Text variant="p" className="mb-0">🎯 Tipo:</Text>
                  <Text variant="p" className="fw-bold text-info mb-0">Cliente DEP URBAN</Text>
                </div>
              </div>

              <div className="d-grid gap-3">
                <Button 
                  variant="outline-dark" 
                  size="lg"
                  onClick={() => navigate('/')}
                >
                  🏪 Seguir Comprando
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="lg"
                  onClick={cerrarSesion}
                >
                  🚪 Cerrar Sesión
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiCuenta;