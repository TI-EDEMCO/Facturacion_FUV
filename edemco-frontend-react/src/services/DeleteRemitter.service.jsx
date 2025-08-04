import fetchWithToken from '../utils/fetchWithToken'

/*
* DeleteRemitter Service
*
* Función:
* Realiza una solicitud HTTP para eliminar un remitente identificado por su ID.
* - Utiliza un token de autenticación para realizar la solicitud de manera segura.
* - Devuelve un objeto que indica el éxito o el fallo de la operación.
*
* Parámetros:
* @param {string} remitterId - El ID del remitente que se desea eliminar.
*
* Retorno:
* @returns {Object} Resultado de la operación.
* - `success` (boolean): Indica si la operación fue exitosa.
* - `error` (string, opcional): Contiene el mensaje de error si la operación falla.
*
* Detalles adicionales:
* - La solicitud utiliza el método HTTP `DELETE`.
* - Maneja errores de red y de respuesta no exitosa, retornando información detallada del fallo.
* - Depende de `fetchWithToken` para incluir automáticamente el token en los encabezados de la solicitud.
*
* Ejemplo de uso:
* ```javascript
* const result = await DeleteRemitter('12345')
* if (result.success) {
*   console.log('Remitente eliminado con éxito')
* } else {
*   console.error('Error eliminando remitente:', result.error)
* }
* ```
*/
const DeleteRemitter = async (remitterId) => {
  try {
    const response = await fetchWithToken(
      `/api/email/delete?idEmail=${remitterId}`,
      {
        method: 'DELETE'
      }
    )

    if (!response.success) {
      throw new Error('Network response was not ok')
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting remitter:', error)

    return { success: false, error: error.message }
  }
}

export default DeleteRemitter
