/*
* PostRegisterUser Service
*
* Función:
* Realiza una solicitud HTTP para registrar un nuevo usuario en el sistema.
* - Utiliza el método HTTP `POST` para enviar los datos del usuario.
* - Devuelve un objeto que contiene los datos de la respuesta del servidor o detalles del error si la operación falla.
*
* Parámetros:
* @param {Object} newUser - Objeto con los datos del nuevo usuario.
* - `username` (string): El nombre de usuario del nuevo usuario.
* - `password` (string): La contraseña del nuevo usuario.
*
* Retorno:
* @returns {Object} Resultado de la operación.
* - `success` (boolean): Indica si la operación fue exitosa.
* - `data` (Object, opcional): Contiene los datos de la respuesta del servidor si la operación fue exitosa.
* - `error` (string, opcional): Contiene el mensaje de error si la operación falla.
*
* Detalles adicionales:
* - La solicitud se realiza al endpoint `/api/register`, utilizando el puerto definido en `VITE_JAVA_PORT` y la URL base en `VITE_API_BASE_URL`.
* - Los datos del usuario se envían como un string JSON en el cuerpo de la solicitud.
* - Configura el encabezado `Content-Type` como `application/json` para garantizar el formato correcto de los datos.
* - Maneja errores de red y respuestas no exitosas del servidor.
*
* Ejemplo de uso:
* ```javascript
* const newUser = {
*   username: 'new_user',
*   password: 'securepassword123'
* }
*
* const result = await PostRegisterUser(newUser)
* if (result.success) {
*   console.log('Usuario registrado exitosamente:', result.data)
* } else {
*   console.error('Error registrando usuario:', result.error)
* }
* ```
*/
const PostRegisterUser = async (newUser) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL
  const JAVA_PORT = import.meta.env.VITE_JAVA_PORT

  try {
    const response = await fetch(`${BASE_URL}${JAVA_PORT}/api/register`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify(newUser)
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    return { success: true, data: await response.json() }
  } catch (error) {
    console.error('Error registering user:', error)

    return { success: false, error: error.message }
  }
}

export default PostRegisterUser
