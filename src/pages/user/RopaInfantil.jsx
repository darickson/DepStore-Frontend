import React from "react";
import { useLocation } from "react-router-dom";
import Products from "./Products";
import Text from "../../components/atoms/Text";

const RopaInfantil = ({ carrito, setCarrito }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tipo = searchParams.get("categoria");

  return (
    <div>
      <div className="bg-dark text-white py-5 mb-4">
        <div className="container text-center">
          <Text variant="h1" className="fw-bold">👶 URBAN KIDS</Text>
          <Text variant="p" className="fs-5">
            Estilo urbano para los más pequeños
          </Text>
        </div>
      </div>
      <Products 
        categoria="infantil" 
        tipo={tipo}
        carrito={carrito} 
        setCarrito={setCarrito} 
      />
    </div>
  );
};

export default RopaInfantil;