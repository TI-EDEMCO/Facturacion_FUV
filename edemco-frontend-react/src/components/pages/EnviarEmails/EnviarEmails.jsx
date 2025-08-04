import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "../../atoms/Button/Button";
import Dropdown from "../../molecules/Dropdown/Dropdown";
import GetDataInvoices from "../../../services/GetDataInvoices.service";
import Modal from "../../layouts/Modal/Modal";
import GetAccessTokenGraph from "../../../services/GetAccessTokenGraph";
import PostTemplate from "../../../services/PostTemplate.service";
import Table from "../../organisms/Table/Table";
import Title from "../../atoms/Title/Title";
import "./EnviarEmails.css";

/*
 * EnviarEmails Component
 *
 * Función:
 * Renderiza una página para editar remitentes y generar plantillas de correos electrónicos basadas en datos de facturas.
 * - Muestra una tabla con facturas obtenidas desde un servicio remoto.
 * - Permite editar remitentes específicos mediante un modal.
 * - Proporciona un botón para generar plantillas y enviar correos.
 *
 * Estado interno:
 * @param {boolean} showModal - Controla la visibilidad del modal.
 * @param {Object} formData - Almacena los datos de la fila seleccionada para editar.
 * @param {Array<Object>} rows - Datos formateados para las filas de la tabla.
 * @param {boolean} loading - Indica si se está generando la plantilla.
 * @param {boolean} pageLoading - Indica si la página está cargando los datos.
 * @param {Array<Object>} invoices - Datos originales obtenidos desde el servicio de facturas.
 *
 * Métodos:
 * - `fetchFacturas`: Obtiene y formatea las facturas desde el servicio remoto.
 * - `generateTemplate`: Genera plantillas y envía correos electrónicos.
 * - `editRow`: Abre el modal para editar remitentes de una factura específica.
 * - `handleClose`: Cierra el modal.
 *
 * Props de componentes utilizados:
 * - `Table`: Muestra los datos de las facturas con soporte para edición.
 * - `Dropdown`: Componente para editar remitentes específicos.
 * - `Button`: Botón para generar plantillas y enviar correos.
 * - `Modal`: Modal utilizado para gestionar los remitentes.
 *
 * Detalles adicionales:
 * - Se utiliza `react-toastify` para notificaciones de éxito o error.
 * - Los nombres de las columnas de la tabla son mapeados con `columnKeyMap`.
 * - Se filtran ciertas columnas para personalizar la visualización en la tabla.
 */
const EnviarEmails = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    document.title = "Edemco - Enviar Emails";
    fetchFacturas();
  }, []);

  const fetchFacturas = async () => {
    const result = await GetDataInvoices();

    if (result.success) {
      const formattedData = result.data.map((row) => ({
        ...row,
        cantidad: `${row.cantidad} kWh`,
      }));

      setInvoices(result.data);
      setRows(formattedData);
    } else {
      console.error("Failed to fetch invoices:", result.error);
    }

    setPageLoading(false);
  };

  const columns = [
    "Código Planta",
    "Nombre Planta",
    "Fecha Inicio",
    "Fecha Fin",
    "Días consumo",
    "Consumo Actual",
    "Consumo Acumulado",
    "Concepto Facturado",
    "Generacion Mensual",
    "Costo unidad",
    "Valor Total",
    "Fecha de Pago",
    "Factura Mes",
    "Factura Nro",
    "Contrato Nro",
    "Ahorro Actual",
    "Ahorro Acumulado",
    "Periodo Actual",
    "Periodo Acumulado",
    "CUFE",
    "Fecha CUFE",
  ];

  const columnKeyMap = {
    "Ahorro Actual": "ahorro_actual",
    "Ahorro Acumulado": "ahorro_acumulado",
    "Código Planta": "cod_planta",
    "Concepto Facturado": "concepto_facturado",
    "Consumo Actual": "consumo_actual",
    "Consumo Acumulado": "consumo_acumulado",
    "Contrato Nro": "contrato_no",
    "Costo unidad": "costo_unidad",
    CUFE: "cufe",
    "Días consumo": "dias_consumo",
    "Factura Mes": "factura_mes",
    "Factura Nro": "numero_factura",
    "Fecha CUFE": "fecha_cufe",
    "Fecha de Pago": "fecha_pago",
    "Fecha Fin": "fecha_fin",
    "Fecha Inicio": "fecha_inicio",
    "Generacion Mensual": "cantidad",
    "Nombre Planta": "nombre_planta",
    "Periodo Actual": "periodo_actual",
    "Periodo Acumulado": "periodo_acumulado",
    "Valor Total": "valor_total",
  };

  const filteredColumns = columns.filter(
    (column) =>
      ![
        "Consumo Actual",
        "Consumo Acumulado",
        "Concepto Facturado",
        "Costo unidad",
        "Factura Mes",
        "Ahorro Actual",
        "Ahorro Acumulado",
        "Periodo Actual",
        "Periodo Acumulado",
        "CUFE",
        "Fecha CUFE",
      ].includes(column)
  );

  const generateTemplate = async () => {
    if (rows.length === 0) return;
    await GetAccessTokenGraph()
      .catch((error) => {
        console.error("Error al obtener token", error);
      })
      .then(async(authToken) => {
        setLoading(true)
        const response = await PostTemplate(invoices,authToken?.data?.authorization)
        if (!response.success) {
          setLoading(false)
          return toast.error('Ocurrió un error al generar las plantillas')
        }
        setLoading(false)
        toast.success('Plantillas generadas correctamente')
      });
  };

  const editRow = (rowData) => {
    setFormData(rowData);

    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <Title text="Editar Remitentes y Enviar Emails" />

      {!pageLoading && (
        <Table
          className="tabla--max-width"
          columnKeyMap={columnKeyMap}
          columns={filteredColumns}
          onEditRow={editRow}
          rows={rows}
          rowsPerPage={20}
          showPagination={false}
        />
      )}

      {pageLoading && (
        <p className="enviar-email__loading">
          Cargando
          <i className="loader"></i>
        </p>
      )}

      {!pageLoading && rows.length > 0 && (
        <>
          <p className="editar-diseno__tooltip">
            <i className="fa-solid fa-circle-info"></i>
            Haz click en cada fila para editar los remitentes
          </p>
          <Button
            className="boton--margin boton--margin-block boton--relative"
            disabled={loading}
            isLoading={loading}
            onClick={generateTemplate}
            text={loading ? "Generando" : "Generar plantillas y enviar correos"}
          />
        </>
      )}

      {!pageLoading && rows.length === 0 && (
        <h3 className="editar-diseno__no-invoices">
          No hay facturas para mostrar
        </h3>
      )}

      {showModal && (
        <Modal
          title={`Remitentes de ${formData.nombre_planta}`}
          onClose={handleClose}
        >
          <Dropdown idPlanta={formData.cod_planta} />
        </Modal>
      )}
    </>
  );
};

export default EnviarEmails;
