import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { FICHA_TECNICA, PRE_RECEBIMENTO } from "src/configs/constants";
import FichaTecnica from "src/components/screens/PreRecebimento/FichaTecnica";
const atual = {
  href: `/${PRE_RECEBIMENTO}/${FICHA_TECNICA}`,
  titulo: "Ficha Técnica do Produto",
};
const anteriores = [
  {
    href: `/`,
    titulo: "Pré-Recebimento",
  },
];
export default () =>
  _jsxs(Page, {
    botaoVoltar: true,
    voltarPara: "/",
    titulo: atual.titulo,
    children: [
      _jsx(Breadcrumb, { home: HOME, atual: atual, anteriores: anteriores }),
      _jsx(FichaTecnica, {}),
    ],
  });
