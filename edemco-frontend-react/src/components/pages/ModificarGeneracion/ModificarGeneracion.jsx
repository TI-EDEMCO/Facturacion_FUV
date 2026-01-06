import { useEffect, useState } from "react";
import Modal from "../../layouts/Modal/Modal";
import Table from "../../organisms/Table/Table";
import PostGeneracionData from "../../../services/PostGeneracionData.service";
import ModifyGeneracion from "../../molecules/ModifyGeneracion/ModifyGeneracion";
import Button from "../../atoms/Button/Button";

/*
* ModificarGeneracion Component
*
* Props:
* @param {void} onClose - función para cerrar el Modal donde se visualiza la tabla
* @param {Object} listCustumers - objeto con las plantas seleccionadas
* @param {void} SendToSiesa - función qyue dispara el proceso de generar facturas
*
* Funcion:
* Renderiza una tabla con la información de calculos de las plantas seleccionadas, con opcion 
*   demodificar la generacin actual para re-hacer los calculos.
* - Visualiza los calculos realizados de las plantas seleccionadas.
* - Dispara el proceso para realizar las facturas en SIESA.
*
* Estado interno:
* - @param {boolean} cargando - indica si esta actualizando la informacion de los calculos.
* - @param {Object} rows - objeto que almacena la información de las plantas y sus calculos.
* - @param {Object} InfoGeneracion - objeto que almacena la informacion de una planata especifica para modificar los calculos (para tomar el id del registro).
* - @param {boolean} showModal - indica si se debe visualizar o no modal donde se modifica el valor de la generacion.
* - @param {Array<objects>} ListaPlantas - array que almacena el id de plantas cuyos calculos se van a consultar.
* - @param {Number} mes_anterior - numero del mes anterior para consultar los calculos.
* - @param {Number} anio - numero del año actual para consultar los calculos.
*
* Métodos:
* - `BuscarGeneracionActual`: funcion que realiza lña consulta de los calculos de las plantas.
*
* Componentes utilizados:
* - `Modal`: Modal para visualizar o no el contenido de la tabla o input para la modificación.
* - `Table`: Tabla para visualizar los calculos de las plantas.
* - `ModifyGeneración`: Formulario para al modificacion del valor de la generación.
* - `Button`: Boton para disparar el registro de las facturas en SIESA.
*/

const ModificarGeneracion = ({ onClose, listCustumers, SendToSiesa }) => {
  const [cargando, SetCargando] = useState(true);
  const [loading, setLoading] = useState(false)
  const [rows, SetRows] = useState();
  const [InfoGeneracion, setInfoGeneracion] = useState();
  const [showModal, SetShowModal] = useState(false);
  const ListaPlantas = [];
  const mes_actual = new Date().getMonth()+1;
  const mes_anterior = mes_actual === 1 ? 12 : mes_actual - 1;
  const anio = mes_anterior === 12 ? new Date().getFullYear() - 1 : new Date().getFullYear();
  listCustumers.map(({ idPlanta, _nombrePlanta }) =>
    ListaPlantas.push({ id_planta: idPlanta, anio: anio, mes: mes_anterior })
  );
  useEffect(() => {
    SetCargando(true);
    const BuscarGeneracionActual = async () => {
      const response = await PostGeneracionData(ListaPlantas);
      //Se transfoma el formato de los datos para mejor lectura 
      SetRows(response?.data?.body.map((data) => ({
        ...data,
        ahorro_actual
          :
          parseFloat(data?.ahorro_actual.replace(",", ".")).toLocaleString("es-CO"),
        ahorro_acumulado
          :
          parseFloat(data?.ahorro_acumulado.replace(",", ".")).toLocaleString("es-CO"),
        ahorro_codos_actual
          :
          parseFloat(data?.ahorro_codos_actual.replace(",", ".")).toLocaleString("es-CO"),
        ahorro_codos_acumulado
          :
          parseFloat(data?.ahorro_codos_acumulado.replace(",", ".")).toLocaleString("es-CO"),
        diferencia_tarifa
          :
          parseFloat(data?.diferencia_tarifa.replace(",", ".")).toLocaleString("es-CO"),
        generacion_actual_formato
          :
          parseFloat(data?.generacion_actual.replace(",", ".")).toLocaleString("es-CO"),
        generacion_acumulado
          :
          parseFloat(data?.generacion_acumulado.replace(",", ".")).toLocaleString("es-CO"),
        valor_total
          :
          parseFloat(data?.valor_total.replace(",", ".")).toLocaleString("es-CO"),
        valor_unidad
          :
          parseFloat(data?.valor_unidad.replace(",", ".")).toLocaleString("es-CO")
      })));
      SetCargando(false);
    };
    BuscarGeneracionActual();
  }, [showModal]);

  const columns = [
    "Planta",
    "Generacion Actual",
    "Generacion Acomulado",
    // "Valor Unidad",
    "Valor Total",
    "Ahorro Actual",
    "Ahorro Acumulado",
    "Ahorro CO2 Actual",
    "Ahorro CO2 Acumulado",
  ];
  const columnsKeyMap = {
    Planta: "NombrePlanta",
    "Generacion Actual": "generacion_actual_formato",
    "Generacion Acomulado": "generacion_acumulado",
    // "Valor Unidad": "valor_unidad",
    "Valor Total": "valor_total",
    "Ahorro Actual": "ahorro_actual",
    "Ahorro Acumulado": "ahorro_acumulado",
    "Ahorro CO2 Actual": "ahorro_codos_actual",
    "Ahorro CO2 Acumulado": "ahorro_codos_acumulado",
  };
  return (
    <Modal onClose={onClose} title={"Verificacion Calculos"}>
      {cargando ? (
        <span className="loader"></span>
      ) : (
        <>
          <Table
            className="tabla--max-width"
            columnKeyMap={columnsKeyMap}
            columns={columns}
            onEditRow={(rowData) => {
              setInfoGeneracion(rowData);
              SetShowModal(true);
            }}
            rows={rows}
            rowsPerPage={20}
            showPagination={false}
          />
          <Button onClick={() => { setLoading(true), SendToSiesa() }} text={"Generar Factura/s"} isLoading={loading} disabled={loading} />
          {showModal ? (
            <Modal
              onClose={() => SetShowModal(false)}
              title={`Modificando Generacion Actual ${InfoGeneracion?.NombrePlanta}`}
            >
              <ModifyGeneracion
                idGeneracion={InfoGeneracion?.id_generacion}
                valorgeneracion={InfoGeneracion?.generacion_actual}
                close={() => SetShowModal(false)}
              />
            </Modal>
          ) : null}
        </>
      )}
    </Modal>
  );
};

export default ModificarGeneracion;
