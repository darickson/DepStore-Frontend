import React, { useState } from 'react';
import { Form, Row, Col, Card } from 'react-bootstrap';
import DynamicForm, { formatRUT, formatTarjeta } from './DynamicForm';
import Button from '../atoms/Button';
import Text from '../atoms/Text';

const PagoForm = ({ onPagoSubmit, total, carrito }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        rut: '',
        numeroTarjeta: '',
        codigoSeguridad: '',
        fechaVencimiento: '',
        direccion: '',
        tipoEntrega: 'envio'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onPagoSubmit(formData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Inputs para el DynamicForm
    const pagoInputs = [
        {
            id: 'nombre',
            type: 'text',
            label: 'Nombre Completo',
            placeholder: 'Juan Pérez González',
            value: formData.nombre,
            onChange: (e) => handleChange(e),
            name: 'nombre',
            required: true
        },
        {
            id: 'rut',
            type: 'text',
            label: 'RUT',
            placeholder: '12.345.678-9',
            value: formData.rut,
            onChange: (e) => {
                const formatted = formatRUT(e.target.value);
                setFormData(prev => ({ ...prev, rut: formatted }));
            },
            name: 'rut',
            required: true,
            maxLength: 12
        },
        {
            id: 'numeroTarjeta',
            type: 'text',
            label: 'Número de Tarjeta',
            placeholder: '1234 5678 9012 3456',
            value: formData.numeroTarjeta,
            onChange: (e) => {
                const formatted = formatTarjeta(e.target.value);
                setFormData(prev => ({ ...prev, numeroTarjeta: formatted }));
            },
            name: 'numeroTarjeta',
            required: true,
            maxLength: 19
        }
    ];

    const seguridadInputs = [
        {
            id: 'codigoSeguridad',
            type: 'text',
            label: 'Código de Seguridad',
            placeholder: '123',
            value: formData.codigoSeguridad,
            onChange: handleChange,
            name: 'codigoSeguridad',
            required: true,
            maxLength: 4
        },
        {
            id: 'fechaVencimiento',
            type: 'month',
            label: 'Fecha de Vencimiento',
            value: formData.fechaVencimiento,
            onChange: handleChange,
            name: 'fechaVencimiento',
            required: true
        }
    ];

    return (
        <div className="pago-container">
            <Card className="shadow-sm">
                <Card.Header className="bg-dark text-white">
                    <Text variant="h4" className="mb-0">💳 Información de Pago</Text>
                </Card.Header>
                <Card.Body>
                    <DynamicForm 
                        inputs={pagoInputs}
                        onSubmit={handleSubmit}
                    >
                        {/* Información de seguridad de la tarjeta */}
                        <Row className="mb-4">
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">
                                        <Text variant="p" className="mb-2">Código de Seguridad</Text>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="codigoSeguridad"
                                        value={formData.codigoSeguridad}
                                        onChange={handleChange}
                                        placeholder="123"
                                        maxLength="4"
                                        required
                                    />
                                    <Form.Text className="text-muted">
                                        <Text variant="small">Código de 3-4 dígitos al reverso de tu tarjeta</Text>
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">
                                        <Text variant="p" className="mb-2">Fecha de Vencimiento</Text>
                                    </Form.Label>
                                    <Form.Control
                                        type="month"
                                        name="fechaVencimiento"
                                        value={formData.fechaVencimiento}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Opción de entrega */}
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">
                                <Text variant="p" className="mb-3">Opción de Entrega</Text>
                            </Form.Label>
                            <div className="d-flex gap-4">
                                <Form.Check
                                    type="radio"
                                    name="tipoEntrega"
                                    value="envio"
                                    checked={formData.tipoEntrega === 'envio'}
                                    onChange={handleChange}
                                    label="🚚 Envío a domicilio"
                                    className="fw-bold"
                                />
                                <Form.Check
                                    type="radio"
                                    name="tipoEntrega"
                                    value="retiro"
                                    checked={formData.tipoEntrega === 'retiro'}
                                    onChange={handleChange}
                                    label="🏪 Retiro en tienda"
                                    className="fw-bold"
                                />
                            </div>
                        </Form.Group>

                        {/* Dirección (solo si es envío) */}
                        {formData.tipoEntrega === 'envio' && (
                            <Form.Group className="mb-4">
                                <Form.Label className="fw-bold">
                                    <Text variant="p" className="mb-2">Dirección de Envío</Text>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    placeholder="Calle Principal 123, Ciudad, Región"
                                    required={formData.tipoEntrega === 'envio'}
                                />
                            </Form.Group>
                        )}

                        {/* Resumen del pago */}
                        <Card className="bg-light border-0">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <Text variant="h5" className="fw-bold text-dark mb-1">
                                            Total a Pagar
                                        </Text>
                                        <Text variant="p" className="text-muted mb-0">
                                            {carrito.length} producto(s) en el carrito
                                        </Text>
                                    </div>
                                    <Text variant="h4" className="fw-bold text-success">
                                        ${total.toLocaleString()}
                                    </Text>
                                </div>
                            </Card.Body>
                        </Card>

                        {/* Botón de confirmación */}
                        <div className="text-center mt-4">
                            <Button 
                                type="submit"
                                variant="success" 
                                size="lg"
                                className="px-5 py-3 fw-bold"
                            >
                                ✅ CONFIRMAR PAGO
                            </Button>
                        </div>
                    </DynamicForm>
                </Card.Body>
            </Card>
        </div>
    );
};

export default PagoForm;