import './Title.css'

/*
* Title Component
*
* Props:
* @param {string} text - Texto que se muestra como contenido del título.
* @param {string} [className=''] - Clase CSS adicional para personalizar estilos.
*
* Función:
* Renderiza un encabezado de nivel 2 (`<h2>`) con texto dinámico.
* - Aplica clases predeterminadas junto con cualquier clase personalizada proporcionada a través de `className`.
*
* Detalles adicionales:
* - La clase CSS `title` se usa para estilos básicos del título.
* - El uso de `className` permite personalizar estilos según sea necesario.
*/
const Title = ({ text, className = '' }) => {
  return <h2 className={`title ${className && className}`}>{text}</h2>
}

export default Title
