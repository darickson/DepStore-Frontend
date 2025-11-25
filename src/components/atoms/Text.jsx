import React from 'react';

function Text({ children, variant = 'p', className = '', style = {}, ...props }) {
  const Tag = variant;
  return (
    <Tag 
      className={`dep-text ${className}`}
      style={style}
      {...props}
    >
      {children}
    </Tag>
  );
}

export default Text;