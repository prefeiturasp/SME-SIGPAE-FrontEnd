import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import "./styles.scss";
const BotaoAnexo = ({ textoBotao, urlAnexo, onClick }) => {
  return _jsx("a", {
    href: urlAnexo,
    target: "_blank",
    rel: "noreferrer",
    className: "link-botao-anexo",
    onClick: onClick,
    children: _jsxs("div", {
      className: "botao-anexo mb-2",
      children: [
        _jsx("i", { className: "fas fa-eye green me-2" }),
        textoBotao ?? "Visualizar Anexo",
      ],
    }),
  });
};
export default BotaoAnexo;
