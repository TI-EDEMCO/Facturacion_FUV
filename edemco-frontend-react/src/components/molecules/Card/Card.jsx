import Anchord from '../../atoms/Anchord/Anchord'
import Title from '../../atoms/Title/Title'
import './Card.css'

/*
* Card Component
*
* Props:
* @param {string} title - Título que se muestra en el encabezado de la tarjeta.
* @param {string} icon - Clase CSS para renderizar un ícono dentro del cuerpo de la tarjeta.
* @param {string} href - URL a la que redirige el enlace en el pie de la tarjeta.
* @param {string} linkText - Texto que se muestra en el enlace del pie de la tarjeta.
* @param {ReactNode} children - Contenido dinámico que se renderiza en el cuerpo de la tarjeta.
*
* Función:
* Renderiza una tarjeta con encabezado, cuerpo y pie opcional con un enlace.
* - El encabezado incluye el título proporcionado, renderizado con el componente `Title`.
* - El cuerpo muestra contenido dinámico (`children`) y un ícono estilizado usando la clase proporcionada en `icon`.
* - Si se proporciona `linkText`, renderiza un pie con un enlace utilizando el componente `Anchord`.
*
* Detalles adicionales:
* - La clase CSS `card-header` se aplica al encabezado, mientras que `card-body` y `card-footer` se usan para el cuerpo y pie, respectivamente.
* - Se utilizan componentes reutilizables como `Title` y `Anchord` para consistencia y modularidad.
*/
const Card = ({ title, icon, href, linkText, children }) => {
  return (
    <article className="card">
      <div className="card-header">
        <Title className="title--medium" text={title} />
      </div>

      <div className="card-body">
        {children}
        <i className={icon}></i>
      </div>

      {linkText && (
        <div className="card-footer">
          <Anchord href={href} text={linkText} />
        </div>
      )}
    </article>
  )
}

export default Card
