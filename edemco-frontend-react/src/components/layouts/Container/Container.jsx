// import { Outlet } from 'react-router-dom'
import './Container.css'

/*
* Container Component
*
* Props:
* @param {ReactNode} children - Contenido dinámico que se renderiza dentro del contenedor.
* @param {string} [className=''] - Clase CSS adicional para personalizar estilos.
*
* Función:
* Renderiza una sección (`<section>`) que actúa como contenedor para otros elementos o componentes.
* - Aplica clases predeterminadas junto con cualquier clase personalizada proporcionada a través de `className`.
* - Puede envolver contenido dinámico pasado mediante `children`.
*
* Detalles adicionales:
* - La clase CSS `contenedor` se utiliza para proporcionar los estilos base del componente.
*/
const Container = ({ children, className = '' }) => {
  return (
    <section className={`contenedor ${className && className}`}>
      {children}
    </section>
  )
}

export default Container
