import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import {
  PARAMETRIZACAO_FINANCEIRA,
  MEDICAO_INICIAL,
} from "../../../configs/constants";
import Breadcrumb from "../../../components/Shareable/Breadcrumb";
import Page from "../../../components/Shareable/Page/Page";
import ParametrizacaoFinanceira from "src/components/screens/LancamentoInicial/ParametrizacaoFinanceira/ParametrizacaoFinanceira";
const atual = {
  href: `/${MEDICAO_INICIAL}/${PARAMETRIZACAO_FINANCEIRA}/`,
  titulo: "Parametrização Financeira",
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
export const ParametrizacaoFinanceiraPage = () =>
  _jsxs(Page, {
    titulo: atual.titulo,
    botaoVoltar: true,
    voltarPara: "/",
    children: [
      _jsx(Breadcrumb, { home: "/", anteriores: anterior, atual: atual }),
      _jsx(ParametrizacaoFinanceira, {}),
    ],
  });
