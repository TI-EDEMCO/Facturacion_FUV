import { useEffect } from 'react'
import Card from '../../molecules/Card/Card'
import CardsList from '../../../jsons/Cards.json'
import Container from '../../layouts/Container/Container'
import './Home.css'

/*
* Home Component
*
* Función:
* Renderiza la página principal de la aplicación con una lista de tarjetas interactivas que redirigen a diferentes secciones.
* - Cada tarjeta contiene un título, un ícono, un enlace y un texto descriptivo.
* - Utiliza un archivo JSON (`Cards.json`) para definir dinámicamente el contenido de las tarjetas.
*
* Efectos:
* - Al cargar el componente, establece el título de la página como "Edemco".
*
* Componentes utilizados:
* - `Card`: Renderiza cada tarjeta individual.
* - `Container`: Contenedor principal estilizado que agrupa las tarjetas.
*
* Datos:
* - `CardsList`: Lista de objetos que define las propiedades de cada tarjeta, obtenida desde un archivo JSON.
*
* Detalles adicionales:
* - La clase CSS `Home.css` se utiliza para personalizar los estilos de la página.
* - Cada tarjeta incluye una clave única (`id`) que se usa como `key` en el método `map`.
*/
const Home = () => {
  useEffect(() => {
    document.title = 'Edemco'
  }, [])

  return (
    <Container>
      {CardsList.map(({ id, title, href, icon, linkText }) => {
        return (
          <Card
            key={id}
            title={title}
            href={href}
            icon={icon}
            linkText={linkText}
          />
        )
      })}
    </Container>
  )
}

export default Home
