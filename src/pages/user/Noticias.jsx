import React from "react";
import { Container, Card } from "react-bootstrap";
import Text from "../../components/atoms/Text";

const Noticias = () => {
  const noticias = [
    {
      id: 1,
      titulo: "Vulnerabilidad crítica en Node.js",
      fecha: "2024-01-15",
      contenido: "Se descubrió una vulnerabilidad de seguridad en Node.js que afecta a múltiples versiones...",
      fuente: "Node.js Security"
    },
    {
      id: 2,
      titulo: "Nuevas características en React 18",
      fecha: "2024-01-10", 
      contenido: "React 18 introduce mejoras en el renderizado concurrente y nuevas APIs...",
      fuente: "React Blog"
    }
  ];

  return (
    <Container className="my-5">
      <Text variant="h1" className="text-center mb-5">📰 Noticias Tecnológicas</Text>
      {noticias.map(noticia => (
        <Card key={noticia.id} className="mb-4 shadow-sm">
          <Card.Body>
            <Card.Title>{noticia.titulo}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {noticia.fecha} • {noticia.fuente}
            </Card.Subtitle>
            <Card.Text>{noticia.contenido}</Card.Text>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default Noticias;