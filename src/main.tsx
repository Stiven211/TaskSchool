import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.tsx'     // Ruta corregida al componente principal
import './styles/index.css'         // Importa estilos globales si existen

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)