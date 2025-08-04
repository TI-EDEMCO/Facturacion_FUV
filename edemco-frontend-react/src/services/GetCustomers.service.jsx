import fetchWithToken from '../utils/fetchWithToken'

/*
* GetCustomers Service
*
* Función:
* Realiza una solicitud HTTP para obtener la lista de clientes (plantas).
* - Utiliza un token de autenticación para garantizar la seguridad de la solicitud.
* - Devuelve un objeto que contiene los datos obtenidos o detalles del error si la operación falla.
*
* Parámetros:
* - No recibe parámetros.
*
* Retorno:
* @returns {Object} Resultado de la operación.
* - `success` (boolean): Indica si la operación fue exitosa.
* - `data` (Array, opcional): Contiene la lista de clientes si la operación fue exitosa.
* - `error` (string, opcional): Contiene el mensaje de error si la operación falla.
*
* Detalles adicionales:
* - La solicitud se realiza al endpoint `/api/planta/all` utilizando el método HTTP `GET`.
* - Maneja errores de red y respuestas no exitosas del servidor.
* - Utiliza `fetchWithToken` para incluir automáticamente el token de autenticación.
*
* Ejemplo de uso:
* ```javascript
* const result = await GetCustomers()
* if (result.success) {
*   console.log('Clientes obtenidos:', result.data)
* } else {
*   console.error('Error obteniendo clientes:', result.error)
* }
* ```
*/
const GetCustomers = async () => {
  try {
    const response = await fetchWithToken('/api/planta/all')

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

export default GetCustomers
