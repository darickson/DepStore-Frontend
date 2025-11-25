import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Button as BSButton } from "react-bootstrap";
import Text from "../atoms/Text";
import Button from "../atoms/Button";
import { useAuth } from '../../contexts/AuthContext';

const Navbar = ({ carrito }) => {
  const [subMenu, setSubMenu] = useState({
    hombre: false,
    mujer: false,
    infantil: false,
    cuenta: false,
  });
  const [showAboutModal, setShowAboutModal] = useState(false);

  const toggleSubMenu = (menu) => {
    setSubMenu({ ...subMenu, [menu]: !subMenu[menu] });
  };

  const { user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    // optional: close offcanvas if open
    const off = document.getElementById('offcanvasMenu');
    if (off) {
      const bsOff = window.bootstrap?.Offcanvas.getInstance(off);
      if (bsOff) bsOff.hide();
    }
  };

  return (
    <>
      <nav className="navbar bg-dark text-white border-bottom">
        <div className="d-flex align-items-center justify-content-between px-3 w-100">
          <button
            className="btn text-white"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasMenu"
            aria-controls="offcanvasMenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <Link to="/" className="navbar-brand mx-auto">
            <Text variant="h4" className="fw-bold mb-0">
              🛍️ DEP URBAN
            </Text>
          </Link>

          <div className="iconos-derecha d-flex align-items-center">
            {user ? (
              <div className="d-flex align-items-center text-white me-3">
                <span className="me-2">👋 {user.nombre || user.name}</span>
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Salir</button>
              </div>
            ) : (
              <Link to="/login" className="btn text-white me-3">
                <span className="material-icons">perm_identity</span>
              </Link>
            )}

            <Link to="/carrito" className="btn text-white position-relative">
              <span className="material-icons">shopping_cart</span>
              {carrito.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {carrito.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="offcanvasMenu"
        aria-labelledby="offcanvasMenuLabel"
      >
        <div className="offcanvas-header">
          <Text variant="h5" className="offcanvas-title" id="offcanvasMenuLabel">
            DEP URBAN 
          </Text>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Cerrar"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="menu-category fw-bold">
            <Link to="/" className="text-dark text-decoration-none">🏠 INICIO</Link>
          </div>

          <div className="menu-category fw-bold mt-3">
            <Link to="/products" className="text-dark text-decoration-none">🛒 TODOS LOS PRODUCTOS</Link>
          </div>

          <div className="menu-category fw-bold mt-3" onClick={() => toggleSubMenu("hombre")}>
            🧔 HOMBRE URBANO
          </div>
          {subMenu.hombre && (
            <div className="submenu">
              <Link to="/hombre?categoria=poleras" className="d-block">👕 Poleras Urbanas</Link>
              <Link to="/hombre?categoria=pantalones" className="d-block">👖 Pantalones Street</Link>
              <Link to="/hombre?categoria=chaquetas" className="d-block">🧥 Chaquetas Urbanas</Link>
              <Link to="/hombre?categoria=todo" className="d-block">🔥 Ver Todo Hombre</Link>
            </div>
          )}

          {/* MUJER */}
          <div className="menu-category fw-bold mt-3" onClick={() => toggleSubMenu("mujer")}>
            👩 MUJER URBANA
          </div>
          {subMenu.mujer && (
            <div className="submenu">
              <Link to="/mujer?categoria=poleras" className="d-block">👚 Poleras Street</Link>
              <Link to="/mujer?categoria=pantalones" className="d-block">🩳 Pantalones Urbanos</Link>
              <Link to="/mujer?categoria=chaquetas" className="d-block">🧥 Chaquetas Moda</Link>
              <Link to="/mujer?categoria=todo" className="d-block">💫 Ver Todo Mujer</Link>
            </div>
          )}

          {/* INFANTIL */}
          <div className="menu-category fw-bold mt-3" onClick={() => toggleSubMenu("infantil")}>
            👶 URBAN KIDS
          </div>
          {subMenu.infantil && (
            <div className="submenu">
              <Link to="/infantil?categoria=poleras" className="d-block">👕 Poleras Kids</Link>
              <Link to="/infantil?categoria=pantalones" className="d-block">👖 Pantalones Infantiles</Link>
              <Link to="/infantil?categoria=chaquetas" className="d-block">🧥 Chaquetas Kids</Link>
              <Link to="/infantil?categoria=todo" className="d-block">🌟 Ver Todo Kids</Link>
            </div>
          )}

          {/* NOTICIAS - NUEVA SECCIÓN */}
          <div className="menu-category fw-bold mt-3">
            <Link to="/noticias" className="text-dark text-decoration-none">📰 NOTICIAS TECNO</Link>
          </div>

          {/* QUIÉNES SOMOS */}
          <div className="menu-category fw-bold mt-3">
            <button 
              className="btn btn-link text-dark text-decoration-none p-0 d-block"
              onClick={() => setShowAboutModal(true)}
            >
              ℹ️ ¿QUIÉNES SOMOS?
            </button>
          </div>

          {isAdmin && (
            <div className="menu-category fw-bold mt-3">
              <Link to="/admin/dashboard" className="text-dark text-decoration-none">👑 Dashboard Admin</Link>
            </div>
          )}

          {/* CUENTA */}
          <div className="menu-category fw-bold mt-3" onClick={() => toggleSubMenu("cuenta")}>
            👤 MI CUENTA DEP
          </div>
          {subMenu.cuenta && (
            <div className="submenu">
              <Link to="/mi-cuenta" className="d-block">📊 Mi Perfil</Link>
              {user ? (
                <button onClick={handleLogout} className="btn btn-link d-block text-start p-0">🔓 Cerrar sesión</button>
              ) : (
                <Link to="/login" className="d-block">🔐 Login/Registro</Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal Quiénes Somos */}
      <Modal show={showAboutModal} onHide={() => setShowAboutModal(false)} centered size="lg">
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>🌟 ¿QUIÉNES SOMOS?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Text variant="h5" className="fw-bold mb-3">DEP URBAN - Ropa con Estilo</Text>
          <p className="text-muted mb-3">
            Somos una tienda online especializada en ropa urbana y de moda para toda la familia. 
            Nuestro objetivo es brindar prendas de calidad, diseño moderno y precios accesibles.
          </p>
          
          <Text variant="h6" className="fw-bold mt-4 mb-2">🎯 NUESTRA MISIÓN</Text>
          <p className="text-muted">
            Ofrecer la mejor experiencia de compra con productos de tendencia, servicio al cliente excepcional 
            y una plataforma fácil de usar.
          </p>

          <Text variant="h6" className="fw-bold mt-4 mb-2">✨ ¿POR QUÉ ELEGIRNOS?</Text>
          <ul className="text-muted">
            <li>Productos de calidad premium</li>
            <li>Precios competitivos</li>
            <li>Envíos rápidos y seguros</li>
            <li>Atención al cliente 24/7</li>
            <li>Devoluciones fáciles</li>
            <li>Diseños exclusivos</li>
          </ul>

          <Text variant="h6" className="fw-bold mt-4 mb-2">📞 CONTACTO</Text>
          <p className="text-muted">
            Email: info@depurban.com<br/>
            WhatsApp: +34 612 345 678<br/>
            Dirección: Calle Principal 123, Madrid
          </p>
        </Modal.Body>
        <Modal.Footer>
          <BSButton variant="secondary" onClick={() => setShowAboutModal(false)}>
            Cerrar
          </BSButton>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Navbar;