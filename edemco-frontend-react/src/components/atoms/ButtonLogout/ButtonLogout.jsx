import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import './ButtonLogout.css'

/*
* ButtonLogout Component
*
* Props:
* No recibe props.
*
* Función:
* Renderiza un botón que permite cerrar la sesión del usuario.
* - Elimina las cookies `accessToken` y `refreshToken` para invalidar la sesión.
* - Redirige al usuario a la ruta raíz (`/`) tras cerrar la sesión, utilizando `useNavigate` de `react-router-dom`.
*
* Detalles adicionales:
* Incluye un ícono estilizado que representa "Cerrar Sesión" con un título accesible para mejorar la usabilidad.
*/
const ButtonLogout = () => {
  const navigate = useNavigate()

  const logout = () => {
    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
    navigate('/')
  }

  return (
    <button className="btn-session" onClick={logout}>
      <i className="fa-solid fa-right-from-bracket" title="Cerrar Sesión"></i>
    </button>
  )
}

export default ButtonLogout
