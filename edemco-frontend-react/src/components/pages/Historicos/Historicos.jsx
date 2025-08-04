import { useEffect, useState } from 'react'
import { getMonthName } from '../../../utils/Historicos.util'
import Button from '../../atoms/Button/Button'
import Container from '../../layouts/Container/Container'
import GetCustomers from '../../../services/GetCustomers.service'
import GetHistoricFactories from '../../../services/GetHistoricFactories.service'
import GetHistoricInvoices from '../../../services/GetHistoricInvoices.service'
import Input from '../../atoms/Input/Input'
import Select from '../../atoms/Select/Select'
import Table from '../../organisms/Table/Table'
import Title from '../../atoms/Title/Title'
import './Historicos.css'

/*
* HistoricoFacturas Component
*
* Función:
* Este componente permite consultar, filtrar y visualizar datos históricos relacionados con facturas o plantas.
* - Permite seleccionar el tipo de histórico (factura o planta).
* - Filtra por planta y fecha utilizando un formulario.
* - Muestra los datos en una tabla con columnas dinámicas.
* - Gestiona estados de carga y de datos no encontrados.
*
* Estado interno:
* @param {Object} formValues - Almacena los valores actuales del formulario.
* @param {Object} prevFormValues - Almacena los valores del formulario enviados previamente.
* @param {Array<Object>} tableInfo - Datos actuales a mostrar en la tabla.
* @param {boolean} notFound - Indica si no se encontraron datos para los filtros aplicados.
* @param {boolean} loading - Indica si los datos están siendo cargados.
* @param {Array<string>} columns - Columnas actuales de la tabla.
* @param {Object} columnKeyMap - Mapa de claves para relacionar columnas con las propiedades de los datos.
* @param {Array<Object>} customersList - Lista de clientes (plantas) disponibles para filtrar.
*
* Métodos:
* - `fetchCustomers`: Obtiene la lista de plantas desde el servicio remoto.
* - `fetchFacturas`: Obtiene datos históricos filtrados desde el backend.
* - `isFormValid`: Valida los valores actuales del formulario.
* - `submitForm`: Envía los valores del formulario y obtiene datos filtrados.
* - `handleChange`: Maneja los cambios en los campos del formulario.
* - `clearFilters`: Restablece los filtros y limpia la tabla.
*
* Componentes utilizados:
* - `Input`: Para entrada de fecha y selección del tipo de histórico.
* - `Select`: Para seleccionar una planta.
* - `Table`: Muestra los datos obtenidos en formato tabular.
* - `Button`: Para buscar datos o limpiar filtros.
* - `Container`: Contenedor estilizado para los filtros.
*
* Detalles adicionales:
* - Utiliza `react-toastify` para mostrar notificaciones de errores.
* - El componente maneja dos tipos de datos históricos: facturas y plantas, con columnas dinámicas.
* - Los errores en el formulario (como fechas futuras) se validan y muestran en tiempo real.
*/
const HistoricoFacturas = () => {
  const getPreviousMonthDate = () => {
    const date = new Date()
    date.setMonth(date.getMonth() - 1)

    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')

    return `${year}-${month}`
  }

  const initialFormValues = {
    historico: 'factura',
    idPlanta: '0',
    fecha: getPreviousMonthDate(),
    errorMessage: ''
  }

  const [prevFormValues, setPrevFormValues] = useState({})
  const [formValues, setFormValues] = useState(initialFormValues)
  const [tableInfo, setTableInfo] = useState([])
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(false)
  const [columns, setColumns] = useState([])
  const [columnKeyMap, setColumnKeymap] = useState({})

  const [customersList, setCustomersList] = useState([])

  useEffect(() => {
    document.title = 'Edemco - Históricos'

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
    return formValues.idPlanta !== '0' || formValues.fecha !== ''
  }

  const submitForm = (e) => {
    e.preventDefault()

    if (!isFormValid()) return

    if (
      prevFormValues.historico === formValues.historico &&
      prevFormValues.idPlanta === formValues.idPlanta &&
      prevFormValues.fecha === formValues.fecha
    ) {
      return
    }

    setPrevFormValues({ ...formValues })

    let url = ''
    const isFactura = formValues.historico === 'factura'
    const hasFecha = formValues.fecha !== ''
    const isNitZero = formValues.idPlanta === '0'

    const year = formValues.fecha.split('-')[0]
    const month = formValues.fecha.split('-')[1]

    let isPython = false

    if (isFactura) {
      if (!hasFecha) {
        url = `/api/historico_facturas/planta?idPlanta=${formValues.idPlanta}`
      } else if (isNitZero) {
        url = `/api/historico_facturas/date?date=${formValues.fecha}`
      } else {
        url = `/api/historico_facturas/filter?idPlanta=${formValues.idPlanta}&date=${formValues.fecha}`
      }

      setColumns(['Planta', 'Mes', 'Año', 'PDF'])
      setColumnKeymap({
        Planta: 'planta',
        Año: 'anio',
        Mes: 'mes',
        PDF: 'pdf'
      })
    } else {
      isPython = true

      if (!hasFecha) {
        url = `/api/historico_plantas?idPlanta=${formValues.idPlanta}`
      } else if (isNitZero) {
        url = `/api/historico_plantas?mes=${month}&anio=${year}`
      } else {
        url = `/api/historico_plantas?idPlanta=${formValues.idPlanta}&mes=${month}&anio=${year}`
      }

      setColumns([
        'Planta',
        'Generación actual',
        'Generación acumulado',
        'Valor unidad',
        'Valor total',
        'Diferencia tarifa',
        'Ahorro actual',
        'Ahorro acumulado',
        'Ahorro CO2 actual',
        'Ahorro CO2 Acumulado',
        'Mes',
        'Año'
      ])
      setColumnKeymap({
        Planta: 'id_planta',
        'Generación actual': 'generacion_actual',
        'Generación acumulado': 'generacion_acumulado',
        'Valor unidad': 'valor_unidad',
        'Valor total': 'valor_total',
        'Diferencia tarifa': 'diferencia_tarifa',
        'Ahorro actual': 'ahorro_actual',
        'Ahorro acumulado': 'ahorro_acumulado',
        'Ahorro CO2 actual': 'ahorro_codos_actual',
        'Ahorro CO2 Acumulado': 'ahorro_codos_acumulado',
        Mes: 'mes',
        Año: 'anio'
      })
    }

    fetchFacturas(url, isPython)
  }

  const fetchFacturas = async (url, isPython) => {
    setLoading(true)

    try {
      const response = isPython
        ? await GetHistoricFactories(url)
        : await GetHistoricInvoices(url)

      if (response.status === 404 || response.data.status === 404) {
        setNotFound(true)
        return setTableInfo([])
      }

      setNotFound(false)

      let { data } = response

      if (!Array.isArray(data)) {
        data = [data]
      }

      const transformedData = data.map((row) => ({
        ...row,
        mes: getMonthName(row.mes)
      }))

      setTableInfo(transformedData)
    } catch (error) {
      console.error('Error fetching data:', error)

      setNotFound(true)
      setTableInfo([])
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { target } = e
    const { name, value, type, checked } = target

    let fechaHasError = formValues.fechaHasError
    let errorMessage = formValues.errorMessage

    if (name === 'fecha') {
      const currentDate = new Date().toISOString().split('T')[0]
      fechaHasError = value > currentDate
      errorMessage =
        value > currentDate ? 'La fecha no puede ser mayor a la actual' : ''
    }

    const newValues = {
      ...formValues,
      [name]: type === 'radio' ? value : type === 'checkbox' ? checked : value,
      fechaHasError,
      errorMessage
    }

    setFormValues(newValues)
  }

  const clearFilters = () => {
    setFormValues(initialFormValues)
    setPrevFormValues(initialFormValues)
    setTableInfo([])
    setNotFound(false)
  }

  return (
    <>
      <Title text="Históricos" />

      <form onSubmit={submitForm}>
        <Container className="container--flex">
          <Title
            className="title--medium title--align-left select--width"
            text="Tipo de Histórico:"
          />

          <div className="tipo-historico__contenedor select--width">
            <Input
              checked={formValues.historico === 'factura'}
              className="input--no-min-width"
              id="factura"
              name="historico"
              onChange={handleChange}
              type="radio"
              value="factura"
            />

            <label htmlFor="factura" className="tipo-historico__label">
              <i className="fa-solid fa-file-invoice"></i>

              <span className="tipo-historico__label-text">Factura</span>
            </label>

            <Input
              checked={formValues.historico === 'planta'}
              className="input--no-min-width"
              id="planta"
              name="historico"
              onChange={handleChange}
              type="radio"
              value="planta"
            />

            <label htmlFor="planta" className="tipo-historico__label">
              <i className="fa-solid fa-industry"></i>

              <span className="tipo-historico__label-text">Planta</span>
            </label>
          </div>

          <div className="filters--flex select--width">
            <Select
              className="select--rare-width select--height"
              defaultOption="Seleccione una planta"
              id="seleccionarCliente"
              name="idPlanta"
              onChange={handleChange}
              placeholder="Planta"
              value={formValues.idPlanta}
            >
              <option value="0">Deseleccionar planta</option>
              {customersList.map(({ idPlanta, nombrePlanta }) => (
                <option key={idPlanta} value={idPlanta}>
                  {nombrePlanta}
                </option>
              ))}
            </Select>

            <Input
              className={`input--width-fit input--grow select--height ${formValues.fechaHasError ? 'input--error' : ''}`}
              errorMessage={formValues.errorMessage}
              hasError={formValues.fechaHasError}
              id="fechaClientes"
              name="fecha"
              onChange={handleChange}
              placeholder="Fecha"
              type="month"
              value={formValues.fecha}
            />
          </div>
        </Container>

        <Button
          className="boton--margin"
          disabled={loading}
          isLoading={loading}
          text={loading ? 'Buscando' : 'Buscar'}
        />
      </form>

      {notFound && (
        <article className="not-found">
          <i className="fa-solid fa-robot"></i>

          <p className="not-found__text">
            Lo sentimos, no se encontraron históricos para{' '}
            {prevFormValues.fecha
              ? `esta fecha: "${prevFormValues.fecha}"`
              : `esta planta: "${prevFormValues.idPlanta}"`}
          </p>

          <Button
            className="boton--secundario boton--margin"
            onClick={clearFilters}
            text="Limpiar los filtros"
          />
        </article>
      )}

      <Table
        columnKeyMap={columnKeyMap}
        columns={columns}
        linkColumns={['PDF']}
        rows={tableInfo}
      />
    </>
  )
}

export default HistoricoFacturas
