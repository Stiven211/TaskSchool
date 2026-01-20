import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.tsx'     // Ruta corregida al componente principal
import './styles/index.css'         // Importa estilos globales si existen

// Apply theme immediately on load
const applyTheme = () => {
  const savedTheme = localStorage.getItem('taskSchool_theme') || 'auto';
  const isDark = savedTheme === 'dark' || (savedTheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

applyTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)