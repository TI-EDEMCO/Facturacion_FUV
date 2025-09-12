import { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import Input from "../../atoms/Input/Input";
import PostModifyGenerationData from "../../../services/PostModifyGenerationData.service";
import "./ModifyGeneracion.css";

/*
 * Dropdown Component
 *
 * Props:
 * @param {number|string} idPlanta - Identificador de la planta para obtener remitentes relacionados.
 *
 * Función:
 * Renderiza un dropdown interactivo para administrar remitentes asociados a una planta.
 *
 * - Muestra un listado de remitentes como "chips" con opciones para agregar o eliminar.
 * - Controla la visibilidad de los chips en función del tamaño disponible del contenedor.
 * - Incluye un formulario para agregar nuevos remitentes con validación básica.
 * - Ofrece una interfaz para eliminar remitentes existentes.
 *
 * Detalles clave:
 * - Usa `useEffect` para manejar las siguientes lógicas:
 *   - Obtención de remitentes al cargar el componente.
 *   - Actualización dinámica de los chips visibles según el tamaño del contenedor.
 *   - Manejo de clics externos para cerrar el dropdown.
 * - Control de errores con validación para campos vacíos y duplicados.
 * - Uso de referencias (`useRef`) para manejar clics externos y dimensiones del contenedor.
 *
 * Notas adicionales:
 * - El componente utiliza servicios `GetRemittersByIdPlanta`, `PostRemitter` y `DeleteRemitter` para interactuar con datos remotos.
 * - Mensajes de error y éxito son gestionados con la librería `react-toastify`.
 */
const ModifyGeneracion = ({ idGeneracion, valorgeneracion }) => {
  const initialFormValues = {
    generacionActual: parseFloat(valorgeneracion.replace(",", ".")),
    generacionActualHasError: false,
    errorMessage: "",
  };
  const [formValues, setFormValues] = useState(initialFormValues);
  const [isOpen, setIsOpen] = useState(true);
  const dropdownChipsRef = useRef(null);
  const dropdownRef = useRef(null);

  // ? Lógica para cerrar el dropdown cuando se hace click por fuera */
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      dropdownChipsRef.current &&
      !dropdownChipsRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };
  // ? Lógica para cerrar el dropdown cuando se hace click por fuera */

  const addRemitter = async (e) => {
    e.preventDefault();
    if (!formValues.generacionActual) {
      setFormValues({
        ...formValues,
        generacionActualHasError: true,
        errorMessage: "La Generacion no puede estar vacía",
      });
      return;
    }

    const NewGeneracion = {
      valorGeneracion: parseFloat(formValues.generacionActual),
      idGeneracion,
    };
    console.log(NewGeneracion);

    await PostModifyGenerationData(NewGeneracion)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error("Error fetching customers:", error);
        toast.error("Error al crear el remitente");
      });
  };

  const handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;
    const newValues = {
      ...formValues,
      [name]: value,
      generacionActualHasError: false,
      errorMessage: "",
    };

    setFormValues(newValues);
  };

  return (
    <article className="dropdown">
      <form onSubmit={addRemitter}>
        <Input
          className={`${formValues.generacionActualHasError && "input--error"}`}
          errorMessage={formValues.errorMessage}
          hasError={formValues.generacionActualHasError}
          id="generacionActual"
          name="generacionActual"
          onChange={handleChange}
          allowDecimals
          placeholder="Modifica Generacion Actual"
          value={formValues.generacionActual}
          type="number"
        />
      </form>
    </article>
  );
};

export default ModifyGeneracion;
