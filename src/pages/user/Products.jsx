import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Alert, Badge, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProductoService from "../../services/ProductoService";
import Text from "../../components/atoms/Text";
import Button from "../../components/atoms/Button";
import Image from "../../components/atoms/Image";

const Products = ({ categoria, tipo, carrito, setCarrito, agregarAlCarrito, user }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await ProductoService.getAllProducto();
        const productsData = Array.isArray(res.data) ? res.data : [];
        setProducts(productsData);
      } catch (err) {
        console.error('Error cargando productos:', err);
        setError('No se pudieron cargar los productos');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  console.log("🎯 Products component loaded");
  console.log("📦 Products data:", products);
  
  // Verificar si products existe y tiene datos
  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status" />
        <Text variant="p" className="mt-3">Cargando productos...</Text>
      </Container>
    );
  }

  if (!products || products.length === 0 || error) {
    return (
      <Container className="my-5">
        <Alert variant="warning" className="text-center">
          <Text variant="h4">⚠️ {error || 'NO HAY PRODUCTOS DISPONIBLES'}</Text>
          <Text variant="p">Intenta recargar la página</Text>
        </Alert>
      </Container>
    );
  }

  const filteredProducts = products.filter((product) => {
    const matchCategoria = !categoria || product.categoria === categoria;
    const matchTipo = !tipo || tipo === "todo" || product.tipo === tipo;
    return matchCategoria && matchTipo;
  });

  console.log("🔍 Filtered products:", filteredProducts);

  const getTitle = () => {
    if (tipo === "todo") {
      return `URBAN WEAR PARA ${categoria?.toUpperCase() || 'TODOS'}`;
    }
    if (tipo && categoria) {
      return `${tipo.charAt(0).toUpperCase() + tipo.slice(1).toUpperCase()} URBANO - ${categoria.toUpperCase()}`;
    }
    if (categoria) {
      return `STREETWEAR ${categoria.charAt(0).toUpperCase() + categoria.slice(1).toUpperCase()}`;
    }
    return "COLECCIÓN URBANA DEP";
  };

  return (
    <Container fluid className="products-page py-5 maximum-width">
      <Text variant="h1" className="display-3 text-center mb-5 fw-bold">
        {getTitle()}
      </Text>
      
      {filteredProducts.length === 0 ? (
        <Alert variant="warning" className="text-center">
          <Text variant="h5">No hay productos en esta categoría</Text>
          <Text variant="p">Filtros aplicados: Categoría: {categoria || 'Todas'}, Tipo: {tipo || 'Todos'}</Text>
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} xl={4} className="g-4 px-3">
          {filteredProducts.map((product) => (
            <Col key={product.id || product._id} className="fade-in">
              <Card className="h-100 text-center urban-product-card shadow-soft">
                <Image
                  src={product.image || product.imagen}
                  alt={product.name || product.nombre || product.title}
                  className="card-img-top"
                  style={{ 
                    height: "350px", 
                    objectFit: "contain", 
                    backgroundColor: "#f8f9fa", 
                    padding: "1rem" 
                  }}
                />
                <Card.Body className="d-flex flex-column">
                  <Text variant="h5" className="fw-bold">{product.name || product.nombre || product.title}</Text>
                  
                  <div className="mb-2">
                    <Text variant="p" className="text-dark fw-bold fs-4 mb-0">
                      ${(product.price ?? product.precio ?? 0).toLocaleString()}
                    </Text>
                    {product.originalPrice && (
                      <Text variant="p" className="text-muted text-decoration-line-through small">
                        ${product.originalPrice.toLocaleString()}
                      </Text>
                    )}
                  </div>

                  {product.oferta && (
                    <Badge bg="success" className="mb-2 align-self-center fs-6">
                      🔥 OFERTA
                    </Badge>
                  )}

                  <Text variant="p" className="text-muted small mb-2">
                    {product.categoria || product.category} • {product.tipo || product.type}
                  </Text>

                  {product.tallas && product.tallas.length > 0 && (
                    <Text variant="p" className="small text-dark mb-2">
                      <strong>Tallas:</strong> {product.tallas.join(', ')}
                    </Text>
                  )}

                  {product.colores && product.colores.length > 0 && (
                    <Text variant="p" className="small text-dark mb-3">
                      <strong>Colores:</strong> {product.colores.join(', ')}
                    </Text>
                  )}
                  
                  <div className="mt-auto d-flex flex-column gap-2">
                    <Link to={`/producto/${product.id || product._id}`} className="w-100">
                      <Button variant="outline-dark" className="w-100 fw-bold">
                        👁️ VER DETALLE
                      </Button>
                    </Link>
                    
                    {/* Botón para agregar al carrito - CON VERIFICACIÓN DE LOGIN */}
                    <Button 
                      variant="dark" 
                      className="w-100 fw-bold"
                      onClick={() => {
                        // Verificar login primero
                        if (!user) {
                          alert('⚠️ Debes iniciar sesión para agregar productos al carrito');
                          window.location.href = '/login-safe';
                          return;
                        }

                        if ((product.tallas && product.tallas.length > 0) || 
                            (product.colores && product.colores.length > 0)) {
                          // Redirigir a la página de detalle para seleccionar talla/color
                          window.location.href = `/producto/${product.id}`;
                        } else {
                          // Para productos sin tallas/colores, agregar directamente
                          agregarAlCarrito({
                            ...product, 
                            tallaSeleccionada: 'Única',
                            colorSeleccionado: 'Único'
                          });
                        }
                      }}
                    >
                      {(product.tallas && product.tallas.length > 0) || 
                       (product.colores && product.colores.length > 0)
                        ? "⚙️ PERSONALIZAR" 
                        : "🛒 AGREGAR AL CARRITO"
                      }
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Products;