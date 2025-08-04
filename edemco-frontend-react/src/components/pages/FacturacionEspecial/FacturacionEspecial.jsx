import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Button from '../../atoms/Button/Button'
import Container from '../../layouts/Container/Container'
import GetSpecialCustomers from '../../../services/GetSpecialCustomers.service'
import Input from '../../atoms/Input/Input'
import PostFacturacionEspecial from '../../../services/PostFacturacionEspecial.service'
import Select from '../../atoms/Select/Select'
import './FacturacionEspecial.css'

/*
* FacturacionEspecial Component
*
* Props:
* @param {function} setOpenStep - Función para cambiar al siguiente paso del flujo de facturación.
*
* Función:
* Este componente permite gestionar la configuración de facturación especial para operadores.
* - Incluye un formulario con campos de entrada para cantidad de kWh, excedente, costo agregado y selección de planta.
* - Valida los datos ingresados antes de enviarlos a través del servicio `PostFacturacionEspecial`.
* - Permite seleccionar una planta de una lista de clientes especiales obtenida desde un servicio remoto.
*
* Estado interno:
* @param {Object} formValues - Almacena los valores actuales del formulario.
* @param {Object} formErrors - Indica los errores actuales en los campos del formulario.
* @param {Array<Object>} specialCustomersList - Lista de clientes especiales obtenida desde el servicio remoto.
* @param {boolean} loading - Indica si el envío del formulario está en curso.
*
* Métodos:
* - `fetchSpecialCustomers`: Obtiene y establece la lista de clientes especiales.
* - `isFormValid`: Valida los valores actuales del formulario.
* - `submitForm`: Envía los datos del formulario al servicio remoto.
* - `handleChange`: Actualiza los valores y valida los campos del formulario.
*
* Componentes utilizados:
* - `Input`: Campos de entrada para capturar los valores del formulario.
* - `Select`: Campo desplegable para seleccionar una planta.
* - `Button`: Botón para enviar el formulario.
* - `Container`: Contenedor estilizado para el formulario.
*
* Detalles adicionales:
* - Se utiliza `react-toastify` para notificaciones de éxito o error.
* - Los errores en los campos de entrada se muestran en tiempo real.
* - La clase CSS `facturacion-especial__inputs` estiliza el formulario.
*/
const FacturacionEspecial = ({ setOpenStep }) => {
  const initialFormValues = {
    cantidadkWh: '',
    excedente: '',
    costoAgregado: '',
    idPlanta: '505'
  }

  const initialFormErrors = {
    cantidadkWh: false,
    excedente: false,
    costoAgregado: false
  }

  const [formValues, setFormValues] = useState(initialFormValues)
  const [formErrors, setFormErrors] = useState(initialFormErrors)
  const [specialCustomersList, setSpecialCustomersList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.title = 'Edemco - Facturación Especial'

    const fetchSpecialCustomers = async () => {
      const result = await GetSpecialCustomers()

      if (result.success) {
        setSpecialCustomersList(result.data)
      } else {
        console.error('Failed to fetch customers:', result.error)
      }
    }

    fetchSpecialCustomers()
  }, [])

  const isFormValid = () => {
    return formValues.excedente !== '' && formValues.costoAgregado !== ''
  }

  const submitForm = async (e) => {
    e.preventDefault()

    if (!isFormValid()) {
      return setFormErrors({
        ...formErrors,
        cantidadkWh: formValues.cantidadkWh === '',
        excedente: formValues.excedente === '',
        costoAgregado: formValues.costoAgregado === ''
      })
    }

    setLoading(true)

    const result = await PostFacturacionEspecial(formValues)

    console.log(result)

    if (result?.data?.statusCode === 400) {
      setLoading(false)
      return toast.error(result?.data?.message)
    }

    if (!result.success) {
      setLoading(false)
      return toast.error('Ocurrió un error al enviar los datos')
    }

    setLoading(false)
    setFormValues(initialFormValues)
    toast.success('Datos enviados con éxito')
    setOpenStep(3)
  }

  const handleChange = (e) => {
    const { target } = e
    const { name, value } = target

    setFormErrors({
      ...formErrors,
      [name]: value === ''
    })

    const newValues = {
      ...formValues,
      [name]: value
    }

    setFormValues(newValues)
  }

  return (
    <>
      <Container className="container--flex">
        <form onSubmit={submitForm} className="facturacion-especial__inputs">
          <Input
            className={`${formErrors.cantidadkWh && 'input--error'}`}
            errorMessage="La cantidad de KWH es obligatoria"
            hasError={formErrors.cantidadkWh}
            id="cantidadkWh"
            name="cantidadkWh"
            onChange={handleChange}
            placeholder="Cantidad Exportación (kWh)"
            type="number"
            value={formValues.cantidadkWh}
          />

          <Input
            className={`${formErrors.excedente && 'input--error'}`}
            errorMessage="El excedente es obligatorio"
            hasError={formErrors.excedente}
            id="excedente"
            name="excedente"
            onChange={handleChange}
            placeholder="Excedente ($)"
            type="number"
            value={formValues.excedente}
          />

          <Input
            className={`${formErrors.costoAgregado && 'input--error'}`}
            errorMessage="El costo agregado es obligatorio"
            hasError={formErrors.costoAgregado}
            id="costoAgregado"
            name="costoAgregado"
            onChange={handleChange}
            placeholder="Costo agregado ($)"
            type="number"
            value={formValues.costoAgregado}
          />

          <Select
            defaultOption="Seleccione una planta"
            id="idPlanta"
            name="idPlanta"
            onChange={handleChange}
            placeholder="Planta"
            value={formValues.idPlanta}
          >
            {specialCustomersList.map(({ idPlanta, nombrePlanta }) => (
              <option key={idPlanta} value={idPlanta}>
                {nombrePlanta}
              </option>
            ))}
          </Select>

          <Button
            className="boton--margin"
            disabled={loading}
            isLoading={loading}
            text={loading ? 'Actualizando' : 'Actualizar'}
          />
        </form>
      </Container>
    </>
  )
}

export default FacturacionEspecial
