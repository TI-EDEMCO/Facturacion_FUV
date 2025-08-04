import fetchWithToken from '../utils/fetchWithToken'

/*
* GetLastTarifasOperadores Service
*
* Función:
* Realiza una solicitud HTTP para obtener las últimas tarifas de los operadores.
* - Utiliza un token de autenticación para garantizar la seguridad.
* - Devuelve un objeto que contiene los datos obtenidos o detalles del error si la operación falla.
*
* Parámetros:
* - No recibe parámetros.
*
* Retorno:
* @returns {Object} Resultado de la operación.
* - `success` (boolean): Indica si la operación fue exitosa.
* - `data` (Array, opcional): Contiene las últimas tarifas de los operadores si la operación fue exitosa.
* - `error` (string, opcional): Contiene el mensaje de error si la operación falla.
*
* Detalles adicionales:
* - La solicitud se realiza al endpoint `/api/tarifaoperador/last_tarifas` utilizando el método HTTP `GET`.
* - Utiliza `fetchWithToken` para incluir automáticamente el token de autenticación en los encabezados de la solicitud.
* - Maneja errores de red y respuestas no exitosas del servidor.
*
* Ejemplo de uso:
* ```javascript
* const result = await GetLastTarifasOperadores()
* if (result.success) {
*   console.log('Últimas tarifas de operadores obtenidas:', result.data)
* } else {
*   console.error('Error obteniendo tarifas de operadores:', result.error)
* }
* ```
*/
const GetLastTarifasOperadores = async () => {
  try {
    const response = await fetchWithToken('/api/tarifaoperador/last_tarifas')

    if (!response.success) {
      throw new Error('Network response was not ok')
    }

    const { data } = response
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching last tarifas operadores:', error)

    return { success: false, error: error.message }
  }
}

export default GetLastTarifasOperadores
