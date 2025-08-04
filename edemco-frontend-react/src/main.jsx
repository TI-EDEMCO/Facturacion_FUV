import { router } from './routes.jsx'
import { RouterProvider } from 'react-router-dom'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './styles.css'

/*
* Archivo de entrada principal de la aplicación.
*
* Función:
* Monta la aplicación React en el DOM y configura las principales herramientas:
* - React Router para el manejo de rutas.
* - React Toastify para notificaciones.
*
* Componentes principales:
* - `<RouterProvider>`: Proporciona las rutas definidas en `routes.jsx`.
* - `<ToastContainer>`: Configura las notificaciones con un diseño personalizado.
* - `<StrictMode>`: Activa verificaciones adicionales para desarrollo.
*
* Estilos:
* - `styles.css`: Estilos globales.
* - `react-toastify/dist/ReactToastify.css`: Estilos para las notificaciones.
*
* Ejecución:
* Renderiza la aplicación en el elemento DOM con el id `root`.
*/
ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />

    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      pauseOnFocusLoss={false}
    />
  </StrictMode>
)
