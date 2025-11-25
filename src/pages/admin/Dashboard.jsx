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
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <Text variant="h1">👑 Panel de Administración</Text>
          <div className="user-actions">
            <Text variant="p" className="user-info">
              Bienvenido, <strong>{userNombre}</strong> ({userRol})
            </Text>
            <Button variant="outline-dark" onClick={handleLogout}>
              🚪 Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

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