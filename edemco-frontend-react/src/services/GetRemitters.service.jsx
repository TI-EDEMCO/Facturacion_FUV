import fetchWithToken from '../utils/fetchWithToken'

/*
* GetRemitters Service
*
* Función:
* Realiza una solicitud HTTP para obtener la lista de remitentes.
* - Utiliza un token de autenticación para garantizar la seguridad de la solicitud.
* - Devuelve un objeto que contiene los datos obtenidos o detalles del error si la operación falla.
*
* Parámetros:
* - No recibe parámetros.
*
* Retorno:
* @returns {Object} Resultado de la operación.
* - `success` (boolean): Indica si la operación fue exitosa.
* - `data` (Array, opcional): Contiene la lista de remitentes si la operación fue exitosa.
* - `error` (string, opcional): Contiene el mensaje de error si la operación falla.
*
* Detalles adicionales:
* - La solicitud se realiza al endpoint `/api/email/all` utilizando el método HTTP `GET`.
* - Utiliza `fetchWithToken` para incluir automáticamente el token de autenticación en los encabezados de la solicitud.
* - Maneja errores de red y respuestas no exitosas del servidor.
*
* Ejemplo de uso:
* ```javascript
* const result = await GetRemitters()
* if (result.success) {
*   console.log('Remitentes obtenidos:', result.data)
* } else {
*   console.error('Error obteniendo remitentes:', result.error)
* }
* ```
*/
const GetRemitters = async () => {
  try {
    const response = await fetchWithToken('/api/email/all')

    if (!response.success) {
      throw new Error('Network response was not ok')
    }

    const { data } = response
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching remitters:', error)

    return { success: false, error: error.message }
  }
}

export default GetRemitters
