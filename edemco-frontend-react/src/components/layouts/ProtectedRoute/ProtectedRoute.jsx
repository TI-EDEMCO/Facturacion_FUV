import { Navigate, Outlet } from 'react-router-dom'
import Cookies from 'js-cookie'

/*
* ProtectedRoute Component
*
* Props:
* No recibe props directamente.
*
* Función:
* Gestiona rutas protegidas basadas en la existencia de un token de autenticación.
* - Verifica la existencia del token `accessToken` almacenado en las cookies.
* - Si no se encuentra el token, redirige al usuario a la ruta raíz (`/`).
* - Si el token está presente, renderiza el componente hijo utilizando `Outlet` de `react-router-dom`.
*
* Detalles adicionales:
* - Utiliza `Navigate` para manejar la redirección a rutas no autorizadas.
* - `Outlet` permite anidar rutas protegidas, mostrando los componentes correspondientes.
*/
const ProtectedRoute = () => {
  const token = Cookies.get('accessToken')

  if (!token) {
    return <Navigate to="/" />
  }

  return <Outlet />
}

export default ProtectedRoute
