import Cookies from 'js-cookie'

/*
* PostNewAccessToken Service
*
* Función:
* Realiza una solicitud HTTP para generar un nuevo token de acceso utilizando un token de actualización.
* - Utiliza el método HTTP `POST` para enviar el token de acceso actual y el token de actualización.
* - Devuelve un objeto que contiene los nuevos tokens u otros detalles proporcionados por el servidor.
*
* Parámetros:
* - No recibe parámetros directos.
* - Recupera el `accessToken` y `refreshToken` desde las cookies mediante la librería `js-cookie`.
*
* Retorno:
* @returns {Object} Resultado de la operación.
* - `success` (boolean): Indica si la operación fue exitosa.
* - `data` (Object, opcional): Contiene los nuevos tokens si la operación fue exitosa.
* - `error` (string, opcional): Contiene el mensaje de error si la operación falla.
*
* Detalles adicionales:
* - La solicitud se realiza al endpoint `/api/refreshToken`, utilizando el puerto definido en `VITE_JAVA_PORT` y la URL base en `VITE_API_BASE_URL`.
* - Los tokens actuales se envían como un string JSON en el cuerpo de la solicitud.
* - Configura el encabezado `Content-Type` como `application/json` para garantizar el formato correcto de los datos.
* - Maneja errores de red y respuestas no exitosas del servidor.
*
* Ejemplo de uso:
* ```javascript
* const result = await PostNewAccessToken()
* if (result.success) {
*   console.log('Token renovado exitosamente:', result.data)
* } else {
*   console.error('Error renovando el token:', result.error)
* }
* ```
*/
const PostNewAccessToken = async () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL
  const JAVA_PORT = import.meta.env.VITE_JAVA_PORT

  const token = Cookies.get('accessToken')
  const refreshToken = Cookies.get('refreshToken')

  try {
    const response = await fetch(`${BASE_URL}${JAVA_PORT}/api/refreshToken`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({ accessToken: token, refreshToken })
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error('Error refreshing token:', error)

    return { success: false, error: error.message }
  }
}

export default PostNewAccessToken
