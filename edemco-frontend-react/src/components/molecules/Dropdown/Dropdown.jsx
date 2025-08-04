import { useRef, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Chip from '../../atoms/Chip/Chip'
import Input from '../../atoms/Input/Input'
import DeleteRemitter from '../../../services/DeleteRemitter.service'
import GetRemittersByIdPlanta from '../../../services/GetRemittersByIdPlanta.service'
import PostRemitter from '../../../services/PostRemitter.service'
import './Dropdown.css'

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
const Dropdown = ({ idPlanta }) => {
  const initialFormValues = {
    remitente: '',
    remitenteHasError: false,
    errorMessage: ''
  }

  const [formValues, setFormValues] = useState(initialFormValues)
  const [isOpen, setIsOpen] = useState(false)
  const [chips, setChips] = useState([])
  const [visibleChips, setVisibleChips] = useState([])
  const [hiddenChipsCount, setHiddenChipsCount] = useState(0)
  const dropdownChipsRef = useRef(null)
  const dropdownRef = useRef(null)

  // ! Obtener los remitentes de esta planta cada que carga el dropdown
  useEffect(() => {
    const fetchRemitters = async () => {
      const result = await GetRemittersByIdPlanta(idPlanta)

      if (result.success) {
        setChips(result.data)
      } else {
        console.error('Failed to fetch customers:', result.error)
      }
    }

    fetchRemitters()
  }, [])
  // ! Obtener los remitentes de esta planta cada que carga el dropdown

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

  // * Lógica para limitar la cantidad de chips que se muestran */
  useEffect(() => {
    const updateVisibleChips = () => {
      if (!dropdownChipsRef.current) return

      const dropdownChipsWidth = dropdownChipsRef.current.offsetWidth - 250
      let totalWidth = 0
      let visibleCount = 0

      chips.forEach(({ idEmail }) => {
        const chipElement = document.getElementById(idEmail)
        const chipElementWidth = chipElement ? chipElement.offsetWidth : 0

        totalWidth += chipElementWidth

        if (totalWidth <= dropdownChipsWidth) {
          visibleCount++
        }
      })

      setVisibleChips(chips.slice(0, visibleCount))
      setHiddenChipsCount(chips.length - visibleCount)
    }

    updateVisibleChips()

    window.addEventListener('resize', updateVisibleChips)

    return () => {
      window.removeEventListener('resize', updateVisibleChips)
    }
  }, [chips])
  // * Lógica para limitar la cantidad de chips que se muestran */

  const addRemitter = async (e) => {
    e.preventDefault()

    if (!formValues.remitente) {
      setFormValues({
        ...formValues,
        remitenteHasError: true,
        errorMessage: 'El remitente no puede estar vacío'
      })
      return
    }

    if (
      chips.some(
        (chip) =>
          chip.email.toLowerCase() === formValues.remitente.toLowerCase()
      )
    ) {
      setFormValues({
        ...formValues,
        remitenteHasError: true,
        errorMessage: 'El remitente ya existe'
      })
      return
    }

    const newRemitter = {
      email: formValues.remitente,
      idPlanta
    }

    await PostRemitter(newRemitter)
      .then((result) => {
        if (result.success) {
          setChips([...chips, { ...newRemitter, idEmail: result.idEmail }])
          setFormValues(initialFormValues)
        }
      })
      .catch((error) => {
        console.error('Error fetching customers:', error)
        toast.error('Error al crear el remitente')
      })
  }

  const removeRemitter = async (idEmail) => {
    setChips(chips.filter((chip) => chip.idEmail !== idEmail))

    await DeleteRemitter(idEmail)
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

  const openDropdown = () => {
    setIsOpen(!isOpen)
  }

  return (
    <article className="dropdown">
      <span
        className={`dropdown__chips ${isOpen ? 'cursor-default' : ''}`}
        onClick={openDropdown}
        ref={dropdownChipsRef}
      >
        {chips.length === 0 && (
          <span className="dropdown__placeholder">Sin remitentes</span>
        )}

        {visibleChips.map(({ idEmail, email }) => (
          <Chip
            key={idEmail}
            onRemove={() => removeRemitter(idEmail)}
            showRemove={!isOpen}
            text={email}
          />
        ))}

        {hiddenChipsCount > 0 && (
          <span className="chip chip--more">+{hiddenChipsCount}</span>
        )}
      </span>

      {isOpen && (
        <article className="dropdown__modal" ref={dropdownRef}>
          <ul className="dropdown__search">
            {chips.map(({ idEmail, email }) => {
              return (
                <li key={idEmail}>
                  <Chip
                    id={idEmail}
                    onRemove={() => removeRemitter(idEmail)}
                    text={email}
                  />
                </li>
              )
            })}
          </ul>

          <form onSubmit={addRemitter}>
            <Input
              className={`${formValues.remitenteHasError && 'input--error'}`}
              errorMessage={formValues.errorMessage}
              hasError={formValues.remitenteHasError}
              id="remitente"
              name="remitente"
              onChange={handleChange}
              placeholder="Añade un remitente"
              value={formValues.remitente}
            />
          </form>
        </article>
      )}
    </article>
  )
}

export default Dropdown
