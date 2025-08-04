import fetchWithToken from '../utils/fetchWithToken'

/*
* PatchPlanta Service
*
* Función:
* Realiza una solicitud HTTP para actualizar los datos de una planta.
* - Utiliza el método HTTP `PATCH` para enviar los datos actualizados.
* - Incluye un token de autenticación para garantizar la seguridad.
* - Devuelve un objeto que contiene los datos de la respuesta o detalles del error si la operación falla.
*
* Parámetros:
* @param {Object} planta - Objeto con los datos de la planta que se desea actualizar.
*
* Retorno:
* @returns {Object} Resultado de la operación.
* - `success` (boolean): Indica si la operación fue exitosa.
* - `data` (Object, opcional): Contiene los datos de la respuesta si la operación fue exitosa.
* - `error` (string, opcional): Contiene el mensaje de error si la operación falla.
*
* Detalles adicionales:
* - La solicitud se realiza al endpoint `/api/planta/updatePlanta` utilizando el método HTTP `PATCH`.
* - Utiliza `fetchWithToken` para incluir automáticamente el token de autenticación en los encabezados de la solicitud.
* - Los datos de la planta se envían como un string JSON en el cuerpo de la solicitud.
* - Maneja errores de red y respuestas no exitosas del servidor.
*
* Ejemplo de uso:
* ```javascript
* const planta = {
*   idPlanta: '12345',
*   nombrePlanta: 'Nueva Planta',
*   porcentajeAumento: 10
* }
*
* const result = await PatchPlanta(planta)
* if (result.success) {
*   console.log('Planta actualizada exitosamente:', result.data)
* } else {
*   console.error('Error actualizando la planta:', result.error)
* }
* ```
*/
const PatchPlanta = async (planta) => {
  try {
    const response = await fetchWithToken('/api/planta/updatePlanta', {
      method: 'PATCH',

      body: JSON.stringify(planta)
    })

    if (!response.success) {
      throw new Error('Network response was not ok')
    }

    const { data } = response
    return { success: true, data }
  } catch (error) {
    console.error('Error sending new planta:', error)

    return { success: false, error: error.message }
  }
}

export default PatchPlanta
