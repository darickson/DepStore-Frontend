import React from "react";
import Text from "../../components/atoms/Text";
import Image from "../../components/atoms/Image";

const Blogs = () => {
  return (
    <main className="container my-5">
      <Text variant="h1" className="mb-4 text-center">📖 DEP URBAN BLOG</Text>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow border-0">
            <div className="card-body p-5">
              <Text variant="h3" className="fw-bold mb-4">Nuestra Historia DEP</Text>
              <Text variant="p" className="fs-5 mb-4">
                DEP URBAN nació de la pasión por el estilo de vida urbano y la cultura streetwear. 
                Lo que comenzó como un simple proyecto entre amigos unidos por el amor a la moda urbana, 
                se transformó en un sueño: crear un espacio donde cada persona pueda expresar su identidad 
                a través de prendas que representan más que simple ropa.
              </Text>
              
              <Text variant="p" className="fs-5 mb-4">
                Para nosotros en DEP, cada prenda cuenta una historia. Cada diseño refleja la esencia 
                de las calles, la energía de la ciudad y la actitud de la cultura urbana contemporánea. 
                Pasamos de pequeñas colecciones entre conocidos a formar una marca que hoy busca inspirar 
                y conectar con amantes del streetwear en todas partes.
              </Text>

              <Text variant="p" className="fs-5 mb-4">
                Seguimos siendo ese grupo de apasionados por la moda urbana, pero ahora con la misión 
                de ofrecerte calidad premium, diseños exclusivos y una experiencia auténtica en cada 
                prenda que creamos. En DEP URBAN, no solo vendemos ropa - compartimos un estilo de vida.
              </Text>

              <div className="text-center mt-4">
                <Image 
                  src="/img/urban-lifestyle.jpg" 
                  alt="Estilo de vida urbano DEP" 
                  className="img-fluid rounded shadow"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
                <Text variant="p" className="text-muted mt-2">
                  El estilo DEP - Más que moda, una actitud
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Blogs;