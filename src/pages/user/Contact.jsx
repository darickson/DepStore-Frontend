import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Text from '../../components/atoms/Text';
import DynamicForm from '../../components/molecules/DynamicForm';
import Button from '../../components/atoms/Button';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        telefono: '',
        mensaje: '',
    });

    const formInputs = [
        {
            id: 'name',
            type: 'text',
            label: '👤 Nombre Completo',
            placeholder: 'Ingresa tu nombre completo',
            value: formData.name,
            onChange: (e) => setFormData({ ...formData, name: e.target.value }),
            required: true
        },
        {
            id: 'email',
            type: 'email',
            label: '📧 Correo Electrónico',
            placeholder: 'tu@email.com',
            value: formData.email,
            onChange: (e) => setFormData({ ...formData, email: e.target.value }),
            required: true
        },
        {
            id: 'telefono',
            type: 'tel',
            label: '📞 Teléfono',
            placeholder: '+56 9 1234 5678',
            value: formData.telefono,
            onChange: (e) => setFormData({ ...formData, telefono: e.target.value }),
        },
        {
            id: 'mensaje',
            type: 'textarea',
            label: '💬 Mensaje',
            placeholder: 'Cuéntanos en qué podemos ayudarte...',
            rows: 5,
            value: formData.mensaje,
            onChange: (e) => setFormData({ ...formData, mensaje: e.target.value }),
            required: true
        },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        const message = `¡Gracias ${formData.name}!\n\nHemos recibido tu mensaje y te contactaremos pronto a ${formData.email}.\n\nMensaje: ${formData.mensaje}`;
        alert(message);
        setFormData({ name: '', email: '', telefono: '', mensaje: '' });
    };

    const handleClear = () => {
        setFormData({ name: '', email: '', telefono: '', mensaje: '' });
    };

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col lg={8}>
                    <Text variant="h1" className="text-center mb-2">📞 CONTACTO DEP</Text>
                    <Text variant="p" className="text-center mb-5 text-muted">
                        ¿Tienes alguna pregunta? Estamos aquí para ayudarte
                    </Text>

                    <Row>
                        <Col md={6} className="mb-4">
                            <Card className="h-100 border-0 shadow-sm">
                                <Card.Body className="p-4">
                                    <Text variant="h5" className="fw-bold mb-4">📍 Información de Contacto</Text>
                                    
                                    <div className="mb-3">
                                        <Text variant="h6" className="fw-bold">🏪 Dirección</Text>
                                        <Text variant="p" className="text-muted">
                                            Av. Streetwear 123<br />
                                            Santiago, Chile
                                        </Text>
                                    </div>

                                    <div className="mb-3">
                                        <Text variant="h6" className="fw-bold">📞 Teléfono</Text>
                                        <Text variant="p" className="text-muted">
                                            +56 2 2345 6789
                                        </Text>
                                    </div>

                                    <div className="mb-3">
                                        <Text variant="h6" className="fw-bold">📧 Email</Text>
                                        <Text variant="p" className="text-muted">
                                            info@depurban.com
                                        </Text>
                                    </div>

                                    <div className="mb-3">
                                        <Text variant="h6" className="fw-bold">🕒 Horario</Text>
                                        <Text variant="p" className="text-muted">
                                            Lunes a Viernes: 8:30 - 18:30<br />
                                            Sábados: 09:30 - 14:30
                                        </Text>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={6}>
                            <Card className="border-0 shadow-sm">
                                <Card.Body className="p-4">
                                    <Text variant="h5" className="fw-bold mb-4">✉️ Envíanos un Mensaje</Text>
                                    <DynamicForm inputs={formInputs} />
                                    <div className="mt-4">
                                        <Button 
                                            variant="dark" 
                                            onClick={handleSubmit} 
                                            className="me-2 w-100 mb-2"
                                        >
                                            📤 ENVIAR MENSAJE
                                        </Button>
                                        <Button 
                                            variant="outline-secondary" 
                                            onClick={handleClear}
                                            className="w-100"
                                        >
                                            🗑️ LIMPIAR FORMULARIO
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default Contact;