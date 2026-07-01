import React from 'react';

function Navbar({ onLogout }) {
    const nombre = localStorage.getItem('nombre');

    return (
        <nav className="navbar navbar-expand-lg navbar-dark shadow"
            style={{ background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)' }}>
            <div className="container">
                <span className="navbar-brand fw-bold fs-4">
                     Tienda 802
                </span>
                <div className="d-flex align-items-center gap-3">
                    {nombre && (
                        <span className="text-white opacity-75 small">
                            Perfil: {nombre}
                        </span>
                    )}
                    <button
                        className="btn btn-outline-light btn-sm px-3 py-2 fw-semibold rounded-3"
                        onClick={onLogout}
                    >
                        🚪 Cerrar Sesión
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;