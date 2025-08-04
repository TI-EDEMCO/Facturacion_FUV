import './Button.css'

/*
* Button Component
*
* Props:
* @param {string} [className=''] - Clase CSS adicional para personalizar estilos.
* @param {boolean} disabled - Indica si el botón está deshabilitado.
* @param {string} id - Identificador único para el botón.
* @param {boolean} isLoading - Muestra un indicador de carga si es true.
* @param {function} onClick - Función que se ejecuta al hacer clic en el botón.
* @param {string} text - Texto que se muestra dentro del botón.
* @param {string} type - Tipo del botón (e.g., "button", "submit", "reset").
*
* Función:
* Renderiza un botón con clases predeterminadas y personalizadas.
* Muestra un indicador de carga (`loader`) si `isLoading` es true.
* Permite personalizar comportamiento, estilo y tipo mediante props.
*/
const Button = ({
  className = '',
  disabled,
  id,
  isLoading,
  onClick,
  text,
  type
}) => {
  return (
    <button
      className={`boton ${className && className}`}
      disabled={disabled}
      id={id}
      onClick={onClick}
      type={type}
    >
      {text}

      {isLoading && <span className="loader"></span>}
    </button>
  )
}

export default Button
