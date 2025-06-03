import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { PRE_RECEBIMENTO, PAINEL_FICHAS_TECNICAS } from "src/configs/constants";
import PainelFichasTecnicas from "src/components/screens/PreRecebimento/PainelFichasTecnicas";
const atual = {
  href: `/${PRE_RECEBIMENTO}/${PAINEL_FICHAS_TECNICAS}`,
  titulo: "Fichas Técnicas",
};
const anteriores = [
  {
    href: `/`,
    titulo: "Pré-Recebimento",
  },
];
export const PainelFichasTecnicasPage = () =>
  _jsxs(Page, {
    botaoVoltar: true,
    voltarPara: "/",
    titulo: atual.titulo,
    children: [
      _jsx(Breadcrumb, { home: HOME, atual: atual, anteriores: anteriores }),
      _jsx(PainelFichasTecnicas, {}),
    ],
  });
