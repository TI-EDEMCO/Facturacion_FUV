import fetchWithToken from '../utils/fetchWithToken'

/*
* PostTarifaOperadores Service
*
* Función:
* Realiza una solicitud HTTP para registrar nuevas tarifas para los operadores.
* - Utiliza el método HTTP `POST` para enviar los datos de las tarifas.
* - Incluye un token de autenticación para garantizar la seguridad.
* - Devuelve un objeto indicando el resultado de la operación.
*
* Parámetros:
* @param {Array} tarifaOperador - Lista de objetos que representan las tarifas de los operadores.
* - Cada objeto debe contener:
*   - `idOperador` (string): Identificador del operador.
*   - `tarifaOperador` (number): La nueva tarifa asignada al operador.
*
* Retorno:
* @returns {Object} Resultado de la operación.
* - `success` (boolean): Indica si la operación fue exitosa.
* - `error` (string, opcional): Contiene el mensaje de error si la operación falla.
*
* Detalles adicionales:
* - La solicitud se realiza al endpoint `/api/tarifaoperador` utilizando el método HTTP `POST`.
* - Los datos de las tarifas se envían como un string JSON en el cuerpo de la solicitud.
* - Utiliza `fetchWithToken` para incluir automáticamente el token de autenticación en los encabezados de la solicitud.
* - Maneja errores de red y respuestas no exitosas del servidor.
*
* Ejemplo de uso:
* ```javascript
* const tarifaOperador = [
*   { idOperador: '1', tarifaOperador: 120.50 },
*   { idOperador: '2', tarifaOperador: 100.75 }
* ]
*
* const result = await PostTarifaOperadores(tarifaOperador)
* if (result.success) {
*   console.log('Tarifas registradas exitosamente.')
* } else {
*   console.error('Error registrando tarifas:', result.error)
* }
* ```
*/
const PostTarifaOperadores = async (tarifaOperador) => {
  try {
    const response = await fetchWithToken('/api/tarifaoperador', {
      method: 'POST',

      body: JSON.stringify(tarifaOperador)
    })

    if (!response.success) {
      throw new Error('Network response was not ok')
    }

    return { success: true }
  } catch (error) {
    console.error('Error creating new tarifa operador:', error)

    return { success: false, error: error.message }
  }
}

export default PostTarifaOperadores
