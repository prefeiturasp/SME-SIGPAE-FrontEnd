import { jsx as _jsx } from "react/jsx-runtime";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
export const AdicionarResposta = ({ ...props }) => {
  const { push, nameFieldArray } = props;
  return _jsx(Botao, {
    className: "col-3 mb-3",
    texto: "Adicionar +",
    onClick: () => push(nameFieldArray),
    style: BUTTON_STYLE.GREEN_OUTLINE,
    type: BUTTON_TYPE.BUTTON,
  });
};
