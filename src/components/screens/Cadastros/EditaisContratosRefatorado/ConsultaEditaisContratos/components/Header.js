import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Field } from "react-final-form";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import InputText from "src/components/Shareable/Input/InputText";
export const Header = ({
  getEditaisContratosAsync,
  setLoading,
  page,
  setPage,
}) => {
  const PARAMS = { page };
  let typingTimeout = null;
  const buscaEditalContrato = (value) => {
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(async () => {
      setLoading(true);
      await getEditaisContratosAsync({
        busca: value,
        ...PARAMS,
      });
      setLoading(false);
      setPage(1);
    }, 1000);
  };
  return _jsxs("div", {
    className: `row p-2 pt-3`,
    children: [
      _jsx("div", {
        className: "col-3 title",
        children: "Tipos de contrata\u00E7\u00E3o",
      }),
      _jsx("div", { className: "col-3 title", children: "N\u00BA do edital" }),
      _jsx("div", {
        className: "col-3 title",
        children: "N\u00BA do processo administrativo",
      }),
      _jsx("div", {
        className: "col-3 title",
        children: _jsx(Field, {
          component: InputText,
          name: "buscar",
          placeholder: "Pesquisar",
          className: `${BUTTON_STYLE.GRAY}`,
          icone: `${BUTTON_ICON.SEARCH} fa-lg`,
          inputOnChange: (e) => {
            const value = e.target.value;
            buscaEditalContrato(value);
          },
        }),
      }),
    ],
  });
};
