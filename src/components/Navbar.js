import React from 'react';

function Navbar({ onLogout }) {
    const nombre = localStorage.getItem('nombre');

    return (
        <nav className="navbar navbar-expand-lg py-3"
            style={{
                backgroundColor: '#0f172a',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                fontFamily: "'Inter', sans-serif"
            }}>
            <div className="container">
                <span className="navbar-brand fw-extrabold fs-4 tracking-tight" style={{
                    background: 'linear-gradient(to right, #6366f1, #ec4899)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.5px'
                }}>
                    Tienda 802
                </span>
                <div className="d-flex align-items-center gap-4">
                    {nombre && (
                        <div className="d-flex align-items-center gap-2">
                            <div style={{ width: '8px', height: '8px', backgroundColor: '#34d399', borderRadius: '50%' }}></div>
                            <span className="text-white fw-medium small" style={{ color: '#cbd5e1' }}>
                                {nombre}
                            </span>
                        </div>
                    )}
                    <button
                        className="btn btn-sm px-3.5 py-2 fw-bold transition-all"
                        style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: '#f87171',
                            borderRadius: '10px',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            fontSize: '0.85rem'
                        }}
                        onClick={onLogout}
                    >
                        Desconectarse
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;