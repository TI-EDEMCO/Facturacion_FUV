import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { redirect, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import Anchord from '../../atoms/Anchord/Anchord'
import Button from '../../atoms/Button/Button'
import Container from '../../layouts/Container/Container'
import Input from '../../atoms/Input/Input'
import PostLoginUser from '../../../services/PostLoginUser'
import Title from '../../atoms/Title/Title'
import './Login.css'
/*
* Login Component
*
* Función:
* Renderiza modal con boton para redirección para el inicio de sesion de Microsoft .
* - Redirige al usuario a la página de inicio de sesion.
*
*
* Componentes utilizados:
* - `Button`: Botón para redireccionar
* - `Container`: Contenedor estilizado que agrupa el formulario y la interfaz.
* - `Anchord`: Enlace para redirigir al registro de nuevos usuarios.
*
* Detalles adicionales:
* - Utiliza `react-toastify` para notificaciones de error en tiempo real.
*/
const Login = () => {
  useEffect(() => {
    document.title = 'Edemco - Inicio de Sesión'
  }, [])
  const url_login=import.meta.env.VITE_URL_LOGIN


  return (
    <section className="login">
      <Container className="login--card container--flex container--max-width">
        <header className="titulo-login">
          <img
            alt="Logo Edemco buena energía"
            height={140}
            src="/Logo-removebg-preview.png"
            width={300}
          />

          <Title text="Inicio de sesión" className="title--medium" />
        </header>
        <Button
        onClick={()=>{window.location.href=url_login}}
        text={"Inicio sesion"}
        />
      </Container>
    </section>
  )
}

export default Login
