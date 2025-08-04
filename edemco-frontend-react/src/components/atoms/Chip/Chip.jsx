import './Chip.css'

/*
* Chip Component
*
* Props:
* @param {string} text - Texto que se muestra dentro del chip.
* @param {function} onRemove - Función que se ejecuta al hacer clic en el botón de eliminación.
* @param {boolean} [showRemove=true] - Determina si se muestra el botón de eliminación.
* @param {string} id - Identificador único opcional para el chip.
*
* Función:
* Renderiza un chip con texto, un botón opcional para eliminarlo y estilos personalizados.
* - Si `showRemove` es true, incluye un botón para eliminar el chip que ejecuta la función `onRemove` al presionarlo.
* - Detiene la propagación del evento `onClick` al presionar el botón de eliminación.
*
* Detalles adicionales:
* - El atributo `title` se utiliza para mostrar el texto completo en un tooltip.
* - La clase CSS `chip` se aplica al contenedor, y las subclases `chip__text` y `chip__button` se usan para estilos específicos.
*/
const Chip = ({ text, onRemove, showRemove = true, id }) => {
  return (
    <span title={text} className="chip" id={id}>
      <span className="chip__text">{text}</span>

      {showRemove && (
        <button
          className="chip__button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      )}
    </span>
  )
}

export default Chip
