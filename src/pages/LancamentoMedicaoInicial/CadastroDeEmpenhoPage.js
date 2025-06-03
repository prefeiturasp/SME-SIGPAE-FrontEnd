import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  EMPENHOS,
  CADASTRO_DE_EMPENHO,
  MEDICAO_INICIAL,
} from "src/configs/constants";
import { CadastroDeEmpenho } from "src/components/screens/LancamentoInicial/CadastroDeEmpenho";
const atual = {
  href: `/${MEDICAO_INICIAL}/${EMPENHOS}/${CADASTRO_DE_EMPENHO}/`,
  titulo: "Cadastrar Empenho",
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
    href: `/${MEDICAO_INICIAL}/${EMPENHOS}/`,
    titulo: "Empenhos",
  },
];
export const CadastroDeEmpenhoPage = () =>
  _jsxs(Page, {
    titulo: atual.titulo,
    botaoVoltar: true,
    children: [
      _jsx(Breadcrumb, { home: "/", anteriores: anterior, atual: atual }),
      _jsx(CadastroDeEmpenho, {}),
    ],
  });
