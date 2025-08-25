import { useState } from 'react'
import './Table.css'

/*
* Table Component
*
* Props:
* @param {string} [className=''] - Clase CSS adicional para personalizar estilos de la tabla.
* @param {Object} columnKeyMap - Mapa de columnas que asocia las etiquetas de columnas con claves del objeto `rows`.
* @param {Array<string>} columns - Lista de nombres de las columnas a mostrar en la tabla.
* @param {Array<string>} [linkColumns=[]] - Lista de columnas cuyos valores se renderizan como enlaces.
* @param {function} [onEditRow] - Función opcional que se ejecuta al hacer clic en una fila.
* @param {Array<Object>} rows - Lista de objetos que representan las filas de datos a mostrar.
* @param {number} [rowsPerPage=10] - Número de filas por página en la tabla.
* @param {boolean} [showPagination=true] - Indica si se debe mostrar la paginación.
*
* Función:
* Renderiza una tabla con soporte para:
* - Paginación configurable.
* - Enlaces en columnas especificadas.
* - Edición de filas mediante la función `onEditRow`.
* - Manejo dinámico de filas y columnas con claves mapeadas a través de `columnKeyMap`.
*
* Detalles adicionales:
* - La clase CSS `tabla-contenedor` se aplica al contenedor principal de la tabla.
* - La clase `tabla-cliente` estiliza el elemento `<table>`.
* - La paginación incluye botones para navegar entre páginas y muestra un rango de filas visibles.
* - Columnas marcadas como enlaces utilizan el elemento `<a>` para mostrar valores como hipervínculos.
*/
const Table = ({
  className = '',
  columnKeyMap,
  columns,
  linkColumns = [],
  onEditRow,
  CheckBox,
  rows,
  rowsPerPage = 10,
  showPagination = true
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(rows.length / rowsPerPage)

  const isLinkColumn = (column) => linkColumns.includes(column)

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
  }

  const startRow = (currentPage - 1) * rowsPerPage
  const currentRows = rows.slice(startRow, startRow + rowsPerPage)

  return (
    <>
      {rows.length > 0 && (
        <>
          <div className={`tabla-contenedor ${className && className}`}>
            <table className="tabla-cliente" id="tablaCliente">
              <thead>
                <tr>
                  {columns.map((column, i) => {
                    return (
                      <th key={i} scope="col">
                        {column}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {currentRows.map((row, rowIndex) => (
                  <tr
                    id={onEditRow && 'edit-row'}
                    key={row.CUFE || rowIndex}
                  >
                    {columns.map((column, colIndex) => {
                      const key =
                        columnKeyMap[column]?.key ||
                        columnKeyMap[column] ||
                        column.toLowerCase()
                      const value = row[key]
                      return (
                        <td
                          key={colIndex}
                          title={onEditRow && `${column}: ${value}`}
                          onClick={column=="Seleccionar"?null:() => onEditRow(row)}
                        >
                          {isLinkColumn(column) ? (
                            <a href={value} rel="noreferrer" target="_blank">
                              Link
                            </a>
                          ):column=="Seleccionar"?(
                            <input type="checkbox" onClick={()=>CheckBox(row)}></input>
                          ) : (
                            value
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showPagination && (
            <nav
              className={`tabla-cliente__paginacion ${className && className}`}
              aria-label="Table navigation"
            >
              <p>
                Mostrando {startRow + 1}-
                {Math.min(startRow + rowsPerPage, rows.length)} de {rows.length}
              </p>

              <div className="paginacion__botones">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  <i className="fa-solid fa-angle-left"></i>
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={handleNextPage}
                >
                  <i className="fa-solid fa-angle-right"></i>
                </button>
              </div>
            </nav>
          )}
        </>
      )}
    </>
  )
}

export default Table
