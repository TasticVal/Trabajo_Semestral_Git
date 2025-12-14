import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importamos useNavigate
import { getMenu } from '../services/menuService';
import { useAuth } from '../context/authContext'; // Importamos useAuth

export default function HomePage() {
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth(); // Obtenemos el usuario actual
  const navigate = useNavigate(); // Hook para redirigir

  useEffect(() => {
    // Si no hay usuario logueado, redirigimos al Login inmediatamente
    if (!user) {
      navigate('/login');
      return;
    }

    // Si hay usuario, cargamos el menú
    getMenu()
      .then(data => setMenuData(data))
      .catch(err => console.error("Error al cargar menú:", err))
      .finally(() => setLoading(false));
  }, [user, navigate]); // Dependencias para que se ejecute si cambia el usuario

  // Mientras carga o si estamos redirigiendo, mostramos spinner
  if (loading || !user) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container mt-5">
      <div className="card shadow-lg text-center p-5 border-0">
        <h1 className="display-4 text-primary mb-3">¡Hola, {user.username}! 👋</h1>
        
        {menuData ? (
          <>
            <h3 className="text-muted mb-5">{menuData.mensaje}</h3>
            
            <div className="row justify-content-center g-4">
              <div className="col-md-4">
                <Link to="/productos" className="btn btn-outline-primary w-100 p-4 fs-5 h-100 d-flex align-items-center justify-content-center shadow-sm">
                  <div>
                    <div className="fs-1 mb-2">📦</div>
                    Ver Productos
                  </div>
                </Link>
              </div>
              <div className="col-md-4">
                <Link to="/carrito" className="btn btn-outline-warning w-100 p-4 fs-5 h-100 d-flex align-items-center justify-content-center shadow-sm">
                  <div>
                    <div className="fs-1 mb-2">🛒</div>
                    Ir al Carrito
                  </div>
                </Link>
              </div>
              <div className="col-md-4">
                <Link to="/pedidos" className="btn btn-outline-success w-100 p-4 fs-5 h-100 d-flex align-items-center justify-content-center shadow-sm">
                  <div>
                    <div className="fs-1 mb-2">📋</div>
                    Mis Pedidos
                  </div>
                </Link>
              </div>
            </div>

            <div className="mt-5 alert alert-light border small text-muted">
              <strong>Endpoints Backend detectados:</strong> {Object.keys(menuData).filter(k => k !== 'mensaje').join(', ')}
            </div>
          </>
        ) : (
          <div className="alert alert-warning">
            No se pudo conectar con el Menú Principal del Backend.
          </div>
        )}
      </div>
    </div>
  );
}