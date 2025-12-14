import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../services/api'; 

export default function InvoicePage() {
  const { id } = useParams(); // ID del Pedido
  const navigate = useNavigate();
  const [factura, setFactura] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFacturaAndDetails = async () => {
      try {
        // 1. Buscamos si existe la factura en la lista general
        const facturas = await apiFetch('/facturas');
        let facturaEncontrada = facturas.find(f => f.pedidoId === parseInt(id));

        if (!facturaEncontrada) {
          // 2. Si no existe, buscamos el pedido para generarla
          const pedido = await apiFetch(`/pedidos/obetener/${id}`);
          if (pedido) {
            facturaEncontrada = await apiFetch('/facturas/generar', {
              method: 'POST',
              body: JSON.stringify(pedido)
            });
          } else {
            setError("Pedido no encontrado.");
            setLoading(false);
            return;
          }
        }

        // 3. CRUCIAL: Si la factura no tiene productos (por ser Transient),
        // buscamos el pedido original para rellenar los datos visuales.
        if (!facturaEncontrada.productos || facturaEncontrada.productos.length === 0) {
          const pedidoOriginal = await apiFetch(`/pedidos/obetener/${id}`);
          if (pedidoOriginal) {
            facturaEncontrada.productos = pedidoOriginal.productos;
            facturaEncontrada.metodoEnvio = pedidoOriginal.metodoEnvio;
          }
        }

        setFactura(facturaEncontrada);

      } catch (err) {
        console.error("Error cargando factura:", err);
        setError("Error de conexión.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
        fetchFacturaAndDetails();
    }
  }, [id]);

  // --- LÓGICA DE AGRUPACIÓN (Para que no salgan repetidos) ---
  const getGroupedProducts = () => {
    if (!factura || !factura.productos) return [];
    
    const grouped = {};
    
    factura.productos.forEach(prod => {
      if (grouped[prod.id]) {
        grouped[prod.id].cantidad += 1;
        grouped[prod.id].totalLine += prod.precio;
      } else {
        grouped[prod.id] = {
          ...prod,
          cantidad: 1,
          totalLine: prod.precio
        };
      }
    });
    
    return Object.values(grouped);
  };

  const groupedItems = getGroupedProducts();

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div><p>Cargando documento...</p></div>;
  
  if (error) return (
    <div className="text-center mt-5">
      <h3 className="text-danger">Error</h3>
      <p>{error}</p>
      <button className="btn btn-secondary" onClick={() => navigate('/pedidos')}>Volver a Mis Pedidos</button>
    </div>
  );

  if (!factura) return <div className="text-center mt-5">Factura no encontrada.</div>;

  return (
    <div className="container mt-4 mb-5">
      <button onClick={() => navigate('/pedidos')} className="btn btn-outline-secondary mb-3 no-print">
        &larr; Volver a Mis Pedidos
      </button>

      <div className="card shadow-lg p-5 border-0" style={{ minHeight: '600px', maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Encabezado */}
        <div className="d-flex justify-content-between align-items-center border-bottom pb-4 mb-4">
          <div>
            <h1 className="h3 text-primary fw-bold">MI TIENDA SPA</h1>
            <p className="text-muted mb-0">RUT: 76.888.999-K</p>
            <p className="text-muted mb-0">Av. Siempre Viva 123, Santiago</p>
          </div>
          <div className="text-end">
            <div className="border border-danger p-2 rounded text-center">
              <h2 className="h5 text-danger mb-0">R.U.T. 76.888.999-K</h2>
              <h2 className="h5 text-danger mb-0">FACTURA ELECTRÓNICA</h2>
              <small className="text-dark fw-bold">N° {factura.numeroFactura}</small>
            </div>
            <p className="mb-0 mt-2 text-muted small">
              <strong>Fecha Emisión:</strong> {new Date(factura.fechaEmision).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Datos Cliente */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="bg-light p-3 border rounded">
              <h5 className="mb-3 text-secondary">Datos del Cliente</h5>
              <div className="row">
                <div className="col-md-6">
                  <p className="mb-1"><strong>Señor(a):</strong> {factura.nombreCliente}</p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1"><strong>Dirección:</strong> {factura.direccionCliente || 'Domicilio Particular'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detalle */}
        <table className="table table-striped table-bordered mt-3">
          <thead className="table-dark text-center">
            <tr>
              <th>Producto / Descripción</th>
              <th style={{width: '100px'}}>Cantidad</th>
              <th style={{width: '150px'}}>Precio Unit.</th>
              <th style={{width: '150px'}}>Total</th>
            </tr>
          </thead>
          <tbody>
            {/* Productos Agrupados */}
            {groupedItems.map((item, index) => (
              <tr key={index}>
                <td>
                  <strong>{item.nombre}</strong>
                  <div className="text-muted small">{item.descripcion}</div>
                </td>
                <td className="text-center">{item.cantidad}</td>
                <td className="text-end">${item.precio.toLocaleString()}</td>
                <td className="text-end">${item.totalLine.toLocaleString()}</td>
              </tr>
            ))}
            
            {/* Envío */}
            {factura.metodoEnvio && (
              <tr>
                <td>
                  <strong>Envío:</strong> {factura.metodoEnvio.nombre}
                  <div className="text-muted small">{factura.metodoEnvio.tiempoEstimado}</div>
                </td>
                <td className="text-center">1</td>
                <td className="text-end">${factura.metodoEnvio.precio.toLocaleString()}</td>
                <td className="text-end">${factura.metodoEnvio.precio.toLocaleString()}</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totales */}
        <div className="row mt-4">
          <div className="col-md-5 offset-md-7">
            <table className="table table-sm table-borderless">
              <tbody>
                <tr>
                  <td className="text-end text-muted">Monto Neto:</td>
                  <td className="text-end fw-bold">${factura.montoNeto?.toLocaleString()}</td>
                </tr>
                <tr>
                  <td className="text-end text-muted">IVA (19%):</td>
                  <td className="text-end fw-bold">${factura.montoIva?.toLocaleString()}</td>
                </tr>
                <tr className="border-top">
                  <td className="text-end fs-5 pt-2">TOTAL A PAGAR:</td>
                  <td className="text-end fs-5 text-primary fw-bold pt-2">${factura.totalPagado?.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pie de página */}
        <div className="mt-auto text-center text-muted small border-top pt-4 no-print">
          <p>Gracias por su compra. Documento generado electrónicamente.</p>
          <button className="btn btn-primary" onClick={() => window.print()}>Imprimir Comprobante</button>
        </div>

      </div>
    </div>
  );
}