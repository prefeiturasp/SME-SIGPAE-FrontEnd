import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  CADASTRO_DOCUMENTOS_RECEBIMENTO,
  DOCUMENTOS_RECEBIMENTO,
  PRE_RECEBIMENTO,
} from "src/configs/constants";
import Cadastrar from "src/components/screens/PreRecebimento/DocumentosRecebimento/components/Cadastrar";
const atual = {
  href: `/${PRE_RECEBIMENTO}/${CADASTRO_DOCUMENTOS_RECEBIMENTO}`,
  titulo: "Cadastrar Documentos de Recebimento",
};
const anteriores = [
  {
    href: `/`,
    titulo: "Pré-Recebimento",
  },
  {
    href: `/${PRE_RECEBIMENTO}/${DOCUMENTOS_RECEBIMENTO}`,
    titulo: "Documentos de Recebimento",
  },
];
export default () =>
  _jsxs(Page, {
    botaoVoltar: true,
    voltarPara: `/${PRE_RECEBIMENTO}/${DOCUMENTOS_RECEBIMENTO}`,
    titulo: atual.titulo,
    children: [
      _jsx(Breadcrumb, { home: HOME, atual: atual, anteriores: anteriores }),
      _jsx(Cadastrar, {}),
    ],
  });
