import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  DETALHAR_CODAE_DOCUMENTO_RECEBIMENTO,
  PAINEL_DOCUMENTOS_RECEBIMENTO,
  PRE_RECEBIMENTO,
} from "src/configs/constants";
import DetalharCodae from "src/components/screens/PreRecebimento/DocumentosRecebimento/components/DetalharCodae";
const atual = {
  href: `/${PRE_RECEBIMENTO}/${DETALHAR_CODAE_DOCUMENTO_RECEBIMENTO}`,
  titulo: "Detalhar Documentos de Recebimento",
};
const anteriores = [
  {
    href: `/`,
    titulo: "Pré-Recebimento",
  },
  {
    href: `/${PRE_RECEBIMENTO}/${PAINEL_DOCUMENTOS_RECEBIMENTO}`,
    titulo: "Documentos de Recebimento",
  },
];
export default () =>
  _jsxs(Page, {
    botaoVoltar: true,
    voltarPara: anteriores[anteriores.length - 1].href,
    titulo: atual.titulo,
    children: [
      _jsx(Breadcrumb, { home: HOME, atual: atual, anteriores: anteriores }),
      _jsx(DetalharCodae, {}),
    ],
  });
