import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import Page from "../../components/Shareable/Page/Page";
import {
  EDITAR_CLAUSULA,
  CLAUSULAS_PARA_DESCONTOS,
  MEDICAO_INICIAL,
} from "../../configs/constants";
import { CadastroDeClausulas } from "src/components/screens/LancamentoInicial/CadastroDeClausulas";
const atual = {
  href: `/${MEDICAO_INICIAL}/${CLAUSULAS_PARA_DESCONTOS}/${EDITAR_CLAUSULA}`,
  titulo: "Editar Cláusula",
};
const anterior = [
  {
    href: "#",
    titulo: "Medição Inicial",
  },
  {
    href: "#",
    titulo: "Cadastros",
  },
  {
    href: `/${MEDICAO_INICIAL}/${CLAUSULAS_PARA_DESCONTOS}/`,
    titulo: "Cláusulas para Descontos",
  },
];
export const EditarClausulaPage = () =>
  _jsxs(Page, {
    titulo: atual.titulo,
    botaoVoltar: true,
    children: [
      _jsx(Breadcrumb, { home: "/", anteriores: anterior, atual: atual }),
      _jsx(CadastroDeClausulas, {}),
    ],
  });
