import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Badge, Button, Alert, Spinner } from "react-bootstrap";
import ProductoService from "../../services/ProductoService";
import { useAuth } from "../../contexts/AuthContext";
import Text from "../../components/atoms/Text";
import Image from "../../components/atoms/Image";

const ProductDetail = ({ agregarAlCarrito }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para la talla y color seleccionados
  const [tallaSeleccionada, setTallaSeleccionada] = useState(null);
  const [colorSeleccionado, setColorSeleccionado] = useState(null);
  const [errorTalla, setErrorTalla] = useState('');
  const [errorColor, setErrorColor] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await ProductoService.getProductoById(id);
        const productData = res.data;
        setProduct(productData);
      } catch (err) {
        console.error('Error cargando producto:', err);
        setError('No se pudo cargar el producto. Por favor intenta de nuevo.');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <Text variant="p" className="mt-3">Cargando detalles del producto...</Text>
      </Container>
    );
  }

  if (!product || error) {
    return (
      <Container className="my-5 text-center">
        <Alert variant="warning">
          <Text variant="h2">Producto no encontrado</Text>
          <Text variant="p">{error || 'El producto que buscas no existe'}</Text>
          <Link to="/products">
            <Button variant="dark" className="mt-3">Volver a Productos</Button>
          </Link>
        </Alert>
      </Container>
    );
  }

  const handleSeleccionarTalla = (talla) => {
    setTallaSeleccionada(talla);
    setErrorTalla(''); // Limpiar error cuando se selecciona una talla
  };

  const handleSeleccionarColor = (color) => {
    setColorSeleccionado(color);
    setErrorColor(''); // Limpiar error cuando se selecciona un color
  };

  const handleAgregarAlCarrito = () => {
    // Verificar si el usuario está logueado
    if (!user) {
      alert('⚠️ Debes iniciar sesión para agregar productos al carrito');
      window.location.href = '/login-safe';
      return;
    }

    // Validar que se haya seleccionado una talla
    if (product.tallas && product.tallas.length > 0 && !tallaSeleccionada) {
      setErrorTalla('⚠️ Por favor selecciona una talla');
      return;
    }

    // Validar que se haya seleccionado un color
    if (product.colores && product.colores.length > 0 && !colorSeleccionado) {
      setErrorColor('⚠️ Por favor selecciona un color');
      return;
    }

    if (agregarAlCarrito) {
      // Crear producto con la talla y color seleccionados
      const productoConSeleccion = {
        ...product,
        tallaSeleccionada: tallaSeleccionada || 'Única',
        colorSeleccionado: colorSeleccionado || 'Único'
      };
      
      agregarAlCarrito(productoConSeleccion);
      setErrorTalla(''); // Limpiar errores después de agregar
      setErrorColor('');
    } else {
      alert("⚠️ Función de carrito no disponible");
    }
  };

  // Función para obtener el nombre de la clase CSS según el color
  const getColorClass = (color) => {
    const colorMap = {
      'Negro': 'color-negro',
      'Blanco': 'color-blanco',
      'Azul': 'color-azul',
      'Azul claro': 'color-azul-claro',
      'Azul oscuro': 'color-azul-oscuro',
      'Gris': 'color-gris',
      'Gris claro': 'color-gris-claro',
      'Verde': 'color-verde',
      'Verde militar': 'color-verde-militar',
      'Rosa': 'color-rosa',
      'Rojo': 'color-rojo',
      'Beige': 'color-beige',
      'Plateado': 'color-plateado',
      'Dorado': 'color-dorado',
      'Amarillo': 'color-amarillo',
      'Morado': 'color-morado',
      'Naranja': 'color-naranja',
      'Transparente': 'color-transparente'
    };
    return colorMap[color] || 'color-default';
  };

  return (
    <Container className="my-5 maximum-width">
      <div className="mb-4">
        <Button 
          variant="outline-dark" 
          onClick={() => navigate(-1)}
          className="mb-3"
        >
          ← Volver
        </Button>
      </div>

      <Row>
        <Col md={6}>
          <div className="text-center">
            <Image
              src={product.image}
              alt={product.name}
              className="img-fluid product-detail-image shadow-medium"
            />
            {colorSeleccionado && (
              <div className="mt-3">
                <Badge bg="dark" className="fs-6 p-2">
                  🎨 Color seleccionado: {colorSeleccionado}
                </Badge>
              </div>
            )}
          </div>
        </Col>
        
        <Col md={6}>
          <div className="ps-md-4">
            <Text variant="h1" className="fw-bold mb-3 display-4">{product.name || product.nombre || product.title}</Text>
            <Text variant="p" className="fs-5 text-muted mb-4">
              {product.description || product.descripcion || product.shortDescription || ''}
            </Text>
            
            <div className="mb-4">
              <div className="d-flex align-items-center gap-3 mb-2">
                <Text variant="h2" className="text-dark fw-bold display-3">
                  ${(product.price ?? product.precio ?? 0).toLocaleString()}
                </Text>
                {product.originalPrice && (
                  <Text variant="h4" className="text-muted text-decoration-line-through">
                    ${(product.originalPrice ?? product.precioOriginal ?? 0).toLocaleString()}
                  </Text>
                )}
              </div>
              
              {product.oferta && (
                <Badge bg="success" className="fs-6 p-2">
                  🔥 OFERTA ESPECIAL
                </Badge>
              )}

              {/* Mostrar estado de stock calculado */}
              <div className="mt-3">
                {((product.stock ?? product.cantidad ?? 0) <= 0) ? (
                  <Badge bg="danger" className="fs-6 p-2">❌ SIN STOCK</Badge>
                ) : (
                  <Badge bg="secondary" className="fs-6 p-2">📦 EN STOCK</Badge>
                )}
              </div>
            </div>

            {/* Selección de colores */}
            {(product.colores || product.colors) && (product.colores || product.colors).length > 0 && (
              <div className="mb-4">
                <Text variant="h5" className="fw-bold mb-3">
                  🎨 SELECCIONA TU COLOR
                </Text>
                
                <div className="d-flex gap-3 flex-wrap">
                  {(product.colores || product.colors).map((color, index) => (
                    <div key={index} className="text-center">
                      <button
                        className={`color-selector-btn ${getColorClass(color)} ${
                          colorSeleccionado === color ? 'active' : ''
                        }`}
                        onClick={() => handleSeleccionarColor(color)}
                        title={color}
                      >
                        <div className="color-circle"></div>
                      </button>
                      <div className="mt-1 small fw-medium">{color}</div>
                    </div>
                  ))}
                </div>
                
                {errorColor && (
                  <Alert variant="danger" className="mt-2 py-2">
                    {errorColor}
                  </Alert>
                )}
              </div>
            )}

            {/* Selección de tallas */}
            {(product.tallas || product.sizes) && (product.tallas || product.sizes).length > 0 && (
              <div className="mb-4">
                <Text variant="h5" className="fw-bold mb-3">
                  👕 SELECCIONA TU TALLA
                  {tallaSeleccionada && (
                    <Badge bg="dark" className="ms-2 fs-6">
                      {tallaSeleccionada}
                    </Badge>
                  )}
                </Text>
                
                <div className="d-flex gap-2 flex-wrap">
                  {(product.tallas || product.sizes).map((talla, index) => (
                    <Button
                      key={index}
                      variant={tallaSeleccionada === talla ? "dark" : "outline-dark"}
                      className="talla-btn"
                      onClick={() => handleSeleccionarTalla(talla)}
                    >
                      {talla}
                    </Button>
                  ))}
                </div>
                
                {errorTalla && (
                  <Alert variant="danger" className="mt-2 py-2">
                    {errorTalla}
                  </Alert>
                )}
              </div>
            )}

            {/* Información del producto */}
            <div className="mb-4">
              <Row className="mb-3">
                <Col sm={6}>
                  <Text variant="h6" className="fw-bold mb-2">Categoría</Text>
                  <Badge bg="secondary" className="text-capitalize fs-6 p-2">
                    {product.categoria}
                  </Badge>
                </Col>
                <Col sm={6}>
                  <Text variant="h6" className="fw-bold mb-2">Tipo</Text>
                  <Badge bg="secondary" className="text-capitalize fs-6 p-2">
                    {product.tipo}
                  </Badge>
                </Col>
              </Row>

              {product.estilo && (
                <div className="mb-4">
                  <Text variant="h6" className="fw-bold mb-2">Estilo</Text>
                  <Badge bg="dark" className="text-uppercase fs-6 p-2">
                    {product.estilo}
                  </Badge>
                </div>
              )}
            </div>

            {/* Botones de acción */}
            <div className="d-flex flex-column gap-3">
              <Button 
                variant="dark" 
                size="lg"
                onClick={handleAgregarAlCarrito}
                className="py-3 fw-bold"
                disabled={
                  (product.tallas && product.tallas.length > 0 && !tallaSeleccionada) ||
                  (product.colores && product.colores.length > 0 && !colorSeleccionado) ||
                  ((product.stock ?? product.cantidad ?? 0) <= 0)
                }
              >
                {(() => {
                  const stockActual = product.stock ?? product.cantidad ?? 0;
                  if (stockActual <= 0) {
                    return "🚫 AGOTADO";
                  }
                  if (product.tallas && product.tallas.length > 0 && !tallaSeleccionada) {
                    return "📏 SELECCIONA UNA TALLA";
                  }
                  if (product.colores && product.colores.length > 0 && !colorSeleccionado) {
                    return "🎨 SELECCIONA UN COLOR";
                  }
                  return "🛒 AGREGAR AL CARRITO";
                })()}
              </Button>
              
              <Link to="/products" className="w-100">
                <Button variant="outline-dark" size="lg" className="w-100 py-3">
                  📦 SEGUIR COMPRANDO
                </Button>
              </Link>
            </div>

            {/* Información adicional */}
            <div className="mt-5 p-4 bg-light rounded">
              <Text variant="h4" className="fw-bold mb-3">📦 Envío y Devoluciones</Text>
              <Text variant="p" className="mb-2 fs-6">
                <strong>Envío gratis</strong> en compras sobre $50.000
              </Text>
              <Text variant="p" className="mb-2 fs-6">
                <strong>Devoluciones</strong> dentro de los 30 días
              </Text>
              <Text variant="p" className="fs-6">
                <strong>Garantía</strong> de calidad DEP
              </Text>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;