import { useEffect } from 'react'
import './Input.css'

/*
* Input Component
*
* Props:
* @param {string} accept - Tipos de archivos aceptados (para inputs de tipo file).
* @param {string|boolean} [checked=''] - Estado checked (para inputs de tipo checkbox o radio).
* @param {string} [className=''] - Clase CSS adicional para personalizar estilos.
* @param {string} errorMessage - Mensaje de error que se muestra cuando `hasError` es true.
* @param {boolean} [hasError=false] - Indica si se debe mostrar un mensaje de error.
* @param {string} id - Identificador único para el input.
* @param {string} name - Nombre del input para identificarlo en formularios.
* @param {function} onChange - Función ejecutada al cambiar el valor del input.
* @param {string} placeholder - Texto que aparece como etiqueta flotante del input.
* @param {string} type - Tipo del input (e.g., "text", "number", "email").
* @param {string|number} value - Valor del input.
*
* Función:
* Renderiza un input con funcionalidad adicional y estilos personalizados.
* - Previene la entrada de la tecla 'e' en inputs de tipo 'number'.
* - Agrega y limpia el evento `keydown` sobre el input para manejar este comportamiento.
* - Muestra un mensaje de error si `hasError` es true.
* - Incluye una etiqueta flotante para el placeholder y estilos asociados.
*
* Detalles adicionales:
* - La clase `input-position` controla la posición general del input.
* - Se agrega la clase `checked` si el input está marcado (para inputs de tipo checkbox o radio).
* - El mensaje de error se estiliza usando la clase `error`.
*/
const Input = ({
  accept,
  checked = '',
  className = '',
  errorMessage,
  hasError = false,
  id,
  name,
  onChange,
  placeholder,
  type,
  value
}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (type === 'number' && event.key === 'e') event.preventDefault()
    }

    const input = document.querySelector(`#${id}`)

    input.addEventListener('keydown', handleKeyDown)

    return () => {
      input.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div
      className={`input-position ${checked ? 'checked' : ''} ${className && className}`}
    >
      <input
        accept={accept}
        checked={checked}
        className={`input ${className && className}`}
        id={id}
        name={name}
        onChange={onChange}
        placeholder=""
        type={type}
        value={value}
      />

      <label className="input__label" htmlFor={id}>
        {placeholder}
      </label>

      {hasError && <p className="error">{errorMessage}</p>}
    </div>
  )
}

export default Input
