import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  ANALISAR_FICHA_TECNICA,
  PAINEL_FICHAS_TECNICAS,
  PRE_RECEBIMENTO,
} from "src/configs/constants";
import Analisar from "src/components/screens/PreRecebimento/FichaTecnica/components/Analisar";
import {
  usuarioEhCODAEGabinete,
  usuarioEhDilogDiretoria,
} from "src/helpers/utilities";
const atual = {
  href: `/${PRE_RECEBIMENTO}/${ANALISAR_FICHA_TECNICA}`,
  titulo: "Analisar Ficha Técnica",
};
const anteriores = [
  {
    href: `/`,
    titulo: "Pré-Recebimento",
  },
  {
    href: `/${PRE_RECEBIMENTO}/${PAINEL_FICHAS_TECNICAS}`,
    titulo: "Fichas Técnicas",
  },
];
const somenteLeitura = usuarioEhCODAEGabinete() || usuarioEhDilogDiretoria();
export default () =>
  _jsxs(Page, {
    botaoVoltar: true,
    voltarPara: `/${PRE_RECEBIMENTO}/${PAINEL_FICHAS_TECNICAS}`,
    titulo: atual.titulo,
    children: [
      _jsx(Breadcrumb, { home: HOME, atual: atual, anteriores: anteriores }),
      _jsx(Analisar, { somenteLeitura: somenteLeitura }),
    ],
  });
