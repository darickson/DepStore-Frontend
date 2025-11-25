import React, { useState, useEffect } from 'react';

export default function AdminProductForm({ product = null, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    price: 0,
    categoria: '',
    stock: 0,
    description: '',
    image: ''
  });

  useEffect(() => {
    if (product) setForm({
      name: product.name || '',
      price: product.price || 0,
      categoria: product.categoria || '',
      stock: product.stock || 0,
      description: product.description || '',
      image: product.image || ''
    });
  }, [product]);

  const handle = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'price' || name === 'stock' ? Number(value) : value }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name) return alert('El producto necesita un nombre');
    onSave(form);
  };

  return (
    <form onSubmit={submit} className="p-3">
      <div className="mb-2">
        <label className="form-label">Nombre</label>
        <input name="name" value={form.name} onChange={handle} className="form-control" />
      </div>
      <div className="row">
        <div className="col mb-2">
          <label className="form-label">Precio</label>
          <input name="price" type="number" value={form.price} onChange={handle} className="form-control" />
        </div>
        <div className="col mb-2">
          <label className="form-label">Stock</label>
          <input name="stock" type="number" value={form.stock} onChange={handle} className="form-control" />
          {/* Mostrar estado derivado del stock y no dejarlo editable */}
          <div className="mt-2">
            {form.stock <= 0 ? (
              <span className="badge bg-danger fs-6 p-2">❌ AGOTADO (Stock: {form.stock})</span>
            ) : (
              <span className="badge bg-success fs-6 p-2">✅ EN STOCK ({form.stock} unidades)</span>
            )}
          </div>
        </div>
      </div>
      <div className="mb-2">
        <label className="form-label">Categoría</label>
        <input name="categoria" value={form.categoria} onChange={handle} className="form-control" />
      </div>
      <div className="mb-2">
        <label className="form-label">Imagen (URL)</label>
        <input name="image" value={form.image} onChange={handle} className="form-control" />
      </div>
      <div className="mb-2">
        <label className="form-label">Descripción</label>
        <textarea name="description" value={form.description} onChange={handle} className="form-control" rows={3} />
      </div>
      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-outline-secondary me-2" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary">Guardar</button>
      </div>
    </form>
  );
}
