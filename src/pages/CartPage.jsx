import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/authContext';
import { getShippingMethods, createOrder } from '../services/orderService';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Estados locales para el formulario
  const [envios, setEnvios] = useState([]);
  const [costoEnvio, setCostoEnvio] = useState(0);
  const [direccion, setDireccion] = useState('');
  
  // Totales
  const subtotal = getCartTotal();
  const totalFinal = subtotal + Number(costoEnvio);

  // Cargar métodos de envío al iniciar
  useEffect(() => {
    fetchEnvios();
  }, []);

  const fetchEnvios = async () => {
    try {
      const data = await getShippingMethods();
      setEnvios(data);
    } catch (error) {
      console.error("Error cargando envíos, usando valores por defecto.");
      // Datos de respaldo si no hay backend
      setEnvios([
        { id: 1, nombre: 'Retiro en Tienda', costo: 0 },
        { id: 2, nombre: 'Despacho a Domicilio', costo: 5000 },
        { id: 3, nombre: 'Envío Express', costo: 8500 }
      ]);
    }
  };

  const handleConfirmarPedido = async () => {
    if (!direccion.trim()) {
      alert("Por favor ingresa una dirección de despacho.");
      return;
    }

    const nuevaOrden = {
      cliente: user?.usuario || 'Invitado',
      items: cart,
      subtotal: subtotal,
      costoEnvio: Number(costoEnvio),
      total: totalFinal,
      direccion: direccion,
      fecha: new Date().toISOString(),
      estado: 'PENDIENTE'
    };

    try {
      // Intentar enviar al backend
      await createOrder(nuevaOrden);
      alert("¡Pedido creado con éxito!");
      
      clearCart(); // Limpiamos el carrito
      navigate('/pedidos'); // Redirigimos a "Mis Pedidos"
    } catch (error) {
      console.error(error);
      alert("Error al crear el pedido (¿El backend está corriendo?)");
    }
  };

  // VISTA: Si el carrito está vacío
  if (cart.length === 0) {
    return (
      <div className="text-center mt-5">
        <h3>Tu carrito está vacío 😢</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/productos')}>
          Volver a la Tienda
        </button>
      </div>
    );
  }

  // VISTA: Carrito con productos
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Tu Pedido</h2>
      
      <div className="row">
        {/* COLUMNA IZQUIERDA: Tabla de Productos */}
        <div className="col-md-8">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white">Productos Seleccionados</div>
            <ul className="list-group list-group-flush">
              {cart.map((item) => (
                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">{item.nombre}</h6>
                    <small className="text-muted">
                      ${item.precio} x {item.cantidad} unidad(es)
                    </small>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="fw-bold me-3">
                      ${item.precio * item.cantidad}
                    </span>
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeFromCart(item.id)}
                    >
                      X
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* COLUMNA DERECHA: Resumen y Pago */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Resumen de Compra</h5>
              
              {/* Selector de Envío */}
              <div className="mb-3">
                <label className="form-label">Método de Envío</label>
                <select 
                  className="form-select"
                  onChange={(e) => setCostoEnvio(Number(e.target.value))}
                >
                  <option value="0">Seleccione...</option>
                  {envios.map(env => (
                    <option key={env.id} value={env.costo}>
                      {env.nombre} - ${env.costo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dirección */}
              <div className="mb-3">
                <label className="form-label">Dirección de Entrega</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Calle, Número, Comuna"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                />
              </div>

              <hr />

              {/* Totales */}
              <div className="d-flex justify-content-between">
                <span>Subtotal:</span>
                <span>${subtotal}</span>
              </div>
              <div className="d-flex justify-content-between text-muted">
                <span>Envío:</span>
                <span>${costoEnvio}</span>
              </div>
              <div className="d-flex justify-content-between mt-2 fs-5 fw-bold">
                <span>Total Final:</span>
                <span className="text-primary">${totalFinal}</span>
              </div>

              {/* Botón Confirmar */}
              <button 
                className="btn btn-success w-100 mt-4 py-2"
                onClick={handleConfirmarPedido}
              >
                CONFIRMAR PEDIDO
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}