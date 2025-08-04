import { Outlet, useLocation } from 'react-router-dom'
import ButtonBack from './components/atoms/ButtonBack/ButtonBack'
import Navbar from './components/organisms/Navbar/Navbar'
import './Layout.css'

/*
* Layout Component
*
* Función:
* Estructura la página principal del sistema incluyendo el encabezado, el contenido principal, y un botón de retroceso en rutas específicas.
* - Utiliza React Router para manejar las rutas y mostrar diferentes vistas dinámicamente.
* - Incluye una barra de navegación persistente en todas las vistas.
*
* Parámetros:
* Este componente no recibe props.
*
* Detalles del comportamiento:
* - Utiliza el hook `useLocation` para determinar la ruta actual.
* - Condicionalmente renderiza el botón de retroceso (`ButtonBack`) dependiendo de la ruta actual:
*   - Si la ruta actual está en `routesToHideButtonBack`, no se muestra el botón de retroceso.
*   - De lo contrario, el botón de retroceso aparece al final de la página.
*/
function Layout() {
  const location = useLocation()
  const routesToHideButtonBack = ['/principal']

  return (
    <main>
      <Navbar />

      <div className="main-layout">
        <Outlet />
      </div>

      {!routesToHideButtonBack.includes(location.pathname) && <ButtonBack />}
    </main>
  )
}

export default Layout
