import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext'; // Para agregar al carrito
import { getProducts } from '../services/productService'; // Para traer datos

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Traemos la función para agregar del contexto
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los productos. Asegúrate de que el Backend esté corriendo.');
      
      // --- SOLO PARA PRUEBAS SIN BACKEND (Datos falsos) ---
      // Si quieres ver cómo queda el diseño sin el servidor, descomenta esto:
      /*
      setProducts([
        { id: 1, nombre: 'Laptop Gamer', descripcion: 'Potente laptop para juegos', precio: 1500, stock: 5 },
        { id: 2, nombre: 'Mouse Inalámbrico', descripcion: 'Ergonómico y rápido', precio: 25, stock: 10 },
        { id: 3, nombre: 'Teclado Mecánico', descripcion: 'Luces RGB', precio: 80, stock: 0 },
      ]);
      */
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Catálogo de Productos</h2>

      {error && <div className="alert alert-warning">{error}</div>}

      <div className="row">
        {products.map((prod) => (
          <div key={prod.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              {/* Placeholder de imagen (gris) */}
              <div className="bg-secondary bg-opacity-25 d-flex justify-content-center align-items-center" style={{height: '200px'}}>
                <span className="text-muted">Sin Imagen</span>
              </div>
              
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{prod.nombre}</h5>
                <p className="card-text text-muted small flex-grow-1">{prod.descripcion}</p>
                
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fs-4 fw-bold text-primary">${prod.precio}</span>
                  <span className={`badge ${prod.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                    Stock: {prod.stock}
                  </span>
                </div>

                <button 
                  className="btn btn-dark w-100 mt-auto"
                  disabled={prod.stock === 0}
                  onClick={() => addToCart(prod)}
                >
                  {prod.stock > 0 ? 'Agregar al Carrito (+1)' : 'Sin Stock'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}