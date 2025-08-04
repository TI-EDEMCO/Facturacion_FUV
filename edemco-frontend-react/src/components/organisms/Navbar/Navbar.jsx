import { Link } from 'react-router-dom'
import './Navbar.css'
import ButtonLogout from '../../atoms/ButtonLogout/ButtonLogout'

/*
* Navbar Component
*
* Props:
* No recibe props.
*
* Función:
* Renderiza una barra de navegación que incluye:
* - Un enlace al dashboard principal (`/principal`) con un logo.
* - Un botón de cierre de sesión utilizando el componente `ButtonLogout`.
*
* Detalles adicionales:
* - La clase CSS `titulo` se aplica al contenedor principal de la barra de navegación.
* - `titulo__link` se utiliza para estilizar el enlace que contiene el logo.
* - El logo se renderiza como una imagen con dimensiones específicas.
* - El componente `ButtonLogout` maneja la funcionalidad de cerrar sesión.
*/
const Navbar = () => {
  return (
    <nav className="titulo">
      <Link className='titulo__link' to="/principal">
        <img
          alt="logo-edemco"
          height={127}
          src="/Logo-removebg-preview.png"
          width={290}
        />
      </Link>

      <ButtonLogout />
    </nav>
  )
}

export default Navbar
