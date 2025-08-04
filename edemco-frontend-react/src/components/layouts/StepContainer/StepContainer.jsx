import Title from '../../atoms/Title/Title'
import './StepContainer.css'

/*
* StepContainer Component
*
* Props:
* @param {ReactNode} children - Contenido dinámico que se renderiza dentro del contenedor del paso.
* @param {boolean} isOpen - Indica si el contenedor está abierto o cerrado.
* @param {function} setOpen - Función que se ejecuta al hacer clic para abrir o cerrar el contenedor.
* @param {number|string} stepNumber - Número o identificador del paso que se muestra en el encabezado.
* @param {string} stepTitle - Título del paso que se muestra junto al número.
* @param {string} stepParagraph - Texto descriptivo opcional que se muestra debajo del título.
*
* Función:
* Renderiza un contenedor de paso con encabezado, descripción opcional y contenido dinámico.
* - La clase CSS `is-open` se aplica si `isOpen` es true, permitiendo manejar estilos condicionales.
* - El encabezado incluye el número del paso (`stepNumber`) y un título (`stepTitle`) renderizado con el componente `Title`.
* - Puede envolver contenido dinámico pasado mediante `children`.
*
* Detalles adicionales:
* - La clase CSS `step-container__header` agrupa el número del paso y el título.
* - El texto descriptivo opcional se estiliza con la clase `step-container__paragraph`.
* - Permite manejar clics en el contenedor para abrir o cerrar su estado.
*/
const StepContainer = ({
  children,
  isOpen,
  setOpen,
  stepNumber,
  stepTitle,
  stepParagraph
}) => {
  const stepContainerClass = isOpen
    ? 'step-container is-open'
    : 'step-container'

  return (
    <article className={stepContainerClass} onClick={setOpen}>
      <div className="step-container__header">
        <span className="step-container__number title">{stepNumber}</span>
        <Title text={stepTitle} />
      </div>

      {stepParagraph && (
        <p className="step-container__paragraph">{stepParagraph}</p>
      )}

      {children}
    </article>
  )
}

export default StepContainer
