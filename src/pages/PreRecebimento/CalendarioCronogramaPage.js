import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HOME } from "src/constants/config";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { CALENDARIO_CRONOGRAMA, PRE_RECEBIMENTO } from "src/configs/constants";
import { CalendarioCronograma } from "src/components/Shareable/CalendarioCronograma";
import { getCalendarioCronogramas } from "src/services/cronograma.service";
const atual = {
  href: `/${PRE_RECEBIMENTO}/${CALENDARIO_CRONOGRAMA}`,
  titulo: "Calendário de Cronogramas",
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
      _jsx(CalendarioCronograma, {
        getObjetos: getCalendarioCronogramas,
        nomeObjeto: "Cronogramas",
        nomeObjetoMinusculo: "cronogramas",
      }),
    ],
  });
