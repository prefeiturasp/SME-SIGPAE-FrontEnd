import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import Page from "../../components/Shareable/Page/Page";
import {
  CLAUSULAS_PARA_DESCONTOS,
  MEDICAO_INICIAL,
} from "../../configs/constants";
import { ClausulasParaDescontos } from "src/components/screens/LancamentoInicial/ClausulasParaDescontos";
const atual = {
  href: `/${MEDICAO_INICIAL}/${CLAUSULAS_PARA_DESCONTOS}/`,
  titulo: "Cláusulas para Descontos",
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
export const ClausulasParaDescontosPage = () =>
  _jsxs(Page, {
    titulo: atual.titulo,
    botaoVoltar: true,
    voltarPara: "/",
    children: [
      _jsx(Breadcrumb, { home: "/", anteriores: anterior, atual: atual }),
      _jsx(ClausulasParaDescontos, {}),
    ],
  });
