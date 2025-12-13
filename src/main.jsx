import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// BORRA ESTO: import './index.css'
// AGREGA ESTO (Si no lo tienes):
import 'bootstrap/dist/css/bootstrap.min.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)