import fetchWithToken from '../utils/fetchWithToken'

/*
* GetRemitters Service
*
* Función:
* Realiza una solicitud HTTP para obtener la lista de remitentes asociados a una planta específica.
* - Utiliza un token de autenticación para garantizar la seguridad de la solicitud.
* - Devuelve un objeto que contiene los datos obtenidos o detalles del error si la operación falla.
*
* Parámetros:
* @param {string} idPlanta - El identificador de la planta cuyos remitentes se desean obtener.
*
* Retorno:
* @returns {Object} Resultado de la operación.
* - `success` (boolean): Indica si la operación fue exitosa.
* - `data` (Array, opcional): Contiene la lista de remitentes si la operación fue exitosa.
* - `error` (string, opcional): Contiene el mensaje de error si la operación falla.
*
* Detalles adicionales:
* - La solicitud se realiza al endpoint `/api/email/find`, añadiendo el parámetro `idPlanta` en la query string.
* - Utiliza `fetchWithToken` para incluir automáticamente el token de autenticación en los encabezados de la solicitud.
* - Maneja errores de red y respuestas no exitosas del servidor.
*
* Ejemplo de uso:
* ```javascript
* const idPlanta = '12345'
* const result = await GetRemitters(idPlanta)
* if (result.success) {
*   console.log(`Remitentes obtenidos para la planta ${idPlanta}:`, result.data)
* } else {
*   console.error('Error obteniendo remitentes:', result.error)
* }
* ```
*/
const GetRemitters = async (idPlanta) => {
  try {
    const response = await fetchWithToken(
      `/api/email/find?idPlanta=${idPlanta}`
    )

    if (!response.success) {
      throw new Error('Network response was not ok')
    }

    const { data } = response
    return { success: true, data }
  } catch (error) {
    console.error(`Error fetching remitter by id: ${idPlanta}:`, error)

    return { success: false, error: error.message }
  }
}

export default GetRemitters
