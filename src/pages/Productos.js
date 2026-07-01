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
        <div className="container-fluid px-4 py-4" style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#f1f5f9', fontFamily: "'Inter', sans-serif" }}>

            {mensaje && (
                <div className="alert border-0 text-white alert-dismissible fade show rounded-3 shadow-sm mb-4" role="alert" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', borderLeft: '4px solid #10b981' }}>
                    <span className="fw-medium">✨ {mensaje}</span>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setMensaje('')}></button>
                </div>
            )}
            {error && (
                <div className="alert border-0 text-white alert-dismissible fade show rounded-3 shadow-sm mb-4" role="alert" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderLeft: '4px solid #ef4444' }}>
                    <span className="fw-medium">⚡ {error}</span>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setError('')}></button>
                </div>
            )}

            <div className="row align-items-center mb-5 g-3">
                <div className="col-sm-6">
                    <h3 className="fw-extrabold mb-1" style={{ letterSpacing: '-0.5px', fontSize: '1.75rem' }}>
                        📦 Catálogo de Productos
                    </h3>
                    <p className="text-muted mb-0 small">
                        Visualizando <span className="text-indigo-400 fw-bold" style={{ color: '#818cf8' }}>{productos.length} items</span> en tiempo real
                    </p>
                </div>
                <div className="col-sm-6 text-sm-end">
                    <button
                        className="btn fw-bold px-4 py-2.5 shadow-lg text-white"
                        style={{
                            background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                            borderRadius: '12px',
                            border: 'none',
                            fontSize: '0.9rem'
                        }}
                        onClick={() => { setProductoForm(productoVacio); setEditando(false); setShowModal(true); }}
                    >
                        + Registrar Producto
                    </button>
                </div>
            </div>

            <div className="card border-0 mb-4" style={{ borderRadius: '16px', backgroundColor: '#1e293b', border: '1px solid #334155' }}>
                <div className="card-body p-3">
                    <div className="input-group">
                        <span className="input-group-text border-0 bg-transparent text-muted px-3">🔍</span>
                        <input
                            type="text"
                            className="form-control border-0 text-white"
                            style={{ backgroundColor: 'transparent', outline: 'none', boxShadow: 'none' }}
                            placeholder="Buscar en el inventario por palabra clave..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-xl" style={{ borderRadius: '16px', backgroundColor: '#1e293b', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="table-responsive">
                    <table className="table table-dark table-hover mb-0 align-middle">
                        <thead>
                            <tr style={{ backgroundColor: '#0f172a', color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                <th className="py-3.5 px-4 text-center" style={{ width: '80px' }}>ID</th>
                                <th className="py-3.5">Detalle Producto</th>
                                <th className="py-3.5">Categoría</th>
                                <th className="py-3.5 text-end">Valor Unitario</th>
                                <th className="py-3.5 text-center">Stock</th>
                                <th className="py-3.5 text-center">Estado</th>
                                <th className="py-3.5 text-center" style={{ width: '200px' }}>Gestión</th>
                            </tr>
                        </thead>
                        <tbody style={{ borderTop: 'none' }}>
                            {productosFiltrados.map((producto) => (
                                <tr key={producto.idproducto} style={{ borderBottom: '1px solid #334155' }}>
                                    <td className="py-3 px-4 text-center text-muted fw-bold">{producto.idproducto}</td>
                                    <td className="py-3 fw-semibold text-white">{producto.nombreproducto}</td>
                                    <td className="py-3">
                                        <span className="badge px-2.5 py-1.5 fw-medium"
                                            style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', borderRadius: '8px' }}>
                                            {producto.objCategoria?.nombrecategoria || 'General'}
                                        </span>
                                    </td>
                                    <td className="py-3 text-end fw-bold" style={{ color: '#34d399' }}>
                                        ${producto.precioproducto?.toLocaleString()}
                                    </td>
                                    <td className="py-3 text-center">
                                        <span className={`fw-bold ${producto.stockproducto < 5 ? 'text-warning' : 'text-slate-300'}`}>
                                            {producto.stockproducto}
                                        </span>
                                    </td>
                                    <td className="py-3 text-center">
                                        <span className={`badge rounded-pill px-3 py-1.5 ${producto.estadoproducto ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}
                                            style={{ backgroundColor: producto.estadoproducto ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: producto.estadoproducto ? '#34d399' : '#f87171' }}>
                                            {producto.estadoproducto ? '● Activo' : '○ Inactivo'}
                                        </span>
                                    </td>
                                    <td className="py-3 text-center">
                                        <button
                                            className="btn btn-sm me-2 fw-bold"
                                            style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#60a5fa', borderRadius: '8px', border: 'none', padding: '6px 12px' }}
                                            onClick={() => handleEditar(producto)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-sm fw-bold"
                                            style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171', borderRadius: '8px', border: 'none', padding: '6px 12px' }}
                                            onClick={() => handleEliminar(producto.idproducto)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {productosFiltrados.length === 0 && !error && (
                <div className="text-center text-muted mt-5 py-5" style={{ backgroundColor: '#1e293b', borderRadius: '16px', border: '1px dashed #334155' }}>
                    <div style={{ fontSize: '40px' }} className="mb-2">📋</div>
                    <h5 className="text-white mb-1">No hay coincidencias</h5>
                    <p className="small text-muted mb-0">Prueba ajustando los criterios de búsqueda</p>
                </div>
            )}

            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(10,15,30,0.85)', backdropFilter: 'blur(8px)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-2xl text-white" style={{ borderRadius: '20px', backgroundColor: '#1e293b', border: '1px solid #475569' }}>
                            <div className="modal-header border-0 px-4 pt-4 pb-2">
                                <h5 className="modal-title fw-extrabold" style={{ fontSize: '1.25rem' }}>
                                    {editando ? '⚡ Modificar Registro' : '✨ Crear Nuevo Registro'}
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <div className="mb-3">
                                    <label className="form-label fw-medium small" style={{ color: '#94a3b8' }}>Nombre descriptivo</label>
                                    <input
                                        type="text"
                                        className="form-control text-white"
                                        style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px' }}
                                        placeholder="Ej. Laptop Core i7"
                                        value={productoForm.nombreproducto}
                                        onChange={(e) => setProductoForm({ ...productoForm, nombreproducto: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-medium small" style={{ color: '#94a3b8' }}>Agrupación / Categoría</label>
                                    <select
                                        className="form-select text-white"
                                        style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px' }}
                                        value={productoForm.idcategoria}
                                        onChange={(e) => setProductoForm({ ...productoForm, idcategoria: parseInt(e.target.value) })}
                                    >
                                        {categorias.map(c => (
                                            <option key={c.idcategoria} value={c.idcategoria} style={{ backgroundColor: '#0f172a' }}>{c.nombrecategoria}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="row">
                                    <div className="col-6 mb-3">
                                        <label className="form-label fw-medium small" style={{ color: '#94a3b8' }}>Precio Base</label>
                                        <input
                                            type="number"
                                            className="form-control text-white"
                                            style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px' }}
                                            value={productoForm.precioproducto}
                                            onChange={(e) => setProductoForm({ ...productoForm, precioproducto: parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="col-6 mb-3">
                                        <label className="form-label fw-medium small" style={{ color: '#94a3b8' }}>Unidades Disponibles</label>
                                        <input
                                            type="number"
                                            className="form-control text-white"
                                            style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px' }}
                                            value={productoForm.stockproducto}
                                            onChange={(e) => setProductoForm({ ...productoForm, stockproducto: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <label className="form-label fw-medium small" style={{ color: '#94a3b8' }}>Disponibilidad Operativa</label>
                                    <select
                                        className="form-select text-white"
                                        style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px' }}
                                        value={productoForm.estadoproducto.toString()}
                                        onChange={(e) => setProductoForm({ ...productoForm, estadoproducto: e.target.value === 'true' })}
                                    >
                                        <option value="true" style={{ backgroundColor: '#0f172a' }}>Habilitado</option>
                                        <option value="false" style={{ backgroundColor: '#0f172a' }}>Inhabilitado</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer border-0 px-4 pb-4">
                                <button className="btn fw-semibold text-white btn-sm px-3 py-2" style={{ backgroundColor: '#334155', borderRadius: '10px' }} onClick={() => setShowModal(false)}>
                                    Cerrar
                                </button>
                                <button
                                    className="btn text-white fw-bold btn-sm px-4 py-2"
                                    style={{ backgroundColor: '#6366f1', borderRadius: '10px' }}
                                    onClick={handleGuardar}
                                >
                                    {editando ? 'Actualizar Datos' : 'Confirmar Guardado'}
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