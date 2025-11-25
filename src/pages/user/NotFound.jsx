import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Text from '../../components/atoms/Text';
import Button from '../../components/atoms/Button';
import Image from '../../components/atoms/Image';

function NotFound() {
  return (
    <Container className="my-5">
      <Row className="justify-content-center text-center">
        <Col lg={6}>
          <Card className="border-0 shadow">
            <Card.Body className="p-5">
              <Text variant="h1" className="fw-bold text-danger">404</Text>
              <Text variant="h3" className="mb-3">🚧 Página No Encontrada</Text>
              <Text variant="p" className="text-muted mb-4">
                ¡Ups! Parece que te has perdido en las calles urbanas. 
                La página que buscas no existe en DEP URBAN.
              </Text>
              
              <Image 
                src="https://images.unsplash.com/photo-1578321272177-56e03a58c7d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                alt="Página no encontrada"
                className="img-fluid rounded mb-4"
                style={{ maxWidth: '300px' }}
              />
              
              <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                <Button 
                  variant="dark" 
                  onClick={() => window.history.back()}
                  className="me-md-2"
                >
                  ↩️ VOLVER ATRÁS
                </Button>
                <Button 
                  variant="outline-dark" 
                  onClick={() => window.location.href = '/'}
                >
                  🏠 IR AL INICIO
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default NotFound;