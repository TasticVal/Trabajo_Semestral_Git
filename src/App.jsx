import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';

// Importamos las páginas que acabamos de crear
import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import InvoicePage from './pages/InvoicePage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          {/* El Navbar va dentro de los Providers para poder leer el usuario y el carrito */}
          <Navbar />
          
          <div className="container">
            <Routes>
              {/* Ruta pública */}
              <Route path="/" element={<LoginPage />} />
              
              {/* Rutas de la tienda */}
              <Route path="/productos" element={<ProductsPage />} />
              <Route path="/carrito" element={<CartPage />} />
              <Route path="/pedidos" element={<OrdersPage />} />
              <Route path="/factura/:id" element={<InvoicePage />} />
            </Routes>
          </div>
          
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;