import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Llamamos al servicio de registro
      const response = await registerUser(formData);
      
      if (response && response.id) {
        setSuccess(true);
        // Redirigir al login después de 2 segundos
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError('No se pudo completar el registro.');
      }
    } catch (err) {
      console.error(err);
      setError('Error al registrar. El usuario podría ya existir.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: '400px' }}>
        <h3 className="text-center mb-4 text-primary">Crear Cuenta</h3>
        
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">¡Registro exitoso! Redirigiendo...</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre de Usuario</label>
            <input 
              type="text" 
              name="username"
              className="form-control" 
              placeholder="Ej: nuevo_usuario"
              value={formData.username}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input 
              type="email" 
              name="email"
              className="form-control" 
              placeholder="correo@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input 
              type="password" 
              name="password"
              className="form-control" 
              placeholder="******"
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>

          <button type="submit" className="btn btn-success w-100 py-2" disabled={success}>
            Registrarse
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to="/" className="small text-decoration-none">
            ¿Ya tienes cuenta? Inicia Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}