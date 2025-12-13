import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext'; // Importamos el contexto (fíjate en la minúscula)
import { loginUser } from '../services/authService'; // Importamos el servicio de conexión

export default function LoginPage() {
  const [formData, setFormData] = useState({ usuario: '', password: '' });
  const [error, setError] = useState(''); // Para mostrar mensajes de error si falla
  const navigate = useNavigate();
  const { login } = useAuth(); // Función del contexto para guardar la sesión

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
      // 1. Intentamos enviar los datos al Backend
      // NOTA: Si no tienes el backend corriendo, esto dará error.
      const response = await loginUser(formData);
      
      // 2. Si el backend responde con éxito (y nos da un token)
      if (response) {
        // Guardamos el usuario en la App (simulamos un objeto usuario si el backend solo devuelve token)
        const userData = { usuario: formData.usuario, token: response.token };
        login(userData, response.token);
        
        // 3. Redirigimos a la tienda
        navigate('/productos');
      }
    } catch (err) {
      // Si falla (ej. contraseña incorrecta o sin conexión)
      console.error(err);
      setError('Error al ingresar: Verifique credenciales o conexión con el servidor.');
      
      // --- SOLO PARA PRUEBAS (SI NO TIENES BACKEND AÚN) ---
      // Si quieres probar que el login "pase" aunque no tengas backend,
      // descomenta estas 3 líneas de abajo y comenta el bloque try/catch:
      /*
      const fakeUser = { usuario: formData.usuario, token: '123-fake' };
      login(fakeUser, '123-fake');
      navigate('/productos');
      */
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
              name="usuario"
              className="form-control" 
              placeholder="Ej: admin"
              value={formData.usuario}
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
            ¿No tienes cuenta? Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}