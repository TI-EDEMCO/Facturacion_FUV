import Cookies from 'js-cookie'
import { useState } from 'react'

/*
* GetGrowattFileExist Service
*
* Función:
* Realiza una solicitud HTTP para verificar si ya se descargo el excel con la informacion desde el endpoint de Growatt.
* - Incluye un token de autenticación almacenado en cookies para garantizar la seguridad.
* - Devuelve un objeto booleano que indica si el archivo existe o no.
*
* Parámetros:
* - No recibe parámetros.
*
*
* Detalles adicionales:
* - El `BASE_URL` se obtiene desde las variables de entorno a través de `import.meta.env.VITE_API_BASE_URL`.
* - La solicitud se realiza al endpoint `/api/growatt` utilizando el método HTTP `GET`.
* - Incluye un token de autenticación en el encabezado `Authorization`.
* - Maneja errores de red y respuestas no exitosas del servidor.
*
* Ejemplo de uso:
* ```javascript
* const result = await GetGrowattCheckFile()
* if (result.success) {
*   console.log('Datos obtenidos de Growatt:', result.data)
* } else {
*   console.error('Error obteniendo datos de Growatt:', result.error)
* }
* ```
*/
const GetGrowattCheckFile = async () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL
  const token = Cookies.get('accessToken')
  try {
       const response=await fetch(`${BASE_URL}8094/api/growatt/check`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
    return { success: true, data: await  response.json() }

  } catch (error) {
    return { success: false, error: error.message }
  }

}

export default GetGrowattCheckFile
