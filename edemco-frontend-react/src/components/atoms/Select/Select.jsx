import './Select.css'

/*
* Select Component
*
* Props:
* @param {ReactNode} children - Opciones adicionales que se renderizan dentro del componente `<select>`.
* @param {string} [className=''] - Clase CSS adicional para personalizar estilos.
* @param {string} defaultOption - Texto de la opción predeterminada que se muestra inicialmente.
* @param {string} errorMessage - Mensaje de error que se muestra cuando `hasError` es true.
* @param {boolean} hasError - Indica si se debe mostrar un mensaje de error.
* @param {string} id - Identificador único para el `<select>`.
* @param {string} name - Nombre del `<select>` para identificarlo en formularios.
* @param {function} onChange - Función que se ejecuta al cambiar la opción seleccionada.
* @param {string} placeholder - Texto que aparece como etiqueta flotante del `<select>`.
* @param {string|number} value - Valor de la opción seleccionada.
*
* Función:
* Renderiza un campo de selección `<select>` con funcionalidad adicional y estilos personalizados.
* - Muestra una opción predeterminada deshabilitada, definida por `defaultOption`.
* - Muestra un mensaje de error si `hasError` es true.
* - Incluye una etiqueta flotante para el placeholder y estilos asociados.
*
* Detalles adicionales:
* - La clase `select-position` controla la posición general del componente.
* - El mensaje de error se estiliza usando la clase `error`.
*/
const Select = ({
  children,
  className = '',
  defaultOption,
  errorMessage,
  hasError,
  id,
  name,
  onChange,
  placeholder,
  value
}) => {
  return (
    <div className={`select-position ${className && className}`}>
      <select
        className={`select ${className && className}`}
        id={id}
        name={name}
        onChange={onChange}
        value={value}
      >
        <option disabled className="select--hide" value="0">
          {defaultOption}
        </option>
        {children}
      </select>

      <label className="select__label" htmlFor={id}>
        {placeholder}
      </label>

      {hasError && <p className="error">{errorMessage}</p>}
    </div>
  )
}

export default Select
