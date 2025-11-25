import React from "react";
import { Form } from 'react-bootstrap';
import Input from "../atoms/Input";
import Text from "../atoms/Text";

function DynamicForm({ inputs = [], title = "", onSubmit, children }) {
    return (
        <Form onSubmit={onSubmit} className="dep-form">
            {title && <Text variant="h5" className="mb-4">{title}</Text>}
            
            {inputs.map((input, index) => (
                <Form.Group key={input.id || index} controlId={`input-${input.id || index}`} className="mb-3">
                    {input.label && (
                        <Form.Label className="fw-bold">
                            <Text variant="p" className="mb-2">{input.label}</Text>
                        </Form.Label>
                    )}
                    <Input {...input} />
                    {input.error && (
                        <Form.Text className="text-danger">
                            <Text variant="small">{input.error}</Text>
                        </Form.Text>
                    )}
                    {input.helpText && (
                        <Form.Text className="text-muted">
                            <Text variant="small">{input.helpText}</Text>
                        </Form.Text>
                    )}
                </Form.Group>
            ))}
            
            {/* AÑADIDO: Para contenido adicional */}
            {children}
        </Form>
    );
}

export const formatRUT = (value) => {
    const cleanValue = value.replace(/[^0-9kK]/g, '');
    if (cleanValue.length <= 1) return cleanValue;
    
    const body = cleanValue.slice(0, -1);
    const dv = cleanValue.slice(-1);
    return `${body.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${dv}`;
};

export const formatTarjeta = (value) => {
    return value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
};

export default DynamicForm;