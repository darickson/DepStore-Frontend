import React from 'react';
import { Button as BootstrapButton } from 'react-bootstrap';

function Button({ children, variant = 'primary', size, className = '', ...props }) {
  return (
    <BootstrapButton 
      variant={variant} 
      size={size}
      className={`dep-button ${className}`}
      {...props}
    >
      {children}
    </BootstrapButton>
  );
}

export default Button;