import React from "react";
import { Form } from "react-bootstrap";

function Input({ className = "", type = "text", placeholder = "", ...props }) {
  const componentProps = {
    className: `dep-input ${className}`,
    placeholder,
    ...(type === "textarea" ? { as: "textarea" } : { type }),
    ...props,
  };
  return <Form.Control {...componentProps} />;
}

export default Input;