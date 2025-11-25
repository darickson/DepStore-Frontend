import React from 'react';
import Text from '../atoms/Text';
import Badge from '../atoms/Badge';

function ProductHeader({ title, categoria, tipo, price, originalPrice, oferta }) {
  return (
    <div className="dep-product-header">
      <Text variant="h1" className="fw-bold mb-2">{title}</Text>
      
      <div className="d-flex gap-2 mb-3">
        <Badge variant="secondary" className="text-uppercase">
          {categoria}
        </Badge>
        <Badge variant="dark" className="text-uppercase">
          {tipo}
        </Badge>
        {oferta && (
          <Badge variant="danger">
            🔥 OFERTA
          </Badge>
        )}
      </div>
      
      <div className="price-section">
        {oferta && originalPrice ? (
          <div className="d-flex align-items-center gap-3">
            <Text variant="h2" className="text-danger fw-bold mb-0">
              ${price.toLocaleString()}
            </Text>
            <Text variant="h4" className="text-muted text-decoration-line-through mb-0">
              ${originalPrice.toLocaleString()}
            </Text>
            <Badge variant="success" className="fs-6">
              {Math.round((1 - price / originalPrice) * 100)}% OFF
            </Badge>
          </div>
        ) : (
          <Text variant="h2" className="text-dark fw-bold">
            ${price.toLocaleString()}
          </Text>
        )}
      </div>
    </div>
  );
}

export default ProductHeader;