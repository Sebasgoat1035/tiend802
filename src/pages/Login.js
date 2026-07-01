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
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%)' }}
            className="d-flex align-items-center justify-content-center">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-5 col-lg-4">
                        <div className="text-center mb-4">
                            <div style={{ fontSize: '60px' }}></div>
                            <h2 className="text-white fw-bold">Tienda 802</h2>
                            <p className="text-white opacity-75">Sistema de Gestión</p>
                        </div>

                        <div className="card border-0 shadow-lg" style={{ borderRadius: '20px' }}>
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-center mb-4">
                                    <div className="btn-group w-100" role="group">
                                        <button
                                            className={`btn fw-semibold ${!esRegistro ? 'btn-success' : 'btn-outline-success'}`}
                                            style={{ borderRadius: '10px 0 0 10px' }}
                                            onClick={() => { setEsRegistro(false); setError(''); setMensaje(''); }}
                                        >
                                            Iniciar Sesión
                                        </button>
                                        <button
                                            className={`btn fw-semibold ${esRegistro ? 'btn-primary' : 'btn-outline-primary'}`}
                                            style={{ borderRadius: '0 10px 10px 0' }}
                                            onClick={() => { setEsRegistro(true); setError(''); setMensaje(''); }}
                                        >
                                            Registrarse
                                        </button>
                                    </div>
                                </div>

                                {mensaje && <div className="alert alert-success py-2 rounded-3"><small>✅ {mensaje}</small></div>}
                                {error && <div className="alert alert-danger py-2 rounded-3"><small>⚠️ {error}</small></div>}

                                {!esRegistro ? (
                                    <form onSubmit={iniciarSesion}>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-muted small">Correo electrónico</label>
                                            <input
                                                type="email"
                                                className="form-control rounded-3"
                                                placeholder="correo@ejemplo.com"
                                                value={login.email}
                                                onChange={(e) => setLogin({ ...login, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label fw-semibold text-muted small">Contraseña</label>
                                            <input
                                                type="password"
                                                className="form-control rounded-3"
                                                placeholder="••••••••"
                                                value={login.password}
                                                onChange={(e) => setLogin({ ...login, password: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <button className="btn btn-success w-100 py-2 fw-semibold rounded-3" type="submit">
                                            Ingresar →
                                        </button>
                                    </form>
                                ) : (
                                    <form onSubmit={registrar}>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-muted small">Tipo de documento</label>
                                            <select
                                                className="form-select rounded-3"
                                                value={registro.tipoDoc}
                                                onChange={(e) => setRegistro({ ...registro, tipoDoc: e.target.value })}
                                            >
                                                <option value="CC">CC</option>
                                                <option value="TI">TI</option>
                                                <option value="CE">CE</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-muted small">Número de documento</label>
                                            <input
                                                className="form-control rounded-3"
                                                placeholder="123456789"
                                                value={registro.nroDoc}
                                                onChange={(e) => setRegistro({ ...registro, nroDoc: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-muted small">Nombre completo</label>
                                            <input
                                                className="form-control rounded-3"
                                                placeholder="Tu nombre"
                                                value={registro.nombre}
                                                onChange={(e) => setRegistro({ ...registro, nombre: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-muted small">Correo electrónico</label>
                                            <input
                                                type="email"
                                                className="form-control rounded-3"
                                                placeholder="correo@ejemplo.com"
                                                value={registro.email}
                                                onChange={(e) => setRegistro({ ...registro, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold text-muted small">Contraseña</label>
                                            <input
                                                type="password"
                                                className="form-control rounded-3"
                                                placeholder="••••••••"
                                                value={registro.password}
                                                onChange={(e) => setRegistro({ ...registro, password: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label fw-semibold text-muted small">Confirmar contraseña</label>
                                            <input
                                                type="password"
                                                className="form-control rounded-3"
                                                placeholder="••••••••"
                                                value={registro.confirmar}
                                                onChange={(e) => setRegistro({ ...registro, confirmar: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <button className="btn btn-primary w-100 py-2 fw-semibold rounded-3" type="submit">
                                            Crear Cuenta →
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;