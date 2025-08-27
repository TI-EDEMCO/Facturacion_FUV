import Cookies from 'js-cookie';

/*
* PostCorreoContabilidad Service
*
* Función:
* Realiza una solicitud HTTP para enviar un correo a contabilidad sobre las facturas generadas de x Plantas.
* - Utiliza el método HTTP `POST` para enviar los datos necesarios para crear la Plantas.
* - Incluye un token de autenticación para garantizar la seguridad.
* - Devuelve un objeto indicando el resultado de la operación.
*
* Parámetros:
* @param {Object} Plantas - Objeto con los datos necesarios para la informacion del correo.
* - Este objeto contiene la información requerida por el servidor para consultar informacion de las plantas y plasmarlas en el correo
*
* Retorno:
* @returns {Object} Resultado de la operación.
* - `success` (boolean): Indica si la operación fue exitosa.
* - `error` (string, opcional): Contiene el mensaje de error si la operación falla.
*
* Detalles adicionales:
* - La solicitud se realiza al endpoint `/api/notificar_contabilidad` en el puerto `8091` definido por `VITE_API_BASE_URL`.
* - Los datos de la Plantas se envían como un string JSON en el cuerpo de la solicitud.
* - Configura los encabezados para incluir `Content-Type: application/json` y el token de autenticación (`Authorization`).
* - Incluye registros de consola para depuración:
*   - `BASE_URL`, `token` y el contenido de `Plantas` antes de enviar la solicitud.
*   - Detalles de la respuesta HTTP (`status` y el cuerpo de la respuesta).
* - Maneja errores de red y respuestas no exitosas del servidor.
*
* Ejemplo de uso:
* ```javascript
* const Plantas = ['LICEO FRANCES',POLLO COA];
*
* const result = await PostCorreoContabilidad(Plantas);
* if (result.success) {
*   console.log('Plantas generada exitosamente.');
* } else {
*   console.error('Error generando Plantas:', result.error);
* }
* ```
*/
const PostCorreoContabilidad = async (Plantas,authorization) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get('accessToken');

  // Verificando valores iniciales
  console.log('BASE_URL:', BASE_URL);
  console.log('Token:', token);
  console.log('Plantas enviadas:', Plantas);
  console.log({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${authorization}`,
  },)
  try {
    const response = await fetch(`${BASE_URL}8091/api/notificar_contabilidad`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authorization}`,
      },
      body: `{"Plantas":[${Plantas}]}`,
    });

    // Imprimir la respuesta completa del fetch
    console.log('Fetch Response:', response);
    console.log('Response Status:', response.status);

    // Leer y loguear el contenido de la respuesta
    const responseBody = await response.text();  // Usamos text() para leer el body
    console.log('Response Body:', responseBody);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return { success: true };
  } catch (error) {
    console.error('Error generating new template:', error);

    return { success: false, error: error.message };
  }
};

export default PostCorreoContabilidad;
