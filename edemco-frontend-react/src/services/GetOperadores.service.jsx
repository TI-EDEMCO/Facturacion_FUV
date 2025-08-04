import fetchWithToken from '../utils/fetchWithToken'

/*
* GetOperadores Service
*
* Función:
* Realiza una solicitud HTTP para obtener la lista de operadores.
* - Utiliza un token de autenticación para garantizar la seguridad de la solicitud.
* - Devuelve un objeto que contiene los datos obtenidos o detalles del error si la operación falla.
*
* Parámetros:
* - No recibe parámetros.
*
* Retorno:
* @returns {Object} Resultado de la operación.
* - `success` (boolean): Indica si la operación fue exitosa.
* - `data` (Array, opcional): Contiene la lista de operadores si la operación fue exitosa.
* - `error` (string, opcional): Contiene el mensaje de error si la operación falla.
*
* Detalles adicionales:
* - La solicitud se realiza al endpoint `/api/operador` utilizando el método HTTP `GET`.
* - Utiliza `fetchWithToken` para incluir automáticamente el token de autenticación en los encabezados de la solicitud.
* - Maneja errores de red y respuestas no exitosas del servidor.
*
* Ejemplo de uso:
* ```javascript
* const result = await GetOperadores()
* if (result.success) {
*   console.log('Operadores obtenidos:', result.data)
* } else {
*   console.error('Error obteniendo operadores:', result.error)
* }
* ```
*/
const GetOperadores = async () => {
  try {
    const response = await fetchWithToken('/api/operador')

    if (!response.success) {
      throw new Error('Network response was not ok')
    }

    const { data } = response
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching operadores:', error)

    return { success: false, error: error.message }
  }
}

export default GetOperadores
