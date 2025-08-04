import { useEffect, useState } from 'react'
import FacturacionEspecial from '../FacturacionEspecial/FacturacionEspecial'
import IniciarFactura from '../IniciarFactura/IniciarFactura'
import StepContainer from '../../layouts/StepContainer/StepContainer'
import Steps from '../../molecules/Steps/Steps'
import TarifaOperadores from '../TarifaOperadores/TarifaOperadores'
import './Facturacion.css'

/*
* Facturacion Component
*
* Función:
* Renderiza un flujo de pasos para el proceso de facturación, incluyendo:
* - Configuración de tarifas de operadores.
* - Gestión de facturación especial.
* - Inicio del proceso de facturación.
* 
* Estado interno:
* @param {number} openStep - Define el paso actualmente abierto (activo).
*
* Métodos:
* - `setOpenStep`: Cambia el paso activo cuando el usuario interactúa con los pasos o contenedores.
*
* Componentes utilizados:
* - `Steps`: Muestra la barra de progreso visual con los pasos del proceso.
* - `StepContainer`: Define el contenedor de cada paso con un encabezado y contenido dinámico.
* - `TarifaOperadores`: Componente para configurar las tarifas de los operadores.
* - `FacturacionEspecial`: Componente para gestionar las configuraciones de facturación especial.
* - `IniciarFactura`: Componente para iniciar el proceso de facturación.
*
* Efectos:
* - Al cargar el componente, establece el título de la página a "Edemco - Facturación".
*
* Detalles adicionales:
* - La clase CSS `facturacion` estiliza el contenedor principal.
* - Cada paso está diseñado como un componente dinámico y reutilizable mediante `StepContainer`.
*/
const Facturacion = () => {
  const [openStep, setOpenStep] = useState(1)

  useEffect(() => {
    document.title = 'Edemco - Facturación'
  }, [])

  return (
    <section className="facturacion">
      <Steps
        actualStep={openStep}
        steps={[
          'Tarifa operadores',
          'Facturación Especial',
          'Iniciar facturación'
        ]}
      />

      <StepContainer
        isOpen={openStep === 1}
        setOpen={() => setOpenStep(1)}
        stepNumber={1}
        stepTitle="Tarifa Operadores"
      >
        <TarifaOperadores setOpenStep={setOpenStep} />
      </StepContainer>

      <StepContainer
        isOpen={openStep === 2}
        setOpen={() => setOpenStep(2)}
        stepNumber={2}
        stepTitle="Facturación Especial"
      >
        <FacturacionEspecial setOpenStep={setOpenStep} />
      </StepContainer>

      <StepContainer
        isOpen={openStep === 3}
        setOpen={() => setOpenStep(3)}
        stepNumber={3}
        stepTitle="Iniciar Facturación"
        stepParagraph='Al iniciar el proceso de facturación, este tardará unos minutos, por favor espere el mensaje de confirmación.'
      >
        <IniciarFactura />
      </StepContainer>
    </section>
  )
}

export default Facturacion
