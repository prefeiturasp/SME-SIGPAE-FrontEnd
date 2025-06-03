import { jsx as _jsx } from "react/jsx-runtime";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "../../../../../../../Shareable/Botao/constants";
import Botao from "../../../../../../../Shareable/Botao";
import "./styles.scss";
const BotaoCiente = ({ name, aprovaCollapse, desabilitar = false }) => {
  return _jsx("div", {
    className: "botao-ciente",
    children: _jsx("div", {
      className: "mt-4",
      children: _jsx(Botao, {
        texto: "Ciente",
        type: BUTTON_TYPE.BUTTON,
        style: BUTTON_STYLE.GREEN,
        className: "float-end ms-3",
        onClick: () => {
          aprovaCollapse(name);
        },
        disabled: desabilitar,
      }),
    }),
  });
};
export default BotaoCiente;
