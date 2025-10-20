import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setUserData(null);

    try {
      const response = await fetch('https://padel-gestionado.com/api/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.status === 'ok') {
        setMessage('Login exitoso! Redirigiendo al menú principal...');
        setUserData(data);
        localStorage.setItem('usuario', JSON.stringify(data));
        
        // Redirigir al menú principal después de 2 segundos
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess();
          }
        }, 2000);
      } else {
        setMessage('Error en el login: ' + (data.message || 'Credenciales inválidas'));
      }
    } catch (error) {
      setMessage('Error de conexión: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '0 auto' }}>
      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0, marginBottom: 6 }}>Iniciar Sesión</h2>
        <p className="muted" style={{ marginTop: 0 }}>Accedé para gestionar reservas y torneos.</p>
        <form onSubmit={handleSubmit} className="form" style={{ marginTop: 12 }}>
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="input" />
          </div>
          <div>
            <label htmlFor="password" className="label">Contraseña</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required className="input" />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary btn-block">
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        <div className="divider" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="muted">¿No tienes una cuenta?</span>
          <button type="button" onClick={() => navigate('/register')} className="btn btn-success">Crear cuenta</button>
        </div>
        {message && (
          <div className={`alert ${message.includes('exitoso') ? 'alert-success' : 'alert-danger'}`} style={{ marginTop: 16 }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
