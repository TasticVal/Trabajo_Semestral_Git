import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext'; 
import { loginUser } from '../services/authService'; 

export default function LoginPage() {
  // CAMBIO: Usamos 'username' en lugar de 'usuario' para coincidir con el Backend
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(''); 
  const navigate = useNavigate();
  const { login } = useAuth(); 

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
      console.log("Enviando datos al backend:", formData); // Para depuración
      const response = await loginUser(formData);
      
      if (response && response.token) {
        // Guardamos el usuario real que viene del backend
        const userData = { 
            username: response.usuario.username, 
            email: response.usuario.email,
            token: response.token 
        };
        login(userData, response.token);
        navigate('/productos');
      } else {
        setError("Respuesta inesperada del servidor");
      }
    } catch (err) {
      console.error(err);
      setError('Credenciales incorrectas o error de conexión');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: '400px' }}>
        <h3 className="text-center mb-4 text-primary">Bienvenido</h3>
        
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input 
              type="text" 
              name="username" // CAMBIO CRÍTICO: name="username"
              className="form-control" 
              placeholder="Ej: admin"
              value={formData.username} // CAMBIO: value={formData.username}
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

          <button type="submit" className="btn btn-primary w-100 py-2">
            Ingresar
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to="/registro" className="small text-decoration-none">
            ¿No tienes cuenta? Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
}