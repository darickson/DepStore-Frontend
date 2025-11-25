import React from 'react';

function Image({ src, alt, className = '', style = {}, ...props }) {
  return (
    <img 
      src={src} 
      alt={alt} 
      className={`dep-image ${className}`}
      style={style}
      {...props}
    />
  );
}

export default Image;