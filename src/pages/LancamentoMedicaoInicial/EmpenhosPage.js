import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import Page from "../../components/Shareable/Page/Page";
import { EMPENHOS, MEDICAO_INICIAL } from "../../configs/constants";
import { Empenhos } from "src/components/screens/LancamentoInicial/Empenhos";
const atual = {
  href: `/${MEDICAO_INICIAL}/${EMPENHOS}/`,
  titulo: "Empenhos",
};
const anterior = [
  {
    href: "#",
    titulo: "Medição Inicial",
  },
  {
    href: "#",
    titulo: "Cadastros",
  },
];
export const EmpenhosPage = () =>
  _jsxs(Page, {
    titulo: atual.titulo,
    botaoVoltar: true,
    voltarPara: "/",
    children: [
      _jsx(Breadcrumb, { home: "/", anteriores: anterior, atual: atual }),
      _jsx(Empenhos, {}),
    ],
  });
