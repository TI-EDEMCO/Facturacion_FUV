import { useRef, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Input from '../../atoms/Input/Input'
import PostRemitter from '../../../services/PostRemitter.service'
import './ModifyGeneracion.css'

/*
* Dropdown Component
*
* Props:
* @param {number|string} idPlanta - Identificador de la planta para obtener remitentes relacionados.
*
* Función:
* Renderiza un dropdown interactivo para administrar remitentes asociados a una planta.
* 
* - Muestra un listado de remitentes como "chips" con opciones para agregar o eliminar.
* - Controla la visibilidad de los chips en función del tamaño disponible del contenedor.
* - Incluye un formulario para agregar nuevos remitentes con validación básica.
* - Ofrece una interfaz para eliminar remitentes existentes.
*
* Detalles clave:
* - Usa `useEffect` para manejar las siguientes lógicas:
*   - Obtención de remitentes al cargar el componente.
*   - Actualización dinámica de los chips visibles según el tamaño del contenedor.
*   - Manejo de clics externos para cerrar el dropdown.
* - Control de errores con validación para campos vacíos y duplicados.
* - Uso de referencias (`useRef`) para manejar clics externos y dimensiones del contenedor.
*
* Notas adicionales:
* - El componente utiliza servicios `GetRemittersByIdPlanta`, `PostRemitter` y `DeleteRemitter` para interactuar con datos remotos.
* - Mensajes de error y éxito son gestionados con la librería `react-toastify`.
*/
const ModifyGeneracion = ({ idGeneracion }) => {
  const initialFormValues = {
    remitente: '',
    remitenteHasError: false,
    errorMessage: ''
  }

  const [formValues, setFormValues] = useState(initialFormValues)
  const [isOpen, setIsOpen] = useState(true)
  const [chips, setChips] = useState([])
  const dropdownChipsRef = useRef(null)
  const dropdownRef = useRef(null)

  // ? Lógica para cerrar el dropdown cuando se hace click por fuera */
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      dropdownChipsRef.current &&
      !dropdownChipsRef.current.contains(event.target)
    ) {
      setIsOpen(false)
    }
  }
  // ? Lógica para cerrar el dropdown cuando se hace click por fuera */


  const addRemitter = async (e) => {
    e.preventDefault()
    console.log(formValues.remitente)

    // if (!formValues.remitente) {
    //   setFormValues({
    //     ...formValues,
    //     remitenteHasError: true,
    //     errorMessage: 'El remitente no puede estar vacío'
    //   })
    //   return
    // }

    // if (
    //   chips.some(
    //     (chip) =>
    //       chip.email.toLowerCase() === formValues.remitente.toLowerCase()
    //   )
    // ) {
    //   setFormValues({
    //     ...formValues,
    //     remitenteHasError: true,
    //     errorMessage: 'El remitente ya existe'
    //   })
    //   return
    // }

    // const newRemitter = {
    //   email: formValues.remitente,
    //   idPlanta
    // }

    // await PostRemitter(newRemitter)
    //   .then((result) => {
    //     if (result.success) {
    //       setChips([...chips, { ...newRemitter, idEmail: result.idEmail }])
    //       setFormValues(initialFormValues)
    //     }
    //   })
    //   .catch((error) => {
    //     console.error('Error fetching customers:', error)
    //     toast.error('Error al crear el remitente')
    //   })
  }

  const handleChange = (e) => {
    const { target } = e
    const { name, value } = target

    const newValues = {
      ...formValues,
      [name]: value,
      remitenteHasError: false,
      errorMessage: ''
    }

    setFormValues(newValues)
  }

  return (
    <article className="dropdown">
          <form onSubmit={addRemitter}>
            <Input
              className={`${formValues.remitenteHasError && 'input--error'}`}
              errorMessage={formValues.errorMessage}
              hasError={formValues.remitenteHasError}
              id="remitente"
              name="remitente"
              onChange={handleChange}
              placeholder="Modifica Generacion Actual"
              value={formValues.remitente}
              type="number"
            />
          </form>
    </article>
  )
}

export default ModifyGeneracion
