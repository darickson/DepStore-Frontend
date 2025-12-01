// pages/admin/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Text from "../../components/atoms/Text";
import Button from "../../components/atoms/Button";

const Dashboard = () => {
  const navigate = useNavigate();
  const userNombre = localStorage.getItem("userNombre");
  const userRol = localStorage.getItem("userRol");

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userNombre");
    localStorage.removeItem("userRol");
    navigate("/login");
  };

  const adminFeatures = [
    { title: "📦 Gestión de Productos", path: "/admin/products", description: "Administrar productos de la tienda" },
    { title: "👥 Gestión de Usuarios", path: "/admin/users", description: "Administrar usuarios del sistema" },
    { title: "💰 Ventas y Pedidos", path: "/admin/orders", description: "Ver reportes de ventas" },
    { title: "📊 Inventario", path: "/admin/inventory", description: "Control de stock" },
    { title: "🏷️ Categorías", path: "/admin/categories", description: "Gestionar categorías" },
    { title: "📈 Analytics", path: "/admin/analytics", description: "Estadísticas de la tienda" }
  ];

  return (
    <div className="admin-dashboard">
      {/* Decorative hero + Welcome */}
      <section className="admin-hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <div className="hero-left">
              <Text variant="h1">👑 Panel de Administración</Text>
              <Text variant="p" className="hero-subtitle">Bienvenido, <strong>{userNombre || 'Administrador'}</strong> — aquí puedes gestionar tu tienda fácilmente.</Text>
              <div className="hero-cta">
                <Button variant="dark" onClick={() => navigate('/mi-cuenta')}>Ver mi perfil</Button>
                <Button variant="outline-dark" onClick={handleLogout} style={{marginLeft: '12px'}}>Cerrar sesión</Button>
              </div>
            </div>

            <div className="hero-right">
              <div className="welcome-card">
                <Text variant="h4">Guía rápida</Text>
                <ol className="steps-list">
                  <li className="step-item"><strong>Paso 1:</strong> Accede a <em>Editar productos</em> para agregar/editar items.</li>
                  <li className="step-item"><strong>Paso 2:</strong> Revisa inventario y actualiza stock si es necesario.</li>
                  <li className="step-item"><strong>Paso 3:</strong> Publica cambios y revisa la tienda pública.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <div className="admin-features-grid">
        {adminFeatures.map((feature, index) => (
          <div key={index} className="feature-card">
            <Text variant="h4">{feature.title}</Text>
            <Text variant="p" className="feature-description">
              {feature.description}
            </Text>
            <Button 
              variant="dark" 
              onClick={() => navigate(feature.path)}
              className="feature-btn"
            >
              Acceder
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;