import { useNavigate } from 'react-router-dom'
import './ButtonBack.css'

/*
* ButtonBack Component
*
* Props:
* No recibe props.
*
* Función:
* Renderiza un botón que, al ser presionado, redirige al usuario a la ruta '/principal'.
* Utiliza `useNavigate` de `react-router-dom` para manejar la navegación programática.
*
* Detalles adicionales:
* Incluye un ícono de flecha hacia la izquierda como contenido del botón, estilizado mediante clases CSS.
*/
const ButtonBack = () => {
  const navigate = useNavigate()

  const goBack = () => {
    navigate('/principal')
  }

  return (
    <button onClick={goBack} className="btn-back">
      <i className="fa-solid fa-angle-left"></i>
    </button>
  )
}

export default ButtonBack
