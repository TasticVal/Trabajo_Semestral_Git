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
      // Ordenamos para ver el más reciente primero
      setOrders(data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
    } catch (error) {
      console.error("Error cargando pedidos");
      // --- DATOS FALSOS PARA QUE VEAS EL DISEÑO SI NO HAY BACKEND ---
      setOrders([
        { id: 101, cliente: 'juan@demo.com', total: 55000, fecha: '2023-10-05', estado: 'DESPACHADO' },
        { id: 102, cliente: 'maria@test.com', total: 12500, fecha: '2023-10-06', estado: 'PENDIENTE' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDespachar = async (id) => {
    if(!confirm("¿Estás seguro de marcar este pedido como DESPACHADO?")) return;

    try {
      await updateOrderStatus(id, 'DESPACHADO');
      // Actualizamos la lista localmente para que cambie el color sin recargar
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === id ? { ...order, estado: 'DESPACHADO' } : order
        )
      );
    } catch (error) {
      alert("Error al actualizar estado. Revisa la consola.");
    }
  };

  if (loading) return <div className="p-5 text-center">Cargando pedidos...</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Gestión de Pedidos</h2>
      
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="align-middle">
                  <td className="fw-bold">#{order.id}</td>
                  <td>{new Date(order.fecha).toLocaleDateString()}</td>
                  <td>{order.cliente}</td>
                  <td>${order.total}</td>
                  <td>
                    {/* Badge condicional: Amarillo si Pendiente, Verde si Despachado */}
                    <span className={`badge ${order.estado === 'PENDIENTE' ? 'bg-warning text-dark' : 'bg-success'}`}>
                      {order.estado}
                    </span>
                  </td>
                  <td className="text-end">
                    {/* Botón ver Factura */}
                    <Link to={`/factura/${order.id}`} className="btn btn-sm btn-info text-white me-2">
                      📄 Ver Factura
                    </Link>

                    {/* Botón Despachar (Solo visible si está PENDIENTE) */}
                    {order.estado === 'PENDIENTE' && (
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
          
          {orders.length === 0 && (
            <div className="text-center p-4 text-muted">No hay pedidos registrados aún.</div>
          )}
        </div>
      </div>
    </div>
  );
}