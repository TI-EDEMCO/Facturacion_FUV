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
* Renderiza el formulario de inicio de sesión que permite a los usuarios autenticarse en la plataforma.
* - Valida los campos de usuario y contraseña.
* - Envía las credenciales al servicio de autenticación.
* - Guarda los tokens de acceso y refresco en cookies si la autenticación es exitosa.
* - Redirige al usuario a la página principal tras iniciar sesión.
*
* Estado interno:
* @param {Object} formValues - Almacena los valores del formulario y los estados de error de los campos.
* @param {boolean} loading - Indica si el proceso de inicio de sesión está en curso.
*
* Métodos:
* - `isFormValid`: Valida que los campos de usuario y contraseña no estén vacíos.
* - `login`: Envía las credenciales al servicio remoto y maneja la autenticación.
* - `handleChange`: Maneja los cambios en los campos del formulario.
*
* Componentes utilizados:
* - `Input`: Para capturar el usuario y la contraseña.
* - `Button`: Botón para iniciar el proceso de inicio de sesión.
* - `Container`: Contenedor estilizado que agrupa el formulario y la interfaz.
* - `Anchord`: Enlace para redirigir al registro de nuevos usuarios.
*
* Detalles adicionales:
* - Utiliza `react-toastify` para notificaciones de error en tiempo real.
* - Maneja el estado de carga y bloquea el formulario mientras se procesan las credenciales.
* - Cambia dinámicamente el título de la página a "Edemco - Inicio de Sesión".
* - Guarda los tokens de autenticación en cookies para usarlos en futuras solicitudes.
*/
const Login = () => {
  const [formValues, setFormValues] = useState({
    username: '',
    password: '',
    usernameHasError: false,
    passwordHasError: false
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Edemco - Inicio de Sesión'
  }, [])

  const isFormValid = () => {
    const { username, password } = formValues

    return username.length > 0 && password.length > 0
  }
  const login = async (e) => {
    e.preventDefault()

    if (!isFormValid()) {
      return setFormValues({
        ...formValues,
        usernameHasError: formValues.username.length === 0,
        passwordHasError: formValues.password.length === 0
      })
    }

    setLoading(true)

    const result = await PostLoginUser({
      username: formValues.username,
      password: formValues.password
    })

    const UNAUTHORIZED_STATUS_CODE = 401

    if (result.data?.statusCode === UNAUTHORIZED_STATUS_CODE) {
      toast.error(result.data?.message)
      return setLoading(false)
    }

    if (result.success) {
      const { accessToken, refreshToken } = result.data

      Cookies.set('accessToken', accessToken)
      Cookies.set('refreshToken', refreshToken)
      navigate('/principal')
    } else {
      toast.error('Ocurrió un error inesperado, intenta nuevamente')
    }

    setLoading(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormValues({
      ...formValues,
      [name]: value,
      [`${name}HasError`]: value.length === 0
    })
  }

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

        <form className="sesion" onSubmit={login}>
          {/* <div className="login-form">
            <div className="input-group">
              <label htmlFor="username">
                <i className="fa-regular fa-user"></i>
              </label>

              <Input
                className={`${formValues.usernameHasError && 'input--error'}`}
                errorMessage="El usuario es obligatorio"
                hasError={formValues.usernameHasError}
                id="username"
                name="username"
                onChange={handleChange}
                placeholder="Usuario"
                type="text"
                value={formValues.username}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">
                <i className="fa-solid fa-key"></i>
              </label>

              <Input
                className={`${formValues.passwordHasError && 'input--error'}`}
                errorMessage="La contraseña es obligatoria"
                hasError={formValues.passwordHasError}
                id="password"
                name="password"
                onChange={handleChange}
                placeholder="Contraseña"
                type="password"
                value={formValues.password}
              />
            </div>
          </div>

          <Button
            className="login--big-button boton--margin"
            disabled={loading}
            isLoading={loading}
            text={loading ? 'Iniciando sesión' : 'Iniciar Sesión'}
          /> */}
        </form>
        <Button
        onClick={()=>{window.location.href="https://192.168.56.1:8080/oauth2/authorization/azure"}}
        text={"Inicio sesion prueba microsoft"}
        />
        <div className="call-to-actions">
          <p>¿No tienes cuenta?</p>

          <Anchord
            className="boton--terciario"
            href="register"
            text="Regístrate ahora"
          />
        </div>
      </Container>
    </section>
  )
}

export default Login
