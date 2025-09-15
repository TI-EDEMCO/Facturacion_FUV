import Cookies from 'js-cookie'
import PostNewAccessToken from '../services/PostNewAccessToken.service'

/*
* fetchWithToken Utility
*
* Función:
* Realiza una solicitud HTTP con autenticación basada en token. Maneja automáticamente la renovación del token de acceso cuando expira.
* - Incluye el token de acceso en el encabezado `Authorization` de cada solicitud.
* - Si el token es inválido o ha expirado, intenta renovarlo utilizando el token de actualización.
* - Redirige al usuario al inicio de sesión si no se puede renovar el token.
*
* Parámetros:
* @param {string} url - El endpoint de la API al que se realiza la solicitud.
* @param {Object} [options={}] - Opciones adicionales para configurar la solicitud `fetch`.
* @param {boolean} [isPython=false] - Indica si la solicitud es para un servicio basado en Python (true) o en Java (false).
*
* Retorno:
* @returns {Object} Resultado de la operación.
* - `success` (boolean): Indica si la operación fue exitosa.
* - `data` (Object, opcional): Contiene los datos de la respuesta del servidor si la operación fue exitosa.
* - `error` (string, opcional): Contiene el mensaje de error si la operación falla.
*
* Detalles adicionales:
* - Configura automáticamente el encabezado `Authorization` con el token de acceso actual.
* - En caso de recibir un código de estado 401 (Unauthorized), intenta renovar el token y reintenta la solicitud.
* - Si no se puede renovar el token, elimina los tokens de las cookies y redirige al usuario al inicio de sesión.
* - Soporta solicitudes a servicios basados en Python y Java mediante el parámetro `isPython`.
* - Maneja errores de red y respuestas no exitosas del servidor.
*
* Ejemplo de uso:
* ```javascript
* const result = await fetchWithToken('/api/example', { method: 'GET' });
* if (result.success) {
*   console.log('Datos recibidos:', result.data);
* } else {
*   console.error('Error en la solicitud:', result.error);
* }
* ```
*/
const fetchWithToken = async (url, options = {}, isPython = false) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL
  const JAVA_PORT = import.meta.env.VITE_JAVA_PORT
  const PYTHON_PORT = 8090
  const UNAUTHORIZED_STATUS_CODE = 401
  const FORBIDDEN_STATUS_CODE = 403

  const token = Cookies.get('accessToken')

  try {
    const port = isPython ? PYTHON_PORT : JAVA_PORT
    const response = await fetch(`${BASE_URL}${port}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      credentials: 'include'
    })

    const data = await response.json()

    if (
      response.ok &&
      data.statusCode !== UNAUTHORIZED_STATUS_CODE &&
      data.statusCode !== FORBIDDEN_STATUS_CODE
    ) {
      return { success: true, data }
    }
    console.log(data)

    if (data.statusCode === UNAUTHORIZED_STATUS_CODE) {
      console.log("unautorizate")
      Cookies.remove('accessToken')
      Cookies.remove('refreshToken')

      window.location.href = '/'
      // return { success: false, error: data.message }
      // const refreshResult = await PostNewAccessToken()

      // if (
      //   refreshResult.success &&
      //   refreshResult.data.statusCode !== FORBIDDEN_STATUS_CODE
      // ) {
      //   const newAccessToken = refreshResult.data.accessToken

      //   if (newAccessToken) Cookies.set('accessToken', newAccessToken)

      //   const retryResponse = await fetch(`${BASE_URL}${JAVA_PORT}${url}`, {
      //     ...options,
      //     headers: {
      //       ...options.headers,
      //       'Content-Type': 'application/json',
      //       Authorization: `Bearer ${newAccessToken}`
      //     }
      //   })

      //   if (!retryResponse.ok) {
      //     throw new Error('Network response was not ok')
      //   }

      //   const data = await retryResponse.json()

      //   return { success: true, data }
      // } else if (refreshResult.data.statusCode === FORBIDDEN_STATUS_CODE) {
      //   Cookies.remove('accessToken')
      //   Cookies.remove('refreshToken')

      //   window.location.href = '/'
      //   return { success: false, error: data.message }
      // } else {
      //   throw new Error('Could not refresh token')
      // }
    }

    throw new Error('Network response was not ok')
  } catch (error) {
    console.error('Error in fetchWithToken:', error)
    return { success: false, error: error.message }
  }
}

export default fetchWithToken
