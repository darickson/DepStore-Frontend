import React from 'react';
import { Badge as BootstrapBadge } from 'react-bootstrap';

function Badge({ children, variant = 'primary', className = '', ...props }) {
  return (
    <BootstrapBadge 
      variant={variant} 
      className={`dep-badge ${className}`}
      {...props}
    >
      {children}
    </BootstrapBadge>
  );
}

export default Badge;