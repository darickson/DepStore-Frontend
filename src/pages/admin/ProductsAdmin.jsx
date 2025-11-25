import React, { useEffect, useState } from 'react';
import ProductoService from '../../services/ProductoService';
import AdminProductForm from './components/AdminProductForm';
import { useNavigate } from 'react-router-dom';

export default function ProductsAdmin() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const [isLocal, setIsLocal] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setError(null);
      setIsLocal(false);
      const res = await ProductoService.getAllProducto();
      setProductos(res.data || []);
      
      // Detectar si son datos locales
      if (res.isLocal) {
        setIsLocal(true);
        console.warn('📍 Usando datos de demostración local');
      }
    } catch (err) {
      console.error('Error cargando productos:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Error desconocido';
      setError(errorMsg);
      alert(`❌ Error cargando productos: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (p) => { setEditing(p); setShowForm(true); };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar producto?')) return;
    try {
      const res = await ProductoService.deleteProducto(id);
      setProductos(prev => prev.filter(r => (r.id || r._id) !== id));
      alert('✅ Guardado Exitoso');
    } catch (err) {
      console.error('Error al eliminar:', err);
      alert('❌ Error al eliminar: ' + (err.message || 'Error desconocido'));
    }
  };

  const handleSave = async (data) => {
    try {
      if (editing && (editing.id || editing._id)) {
        const id = editing.id || editing._id;
        const res = await ProductoService.updateProducto(id, data);
        setProductos(prev => prev.map(p => (p.id === id || p._id === id) ? { ...p, ...data } : p));
        alert('✅ Guardado Exitoso');
      } else {
        const res = await ProductoService.createProducto(data);
        const created = res.data || data;
        setProductos(prev => [created, ...prev]);
        alert('✅ Guardado Exitoso');
      }
      setShowForm(false);
      setEditing(null);
    } catch (err) {
      console.error('Error al guardar:', err);
      alert('❌ Error guardando producto: ' + (err.message || 'Error desconocido'));
    }
  };

  const retryFetch = () => {
    setLoading(true);
    fetchProducts();
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>👑 Productos (Admin)</h2>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={() => navigate('/admin/dashboard')}>Volver</button>
          <button className="btn btn-primary" onClick={handleCreate}>+ Nuevo Producto</button>
        </div>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <AdminProductForm product={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />
          </div>
        </div>
      )}

      {isLocal && (
        <div className="alert alert-warning alert-dismissible fade show mb-4" role="alert" style={{ display: 'none' }}>
          <strong>📍 Modo Demo - Datos Locales:</strong> Tu backend aún no está disponible.
          <br/>
          <small>
            ✅ Todos los cambios se guardan <strong>localmente</strong> en tu navegador<br/>
            🔄 Cuando tu backend en Render esté activo, <strong>se sincronizarán automáticamente</strong><br/>
            💾 Los datos se guardan en localStorage para que persistan entre sesiones
          </small>
          <button type="button" className="btn-close" onClick={() => setIsLocal(false)}></button>
        </div>
      )}

      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          <strong>❌ Error de API:</strong> {error}
          <br/>
          <small className="text-muted">
            Verifica que tu backend está corriendo en la URL configurada en <code>.env</code>
          </small>
          <br/>
          <button className="btn btn-sm btn-danger mt-2" onClick={retryFetch}>🔄 Reintentar</button>
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {loading ? (
        <div>Cargando productos...</div>
      ) : productos.length === 0 ? (
        <div className="alert alert-info">
          📦 No hay productos. <button className="btn btn-sm btn-primary" onClick={handleCreate}>Crear el primero</button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(p => {
                const stock = p.stock ?? p.cantidad ?? 0;
                const estado = stock <= 0 ? 'sin' : 'ok';
                return (
                  <tr key={p.id || p._id}>
                    <td>{p.id || p._id}</td>
                    <td>{p.name || p.nombre || p.title}</td>
                    <td>${(p.price || p.precio || 0).toLocaleString()}</td>
                    <td>
                      <span className={estado === 'sin' ? 'text-danger fw-bold' : 'text-success fw-bold'}>
                        {stock}
                      </span>
                    </td>
                    <td>
                      {estado === 'sin' ? (
                        <span className="badge bg-danger fs-6 px-3 py-2">❌ AGOTADO</span>
                      ) : (
                        <span className="badge bg-success fs-6 px-3 py-2">✅ EN STOCK</span>
                      )}
                    </td>
                    <td>{p.categoria || p.category}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(p)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id || p._id)}>Eliminar</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
