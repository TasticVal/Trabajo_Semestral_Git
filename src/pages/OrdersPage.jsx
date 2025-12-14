import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders, updateOrderStatus } from '../services/orderService';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar pedidos al iniciar
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      // Validamos que sea un array antes de ordenar
      const validOrders = Array.isArray(data) ? data : [];
      
      // Ordenamos para ver el más reciente primero (ID más alto primero)
      setOrders(validOrders.sort((a, b) => b.id - a.id));
    } catch (error) {
      console.error("Error cargando pedidos:", error);
      setOrders([]); 
    } finally {
      setLoading(false);
    }
  };

  const handleDespachar = async (id) => {
    if(!confirm("¿Estás seguro de marcar este pedido como DESPACHADO?")) return;

    try {
      // Llamamos al servicio (envía texto plano "DESPACHADO")
      const updatedOrder = await updateOrderStatus(id, 'DESPACHADO');
      
      // Actualizamos la lista localmente con la respuesta real del servidor
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === id ? updatedOrder : order
        )
      );
      alert("Pedido despachado correctamente.");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar estado. Revisa la conexión.");
    }
  };

  if (loading) return <div className="p-5 text-center"><div className="spinner-border text-primary"></div><p>Cargando pedidos...</p></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Gestión de Pedidos</h2>
      
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead className="table-dark text-center">
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha Despacho</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-center align-middle">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="fw-bold">#{order.id}</td>
                    
                    {/* Usamos los nombres de campo de PedidoModel (Java) */}
                    <td>{order.nombreCliente || 'Cliente'}</td> 
                    <td>${order.totalCalculado?.toLocaleString()}</td>
                    
                    <td>
                      {/* Badge condicional */}
                      <span className={`badge ${order.estado === 'DESPACHADO' ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {order.estado}
                      </span>
                    </td>
                    
                    <td>
                      {/* Mostramos fecha si existe */}
                      {order.fechaDespacho 
                        ? new Date(order.fechaDespacho).toLocaleString() 
                        : '-'}
                    </td>

                    <td className="text-end">
                      {/* Botón ver Factura: Redirige a /factura/{idPedido} */}
                      {/* InvoicePage se encargará de buscarla o generarla */}
                      <Link to={`/factura/${order.id}`} className="btn btn-sm btn-info text-white me-2">
                        📄 Factura
                      </Link>

                      {/* Botón Despachar (Solo visible si no está despachado) */}
                      {order.estado !== 'DESPACHADO' && (
                        <button 
                          className="btn btn-sm btn-dark"
                          onClick={() => handleDespachar(order.id)}
                        >
                          🚚 Despachar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {!loading && orders.length === 0 && (
            <div className="text-center p-5 text-muted">
              <h4>No hay pedidos registrados aún 📭</h4>
              <p>Realiza una compra en el catálogo para verla aquí.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}