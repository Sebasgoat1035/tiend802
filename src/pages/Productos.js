import React, { useState, useEffect } from 'react';
import api from '../services/api';

const productoVacio = {
    idproducto: 0,
    idcategoria: 1,
    nombreproducto: '',
    precioproducto: 0,
    stockproducto: 0,
    estadoproducto: true
};

function Productos() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [error, setError] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [productoForm, setProductoForm] = useState(productoVacio);
    const [editando, setEditando] = useState(false);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        fetchProductos();
        fetchCategorias();
    }, []);

    const fetchProductos = async () => {
        try {
            const response = await api.get('/api/Producto/Lista');
            setProductos(response.data.response);
        } catch (err) {
            setError('Error al cargar los productos');
        }
    };

    const fetchCategorias = async () => {
        try {
            const response = await api.get('/api/Categoria/Lista');
            setCategorias(response.data.response);
        } catch (err) {
            setCategorias([
                { idcategoria: 1, nombrecategoria: 'Cereales' },
                { idcategoria: 2, nombrecategoria: 'Lacteos' },
                { idcategoria: 3, nombrecategoria: 'Granos' },
                { idcategoria: 4, nombrecategoria: 'Limpieza' },
            ]);
        }
    };

    const handleGuardar = async () => {
        try {
            if (editando) {
                await api.put('/api/Producto/Editar', productoForm);
                setMensaje('Producto editado correctamente');
            } else {
                await api.post('/api/Producto/Guardar', productoForm);
                setMensaje('Producto guardado correctamente');
            }
            setShowModal(false);
            setProductoForm(productoVacio);
            setEditando(false);
            fetchProductos();
        } catch (err) {
            setError('Error al guardar el producto');
        }
    };

    const handleEditar = (producto) => {
        setProductoForm({
            idproducto: producto.idproducto,
            idcategoria: producto.idcategoria,
            nombreproducto: producto.nombreproducto,
            precioproducto: producto.precioproducto,
            stockproducto: producto.stockproducto,
            estadoproducto: producto.estadoproducto
        });
        setEditando(true);
        setShowModal(true);
    };

    const handleEliminar = async (id) => {
        if (!window.confirm('¿Está seguro de eliminar este producto?')) return;
        try {
            await api.delete(`/api/Producto/Eliminar/${id}`);
            setMensaje('Producto eliminado correctamente');
            fetchProductos();
        } catch (err) {
            setError('Error al eliminar el producto');
        }
    };

    const productosFiltrados = productos.filter(p =>
        p.nombreproducto.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="container-fluid px-4 py-4" style={{ backgroundColor: '#f8faf9', minHeight: '100vh' }}>
            {mensaje && (
                <div className="alert alert-success alert-dismissible fade show rounded-3 shadow-sm" role="alert">
                    ✅ {mensaje}
                    <button type="button" className="btn-close" onClick={() => setMensaje('')}></button>
                </div>
            )}
            {error && (
                <div className="alert alert-danger alert-dismissible fade show rounded-3 shadow-sm" role="alert">
                    ⚠️ {error}
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
            )}

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="fw-bold mb-0" style={{ color: '#1b4332' }}>📦 Productos</h3>
                    <small className="text-muted">{productos.length} productos registrados</small>
                </div>
                <button
                    className="btn fw-semibold text-white shadow-sm px-4"
                    style={{ backgroundColor: '#1b4332', borderRadius: '10px' }}
                    onClick={() => { setProductoForm(productoVacio); setEditando(false); setShowModal(true); }}
                >
                    ➕ Nuevo Producto
                </button>
            </div>

            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
                <div className="card-body py-3">
                    <input
                        type="text"
                        className="form-control border-0 bg-light rounded-3"
                        placeholder="🔍 Buscar producto por nombre..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
            </div>

            <div className="card border-0 shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead style={{ backgroundColor: '#1b4332', color: 'white' }}>
                            <tr>
                                <th className="py-3 px-4">#</th>
                                <th className="py-3">Nombre</th>
                                <th className="py-3">Categoría</th>
                                <th className="py-3">Precio</th>
                                <th className="py-3">Stock</th>
                                <th className="py-3">Estado</th>
                                <th className="py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productosFiltrados.map((producto, index) => (
                                <tr key={producto.idproducto} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f8faf9' }}>
                                    <td className="py-3 px-4 text-muted">{producto.idproducto}</td>
                                    <td className="py-3 fw-semibold">{producto.nombreproducto}</td>
                                    <td className="py-3">
                                        <span className="badge rounded-pill px-3 py-2"
                                            style={{ backgroundColor: '#d8f3dc', color: '#1b4332' }}>
                                            {producto.objCategoria?.nombrecategoria}
                                        </span>
                                    </td>
                                    <td className="py-3 fw-semibold" style={{ color: '#1b4332' }}>
                                        ${producto.precioproducto?.toLocaleString()}
                                    </td>
                                    <td className="py-3">{producto.stockproducto}</td>
                                    <td className="py-3">
                                        <span className={`badge rounded-pill px-3 py-2 ${producto.estadoproducto ? 'bg-success' : 'bg-danger'}`}>
                                            {producto.estadoproducto ? '✅ Activo' : '❌ Inactivo'}
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <button
                                            className="btn btn-sm me-2 fw-semibold"
                                            style={{ backgroundColor: '#e8f4f8', color: '#0077b6', borderRadius: '8px', border: 'none' }}
                                            onClick={() => handleEditar(producto)}
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            className="btn btn-sm fw-semibold"
                                            style={{ backgroundColor: '#fde8e8', color: '#e63946', borderRadius: '8px', border: 'none' }}
                                            onClick={() => handleEliminar(producto.idproducto)}
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {productosFiltrados.length === 0 && !error && (
                <div className="text-center text-muted mt-5">
                    <div style={{ fontSize: '50px' }}>📭</div>
                    <h5>No se encontraron productos</h5>
                </div>
            )}

            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
                            <div className="modal-header border-0 px-4 pt-4" style={{ backgroundColor: '#1b4332', borderRadius: '16px 16px 0 0' }}>
                                <h5 className="modal-title text-white fw-bold">
                                    {editando ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold text-muted small">Nombre del producto</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-3"
                                        placeholder="Nombre del producto"
                                        value={productoForm.nombreproducto}
                                        onChange={(e) => setProductoForm({ ...productoForm, nombreproducto: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold text-muted small">Categoría</label>
                                    <select
                                        className="form-select rounded-3"
                                        value={productoForm.idcategoria}
                                        onChange={(e) => setProductoForm({ ...productoForm, idcategoria: parseInt(e.target.value) })}
                                    >
                                        {categorias.map(c => (
                                            <option key={c.idcategoria} value={c.idcategoria}>{c.nombrecategoria}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="row">
                                    <div className="col-6 mb-3">
                                        <label className="form-label fw-semibold text-muted small">Precio</label>
                                        <input
                                            type="number"
                                            className="form-control rounded-3"
                                            placeholder="0"
                                            value={productoForm.precioproducto}
                                            onChange={(e) => setProductoForm({ ...productoForm, precioproducto: parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="col-6 mb-3">
                                        <label className="form-label fw-semibold text-muted small">Stock</label>
                                        <input
                                            type="number"
                                            className="form-control rounded-3"
                                            placeholder="0"
                                            value={productoForm.stockproducto}
                                            onChange={(e) => setProductoForm({ ...productoForm, stockproducto: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold text-muted small">Estado</label>
                                    <select
                                        className="form-select rounded-3"
                                        value={productoForm.estadoproducto.toString()}
                                        onChange={(e) => setProductoForm({ ...productoForm, estadoproducto: e.target.value === 'true' })}
                                    >
                                        <option value="true">✅ Activo</option>
                                        <option value="false">❌ Inactivo</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer border-0 px-4 pb-4">
                                <button className="btn btn-light rounded-3 px-4" onClick={() => setShowModal(false)}>
                                    Cancelar
                                </button>
                                <button
                                    className="btn text-white rounded-3 px-4 fw-semibold"
                                    style={{ backgroundColor: '#1b4332' }}
                                    onClick={handleGuardar}
                                >
                                    {editando ? '💾 Guardar Cambios' : '✅ Guardar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Productos;