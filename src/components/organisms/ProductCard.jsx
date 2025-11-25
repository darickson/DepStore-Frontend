import React from "react";
import { Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Text from "../atoms/Text";
import Button from "../atoms/Button";
import Image from "../atoms/Image";
import Badge from "../atoms/Badge";
import CardBody from "../molecules/CardBody";

const ProductCard = ({ product }) => {
  const stockActual = product.stock ?? product.cantidad ?? 0;
  const sinStock = stockActual <= 0;

  return (
    <Col>
      <Card className="h-100 text-center urban-card shadow-sm border-0">
        <div className="position-relative">
          <Image
            src={product.image}
            alt={product.name}
            className="card-img-top"
            style={{ height: "250px", objectFit: "cover" }}
          />
          {product.oferta && (
            <Badge variant="danger" className="position-absolute top-0 start-0 m-2">
              🔥 OFERTA
            </Badge>
          )}
          {/* Mostrar badge de Sin stock si corresponde (derivado de stock numérico) */}
          {sinStock && (
            <Badge variant="danger" className="position-absolute top-0 start-0 m-2">
              ❌ SIN STOCK
            </Badge>
          )}
          <Badge variant="dark" className="position-absolute top-0 end-0 m-2">
            DEP
          </Badge>
        </div>
        <Card.Body className="d-flex flex-column">
          <CardBody
            title={product.name}
            description={product.description}
            price={product.price}
            categoria={product.categoria}
            oferta={product.oferta}
            originalPrice={product.originalPrice}
          />
          
          <div className="mt-auto">
            <Link to={`/producto/${product.id}`}>
              <Button 
                variant="dark" 
                className="w-100 fw-bold" 
                disabled={sinStock}
              >
                {sinStock ? '🚫 AGOTADO' : '👀 VER DETALLE'}
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ProductCard;