import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">Mi Tienda</Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/productos">Catálogo</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/pedidos">Mis Pedidos</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary position-relative ms-2 me-3" to="/carrito">
                    🛒 Carrito
                    {cart.length > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">Salir</button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}