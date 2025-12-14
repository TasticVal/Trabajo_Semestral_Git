import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrders } from '../services/orderService';

export default function InvoicePage() {
  const { id } = useParams(); // Capturamos el ID de la URL
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Como no creamos un endpoint específico para "un pedido" en el backend simple,
    // traemos todos y buscamos el correcto aquí.
    const findOrder = async () => {
      try {
        const allOrders = await getOrders();
        // Buscamos el pedido que coincida con el ID de la URL
        const found = allOrders.find(o => o.id.toString() === id);
        
        if (found) {
          setOrder(found);
        } else {
          // Si no existe, usamos datos falsos para que veas el diseño igual
          setOrder({
            id: id,
            cliente: 'cliente@ejemplo.com',
            fecha: new Date().toISOString(),
            items: [
              { nombre: 'Producto Ejemplo 1', precio: 10000, cantidad: 1 },
              { nombre: 'Producto Ejemplo 2', precio: 5000, cantidad: 2 }
            ],
            subtotal: 20000,
            costoEnvio: 5000,
            total: 25000
          });
        }
      } catch (error) {
        console.error("Error cargando factura");
      } finally {
        setLoading(false);
      }
    };
    findOrder();
  }, [id]);

  if (loading) return <div className="text-center mt-5">Generando Factura...</div>;
  if (!order) return <div className="text-center mt-5">Pedido no encontrado</div>;

  // --- CÁLCULOS MATEMÁTICOS (RF3) ---
  const total = order.total;
  const neto = Math.round(total / 1.19); // Quitamos el IVA
  const iva = total - neto; // La diferencia es el impuesto

  return (
    <div className="container mt-4 mb-5">
      <button onClick={() => navigate(-1)} className="btn btn-outline-secondary mb-3 no-print">
        &larr; Volver
      </button>

      {/* Contenedor tipo "Hoja de Papel" */}
      <div className="card shadow-lg p-5 border-0" style={{ minHeight: '600px' }}>
        
        {/* Encabezado */}
        <div className="d-flex justify-content-between align-items-center border-bottom pb-4 mb-4">
          <div>
            <h1 className="h3 text-primary fw-bold">MI TIENDA SPA</h1>
            <p className="text-muted mb-0">RUT: 76.888.999-K</p>
            <p className="text-muted mb-0">Av. Siempre Viva 123, Santiago</p>
          </div>
          <div className="text-end">
            <h2 className="h4 text-danger border border-danger p-2 rounded">
              R.U.T. 76.888.999-K<br/>
              FACTURA ELECTRÓNICA<br/>
              <small className="text-dark">N° {order.id}</small>
            </h2>
            <p className="mb-0 mt-2"><strong>Fecha:</strong> {new Date(order.fecha).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Datos Cliente */}
        <div className="row mb-4">
          <div className="col-12">
            <h5 className="bg-light p-2 border rounded">Datos del Cliente</h5>
            <p className="mb-1"><strong>Señor(a):</strong> {order.cliente}</p>
            <p className="mb-1"><strong>Dirección:</strong> {order.direccion || 'Domicilio Particular'}</p>
          </div>
        </div>

        {/* Detalle */}
        <table className="table table-bordered mt-3">
          <thead className="table-light text-center">
            <tr>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Precio Unit.</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items && order.items.map((item, index) => (
              <tr key={index}>
                <td>{item.nombre}</td>
                <td className="text-center">{item.cantidad}</td>
                <td className="text-end">${item.precio}</td>
                <td className="text-end">${item.precio * item.cantidad}</td>
              </tr>
            ))}
            {/* Fila del Envío */}
            {order.costoEnvio > 0 && (
              <tr>
                <td>Costo de Envío</td>
                <td className="text-center">1</td>
                <td className="text-end">${order.costoEnvio}</td>
                <td className="text-end">${order.costoEnvio}</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totales (RF3) */}
        <div className="row mt-4">
          <div className="col-md-5 offset-md-7">
            <table className="table table-sm table-borderless">
              <tbody>
                <tr>
                  <td className="text-end fw-bold">Monto Neto:</td>
                  <td className="text-end border bg-light">${neto}</td>
                </tr>
                <tr>
                  <td className="text-end fw-bold">IVA (19%):</td>
                  <td className="text-end border bg-light">${iva}</td>
                </tr>
                <tr>
                  <td className="text-end fw-bold fs-5">TOTAL:</td>
                  <td className="text-end border bg-dark text-white fs-5">${total}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pie de página */}
        <div className="mt-auto text-center text-muted small border-top pt-3">
          <p>Gracias por su compra. Documento generado electrónicamente.</p>
        </div>

      </div>
    </div>
  );
}