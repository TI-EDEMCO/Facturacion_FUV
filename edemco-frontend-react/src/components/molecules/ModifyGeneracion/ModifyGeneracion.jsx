import { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import Input from "../../atoms/Input/Input";
import PostModifyGenerationData from "../../../services/PostModifyGenerationData.service";
import "./ModifyGeneracion.css";
import Button from "../../atoms/Button/Button";

/*
 * ModifyGeneracion Component
 *
 * Props:
 * @param {number|string} idGeneracion - Identificador del registro en la tabla de generación.
 *  @param {string} valorgeneracion - Valor de la generación actual de la planta.
 *
 * Función:
 * Renderiza un dropdown interactivo para modificar el valor de la generación.
 *
 * - Incluye un formulario para modificar el valor de la generación.
 *
 * Notas adicionales:
 * - El componente utiliza servicios `PostModifyGenerationData` para interactuar con datos remotos.
 * - Mensajes de error y éxito son gestionados con la librería `react-toastify`.
 */
const ModifyGeneracion = ({ idGeneracion, valorgeneracion, close }) => {
  const initialFormValues = {
    generacionActual: parseFloat(valorgeneracion.replace(",", ".")),
    generacionActualHasError: false,
    errorMessage: "",
  };
  const [formValues, setFormValues] = useState(initialFormValues);
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false)
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
    setLoading(true)
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

    await PostModifyGenerationData(NewGeneracion)
      .then((result) => {
        toast.success("Generacion modificada correctamente, verifique los calculos")
        close()
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
    <>
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
      <Button text={"Actualizar"} onClick={addRemitter} isLoading={loading} disabled={loading} />
    </>
  );
};

export default ModifyGeneracion;
