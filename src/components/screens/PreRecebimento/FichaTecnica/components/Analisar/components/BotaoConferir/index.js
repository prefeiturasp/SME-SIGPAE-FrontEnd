import { jsx as _jsx } from "react/jsx-runtime";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "../../../../../../../Shareable/Botao/constants";
import Botao from "../../../../../../../Shareable/Botao";
import "./styles.scss";
const BotaoConferir = ({ name, aprovaCollapse }) => {
  return _jsx("div", {
    className: "botao-conferir",
    children: _jsx("div", {
      className: "mt-4",
      children: _jsx(Botao, {
        texto: "Conferido",
        type: BUTTON_TYPE.BUTTON,
        style: BUTTON_STYLE.GREEN,
        className: "float-end ms-3",
        onClick: () => {
          aprovaCollapse(name);
        },
      }),
    }),
  });
};
export default BotaoConferir;
