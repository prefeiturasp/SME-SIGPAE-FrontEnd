import { jsx as _jsx } from "react/jsx-runtime";
import { Field } from "react-final-form";
import { InputText } from "src/components/Shareable/Input/InputText";
import { required } from "src/helpers/fieldValidators";
export const CampoNumerico = ({ ...props }) => {
  const { titulo, name, somenteLeitura } = props;
  return _jsx(Field, {
    component: InputText,
    label: titulo,
    name: name,
    type: "number",
    min: 0,
    required: true,
    validate: required,
    disabled: somenteLeitura,
  });
};
