import fetchWithToken from '../utils/fetchWithToken'

/*
* PostSiesaIntegration Service
*
* Función:
* Realiza una solicitud HTTP para integrar las facturas generadas con el sistema Siesa.
* - Utiliza el método HTTP `POST` para enviar los datos de los clientes y la fecha de facturación.
* - Incluye un token de autenticación para garantizar la seguridad.
* - Devuelve un objeto que contiene los datos de la respuesta del servidor o detalles del error si la operación falla.
*
* Parámetros:
* @param {Array} customers - Lista de clientes con sus datos de facturación.
* - Cada elemento debe ser un objeto que represente un cliente con los campos requeridos.
* @param {string} fechaFactura - Fecha de facturación en formato `YYYY-MM-DD`.
*
* Retorno:
* @returns {Object} Resultado de la operación.
* - `success` (boolean): Indica si la operación fue exitosa.
* - `data` (Object, opcional): Contiene los datos de la respuesta del servidor si la operación fue exitosa.
* - `error` (string, opcional): Contiene el mensaje de error si la operación falla.
*
* Detalles adicionales:
* - La solicitud se realiza al endpoint `/api/integracion_siesa/enviar_factura_siesa`, incluyendo la fecha como parámetro de consulta.
* - Los datos de los clientes se envían como un string JSON en el cuerpo de la solicitud.
* - Utiliza `fetchWithToken` para incluir automáticamente el token de autenticación en los encabezados de la solicitud.
* - Maneja errores de red y respuestas no exitosas del servidor.
*
* Ejemplo de uso:
* ```javascript
* const customers = [
*   { idPlanta: '12345', nombrePlanta: 'Planta 1', monto: 1000 },
*   { idPlanta: '67890', nombrePlanta: 'Planta 2', monto: 2000 }
* ]
*
* const fechaFactura = '2024-01-15'
*
* const result = await PostSiesaIntegration(customers, fechaFactura)
* if (result.success) {
*   console.log('Integración con Siesa exitosa:', result.data)
* } else {
*   console.error('Error en la integración con Siesa:', result.error)
* }
* ```
*/
const PostSiesaIntegration = async (customers, fechaFactura) => {
  try {
    const response = await fetchWithToken(
      `/api/integracion_siesa/enviar_factura_siesa?date=${fechaFactura}`,
      {
        method: 'POST',

        body: JSON.stringify(customers)
      }
    )

    if (!response.success) {
      throw new Error('Network response was not ok')
    }

    const { data } = response
    return { success: true, data }
  } catch (error) {
    console.error('Error integrating on siesa:', error)

    return { success: false, error: error.message }
  }
}

export default PostSiesaIntegration
