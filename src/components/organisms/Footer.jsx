import React from "react";
import Text from "../atoms/Text";

const Footer = () => {
  return (  
    <footer className="page-footer bg-dark text-white pt-4">
      <div className="container">
        <div className="row">
          <div className="col-md-6 text-start">
            <Text variant="h5">DEP URBAN WEAR</Text>
            <Text variant="p">Estilo urbano, actitud callejera. Suscríbete para nuevas colecciones.</Text>
            <ul className="ps-0 list-unstyled">
              <li><a className="text-white" href="https://www.instagram.com">📷 Instagram</a></li>
              <li><a className="text-white" href="https://www.facebook.com">👤 Facebook</a></li>
              <li><a className="text-white" href="https://www.tiktok.com">🎵 TikTok</a></li>
              <li><a className="text-white" href="https://www.x.com">🐦 X/Twitter</a></li>
            </ul>
          </div>
          <div className="col-md-6">
            <Text variant="h5">AYUDA DEP</Text>
            <ul className="ps-0 list-unstyled">
              <li><a className="text-white" href="#!">📞 Servicio al Cliente</a></li>
              <li><a className="text-white" href="#!">🏪 Nuestras Tiendas</a></li>
              <li><a className="text-white" href="#!">🚚 Click & Collect</a></li>
              <li><a className="text-white" href="#!">📄 Términos y Condiciones</a></li>
              <li><a className="text-white" href="#!">🔒 Política de Privacidad</a></li>
              <li><a className="text-white" href="#!">🍪 Política de Cookies</a></li>
              <li><a className="text-white" href="#!">📧 Contacto</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-copyright border-top pt-3 pb-2" style={{ background: "#222" }}>
        <div className="container-fluid d-flex flex-column flex-md-row align-items-start justify-content-between">
          <div>
            <Text variant="span" className="fw-bold">© DEP URBAN WEAR 2024</Text>
            <ul className="ps-0 list-unstyled">
              <li><Text variant="small">Enfatizamos la exclusividad, calidad del diseño urbano y originalidad streetwear</Text></li>
              <li><Text variant="small">El contenido está protegido por copyright - DEP Urban Style</Text></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;