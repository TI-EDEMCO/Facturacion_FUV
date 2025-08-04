import { Link, useRouteError } from 'react-router-dom'
import './NotFound404.css'
import { useEffect } from 'react'

/*
* NotFound404 Component
*
* Función:
* Renderiza una página de error 404 cuando un usuario intenta acceder a una ruta inexistente.
* - Muestra un mensaje de error genérico.
* - Muestra detalles adicionales del error si están disponibles.
* - Proporciona un enlace para redirigir al usuario a la página principal.
*
* Estado interno:
* @param {Object} error - Error capturado de la ruta utilizando `useRouteError`.
*
* Efectos:
* - Cambia dinámicamente el título de la página a "Edemco - Página no encontrada".
*
* Componentes utilizados:
* - `Link`: Proporciona un enlace a la página principal.
*
* Detalles adicionales:
* - El mensaje de error se personaliza mostrando `error.statusText` o `error.message` si están disponibles.
* - La clase CSS `error-page` estiliza el contenedor principal de la página de error.
* - Se utiliza el `id` `error-page` para permitir una mayor personalización y selección en CSS.
*/
const NotFound404 = () => {
  const error = useRouteError()

  useEffect(() => {
    document.title = 'Edemco - Página no encontrada'
  }, [])

  return (
    <section className="error-page" id="error-page">
      <h1>Oops!</h1>
      <p>Error, la página a la que intentas acceder no existe.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <Link to="/principal">Volver al Inicio</Link>
    </section>
  )
}

export default NotFound404
