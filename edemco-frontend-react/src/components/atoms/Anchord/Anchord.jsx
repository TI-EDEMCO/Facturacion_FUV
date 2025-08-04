import { Link } from 'react-router-dom'
import './Anchord.css'

/*
* Anchord Component
*
* Props:
* @param {string} text - Texto que se muestra dentro del enlace.
* @param {string} href - Ruta a la que se dirige el enlace.
* @param {string} [className=''] - Clase CSS adicional para personalizar estilos.
*
* Función:
* Renderiza un enlace estilizado utilizando el componente `Link` de `react-router-dom`.
* Aplica clases predeterminadas junto con cualquier clase adicional proporcionada por `className`.
*/
const Anchord = ({ text, href, className = '' }) => {
  return (
    <Link className={`boton boton--margin ${className && className}`} to={href}>
      {text}
    </Link>
  )
}

export default Anchord
