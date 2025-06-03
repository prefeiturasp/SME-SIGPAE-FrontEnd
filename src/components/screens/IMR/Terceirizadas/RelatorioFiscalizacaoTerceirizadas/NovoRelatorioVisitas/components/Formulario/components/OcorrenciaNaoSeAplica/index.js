import { jsx as _jsx } from "react/jsx-runtime";
import { Field } from "react-final-form";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
export const OcorrenciaNaoSeAplica = ({ ...props }) => {
  const { tipoOcorrencia, somenteLeitura } = props;
  return _jsx("tr", {
    children: _jsx("td", {
      className: "p-3",
      colSpan: 2,
      children: _jsx(Field, {
        component: TextArea,
        label: "Descri\u00E7\u00E3o",
        name: `descricao_${tipoOcorrencia.uuid}`,
        placeholder: "Descreva as observa\u00E7\u00F5es",
        height: "100",
        disabled: somenteLeitura,
      }),
    }),
  });
};
