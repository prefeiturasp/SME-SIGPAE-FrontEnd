import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { ListaOcorrencias } from "src/components/screens/IMR/ListaOcorrencias";
import {
  LANCAMENTO_INICIAL,
  LANCAMENTO_MEDICAO_INICIAL,
  REGISTRAR_OCORRENCIAS,
} from "src/configs/constants";
import { HOME } from "src/constants/config";
const atual = {
  href: `/${LANCAMENTO_INICIAL}/${LANCAMENTO_MEDICAO_INICIAL}/${REGISTRAR_OCORRENCIAS}`,
  titulo: "Registrar Ocorrências",
};
const anteriores = [
  {
    href: `/`,
    titulo: "Medição Inicial",
  },
  {
    navigate_to: -1,
    titulo: "Lançamento Medição Inicial",
  },
];
export const ListaOcorrenciasPage = () =>
  _jsxs(Page, {
    botaoVoltar: true,
    titulo: atual.titulo,
    children: [
      _jsx(Breadcrumb, { home: HOME, atual: atual, anteriores: anteriores }),
      _jsx(ListaOcorrencias, {}),
    ],
  });
