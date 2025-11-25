import React, { useState } from "react";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import products from "../../data/Products";
import Text from "../../components/atoms/Text";
import Button from "../../components/atoms/Button";
import Image from "../../components/atoms/Image";

const Home = () => {
  const productosOferta = products.filter(product => product.oferta);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  return (
    <main className="home">
      {/* Hero Section - DEP URBANO */}
      <section className="mb-5">
        <div className="text-center mb-4">
          <Text variant="h1" className="fw-bold" style={{ color: "#2c3e50", fontSize: "3rem", animation: "fadeIn 1s ease-in" }}>
            🎯 DEP URBAN 
          </Text>
          <Text variant="p" className="fs-5 text-muted" style={{ animation: "fadeIn 1.5s ease-in" }}>
            ✨ Estilo urbano, actitud callejera, diseño exclusivo
          </Text>
        </div>
        <div className="card border-0 shadow-lg" style={{ overflow: "hidden" }}>
          <div style={{
            height: "400px", 
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "2.5rem",
            fontWeight: "bold",
            textAlign: "center",
            padding: "20px",
            animation: "slideIn 0.8s ease-out"
          }}>
            🛍️ COLECCIÓN URBANA | DONDE TU ESTILO NOS IMPORTA
          </div>
        </div>
      </section>

      {/* Sección de Categorías */}
      <section className="mb-5">
        <Container>
          <div className="text-center mb-4">
            <Text variant="h2" className="fw-bold">👕 EXPLORA POR CATEGORÍA</Text>
          </div>
          <Row xs={1} md={3} className="g-4">
            {["Hombre", "Mujer", "Infantil"].map((cat) => (
              <Col key={cat}>
                <Link to={`/products`} style={{ textDecoration: "none" }}>
                  <Card className="h-100 border-0 shadow-sm" style={{
                    cursor: "pointer",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    background: cat === "Hombre" ? "#e8f4f8" : cat === "Mujer" ? "#fce8f3" : "#f0e8fc"
                  }} 
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                  }}>
                    <Card.Body className="text-center py-5">
                      <Text variant="h3" className="fw-bold mb-3">
                        {cat === "Hombre" ? "👔" : cat === "Mujer" ? "👗" : "👶"}
                      </Text>
                      <Text variant="h4" className="fw-bold">{cat}</Text>
                      <Text variant="p" className="text-muted">Descubre lo mejor</Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      
      {/* Ofertas Urbanas */}
      <section className="mb-5">
        <Container>
          <div className="text-center mb-4">
            <Text variant="h2" className="fw-bold">🔥 OFERTAS HOT</Text>
            <Text variant="p" className="text-muted">Limitado por tiempo</Text>
          </div>
          <Row xs={1} md={3} className="g-4">
            {productosOferta.slice(0, 3).map((product) => {
              const sinStock = (product.stock ?? product.cantidad ?? 0) <= 0;
              return (
                <Col key={product.id}>
                  <Card 
                    className="h-100 text-center position-relative urban-card border-0 shadow-sm"
                    style={{
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      opacity: hoveredProduct === product.id && sinStock ? 0.7 : 1
                    }}
                    onMouseEnter={() => !sinStock && setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    <Badge bg="dark" className="position-absolute top-0 start-0 m-2">
                      🏷️ URBAN
                    </Badge>

                    {sinStock && (
                      <Badge variant="danger" className="position-absolute top-0 start-50 translate-middle-x m-2">
                        ❌ AGOTADO
                      </Badge>
                    )}
                    
                    <Image
                      src={product.image}
                      alt={product.name}
                      className="card-img-top"
                      style={{ 
                        height: "250px", 
                        objectFit: "cover",
                        filter: sinStock ? "grayscale(50%)" : "grayscale(0%)",
                        transition: "filter 0.3s"
                      }}
                    />
                    <Card.Body>
                      <Text variant="h6" className="fw-bold">{product.name}</Text>
                      
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        <Text variant="p" className="text-dark fw-bold fs-5 mb-0">
                          ${product.price.toLocaleString()}
                        </Text>
                        {product.originalPrice && (
                          <Text variant="p" className="text-muted text-decoration-line-through mb-0">
                            ${product.originalPrice.toLocaleString()}
                          </Text>
                        )}
                      </div>

                      {product.originalPrice && (
                        <Badge bg="danger" className="mt-1">
                          {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                        </Badge>
                      )}

                      <div className="mt-3">
                        <Link to={`/producto/${product.id}`}>
                          <Button 
                            variant="dark" 
                            size="sm"
                            disabled={sinStock}
                            style={{
                              transition: "all 0.3s",
                              transform: hoveredProduct === product.id ? "scale(1.05)" : "scale(1)"
                            }}
                          >
                            {sinStock ? "🚫 AGOTADO" : "👀 VER DETALLE"}
                          </Button>
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>

      {/* Sección de Características */}
      <section className="mb-5">
        <Container>
          <Row xs={1} md={4} className="g-4">
            {[
              { icon: "🚚", title: "Envío Gratis", desc: "Compras mayores a $50" },
              { icon: "🔒", title: "100% Seguro", desc: "Pago encriptado" },
              { icon: "↩️", title: "Devoluciones", desc: "30 días sin preguntas" },
              { icon: "💬", title: "Soporte 24/7", desc: "Atención al cliente" }
            ].map((feature, idx) => (
              <Col key={idx}>
                <Card className="border-0 shadow-sm h-100" style={{ background: "#f8f9fa" }}>
                  <Card.Body className="text-center">
                    <Text variant="h2" className="mb-2">{feature.icon}</Text>
                    <Text variant="h6" className="fw-bold mb-2">{feature.title}</Text>
                    <Text variant="p" className="text-muted text-sm mb-0">{feature.desc}</Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Final */}
      <section className="mb-5">
        <Container>
          <Card className="border-0 shadow-lg" style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", color: "white" }}>
            <Card.Body className="text-center py-5">
              <Text variant="h2" className="fw-bold mb-3">¿Listo para revolucionar tu estilo?</Text>
              <Text variant="p" className="fs-5 mb-4">Descubre nuestra colección completa de ropa urbana</Text>
              <Link to="/products">
                <Button variant="light" size="lg" className="fw-bold">
                  🛒 COMPRAR AHORA
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Container>
      </section>
    </main>
  );
};

export default Home;