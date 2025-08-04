import fetchWithToken from '../utils/fetchWithToken'

/*
* GetHistoricFactories Service
*
* Función:
* Realiza una solicitud HTTP para obtener datos históricos de fábricas desde un endpoint específico.
* - Utiliza un token de autenticación para garantizar la seguridad.
* - La URL del endpoint se pasa como argumento, permitiendo flexibilidad en la configuración de la solicitud.
* - Devuelve un objeto que contiene los datos obtenidos o detalles del error si la operación falla.
*
* Parámetros:
* @param {string} url - Endpoint al que se realiza la solicitud.
*
* Retorno:
* @returns {Object} Resultado de la operación.
* - `success` (boolean): Indica si la operación fue exitosa.
* - `data` (Object, opcional): Contiene los datos obtenidos si la operación fue exitosa.
* - `error` (string, opcional): Contiene el mensaje de error si la operación falla.
*
* Detalles adicionales:
* - Utiliza `fetchWithToken` para incluir automáticamente el token de autenticación en los encabezados de la solicitud.
* - Soporta encabezados adicionales u opciones configuradas mediante `fetchWithToken`.
* - Maneja errores de red y respuestas no exitosas del servidor.
*
* Ejemplo de uso:
* ```javascript
* const url = '/api/historico_plantas?mes=01&anio=2024'
* const result = await GetHistoricFactories(url)
* if (result.success) {
*   console.log('Datos históricos obtenidos:', result.data)
* } else {
*   console.error('Error obteniendo datos históricos:', result.error)
* }
* ```
*/
const GetHistoricFactories = async (url) => {
  try {
    const response = await fetchWithToken(url, {}, true)

    if (!response.success) {
      throw new Error('Network response was not ok')
    }

    const { data } = response
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching customers:', error)

    return { success: false, error: error.message }
  }
}

export default GetHistoricFactories
