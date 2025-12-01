import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Text from "../../components/atoms/Text";
import Button from "../../components/atoms/Button";
import UsuarioService from "../../services/UsuarioService";

const MiCuenta = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [mensaje, setMensaje] = useState({ show: false, titulo: "", texto: "" });
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ nombre: "", email: "", phone: "", address: "", currentPassword: "", newPassword: "", confirmPassword: "" });

  useEffect(() => {
    const usuarioActivo = localStorage.getItem('isLoggedIn') === 'true';
    if (usuarioActivo) {
      const saved = {
        id: localStorage.getItem('userId') || '',
        nombre: localStorage.getItem('userNombre') || 'Usuario DEP',
        email: localStorage.getItem('userEmail') || 'usuario@dep.com',
        phone: localStorage.getItem('userPhone') || '',
        address: localStorage.getItem('userAddress') || ''
      };
      setUsuario(saved);
      setForm({ ...form, nombre: saved.nombre, email: saved.email, phone: saved.phone, address: saved.address });
    } else {
      mostrarMensaje("ℹ️ Información", "No hay usuario iniciado. Redirigiendo al login...");
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [navigate]);

  const cerrarSesion = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userNombre");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userAddress");
    localStorage.removeItem("userId");

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const guardarCambios = async () => {
    // Validaciones básicas
    if (!form.nombre || !form.email) {
      mostrarMensaje('❗ Campos requeridos', 'Nombre y correo son obligatorios');
      return;
    }

    if (form.newPassword || form.confirmPassword) {
      if (form.newPassword !== form.confirmPassword) {
        mostrarMensaje('❗ Error contraseña', 'La nueva contraseña y su confirmación no coinciden');
        return;
      }
    }

    // Actualizar localStorage primero
    localStorage.setItem('userNombre', form.nombre);
    localStorage.setItem('userEmail', form.email);
    localStorage.setItem('userPhone', form.phone || '');
    localStorage.setItem('userAddress', form.address || '');

    // Si existe un id de usuario, intentar guardar en backend
    const id = localStorage.getItem('userId');
    if (id) {
      try {
        const payload = { nombre: form.nombre, email: form.email, phone: form.phone, address: form.address };
        // Si el usuario cambió contraseña, enviar también
        if (form.newPassword) payload.password = form.newPassword;
        await UsuarioService.updateUsuario(id, payload);
        mostrarMensaje('✅ Guardado', 'Tus cambios se guardaron en el servidor');
      } catch (err) {
        console.warn('Error guardando usuario en servidor', err.message || err);
        mostrarMensaje('⚠️ Guardado local', 'Cambios guardados localmente, pero falló la actualización al servidor');
      }
    } else {
      mostrarMensaje('✅ Guardado local', 'Cambios guardados en tu navegador');
    }

    // Actualizar estado
    setUsuario(prev => ({ ...prev, nombre: form.nombre, email: form.email, phone: form.phone, address: form.address }));
    setEditMode(false);
    // Limpiar campos de contraseña
    setForm(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
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
                {!editMode ? (
                  <>
                    <div className="d-flex justify-content-between border-bottom py-2">
                      <Text variant="p" className="mb-0">👤 Nombre:</Text>
                      <Text variant="p" className="fw-bold mb-0">{usuario.nombre}</Text>
                    </div>
                    <div className="d-flex justify-content-between border-bottom py-2">
                      <Text variant="p" className="mb-0">📧 Email:</Text>
                      <Text variant="p" className="fw-bold mb-0">{usuario.email}</Text>
                    </div>
                    <div className="d-flex justify-content-between border-bottom py-2">
                      <Text variant="p" className="mb-0">📞 Teléfono:</Text>
                      <Text variant="p" className="fw-bold mb-0">{usuario.phone || '-'}</Text>
                    </div>
                    <div className="d-flex justify-content-between border-bottom py-2">
                      <Text variant="p" className="mb-0">📍 Dirección:</Text>
                      <Text variant="p" className="fw-bold mb-0">{usuario.address || '-'}</Text>
                    </div>
                  </>
                ) : (
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Nombre</label>
                      <input className="form-control" name="nombre" value={form.nombre} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Correo electrónico</label>
                      <input className="form-control" name="email" value={form.email} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Teléfono</label>
                      <input className="form-control" name="phone" value={form.phone} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Dirección</label>
                      <input className="form-control" name="address" value={form.address} onChange={handleChange} />
                    </div>
                    <hr />
                    <Text variant="p" className="text-muted">Si deseas cambiar la contraseña, completa los campos abajo.</Text>
                    <div className="mb-3">
                      <label className="form-label">Contraseña actual</label>
                      <input type="password" className="form-control" name="currentPassword" value={form.currentPassword} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Nueva contraseña</label>
                      <input type="password" className="form-control" name="newPassword" value={form.newPassword} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Confirmar nueva contraseña</label>
                      <input type="password" className="form-control" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
                    </div>
                  </form>
                )}
              </div>

              <div className="d-grid gap-3">
                {!editMode ? (
                  <>
                    <Button variant="dark" size="lg" onClick={() => setEditMode(true)}>✏️ Editar perfil</Button>
                    <Button variant="outline-danger" size="lg" onClick={cerrarSesion}>🚪 Cerrar Sesión</Button>
                  </>
                ) : (
                  <>
                    <Button variant="dark" size="lg" onClick={guardarCambios}>💾 Guardar cambios</Button>
                    <Button variant="outline-secondary" size="lg" onClick={() => { setEditMode(false); setForm({ ...form, nombre: usuario.nombre, email: usuario.email, phone: usuario.phone || '', address: usuario.address || '' }); }}>Cancelar</Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiCuenta;