import { useEffect, useState } from "react";
import Modal from "../../layouts/Modal/Modal";
import Table from "../../organisms/Table/Table";
import PostGeneracionData from "../../../services/PostGeneracionData.service";
import ModifyGeneracion from "../../molecules/ModifyGeneracion/ModifyGeneracion";
import Button from "../../atoms/Button/Button";

const ModificarGeneracion = ({ onClose, listCustumers,SendToSiesa }) => {
  const [cargando, SetCargando] = useState(true);
  const [rows, SetRows] = useState();
  const [InfoGeneracion, setInfoGeneracion] = useState();
  const [showModal, SetShowModal] = useState(false);
  const ListaPlantas = [];
  const mes_anterior = new Date().getMonth();
  const anio = new Date().getFullYear();
  listCustumers.map(({ idPlanta, _nombrePlanta }) =>
    ListaPlantas.push({ id_planta: idPlanta, anio: anio, mes: mes_anterior })
  );
  useEffect(() => {
    SetCargando(true)
    const BuscarGeneracionActual = async () => {
      const response = await PostGeneracionData(ListaPlantas);
      SetRows(response?.data?.body);
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
    "Generacion Actual": "generacion_actual",
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
          {/* // <h1>hola</h1> */}
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
          <Button onClick={SendToSiesa} text={"Generar Factura/s"}/>
          {showModal ? (
            <Modal
              onClose={() => SetShowModal(false)}
              title={`Modificando Generacion Actual ${InfoGeneracion?.NombrePlanta}`}
            >
              <ModifyGeneracion
                idGeneracion={InfoGeneracion?.id_generacion}
                valorgeneracion={InfoGeneracion?.generacion_actual}
                close={()=> SetShowModal(false)}
              />
            </Modal>
          ) : null}
        </>
      )}
    </Modal>
  );
};

export default ModificarGeneracion;
