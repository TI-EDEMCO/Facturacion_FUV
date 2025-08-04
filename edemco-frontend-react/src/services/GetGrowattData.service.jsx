import Cookies from 'js-cookie'

/*
* GetGrowattData Service
*
* Función:
* Realiza una solicitud HTTP para obtener datos desde el endpoint de Growatt.
* - Incluye un token de autenticación almacenado en cookies para garantizar la seguridad.
* - Devuelve un objeto que contiene los datos obtenidos o detalles del error si la operación falla.
*
* Parámetros:
* - No recibe parámetros.
*
* Retorno:
* @returns {Object} Resultado de la operación.
* - `success` (boolean): Indica si la operación fue exitosa.
* - `data` (Object, opcional): Contiene los datos obtenidos si la operación fue exitosa.
* - `error` (string, opcional): Contiene el mensaje de error si la operación falla.
*
* Detalles adicionales:
* - El `BASE_URL` se obtiene desde las variables de entorno a través de `import.meta.env.VITE_API_BASE_URL`.
* - La solicitud se realiza al endpoint `/api/growatt` utilizando el método HTTP `GET`.
* - Incluye un token de autenticación en el encabezado `Authorization`.
* - Maneja errores de red y respuestas no exitosas del servidor.
*
* Ejemplo de uso:
* ```javascript
* const result = await GetGrowattData()
* if (result.success) {
*   console.log('Datos obtenidos de Growatt:', result.data)
* } else {
*   console.error('Error obteniendo datos de Growatt:', result.error)
* }
* ```
*/
const GetGrowattData = async () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL
  const token = Cookies.get('accessToken')

  try {
    const response = await fetch(`${BASE_URL}8094/api/growatt`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    return { success: true, data: await response.json() }
  } catch (error) {
    console.error('Error sending data to growatt:', error)

    return { success: false, error: error.message }
  }
}

export default GetGrowattData
