import './Steps.css'

/*
* Steps Component
*
* Props:
* @param {number} [actualStep=1] - El paso actual que se encuentra activo.
* @param {Array<string>} steps - Lista de pasos que se mostrarán en el componente.
*
* Función:
* Renderiza una lista de pasos con estilos que indican el paso actual y los completados.
* - Cada paso se representa con un número y un texto.
* - Los pasos activos (menores o iguales a `actualStep`) reciben la clase `active`.
* - Si el paso es uno de los últimos, se agrega la clase `has-border` para manejar estilos adicionales.
*
* Detalles adicionales:
* - La clase CSS `steps` se aplica al contenedor principal de la lista de pasos.
* - Los estilos de cada paso (`step`) se manejan con clases dinámicas basadas en su posición relativa al paso actual.
* - `step__number` y `step__text` se usan para estilos específicos del número y texto del paso.
*/
const Steps = ({ actualStep = 1, steps }) => {
  return (
    <ul className="steps">
      {steps.map((step, idx) => {
        const stepClass = idx + 1 <= actualStep ? 'step active' : 'step'
        const hasBorder = idx + 1 >= steps.length - 1

        return (
          <li
            key={step}
            className={`${stepClass} ${hasBorder ? 'has-border' : ''}`}
          >
            <span className="step__number">{idx + 1}</span>

            <span className="step__text">{step}</span>
          </li>
        )
      })}
    </ul>
  )
}

export default Steps
