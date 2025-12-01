import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Button as BSButton } from "react-bootstrap";
import Text from "../atoms/Text";
import Button from "../atoms/Button";
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

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
    const off = document.getElementById('offcanvasMenu');
    if (off) {
      const bsOff = window.bootstrap?.Offcanvas.getInstance(off);
      if (bsOff) bsOff.hide();
    }
  };

  return (
    <>
      <nav className="navbar bg-dark text-white border-bottom border-danger" style={{ borderWidth: '3px' }}>
        <div className="d-flex align-items-center justify-content-between px-4 w-100">
          <button
            className="btn text-white"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasMenu"
            aria-controls="offcanvasMenu"
          >
            <i className="material-icons fs-4">menu</i>
          </button>

          <Link to="/" className="navbar-brand mx-auto">
            <Text variant="h3" className="fw-bold mb-0" style={{ color: '#ff0000' }}>
              🛍️ DEP URBAN
            </Text>
          </Link>

          <div className="iconos-derecha d-flex align-items-center gap-3">
            {user ? (
              <div className="d-flex align-items-center gap-2">
                <span className="text-white fw-bold d-none d-md-block">
                  👋 {user.nombre || user.name}
                </span>
                <button 
                  className="btn btn-outline-danger btn-sm fw-bold" 
                  onClick={handleLogout}
                >
                  🔓 Salir
                </button>
              </div>
            ) : (
              <Link to="/login-safe" className="btn btn-danger fw-bold">
                <i className="material-icons me-1">login</i> Ingresar
              </Link>
            )}

            <Link to="/carrito" className="btn btn-outline-danger position-relative fw-bold">
              <i className="material-icons">shopping_cart</i>
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
        <div className="offcanvas-header bg-dark text-white">
          <Text variant="h5" className="offcanvas-title fw-bold" id="offcanvasMenuLabel">
            🛍️ DEP URBAN
          </Text>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="Cerrar"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="menu-category fw-bold mb-3">
            <Link to="/" className="text-dark text-decoration-none d-flex align-items-center gap-2">
              <i className="material-icons">home</i> INICIO
            </Link>
          </div>

          <div className="menu-category fw-bold mb-3">
            <Link to="/products" className="text-dark text-decoration-none d-flex align-items-center gap-2">
              <i className="material-icons">shopping_bag</i> TODOS LOS PRODUCTOS
            </Link>
          </div>

          <div 
            className="menu-category fw-bold mb-2 cursor-pointer"
            onClick={() => toggleSubMenu("hombre")}
            style={{ cursor: 'pointer' }}
          >
            <div className="d-flex align-items-center gap-2">
              <i className="material-icons">male</i> 
              HOMBRE URBANO
              <i className="material-icons ms-auto">{subMenu.hombre ? 'expand_less' : 'expand_more'}</i>
            </div>
          </div>
          {subMenu.hombre && (
            <div className="submenu ms-3 mb-3">
              <Link to="/hombre?categoria=poleras" className="d-block py-2 text-decoration-none text-dark">
                👕 Poleras Urbanas
              </Link>
              <Link to="/hombre?categoria=pantalones" className="d-block py-2 text-decoration-none text-dark">
                👖 Pantalones Street
              </Link>
              <Link to="/hombre?categoria=chaquetas" className="d-block py-2 text-decoration-none text-dark">
                🧥 Chaquetas Urbanas
              </Link>
              <Link to="/hombre?categoria=todo" className="d-block py-2 text-decoration-none text-danger fw-bold">
                🔥 Ver Todo Hombre
              </Link>
            </div>
          )}

          <div 
            className="menu-category fw-bold mb-2 cursor-pointer"
            onClick={() => toggleSubMenu("mujer")}
            style={{ cursor: 'pointer' }}
          >
            <div className="d-flex align-items-center gap-2">
              <i className="material-icons">female</i> 
              MUJER URBANA
              <i className="material-icons ms-auto">{subMenu.mujer ? 'expand_less' : 'expand_more'}</i>
            </div>
          </div>
          {subMenu.mujer && (
            <div className="submenu ms-3 mb-3">
              <Link to="/mujer?categoria=poleras" className="d-block py-2 text-decoration-none text-dark">
                👚 Poleras Street
              </Link>
              <Link to="/mujer?categoria=pantalones" className="d-block py-2 text-decoration-none text-dark">
                🩳 Pantalones Urbanos
              </Link>
              <Link to="/mujer?categoria=chaquetas" className="d-block py-2 text-decoration-none text-dark">
                🧥 Chaquetas Moda
              </Link>
              <Link to="/mujer?categoria=todo" className="d-block py-2 text-decoration-none text-danger fw-bold">
                💫 Ver Todo Mujer
              </Link>
            </div>
          )}

          <div 
            className="menu-category fw-bold mb-2 cursor-pointer"
            onClick={() => toggleSubMenu("infantil")}
            style={{ cursor: 'pointer' }}
          >
            <div className="d-flex align-items-center gap-2">
              <i className="material-icons">child_care</i> 
              URBAN KIDS
              <i className="material-icons ms-auto">{subMenu.infantil ? 'expand_less' : 'expand_more'}</i>
            </div>
          </div>
          {subMenu.infantil && (
            <div className="submenu ms-3 mb-3">
              <Link to="/infantil?categoria=poleras" className="d-block py-2 text-decoration-none text-dark">
                👕 Poleras Kids
              </Link>
              <Link to="/infantil?categoria=pantalones" className="d-block py-2 text-decoration-none text-dark">
                👖 Pantalones Infantiles
              </Link>
              <Link to="/infantil?categoria=chaquetas" className="d-block py-2 text-decoration-none text-dark">
                🧥 Chaquetas Kids
              </Link>
              <Link to="/infantil?categoria=todo" className="d-block py-2 text-decoration-none text-danger fw-bold">
                🌟 Ver Todo Kids
              </Link>
            </div>
          )}

          <div className="menu-category fw-bold mb-3">
            <Link to="/noticias" className="text-dark text-decoration-none d-flex align-items-center gap-2">
              <i className="material-icons">newspaper</i> NOTICIAS TECNO
            </Link>
          </div>

          <div className="menu-category fw-bold mb-3">
            <button 
              className="btn btn-link text-dark text-decoration-none p-0 d-flex align-items-center gap-2"
              onClick={() => setShowAboutModal(true)}
              style={{ border: 'none' }}
            >
              <i className="material-icons">info</i> ¿QUIÉNES SOMOS?
            </button>
          </div>

          {isAdmin && (
            <div className="menu-category fw-bold mb-3">
              <Link to="/admin/dashboard" className="text-danger text-decoration-none d-flex align-items-center gap-2 fw-bold">
                <i className="material-icons">admin_panel_settings</i> 👑 Dashboard Admin
              </Link>
            </div>
          )}

          <div 
            className="menu-category fw-bold mb-2 cursor-pointer border-top pt-3"
            onClick={() => toggleSubMenu("cuenta")}
            style={{ cursor: 'pointer' }}
          >
            <div className="d-flex align-items-center gap-2">
              <i className="material-icons">person</i> 
              MI CUENTA DEP
              <i className="material-icons ms-auto">{subMenu.cuenta ? 'expand_less' : 'expand_more'}</i>
            </div>
          </div>
          {subMenu.cuenta && (
            <div className="submenu ms-3">
              <Link to="/mi-cuenta" className="d-block py-2 text-decoration-none text-dark">
                📊 Mi Perfil
              </Link>
              {user ? (
                <button 
                  onClick={handleLogout} 
                  className="btn btn-link d-block text-start p-0 py-2 text-decoration-none text-danger fw-bold"
                  style={{ border: 'none' }}
                >
                  🔓 Cerrar sesión
                </button>
              ) : (
                <Link to="/login-safe" className="d-block py-2 text-decoration-none text-danger fw-bold">
                  🔐 Login/Registro
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

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
