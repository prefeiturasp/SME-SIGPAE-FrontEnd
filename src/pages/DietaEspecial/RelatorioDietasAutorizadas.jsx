import { HOME } from "src/constants/config";

import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";

import { RelatorioDietasAutorizadas } from "src/components/screens/DietaEspecial/RelatorioDietasAutorizadas";
import {
  DIETA_ESPECIAL,
  RELATORIO_DIETAS_AUTORIZADAS,
} from "src/configs/constants";

const atual = {
  href: `/${DIETA_ESPECIAL}/${RELATORIO_DIETAS_AUTORIZADAS}`,
  titulo: "Relatório de Dietas Autorizadas",
};

const anteriores = [
  {
    href: "/painel-dieta-especial",
    titulo: "Dieta Especial",
  },
  {
    href: "#",
    titulo: "Relatórios",
  },
];

export const RelatorioDietasAutorizadasPage = () => (
  <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
    <Breadcrumb home={HOME} anteriores={anteriores} atual={atual} />
    <RelatorioDietasAutorizadas />
  </Page>
);
