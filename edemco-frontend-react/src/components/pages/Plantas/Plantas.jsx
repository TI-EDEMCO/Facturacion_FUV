import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Button from '../../atoms/Button/Button'
import Container from '../../layouts/Container/Container'
import GetCustomers from '../../../services/GetCustomers.service'
import Input from '../../atoms/Input/Input'
import PatchPlanta from '../../../services/PatchPlanta.service'
import Title from '../../atoms/Title/Title'
import './Plantas.css'

/*
* Plantas Component
*
* Función:
* Permite modificar información asociada a plantas, como el asunto, la URL de la imagen y el porcentaje de aumento.
* - Obtiene una lista de plantas desde un servicio remoto.
* - Proporciona un formulario para modificar atributos de las plantas.
* - Realiza las actualizaciones a través de un servicio remoto.
*
* Estado interno:
* @param {Object} formValues - Valores actuales del formulario por planta.
* @param {Object} initialValues - Valores iniciales del formulario para identificar cambios.
* @param {Array<Object>} plantas - Lista de plantas obtenidas desde el servicio remoto.
* @param {boolean} isLoading - Indica si el proceso de actualización está en curso.
* @param {boolean} pageLoading - Indica si los datos de las plantas están siendo cargados.
*
* Métodos:
* - `fetchCustomers`: Obtiene la lista de plantas desde el backend.
* - `updatePlanta`: Filtra y envía los datos modificados al servicio de actualización.
* - `patchPlanta`: Llama al servicio de actualización de plantas y actualiza la interfaz si es exitoso.
* - `handleChange`: Maneja cambios en los campos del formulario, actualizando `formValues`.
*
* Componentes utilizados:
* - `Input`: Para capturar los valores modificables de cada planta.
* - `Button`: Botón para enviar los cambios.
* - `Container`: Contenedor principal estilizado para agrupar los elementos de la interfaz.
* - `Title`: Títulos descriptivos para identificar plantas y valores.
*
* Detalles adicionales:
* - Utiliza `react-toastify` para notificaciones de éxito y error.
* - Solo los campos modificados se envían al backend.
* - La lista de plantas se ordena por `idPlanta` para facilitar la visualización.
*/
const Plantas = () => {
  const [formValues, setFormValues] = useState({})
  const [initialValues, setInitialValues] = useState({})
  const [plantas, setPlantas] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    const fetchCustomers = async () => {
      const result = await GetCustomers()

      if (result.success) {
        const orderedPlantas = result.data.sort(
          (a, b) => a.idPlanta - b.idPlanta
        )
        setPlantas(orderedPlantas)

        const initialData = result.data.reduce((acc, planta) => {
          acc[planta.idPlanta] = {
            asunto: planta.asunto || '',
            urlImg: planta.urlImg || '',
            porcentajeAumento: 0
          }
          return acc
        }, {})

        setFormValues(initialData)
        setInitialValues(initialData)
      } else {
        console.error('Failed to fetch plantas:', result.error)
      }

      setPageLoading(false)
    }

    fetchCustomers()
  }, [])

  const updatePlanta = (e) => {
    e.preventDefault()

    const filteredFormValues = Object.entries(formValues)
      .filter(([id, values]) => {
        const initial = initialValues[id]
        return (
          values.asunto !== initial.asunto ||
          values.urlImg !== initial.urlImg ||
          values.porcentajeAumento !== initial.porcentajeAumento
        )
      })
      .map(([id, values]) => {
        const result = { idPlanta: id }
        if (values.asunto !== initialValues[id].asunto)
          result.asunto = values.asunto
        if (values.urlImg !== initialValues[id].urlImg)
          result.urlImg = values.urlImg
        if (values.porcentajeAumento !== initialValues[id].porcentajeAumento)
          result.porcentajeAumento = values.porcentajeAumento / 100

        return result
      })

    if (filteredFormValues.length === 0) return

    patchPlanta(filteredFormValues)
  }

  const patchPlanta = async (newValues) => {
    setIsLoading(true)

    try {
      const result = await PatchPlanta(newValues)

      if (result.success) {
        const plantaMap = new Map(
          plantas.map((planta) => [planta.idPlanta, planta])
        )

        result.data.forEach((planta) => {
          const existingPlanta = plantaMap.get(planta.idPlanta)
          if (existingPlanta) {
            plantaMap.set(planta.idPlanta, { ...existingPlanta, ...planta })
          }
        })

        const newPlantas = plantas.map(
          (planta) => plantaMap.get(planta.idPlanta) || planta
        )

        setPlantas(newPlantas)
        setInitialValues(formValues)
        toast.success('Plantas modificadas correctamente')
      } else {
        console.error('Failed to update plantas:', result.error)
      }
    } catch (error) {
      console.error('An error occurred while updating plantas:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (idPlanta, e) => {
    const { name, value } = e.target

    setFormValues({
      ...formValues,
      [idPlanta]: {
        ...formValues[idPlanta],
        [name]: value
      }
    })
  }

  return (
    <Container className="container--flex">
      <Title text="Modificar Plantas" />

      {pageLoading && (
        <p className="plantas__loading">
          Cargando plantas
          <i className="loader"></i>
        </p>
      )}

      {!pageLoading && plantas.length === 0 && (
        <p className="plantas__no-data">No hay plantas</p>
      )}

      <form onSubmit={updatePlanta} className="plantas__form">
        {plantas.map(({ idPlanta, nombrePlanta, valorUnidad }) => {
          return (
            <article key={idPlanta} className="planta__form">
              <Title
                className="title--medium title--capitalize title--align-left"
                text={`${idPlanta} - ${nombrePlanta.toLowerCase()}`}
              />

              <Title
                className="title--small title--align-left"
                text={`Valor Unidad: $${valorUnidad.toFixed(2)}`}
              />

              <div className="planta__inputs">
                <Input
                  id={`asunto-${idPlanta}`}
                  name="asunto"
                  onChange={(e) => handleChange(idPlanta, e)}
                  placeholder="Asunto"
                  type="text"
                  value={formValues[idPlanta]?.asunto || ''}
                />

                <Input
                  id={`urlImg-${idPlanta}`}
                  name="urlImg"
                  onChange={(e) => handleChange(idPlanta, e)}
                  placeholder="Url imagen"
                  type="text"
                  value={formValues[idPlanta]?.urlImg || ''}
                />

                <Input
                  id={`porcentajeAumento-${idPlanta}`}
                  name="porcentajeAumento"
                  onChange={(e) => handleChange(idPlanta, e)}
                  placeholder="Porcentaje de aumento"
                  type="number"
                  value={formValues[idPlanta]?.porcentajeAumento || ''}
                />
              </div>
            </article>
          )
        })}

        {!pageLoading && plantas.length !== 0 && (
          <Button
            text={isLoading ? 'Modificando' : 'Modificar plantas'}
            isLoading={isLoading}
            disabled={isLoading}
          />
        )}
      </form>
    </Container>
  )
}

export default Plantas
