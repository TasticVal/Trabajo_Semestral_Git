import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';

// Importamos las páginas REALES
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';         // <--- IMPORTANTE: Menú Principal
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import InvoicePage from './pages/InvoicePage';

function App() {
  return (
    <BrowserRouter>
      {/* El AuthProvider envuelve todo para gestionar el usuario */}
      <AuthProvider>
        <CartProvider>
          {/* El Navbar va dentro de los Providers para leer usuario/carrito */}
          <Navbar />
          
          <div className="container mt-4">
            <Routes>
              {/* Ruta Raíz: Muestra el Menú Principal */}
              <Route path="/" element={<HomePage />} />
              
              {/* Ruta alias para el menú (opcional) */}
              <Route path="/menu" element={<HomePage />} />
              
              {/* Rutas de Acceso */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registro" element={<RegisterPage />} />
              
              {/* Rutas privadas de la tienda */}
              <Route path="/productos" element={<ProductsPage />} />
              <Route path="/carrito" element={<CartPage />} />
              <Route path="/pedidos" element={<OrdersPage />} />
              <Route path="/factura/:id" element={<InvoicePage />} />
              
              {/* Ruta para manejar errores 404 */}
              <Route path="*" element={<h2 className="text-center mt-5">Página no encontrada (404)</h2>} />
            </Routes>
          </div>
          
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;