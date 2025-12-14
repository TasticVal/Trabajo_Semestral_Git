import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estados para el Modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ id: null, nombre: '', descripcion: '', precio: '', stock: '' });

  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError('Error al cargar productos. Revisa la conexión con el backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await deleteProduct(id);
        fetchProducts(); 
      } catch (err) {
        console.error(err);
        // Mensaje amigable para el usuario cuando falla por FK (clave foránea)
        alert('No se pudo eliminar el producto. Es probable que tenga pedidos asociados.');
      }
    }
  };

  const handleEditClick = (prod) => {
    setCurrentProduct(prod);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleNewClick = () => {
    setCurrentProduct({ id: null, nombre: '', descripcion: '', precio: '', stock: '' });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateProduct(currentProduct.id, currentProduct);
      } else {
        await createProduct(currentProduct);
      }
      setShowModal(false);
      fetchProducts(); 
    } catch (err) {
      alert('Error al guardar producto');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Catálogo de Productos</h2>
        <button className="btn btn-success" onClick={handleNewClick}>
          + Nuevo Producto
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {products.map((prod) => (
          <div key={prod.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between">
                  <h5 className="card-title text-truncate">{prod.nombre}</h5>
                  <div className="d-flex gap-1">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditClick(prod)}>✏️</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(prod.id)}>🗑️</button>
                  </div>
                </div>
                
                <p className="card-text text-muted small flex-grow-1">{prod.descripcion}</p>
                
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fs-4 fw-bold text-primary">${prod.precio}</span>
                  <span className={`badge ${prod.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                    Stock: {prod.stock}
                  </span>
                </div>

                <button 
                  className="btn btn-dark w-100 mt-auto"
                  disabled={prod.stock <= 0}
                  onClick={() => addToCart(prod)}
                >
                  {prod.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <>
          {/* Backdrop oscuro */}
          <div className="modal-backdrop fade show"></div>
          {/* Modal */}
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{isEditing ? 'Editar Producto' : 'Crear Producto'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
                </div>
                <form onSubmit={handleModalSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Nombre</label>
                      <input type="text" name="nombre" className="form-control" value={currentProduct.nombre} onChange={handleInputChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Descripción</label>
                      <textarea name="descripcion" className="form-control" value={currentProduct.descripcion} onChange={handleInputChange} required />
                    </div>
                    <div className="row">
                      <div className="col-6 mb-3">
                        <label className="form-label">Precio</label>
                        <input type="number" name="precio" className="form-control" value={currentProduct.precio} onChange={handleInputChange} required min="0" />
                      </div>
                      <div className="col-6 mb-3">
                        <label className="form-label">Stock</label>
                        <input type="number" name="stock" className="form-control" value={currentProduct.stock} onChange={handleInputChange} required min="0" />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                    <button type="submit" className="btn btn-primary">Guardar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}