import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Button from '../../atoms/Button/Button'
import Container from '../../layouts/Container/Container'
import GetCustomers from '../../../services/GetCustomers.service'
import GetGrowattDataDowload from '../../../services/GetGrowattDownload.service'
import GetGrowattData from '../../../services/GetGrowattData.service'
import Input from '../../atoms/Input/Input'
import PostExcelFile from '../../../services/PostExcelFile.service'
import PostGenerateCalculations from '../../../services/PostGenerateCalculations.service'
import PostSiesaIntegration from '../../../services/PostSiesaIntegration.service'
import Select from '../../atoms/Select/Select'
import './IniciarFactura.css'
import GetAccessTokenGraph from '../../../services/GetAccessTokenGraph'
import PostCorreoContabilidad from '../../../services/PostCorreoContabilidad.service'

/*
* IniciarFactura Component
*
* Función:
* Este componente permite iniciar el proceso de facturación de clientes seleccionados.
* - Gestiona la selección de plantas a facturar.
* - Permite subir un archivo de generación de Growatt opcional.
* - Integra la generación de cálculos y facturas a través de servicios remotos.
* - Muestra un resumen de los clientes seleccionados y un botón para iniciar el proceso.
*
* Estado interno:
* @param {Object} formValues - Contiene los valores actuales del formulario.
* @param {Array<Object>} customers - Lista de clientes seleccionados para facturación.
* @param {Array<Object>} customersList - Lista de todas las plantas disponibles.
* @param {boolean} isLoading - Indica si el proceso de facturación está en curso.
*
* Métodos:
* - `fetchCustomers`: Obtiene la lista de plantas desde el servicio remoto.
* - `submitInvoice`: Maneja la lógica de validación y flujo al enviar el formulario.
* - `sendDataToGrowatt`: Obtiene datos de Growatt para iniciar el proceso sin archivo.
* - `uploadFile`: Sube un archivo Excel y lo procesa.
* - `generateCalculations`: Realiza cálculos de facturación.
* - `siesaIntegration`: Integra las facturas generadas en Siesa.
* - `addCustomer`: Agrega un cliente a la lista seleccionada.
* - `removeCustomer`: Elimina un cliente de la lista seleccionada.
* - `handleChange`: Maneja cambios en los campos del formulario.
*
* Componentes utilizados:
* - `Input`: Campo de carga de archivos opcional para subir el archivo de generación de Growatt.
* - `Select`: Desplegable para seleccionar una planta o todas.
* - `Button`: Botón para iniciar el proceso de facturación.
* - `Container`: Contenedor principal del formulario.
*
* Detalles adicionales:
* - Utiliza `react-toastify` para mostrar notificaciones de errores y éxito.
* - Permite la selección de todas las plantas o una específica.
* - Valida que al menos una planta esté seleccionada antes de iniciar la facturación.
* - Integra flujos separados para uso de datos de Growatt o archivos Excel.
*/
const IniciarFactura = () => {
  const initialFormValues = {
    idPlanta: '0',
    archivo: '',
    plantaHasError: false
  }

  const [formValues, setFormValues] = useState(initialFormValues)
  const [customers, setCustomers] = useState([])
  const [customersList, setCustomersList] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    document.title = 'Edemco - Iniciar Facturación'

    const fetchCustomers = async () => {
      const result = await GetCustomers()

      if (result.success) {
        setCustomersList(result.data)
      } else {
        console.error('Failed to fetch customers:', result.error)
      }
    }

    fetchCustomers()
  }, [])

  const isFormValid = () => {
    return !formValues.plantaHasError && customers.length > 0
  }
  const Gettoken=async()=>{
    const token=await GetAccessTokenGraph()
    return token.data
  }

  const submitInvoice = (e) => {
    e.preventDefault()

    setFormValues({
      ...formValues,
      plantaHasError: customers.length === 0
    })

    if (!isFormValid()) return

    setIsLoading(true)

    const fileExists =
      formValues.archivo !== '' && formValues.archivo !== undefined

    if (fileExists) {
      uploadFile(formValues.archivo)
    } else {
      sendDataToGrowatt()
    }
  }

  const sendDataToGrowatt = async () => {
    GetGrowattDataDowload()
    setTimeout(async () => {
      const result = await GetGrowattData()
      if (result.success) {
        await generateCalculations(JSON.parse(result.data))
        await siesaIntegration()
      } else {
        console.error('Failed to get data from growatt:', result.error)
        setIsLoading(false)
      }
    }, 90000)
  }

  const uploadFile = async (excelFile) => {
    const result = await PostExcelFile(excelFile)

    if (result.success) {
      await generateCalculations(result.data)
      await siesaIntegration()
    } else {
      console.error('Failed to upload file:', result.error)
      toast.error(
        'El archivo no es válido, carga el excel con la generación de Growatt'
      )
      setIsLoading(false)
    }
  }

  const generateCalculations = async (calculations) => {
    const result = await PostGenerateCalculations(calculations)

    if (!result.success) {
      console.error('Failed to generate calculations:', result.error)

      setIsLoading(false)
      toast.error('Error al generar la facturación, intenta nuevamente')
    }
  }
  const siesaIntegration = async () => {
    const todayDate = new Date().toISOString().split('T')[0]

    const result = await PostSiesaIntegration(customers, todayDate)

    if (result.success) {
      var ListaPlantas=[]
      const token= await Gettoken()
      customers.map(({idPlanta,nombrePlanta})=>{ListaPlantas.push(`"${nombrePlanta}"`)})
      PostCorreoContabilidad(ListaPlantas,token.authorization)
      toast.success('Facturas generadas con éxito!')

    } else {
      console.error('Failed to integrate on siesa:', result.error)
    }

    setIsLoading(false)
  }

  const addCustomer = (customer) => {
    if (customers.some(({ idPlanta }) => idPlanta === customer.idPlanta)) return

    setCustomers([...customers, customer])
    setFormValues((prevValues) => ({
      ...prevValues,
      plantaHasError: false
    }))
  }

  const removeCustomer = (planta) => {
    const updatedCustomers = customers.filter(
      ({ idPlanta }) => idPlanta !== planta
    )

    setCustomers(updatedCustomers)

    setFormValues((prevValues) => ({
      ...prevValues,
      plantaHasError: updatedCustomers.length === 0
    }))
  }

  const handleChange = (e) => {
    const { target } = e
    const { name, value, files, options } = target

    if (options && name === 'idPlanta') {
      const valueText = options[e.target.selectedIndex].text

      if (value === 'all') {
        const allCustomers = customersList.map(
          ({ idPlanta, nombrePlanta }) => ({
            idPlanta,
            nombrePlanta
          })
        )

        setFormValues((prevValues) => ({
          ...prevValues,
          plantaHasError: false
        }))

        return setCustomers(allCustomers)
      }

      addCustomer({ idPlanta: value, nombrePlanta: valueText })
    } else if (name === 'archivo') {
      return setFormValues((prevValues) => ({
        ...prevValues,
        [name]: files[0]
      }))
    }

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }))
  }

  return (
    <Container className="container--flex">
      <form className="facturacion__form" onSubmit={submitInvoice}>
        <div className="facturacion__filtros">
          <Select
            className={`${formValues.plantaHasError && 'select--error'}`}
            defaultOption="Seleccione una planta"
            errorMessage="Selecciona al menos una planta"
            hasError={formValues.plantaHasError}
            id="idPlanta"
            name="idPlanta"
            onChange={handleChange}
            placeholder="Planta"
            value={formValues.idPlanta}
          >
            {customers.length === 0 && (
              <option value="all">Todas las plantas</option>
            )}

            {customersList.map(({ idPlanta, nombrePlanta }) => (
              <option key={idPlanta} value={idPlanta}>
                {nombrePlanta}
              </option>
            ))}
          </Select>

          <Input
            accept=".xls, .xlsx"
            id="archivo"
            name="archivo"
            onChange={handleChange}
            placeholder="Archivo excel (opcional)"
            type="file"
          />
        </div>

        {customers.length > 0 && (
          <div className="facturacion__clientes-facturar">
            <p className="facturacion__subtitle facturacion__bold">
              Clientes a facturar:
            </p>

            <div className="facturacion__clientes">
              {customers.map(({ idPlanta, nombrePlanta }) => (
                <div key={idPlanta} className="facturacion__cliente">
                  <p>{nombrePlanta}</p>

                  <button
                    className="facturacion__close-button"
                    onClick={() => removeCustomer(idPlanta)}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          disabled={isLoading}
          isLoading={isLoading}
          text={isLoading ? 'Cargando' : 'Iniciar Facturación'}
        />
      </form>
    </Container>
  )
}

export default IniciarFactura
