import Cookies from 'js-cookie'

/*
* GetDataInvoices Service
*
* Función:
* Realiza una solicitud HTTP para obtener los datos de facturas desde el servidor.
* - Incluye un token de autenticación almacenado en cookies para garantizar la seguridad.
* - Devuelve un objeto que contiene los datos obtenidos o detalles del error si la operación falla.
*
* Parámetros:
* - No recibe parámetros.
*
* Retorno:
* @returns {Object} Resultado de la operación.
* - `success` (boolean): Indica si la operación fue exitosa.
* - `data` (Array, opcional): Contiene los datos de las facturas si la operación fue exitosa.
* - `error` (string, opcional): Contiene el mensaje de error si la operación falla.
*
* Detalles adicionales:
* - El `BASE_URL` se obtiene desde las variables de entorno a través de `import.meta.env.VITE_API_BASE_URL`.
* - La solicitud se realiza al endpoint `/api/facturas` utilizando el método HTTP `GET`.
* - Incluye un token de autenticación en el encabezado `Authorization`.
* - Maneja errores de red y respuestas no exitosas del servidor.
*
* Ejemplo de uso:
* ```javascript
* const result = await GetDataInvoices()
* if (result.success) {
*   console.log('Datos de facturas obtenidos:', result.data)
* } else {
*   console.error('Error obteniendo datos de facturas:', result.error)
* }
* ```
*/
const GetDataInvoices = async () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL
  const token = Cookies.get('accessToken')

  try {
    const response = await fetch(`${BASE_URL}8092/api/facturas`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    console.log(response)

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching invoices data:', error)

    return { success: false, error: error.message }
  }
}

export default GetDataInvoices
