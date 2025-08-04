/*
* PostLoginUser Service
*
* Función:
* Realiza una solicitud HTTP para autenticar a un usuario mediante su nombre de usuario y contraseña.
* - Utiliza el método HTTP `POST` para enviar las credenciales del usuario.
* - Devuelve un objeto que contiene los tokens de autenticación u otros detalles proporcionados por el servidor.
*
* Parámetros:
* @param {Object} user - Objeto con las credenciales del usuario.
* - `username` (string): El nombre de usuario del usuario.
* - `password` (string): La contraseña del usuario.
*
* Retorno:
* @returns {Object} Resultado de la operación.
* - `success` (boolean): Indica si la operación fue exitosa.
* - `data` (Object, opcional): Contiene los datos de la respuesta del servidor si la operación fue exitosa.
* - `error` (string, opcional): Contiene el mensaje de error si la operación falla.
*
* Detalles adicionales:
* - La solicitud se realiza al endpoint `/api/login`, utilizando el puerto definido en `VITE_JAVA_PORT` y la URL base en `VITE_API_BASE_URL`.
* - Las credenciales del usuario se envían como un string JSON en el cuerpo de la solicitud.
* - Configura el encabezado `Content-Type` como `application/json` para garantizar el formato correcto de los datos.
* - Maneja errores de red y respuestas no exitosas del servidor.
*
* Ejemplo de uso:
* ```javascript
* const user = {
*   username: 'john_doe',
*   password: 'securepassword123'
* }
*
* const result = await PostLoginUser(user)
* if (result.success) {
*   console.log('Inicio de sesión exitoso:', result.data)
* } else {
*   console.error('Error al iniciar sesión:', result.error)
* }
* ```
*/
const PostLoginUser = async (user) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL
  const JAVA_PORT = import.meta.env.VITE_JAVA_PORT
  try {
    const response = await fetch(`${BASE_URL}${JAVA_PORT}/api/login`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(user)
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    return { success: true, data: await response.json() }
  } catch (error) {
    console.error('Error login user:', error)

    return { success: false, error: error.message }
  }
}

export default PostLoginUser
