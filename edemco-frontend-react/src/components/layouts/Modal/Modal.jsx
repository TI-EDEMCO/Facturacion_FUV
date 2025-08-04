import { useEffect } from 'react'
import Title from '../../atoms/Title/Title'
import './Modal.css'

/*
* Modal Component
*
* Props:
* @param {ReactNode} children - Contenido dinámico que se renderiza dentro del modal.
* @param {function} onClose - Función que se ejecuta al cerrar el modal, ya sea mediante el botón de cierre o la tecla Escape.
* @param {string} title - Título opcional que se muestra en el encabezado del modal.
*
* Función:
* Renderiza un modal con un contenedor principal y un encabezado.
* - Escucha el evento de teclado para cerrar el modal al presionar la tecla Escape.
* - Proporciona un botón de cierre estilizado con un ícono.
* - Puede envolver contenido dinámico pasado mediante `children`.
*
* Detalles adicionales:
* - La clase CSS `modal__container` actúa como fondo del modal, mientras que `modal` define el área principal del contenido.
* - El componente `Title` se utiliza para mostrar el título si se pasa como prop.
* - Se limpia el evento de teclado al desmontar el componente.
*/
const Modal = ({ children, onClose, title }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keyup', handleKeyDown)

    return () => {
      document.removeEventListener('keyup', handleKeyDown)
    }
  }, [])

  return (
    <section className="modal__container">
      <article className="modal">
        <header className='modal__header'>
          {title && <Title text={title} />}

          <button onClick={onClose} className="modal__close-button">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </header>

        {children}
      </article>
    </section>
  )
}

export default Modal
