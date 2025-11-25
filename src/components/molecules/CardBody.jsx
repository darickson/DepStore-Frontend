import React from 'react';
import Text from '../atoms/Text';
import Badge from '../atoms/Badge';

function CardBody({ title, description, price, categoria, oferta, originalPrice }) {
  return (
    <div className="dep-card-body">
      <Text variant="h5" className="fw-bold mb-2">{title}</Text>
      
      {categoria && (
        <Badge variant="secondary" className="mb-2 text-uppercase">
          {categoria}
        </Badge>
      )}
      
      <Text variant="p" className="text-muted mb-2">{description}</Text>
      
      <div className="price-section">
        {oferta && originalPrice ? (
          <div className="d-flex align-items-center gap-2">
            <Text variant="h6" className="text-danger fw-bold mb-0">
              ${price.toLocaleString()}
            </Text>
            <Text variant="p" className="text-muted text-decoration-line-through mb-0">
              ${originalPrice.toLocaleString()}
            </Text>
            <Badge variant="success" className="ms-2">
              {Math.round((1 - price / originalPrice) * 100)}% OFF
            </Badge>
          </div>
        ) : (
          <Text variant="h6" className="text-dark fw-bold">
            ${price.toLocaleString()}
          </Text>
        )}
      </div>
    </div>
  );
}

export default CardBody;