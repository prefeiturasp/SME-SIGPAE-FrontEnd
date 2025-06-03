import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  LANCAMENTO_INICIAL,
  LANCAMENTO_MEDICAO_INICIAL,
  REGISTRAR_NOVA_OCORRENCIA,
  REGISTRAR_OCORRENCIAS,
} from "src/configs/constants";
import { RegistrarNovaOcorrencia } from "src/components/screens/IMR/RegistrarNovaOcorrencia";
const atual = {
  href: `/${LANCAMENTO_INICIAL}/${LANCAMENTO_MEDICAO_INICIAL}/${REGISTRAR_OCORRENCIAS}/${REGISTRAR_NOVA_OCORRENCIA}`,
  titulo: "Nova Ocorrência",
};
const anteriores = [
  {
    href: `/`,
    titulo: "Medição Inicial",
  },
  {
    navigate_to: -2,
    titulo: "Lançamento Medição Inicial",
  },
  {
    navigate_to: -1,
    titulo: "Registrar Ocorrências",
  },
];
export const RegistrarNovaOcorrenciaPage = () =>
  _jsxs(Page, {
    botaoVoltar: true,
    titulo: atual.titulo,
    children: [
      _jsx(Breadcrumb, { home: HOME, atual: atual, anteriores: anteriores }),
      _jsx(RegistrarNovaOcorrencia, {}),
    ],
  });
