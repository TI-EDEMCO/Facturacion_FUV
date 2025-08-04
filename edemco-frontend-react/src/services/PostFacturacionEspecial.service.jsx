import fetchWithToken from '../utils/fetchWithToken'

/*
* PostFacturacionEspecial Service
*
* Función:
* Realiza una solicitud HTTP para crear una facturación especial.
* - Utiliza el método HTTP `POST` para enviar los datos de facturación especial.
* - Incluye un token de autenticación para garantizar la seguridad.
* - Devuelve un objeto que contiene la respuesta del servidor o detalles del error si la operación falla.
*
* Parámetros:
* @param {Object} facturacionEspecial - Objeto que contiene los datos necesarios para la facturación especial.
*
* Retorno:
* @returns {Object} Resultado de la operación.
* - `success` (boolean): Indica si la operación fue exitosa.
* - `data` (Object, opcional): Contiene los datos de la respuesta del servidor si la operación fue exitosa.
* - `error` (string, opcional): Contiene el mensaje de error si la operación falla.
*
* Detalles adicionales:
* - La solicitud se realiza al endpoint `/api/facturacion_especial/create` utilizando el método HTTP `POST`.
* - Los datos de facturación especial se envían como un string JSON en el cuerpo de la solicitud.
* - Utiliza `fetchWithToken` para incluir automáticamente el token de autenticación en los encabezados de la solicitud.
* - Maneja errores de red y respuestas no exitosas del servidor.
*
* Ejemplo de uso:
* ```javascript
* const facturacionEspecial = {
*   idPlanta: '12345',
*   cantidadkWh: 5000,
*   excedente: 200,
*   costoAgregado: 50
* }
*
* const result = await PostFacturacionEspecial(facturacionEspecial)
* if (result.success) {
*   console.log('Facturación especial creada exitosamente:', result.data)
* } else {
*   console.error('Error creando facturación especial:', result.error)
* }
* ```
*/
const PostFacturacionEspecial = async (facturacionEspecial) => {
  try {
    const response = await fetchWithToken('/api/facturacion_especial/create', {
      method: 'POST',

      body: JSON.stringify(facturacionEspecial)
    })

    if (!response.success) {
      throw new Error('Network response was not ok')
    }

    return { success: true, data: response.data }
  } catch (error) {
    console.error('Error sending special invoices:', error)

    return { success: false, error: error.message }
  }
}

export default PostFacturacionEspecial
