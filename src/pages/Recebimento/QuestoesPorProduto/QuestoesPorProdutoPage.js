import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HOME } from "src/constants/config";
import { RECEBIMENTO, QUESTOES_POR_PRODUTO } from "src/configs/constants";
import Page from "src/components/Shareable/Page/Page";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import QuestoesPorProduto from "src/components/screens/Recebimento/QuestoesPorProduto";
const atual = {
  href: `/${RECEBIMENTO}/${QUESTOES_POR_PRODUTO}`,
  titulo: "Questões por Produto",
};
const anteriores = [
  {
    href: `/`,
    titulo: "Recebimento",
  },
];
export default () =>
  _jsxs(Page, {
    botaoVoltar: true,
    voltarPara: anteriores[anteriores.length - 1].href,
    titulo: atual.titulo,
    children: [
      _jsx(Breadcrumb, { home: HOME, atual: atual, anteriores: anteriores }),
      _jsx(QuestoesPorProduto, {}),
    ],
  });
