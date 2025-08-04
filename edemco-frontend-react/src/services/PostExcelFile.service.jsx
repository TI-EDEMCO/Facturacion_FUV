import Cookies from 'js-cookie'

/*
* PostExcelFile Service
*
* Función:
* Realiza una solicitud HTTP para cargar un archivo Excel al servidor.
* - Utiliza el método HTTP `POST` para enviar el archivo.
* - Incluye un token de autenticación en los encabezados para garantizar la seguridad.
* - Devuelve un objeto que contiene la respuesta del servidor o detalles del error si la operación falla.
*
* Parámetros:
* @param {File} excelFile - El archivo Excel que se desea cargar.
*
* Retorno:
* @returns {Object} Resultado de la operación.
* - `success` (boolean): Indica si la operación fue exitosa.
* - `data` (Object, opcional): Contiene los datos de la respuesta del servidor si la operación fue exitosa.
* - `error` (string, opcional): Contiene el mensaje de error si la operación falla.
*
* Detalles adicionales:
* - La solicitud se realiza al endpoint `/api/upload_excel` en el puerto `8093`.
* - Los datos se envían como `FormData`, adecuado para el manejo de archivos.
* - Utiliza el encabezado `Authorization` para incluir el token de autenticación almacenado en cookies.
* - Maneja errores de red y respuestas no exitosas del servidor.
*
* Ejemplo de uso:
* ```javascript
* const excelFile = document.querySelector('input[type="file"]').files[0]
* const result = await PostExcelFile(excelFile)
* if (result.success) {
*   console.log('Archivo subido exitosamente:', result.data)
* } else {
*   console.error('Error subiendo el archivo:', result.error)
* }
* ```
*/
const PostExcelFile = async (excelFile) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL
  const token = Cookies.get('accessToken')

  try {
    const formData = new FormData()
    formData.append('file', excelFile)

    const response = await fetch(`${BASE_URL}8093/api/upload_excel`, {
      headers: {
        Authorization: `Bearer ${token}`
      },

      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error('Error uploading file:', error)

    return { success: false, error: error.message }
  }
}

export default PostExcelFile
