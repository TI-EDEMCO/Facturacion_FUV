import fetchWithToken from '../utils/fetchWithToken'

/*
* PostGeneracionData Service
*
* Función:
* Realiza una solicitud HTTP para obtener los cálculos relacionados con generación de energía.
* - Utiliza el método HTTP `POST` para enviar los datos necesarios para obtener los datos.
* - Incluye un token de autenticación para garantizar la seguridad.
* - Devuelve un objeto que contiene la respuesta del servidor o detalles del error si la operación falla.
*
* Parámetros:
* @param {Object} ListPlantas - Objeto que contiene los datos necesarios para consultar.
*
* Retorno:
* @returns {Object} Resultado de la operación.
* - `success` (boolean): Indica si la operación fue exitosa.
* - `data` (Object, opcional): Contiene los datos de la respuesta del servidor si la operación fue exitosa.
* - `error` (string, opcional): Contiene el mensaje de error si la operación falla.
*
* Detalles adicionales:
* - La solicitud se realiza al endpoint `/api/generacion/datos_generacion_actual` utilizando el método HTTP `POST`.
* - Los datos de cálculo se envían como un string JSON en el cuerpo de la solicitud.
* - Utiliza `fetchWithToken` para incluir automáticamente el token de autenticación en los encabezados de la solicitud.
* - Maneja errores de red y respuestas no exitosas del servidor.
*
* Ejemplo de uso:
* ```javascript
* const calculations = {
*   idPlanta: '12345',
*   anio: 2025,
*   mes: 7
* }
*
* const result = await PostGenerateCalculations(calculations)
* if (result.success) {
*   console.log('Cálculos generados exitosamente:', result.data)
* } else {
*   console.error('Error generando cálculos:', result.error)
* }
* ```
*/
const PostGeneracionData = async (ListPlantas) => {
  try {
    const response = await fetchWithToken('/api/generacion/datos_generacion_actual', {
      method: 'POST',

      body: JSON.stringify(ListPlantas)
    })

    if (!response.success) {
      throw new Error('Network response was not ok')
    }

    const { data } = response
    return { success: true, data }
  } catch (error) {
    console.error('Error generating calculations:', error)

    return { success: false, error: error.message }
  }
}

export default PostGeneracionData
