import React from 'react'
import ReactDOM from 'react-dom/client'
import AppRoutes from './routes/AppRoutes'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  // Matikan StrictMode SEMENTARA untuk menghindari double-render 
  // yang membingungkan Backend saat proses upload/klaim CV.
  // <React.StrictMode>
    <AppRoutes />
  // </React.StrictMode>
)