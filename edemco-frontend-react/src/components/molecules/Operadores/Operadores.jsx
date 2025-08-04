import { getMonthName } from '../../../utils/Historicos.util'
import Input from '../../atoms/Input/Input'
import Title from '../../atoms/Title/Title'
import './Operadores.css'

/*
* Operadores Component
*
* Props:
* @param {number} actualRate - Tarifa actual del operador.
* @param {string} errorMessage - Mensaje de error que se muestra si `hasError` es true.
* @param {boolean} hasError - Indica si hay un error en el input.
* @param {string} imgLogo - URL de la imagen/logo del operador.
* @param {string|number} inputValue - Valor actual del input de tarifa.
* @param {number} month - Número del mes utilizado para mostrar el nombre del mes correspondiente.
* @param {string} nombreOperador - Nombre del operador mostrado en el título.
* @param {function} onChange - Función que se ejecuta al cambiar el valor del input.
*
* Función:
* Renderiza una tarjeta que muestra información sobre un operador.
* - Incluye un título, un logo, la tarifa actual (formateada) y un campo para ingresar una nueva tarifa.
* - Si se proporciona un mes, muestra "Tarifa de {mes}" con el nombre del mes traducido por `getMonthName`.
* - Valida y formatea la tarifa actual con `formatNumber`.
* - Maneja estilos de error para el campo de entrada en caso de que `hasError` sea true.
*
* Detalles adicionales:
* - La clase CSS `operador` estiliza el contenedor principal.
* - El campo de entrada utiliza el componente reutilizable `Input`.
* - La tarifa actual se formatea al estilo de moneda con separadores de miles y decimales.
*/
const Operadores = ({
  actualRate,
  errorMessage,
  hasError,
  imgLogo,
  inputValue,
  month,
  nombreOperador,
  onChange
}) => {
  const formatNumber = (number) => {
    const parts = number.toFixed(2).split('.')
    const integerPart = parts[0]
    const decimalPart = parts[1]

    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      '.'
    )

    return formattedIntegerPart + ',' + decimalPart
  }

  return (
    <article className="operador">
      <Title text={nombreOperador} />

      <img
        alt={`Logo de ${nombreOperador}`}
        className="operador__image"
        height={128}
        src={imgLogo}
        width={128}
      />

      <p className="tarifa">
        {actualRate ? (
          <>
            Tarifa {month ? `de ${getMonthName(month)}:` : ''}{' '}
            <b className="actual-rate">${formatNumber(actualRate)}</b>
          </>
        ) : (
          'No hay tarifa anterior'
        )}
      </p>

      <Input
        className={hasError ? 'input--error' : ''}
        errorMessage={errorMessage}
        hasError={hasError}
        id="tarifa"
        maxLength={10}
        name="tarifa"
        onChange={onChange}
        placeholder="Ingrese la tarifa"
        type="number"
        value={inputValue}
      />
    </article>
  )
}

export default Operadores
