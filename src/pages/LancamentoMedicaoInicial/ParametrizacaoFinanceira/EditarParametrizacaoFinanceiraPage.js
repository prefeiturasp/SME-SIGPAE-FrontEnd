import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import {
  EDITAR_PARAMETRIZACAO_FINANCEIRA,
  PARAMETRIZACAO_FINANCEIRA,
  MEDICAO_INICIAL,
} from "../../../configs/constants";
import Breadcrumb from "../../../components/Shareable/Breadcrumb";
import Page from "../../../components/Shareable/Page/Page";
import AdicionarParametrizacaoFinanceira from "src/components/screens/LancamentoInicial/ParametrizacaoFinanceira/AdicionarParametrizacaoFinanceira";
const atual = {
  href: `/${MEDICAO_INICIAL}/${PARAMETRIZACAO_FINANCEIRA}/${EDITAR_PARAMETRIZACAO_FINANCEIRA}`,
  titulo: "Editar Parametrização",
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
  {
    href: `/${MEDICAO_INICIAL}/${PARAMETRIZACAO_FINANCEIRA}/`,
    titulo: "Parametrização Financeira",
  },
];
export const EditarParametrizacaoFinanceiraPage = () =>
  _jsxs(Page, {
    titulo: "Editar Parametriza\u00E7\u00E3o Financeira",
    botaoVoltar: true,
    children: [
      _jsx(Breadcrumb, { home: "/", anteriores: anterior, atual: atual }),
      _jsx(AdicionarParametrizacaoFinanceira, {}),
    ],
  });
