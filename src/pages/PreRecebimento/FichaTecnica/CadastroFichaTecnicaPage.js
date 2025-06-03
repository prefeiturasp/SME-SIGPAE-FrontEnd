import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  CADASTRAR_FICHA_TECNICA,
  FICHA_TECNICA,
  PRE_RECEBIMENTO,
} from "src/configs/constants";
import Cadastrar from "src/components/screens/PreRecebimento/FichaTecnica/components/Cadastrar";
const atual = {
  href: `/${PRE_RECEBIMENTO}/${CADASTRAR_FICHA_TECNICA}`,
  titulo: "Cadastrar Ficha Técnica",
};
const anteriores = [
  {
    href: `/`,
    titulo: "Pré-Recebimento",
  },
  {
    href: `/${PRE_RECEBIMENTO}/${FICHA_TECNICA}`,
    titulo: "Ficha Técnica do Produto",
  },
];
export default () =>
  _jsxs(Page, {
    botaoVoltar: true,
    temModalVoltar: true,
    textoModalVoltar:
      "Existem informa\u00E7\u00F5es n\u00E3o salvas na Ficha T\u00E9cnica. Ao voltar \u00E0 tela anterior, as informa\u00E7\u00F5es inseridas ser\u00E3o perdidas.",
    voltarPara: `/${PRE_RECEBIMENTO}/${FICHA_TECNICA}`,
    titulo: atual.titulo,
    children: [
      _jsx(Breadcrumb, { home: HOME, atual: atual, anteriores: anteriores }),
      _jsx(Cadastrar, {}),
    ],
  });
