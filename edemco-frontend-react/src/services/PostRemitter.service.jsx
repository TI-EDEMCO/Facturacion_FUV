import fetchWithToken from '../utils/fetchWithToken'

/*
* PostRemitter Service
*
* Función:
* Realiza una solicitud HTTP para crear un nuevo remitente.
* - Utiliza el método HTTP `POST` para enviar los datos del remitente.
* - Incluye un token de autenticación para garantizar la seguridad.
* - Devuelve un objeto que contiene el identificador del remitente creado o detalles del error si la operación falla.
*
* Parámetros:
* @param {Object} remitter - Objeto con los datos del remitente que se desea crear.
* - `email` (string): Dirección de correo electrónico del remitente.
* - `idPlanta` (string): Identificador de la planta asociada al remitente.
*
* Retorno:
* @returns {Object} Resultado de la operación.
* - `success` (boolean): Indica si la operación fue exitosa.
* - `idEmail` (string, opcional): Identificador del remitente creado si la operación fue exitosa.
* - `error` (string, opcional): Contiene el mensaje de error si la operación falla.
*
* Detalles adicionales:
* - La solicitud se realiza al endpoint `/api/email/create` utilizando el método HTTP `POST`.
* - Los datos del remitente se envían como un string JSON en el cuerpo de la solicitud.
* - Utiliza `fetchWithToken` para incluir automáticamente el token de autenticación en los encabezados de la solicitud.
* - Maneja errores de red y respuestas no exitosas del servidor.
*
* Ejemplo de uso:
* ```javascript
* const remitter = {
*   email: 'example@example.com',
*   idPlanta: '12345'
* }
*
* const result = await PostRemitter(remitter)
* if (result.success) {
*   console.log('Remitente creado exitosamente, ID:', result.idEmail)
* } else {
*   console.error('Error creando remitente:', result.error)
* }
* ```
*/
const PostRemitter = async (remitter) => {
  try {
    const response = await fetchWithToken('/api/email/create', {
      method: 'POST',

      body: JSON.stringify(remitter)
    })

    if (!response.success) {
      throw new Error('Network response was not ok')
    }

    const { data } = response
    return { success: true, idEmail: data }
  } catch (error) {
    console.error('Error creating remitter:', error)

    return { success: false, error: error.message }
  }
}

export default PostRemitter
