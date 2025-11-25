import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Text from "../../components/atoms/Text";
import Button from "../../components/atoms/Button";
import { Input } from "../../components/atoms/Input";
import "../styles/Login.css";
import predefinedUsers from '../../data/predefinedUsers';

const Login = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    login: { email: "", password: "" },
    registro: { nombre: "", email: "", password: "", confirmarPassword: "" },
  });
  const [mensaje, setMensaje] = useState({ titulo: "", texto: "", show: false });
  const navigate = useNavigate();

  // Usuarios predefinidos con roles (importados de data/predefinedUsers)
  const usuariosPredefinidos = predefinedUsers;

  const dominiosPermitidos = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"];

  const validarEmail = (email) => {
    const dominio = email.split("@")[1];
    return dominiosPermitidos.includes(dominio);
  };

  // Ocultar navbar cuando esté en login
  useEffect(() => {
    const navbar = document.querySelector('nav');
    if (navbar) {
      navbar.style.display = 'none';
    }

    return () => {
      if (navbar) {
        navbar.style.display = 'block';
      }
    };
  }, []);

  const handleInputChange = (tab, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [field]: value,
      },
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const { email, password } = formData.login;

    const storedNombre = localStorage.getItem("nombreUsuarioDEP");
    const storedEmail = localStorage.getItem("correoUsuarioDEP");
    const storedPassword = localStorage.getItem("passwordUsuarioDEP");
    const storedRol = localStorage.getItem("rolUsuarioDEP");

    let usuarioValido = null;

    // Verificar usuario registrado
    if (storedEmail && storedPassword) {
      if (email === storedEmail && password === storedPassword) {
        usuarioValido = { 
          nombre: storedNombre, 
          email: storedEmail,
          rol: storedRol || "user" // Por defecto user si no tiene rol
        };
      }
    }

    // Verificar usuarios predefinidos
    if (!usuarioValido) {
      usuariosPredefinidos.forEach(usuario => {
        if (email === usuario.email && password === usuario.password) {
          usuarioValido = usuario;
        }
      });
    }

    if (usuarioValido) {
      // Guardar datos en localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", usuarioValido.email);
      localStorage.setItem("userNombre", usuarioValido.nombre);
      localStorage.setItem("userRol", usuarioValido.rol);
      
      mostrarMensaje("🎉 ¡Bienvenido!", `Has iniciado sesión como ${usuarioValido.rol === 'admin' ? 'Administrador' : 'Usuario'}`);
      setFormData((prev) => ({ ...prev, login: { email: "", password: "" } }));
      
      // Redirigir según el rol
      setTimeout(() => {
        if (usuarioValido.rol === 'admin') {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }, 1500);
    } else {
      mostrarMensaje("❌ Error", "Correo o contraseña incorrectos");
    }
  };

  const handleRegistro = (e) => {
    e.preventDefault();
    const { nombre, email, password, confirmarPassword } = formData.registro;

    // Validar formato de email
    if (!validarEmail(email)) {
      mostrarMensaje("❌ Error", "Solo se permiten correos @gmail.com, @hotmail.com, etc.");
      return;
    }

    if (password !== confirmarPassword) {
      mostrarMensaje("❌ Error", "Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      mostrarMensaje("❌ Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    // Guardar usuario con rol de user por defecto
    localStorage.setItem("nombreUsuarioDEP", nombre);
    localStorage.setItem("correoUsuarioDEP", email);
    localStorage.setItem("passwordUsuarioDEP", password);
    localStorage.setItem("rolUsuarioDEP", "user"); // Rol por defecto

    mostrarMensaje("✅ ¡Cuenta Creada!", "Cuenta DEP creada correctamente. Ahora puedes iniciar sesión");
    setFormData((prev) => ({
      ...prev,
      registro: { nombre: "", email: "", password: "", confirmarPassword: "" },
    }));

    setTimeout(() => setActiveTab("login"), 1500);
  };

  const mostrarMensaje = (titulo, texto) => {
    setMensaje({ titulo, texto, show: true });
  };

  const cerrarModal = () => {
    setMensaje({ ...mensaje, show: false });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <Text variant="h1" className="text-center mb-2">🛍️ DEP URBAN</Text>
        <Text variant="p" className="text-center mb-4 login-subtitle">
          Estilo Urbano, Actitud Callejera
        </Text>

        {/* Tabs */}
        <div className="tabs-container">
          <button
            className={activeTab === "login" ? "tab-active" : "tab-inactive"}
            onClick={() => setActiveTab("login")}
          >
            🔐 INICIAR SESIÓN
          </button>
          <button
            className={activeTab === "registro" ? "tab-active" : "tab-inactive"}
            onClick={() => setActiveTab("registro")}
          >
            👤 CREAR CUENTA
          </button>
        </div>

        {/* Formulario de inicio de sesión */}
        {activeTab === "login" && (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email_login">📧 Correo electrónico</label>
              <Input
                id="email_login"
                type="email"
                required
                value={formData.login.email}
                onChange={(e) => handleInputChange("login", "email", e.target.value)}
                placeholder="usuario@dep.com o admin@dep.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password_login">🔒 Contraseña</label>
              <Input
                id="password_login"
                type="password"
                required
                value={formData.login.password}
                onChange={(e) => handleInputChange("login", "password", e.target.value)}
                placeholder="123456 o admin123"
              />
            </div>
            <Button type="submit" variant="dark" className="w-100 login-btn">
              🚀 INGRESAR A DEP
            </Button>
          </form>
        )}

        {/* Formulario de registro */}
        {activeTab === "registro" && (
          <form onSubmit={handleRegistro}>
            <div className="form-group">
              <label htmlFor="nombre_registro">👤 Nombre completo</label>
              <Input
                id="nombre_registro"
                type="text"
                required
                value={formData.registro.nombre}
                onChange={(e) => handleInputChange("registro", "nombre", e.target.value)}
                placeholder="Tu nombre completo"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email_registro">📧 Correo electrónico</label>
              <Input
                id="email_registro"
                type="email"
                required
                value={formData.registro.email}
                onChange={(e) => handleInputChange("registro", "email", e.target.value)}
                placeholder="tu@email.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password_registro">🔒 Contraseña</label>
              <Input
                id="password_registro"
                type="password"
                required
                value={formData.registro.password}
                onChange={(e) => handleInputChange("registro", "password", e.target.value)}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmar_password">✅ Confirme su contraseña</label>
              <Input
                id="confirmar_password"
                type="password"
                required
                value={formData.registro.confirmarPassword}
                onChange={(e) => handleInputChange("registro", "confirmarPassword", e.target.value)}
                placeholder="Repite tu contraseña"
              />
            </div>
            <Button
              type="submit"
              variant="success"
              className="w-100 login-btn"
            >
              🎉 CREAR CUENTA DEP
            </Button>
          </form>
        )}

        {/* Información de prueba ACTUALIZADA */}
        <div className="login-info">
          <Text variant="p" className="fw-bold mb-2">🧪 Datos de prueba:</Text>
          <Text variant="p" className="mb-1">👑 <strong>Admin:</strong> admin@dep.com / admin123</Text>
          <Text variant="p" className="mb-0">👤 <strong>Usuario:</strong> usuario@dep.com / 123456</Text>
        </div>
      </div>

      {/* Modal de mensaje */}
      {mensaje.show && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content">
            <Text variant="h5">{mensaje.titulo}</Text>
            <Text variant="p">{mensaje.texto}</Text>
            <Button onClick={cerrarModal} variant="outline-dark">
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;