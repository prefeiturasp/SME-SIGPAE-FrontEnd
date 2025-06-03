import { jsx as _jsx } from "react/jsx-runtime";
import { Field } from "react-final-form";
import { InputText } from "src/components/Shareable/Input/InputText";
import { required } from "src/helpers/fieldValidators";
export const CampodeTextoSimples = ({ ...props }) => {
  const { titulo, name, somenteLeitura } = props;
  return _jsx(Field, {
    component: InputText,
    label: titulo,
    name: name,
    required: true,
    validate: required,
    disabled: somenteLeitura,
  });
};
