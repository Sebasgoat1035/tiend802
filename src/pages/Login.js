import React, { useState } from 'react';
import api from '../services/api';

function Login({ onLogin }) {

    const [esRegistro, setEsRegistro] = useState(false);

    const [login, setLogin] = useState({
        email: '',
        password: ''
    });

    const [registro, setRegistro] = useState({
        tipoDoc: 'CC',
        nroDoc: '',
        nombre: '',
        email: '',
        password: '',
        confirmar: ''
    });

    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    const iniciarSesion = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');
        try {
            const response = await api.post('/api/Auth/login', {
                email: login.email,
                password: login.password
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('nombre', response.data.nombre);
            onLogin();
        } catch {
            setError('Correo o contraseña incorrectos.');
        }
    };

    const registrar = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');
        if (registro.password !== registro.confirmar) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        try {
            await api.post('/api/Auth/register', {
                tipoDoc: registro.tipoDoc,
                nroDoc: registro.nroDoc,
                nombre: registro.nombre,
                email: registro.email,
                password: registro.password,
                roles: [2]
            });
            setMensaje('Usuario registrado correctamente.');
            setRegistro({ tipoDoc: 'CC', nroDoc: '', nombre: '', email: '', password: '', confirmar: '' });
            setEsRegistro(false);
        } catch (err) {
            if (err.response) {
                setError(err.response.data);
            } else {
                setError('No fue posible registrar el usuario.');
            }
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#0a0f1d',
            backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(236, 72, 153, 0.12) 0%, transparent 50%)',
            fontFamily: "'Inter', sans-serif"
        }}
            className="d-flex align-items-center justify-content-center p-3">
            <div className="container" style={{ maxWidth: '450px' }}>
                <div className="text-center mb-4">
                    <h2 className="fw-extrabold tracking-tight" style={{
                        background: 'linear-gradient(to right, #6366f1, #ec4899)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: '2.5rem',
                        fontWeight: '800'
                    }}>Tienda 802</h2>
                    <p className="text-muted small uppercase fw-bold tracking-wider" style={{ letterSpacing: '2px', color: '#94a3b8' }}>
                        NEXUS MANAGEMENT SYSTEM
                    </p>
                </div>

                <div className="card border-0 shadow-2xl" style={{
                    borderRadius: '24px',
                    backgroundColor: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}>
                    <div className="card-body p-4 p-sm-5">
                        <div className="d-flex justify-content-center mb-4 p-1" style={{ backgroundColor: '#1e293b', borderRadius: '14px' }}>
                            <button
                                className={`btn w-100 py-2.5 fw-bold transition-all border-0 rounded-3`}
                                style={{
                                    borderRadius: '11px',
                                    backgroundColor: !esRegistro ? '#6366f1' : 'transparent',
                                    color: !esRegistro ? '#ffffff' : '#94a3b8',
                                    transition: 'all 0.3s ease',
                                    fontSize: '0.95rem'
                                }}
                                onClick={() => { setEsRegistro(false); setError(''); setMensaje(''); }}
                            >
                                Acceder
                            </button>
                            <button
                                className={`btn w-100 py-2.5 fw-bold transition-all border-0 rounded-3`}
                                style={{
                                    borderRadius: '11px',
                                    backgroundColor: esRegistro ? '#6366f1' : 'transparent',
                                    color: esRegistro ? '#ffffff' : '#94a3b8',
                                    transition: 'all 0.3s ease',
                                    fontSize: '0.95rem'
                                }}
                                onClick={() => { setEsRegistro(true); setError(''); setMensaje(''); }}
                            >
                                Registro
                            </button>
                        </div>

                        {mensaje && (
                            <div className="alert border-0 text-center py-2.5 rounded-3 mb-3" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                                <small className="fw-semibold">✨ {mensaje}</small>
                            </div>
                        )}
                        {error && (
                            <div className="alert border-0 text-center py-2.5 rounded-3 mb-3" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
                                <small className="fw-semibold">⚡ {error}</small>
                            </div>
                        )}

                        {!esRegistro ? (
                            <form onSubmit={iniciarSesion}>
                                <div className="mb-3">
                                    <label className="form-label fw-medium small mb-1" style={{ color: '#94a3b8' }}>Dirección de Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        style={{
                                            backgroundColor: '#0f172a',
                                            border: '1px solid #334155',
                                            color: '#f8fafc',
                                            borderRadius: '12px',
                                            padding: '12px'
                                        }}
                                        placeholder="nombre@ejemplo.com"
                                        value={login.email}
                                        onChange={(e) => setLogin({ ...login, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-medium small mb-1" style={{ color: '#94a3b8' }}>Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        style={{
                                            backgroundColor: '#0f172a',
                                            border: '1px solid #334155',
                                            color: '#f8fafc',
                                            borderRadius: '12px',
                                            padding: '12px'
                                        }}
                                        placeholder="••••••••"
                                        value={login.password}
                                        onChange={(e) => setLogin({ ...login, password: e.target.value })}
                                        required
                                    />
                                </div>
                                <button className="btn w-100 py-3 fw-bold rounded-3 shadow-lg transition-all"
                                    style={{
                                        background: 'linear-gradient(90deg, #6366f1, #4f46e5)',
                                        color: 'white',
                                        borderRadius: '12px',
                                        border: 'none',
                                        letterSpacing: '0.5px'
                                    }}
                                    type="submit">
                                    Autenticar Entrada →
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={registrar} style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '4px' }}>
                                <div className="mb-3">
                                    <label className="form-label fw-medium small mb-1" style={{ color: '#94a3b8' }}>Tipo de documento</label>
                                    <select
                                        className="form-select"
                                        style={{
                                            backgroundColor: '#0f172a',
                                            border: '1px solid #334155',
                                            color: '#f8fafc',
                                            borderRadius: '12px',
                                            padding: '12px'
                                        }}
                                        value={registro.tipoDoc}
                                        onChange={(e) => setRegistro({ ...registro, tipoDoc: e.target.value })}
                                    >
                                        <option value="CC">Cédula de Ciudadanía</option>
                                        <option value="TI">Tarjeta de Identidad</option>
                                        <option value="CE">Cédula de Extranjería</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-medium small mb-1" style={{ color: '#94a3b8' }}>Número de documento</label>
                                    <input
                                        className="form-control"
                                        style={{
                                            backgroundColor: '#0f172a',
                                            border: '1px solid #334155',
                                            color: '#f8fafc',
                                            borderRadius: '12px',
                                            padding: '12px'
                                        }}
                                        placeholder="123456789"
                                        value={registro.nroDoc}
                                        onChange={(e) => setRegistro({ ...registro, nroDoc: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-medium small mb-1" style={{ color: '#94a3b8' }}>Nombre completo</label>
                                    <input
                                        className="form-control"
                                        style={{
                                            backgroundColor: '#0f172a',
                                            border: '1px solid #334155',
                                            color: '#f8fafc',
                                            borderRadius: '12px',
                                            padding: '12px'
                                        }}
                                        placeholder="Tu nombre completo"
                                        value={registro.nombre}
                                        onChange={(e) => setRegistro({ ...registro, nombre: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-medium small mb-1" style={{ color: '#94a3b8' }}>Correo electrónico</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        style={{
                                            backgroundColor: '#0f172a',
                                            border: '1px solid #334155',
                                            color: '#f8fafc',
                                            borderRadius: '12px',
                                            padding: '12px'
                                        }}
                                        placeholder="correo@ejemplo.com"
                                        value={registro.email}
                                        onChange={(e) => setRegistro({ ...registro, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-medium small mb-1" style={{ color: '#94a3b8' }}>Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        style={{
                                            backgroundColor: '#0f172a',
                                            border: '1px solid #334155',
                                            color: '#f8fafc',
                                            borderRadius: '12px',
                                            padding: '12px'
                                        }}
                                        placeholder="••••••••"
                                        value={registro.password}
                                        onChange={(e) => setRegistro({ ...registro, password: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-medium small mb-1" style={{ color: '#94a3b8' }}>Confirmar contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        style={{
                                            backgroundColor: '#0f172a',
                                            border: '1px solid #334155',
                                            color: '#f8fafc',
                                            borderRadius: '12px',
                                            padding: '12px'
                                        }}
                                        placeholder="••••••••"
                                        value={registro.confirmar}
                                        onChange={(e) => setRegistro({ ...registro, confirmar: e.target.value })}
                                        required
                                    />
                                </div>
                                <button className="btn w-100 py-3 fw-bold rounded-3 shadow-lg"
                                    style={{
                                        background: 'linear-gradient(90deg, #ec4899, #db2777)',
                                        color: 'white',
                                        borderRadius: '12px',
                                        border: 'none'
                                    }}
                                    type="submit">
                                    Completar Registro →
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;