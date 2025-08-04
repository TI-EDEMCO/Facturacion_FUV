import React, { useEffect } from 'react'
import Container from '../../layouts/Container/Container'
import './VisualizacionArchivos.css'

/*
* VisualizacionArchivos Component
*
* Función:
* Este componente renderiza un informe embebido desde Power BI para su visualización.
* - Muestra un iframe que carga un informe alojado en Power BI.
* - Cambia dinámicamente el título de la página a "Edemco - Visualización de Archivos".
*
* Estado interno:
* - No utiliza estado local, ya que su funcionalidad es estática.
*
* Efectos:
* - `useEffect`: Cambia el título de la página al montar el componente.
*
* Componentes utilizados:
* - `Container`: Contenedor estilizado que agrupa la interfaz de visualización.
*
* Detalles adicionales:
* - El iframe utiliza la propiedad `allowFullScreen` para permitir la visualización en pantalla completa.
* - Se aplica la clase CSS `visualizacion-grafica` al iframe para estilizar su apariencia.
*/
const VisualizacionArchivos = () => {
  useEffect(() => {
    document.title = 'Edemco - Visualización de Archivos'
  }, [])

  return (
    <>
      <Container>
        <div className="reportContainer">
          <iframe
            title="informe comercial version3"
            src="https://app.powerbi.com/reportEmbed?reportId=ee9375d0-4c95-4b18-88d8-9fd8d2e260b8&autoAuth=true&ctid=dfeb1d64-2c83-434a-bf21-c6696d5322ec"
            frameBorder="0"
            allowFullScreen={true}
            className="visualizacion-grafica"
          ></iframe>
        </div>
      </Container>
    </>
  )
}

export default VisualizacionArchivos
