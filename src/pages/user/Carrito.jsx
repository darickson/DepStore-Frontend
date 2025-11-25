import { Container, Table, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Text from "../../components/atoms/Text.jsx";
import Button from "../../components/atoms/Button.jsx";
import Image from "../../components/atoms/Image.jsx";

const Carrito = ({ carrito, setCarrito }) => {
  const navigate = useNavigate();

  const handleRemoveItem = (index) => {
    const nuevoCarrito = carrito.filter((_, i) => i !== index);
    setCarrito(nuevoCarrito);
  };

  const handleUpdateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > 10) return;
    
    const nuevoCarrito = carrito.map((item, i) =>
      i === index ? { ...item, cantidad: newQuantity } : item
    );
    setCarrito(nuevoCarrito);
  };

  const getTotal = () => {
    return carrito.reduce((total, item) => {
      const precio = item.price || item.precio || 0;
      return total + (precio * (item.cantidad || 1));
    }, 0);
  };

  if (carrito.length === 0) {
    return (
      <Container className="my-5 text-center">
        <Text variant="h2">🛒 Tu carrito está vacío</Text>
        <Text variant="p" className="text-muted">Agrega algunos productos para continuar</Text>
        <Button variant="dark" className="mt-3" onClick={() => navigate("/")}>
          🏠 Volver a la Tienda
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Text variant="h2" className="text-center mb-4">🛒 CARRITO DEP URBAN</Text>
      
      <Table responsive className="table-hover">
        <thead className="bg-dark text-white">
          <tr>
            <th>PRODUCTO</th>
            <th>TALLA</th>
            <th>PRECIO</th>
            <th>CANTIDAD</th>
            <th>SUBTOTAL</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {carrito.map((item, index) => {
            const precio = item.price || item.precio || 0;
            const subtotal = precio * (item.cantidad || 1);
            
            return (
              <tr key={index}>
                <td>
                  <div className="d-flex align-items-center">
                    <Image
                      src={item.image}
                      alt={item.name}
                      style={{ width: "60px", height: "60px", objectFit: "cover" }}
                      className="me-3 rounded"
                    />
                    <div>
                      <Text variant="h6" className="fw-bold mb-1">{item.name}</Text>
                      <Badge bg="secondary" className="text-uppercase">{item.categoria}</Badge>
                    </div>
                  </div>
                </td>
                <td>
                  <Badge bg="dark">{item.talla || "ÚNICA"}</Badge>
                </td>
                <td>
                  <Text variant="p" className="fw-bold text-success mb-0">
                    ${precio.toLocaleString()}
                  </Text>
                </td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <Button
                      variant="outline-dark"
                      size="sm"
                      onClick={() => handleUpdateQuantity(index, (item.cantidad || 1) - 1)}
                    >
                      -
                    </Button>
                    <Text variant="span" className="fw-bold">{item.cantidad || 1}</Text>
                    <Button
                      variant="outline-dark"
                      size="sm"
                      onClick={() => handleUpdateQuantity(index, (item.cantidad || 1) + 1)}
                      disabled={(item.cantidad || 1) >= 10}
                    >
                      +
                    </Button>
                  </div>
                </td>
                <td>
                  <Text variant="p" className="fw-bold text-dark mb-0">
                    ${subtotal.toLocaleString()}
                  </Text>
                </td>
                <td>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleRemoveItem(index)}
                  >
                    🗑️ Eliminar
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <div className="text-end mt-4 p-4 bg-light rounded">
        <Text variant="h4" className="fw-bold">
          TOTAL: ${getTotal().toLocaleString()}
        </Text>
        <div className="mt-3">
          <Button 
            variant="success" 
            size="lg" 
            className="mt-3"
            onClick={() => navigate('/pago')}
          >
            💳 PROCEDER AL PAGO
          </Button>
          <Button 
            variant="outline-dark" 
            size="lg"
            onClick={() => navigate("/")}
          >
            🏪 SEGUIR COMPRANDO
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default Carrito; 