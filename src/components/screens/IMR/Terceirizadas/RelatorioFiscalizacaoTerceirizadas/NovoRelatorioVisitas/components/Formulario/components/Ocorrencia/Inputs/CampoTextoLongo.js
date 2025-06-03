import { jsx as _jsx } from "react/jsx-runtime";
import { Field } from "react-final-form";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import { required } from "src/helpers/fieldValidators";
export const CampoTextoLongo = ({ ...props }) => {
  const { titulo, name, somenteLeitura } = props;
  return _jsx(Field, {
    component: TextArea,
    label: titulo,
    name: name,
    height: "100",
    required: true,
    validate: required,
    disabled: somenteLeitura,
  });
};
