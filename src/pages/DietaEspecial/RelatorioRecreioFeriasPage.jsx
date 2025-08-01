import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { RelatorioRecreioFerias } from "src/components/screens/DietaEspecial/RelatorioRecreioFerias";
import {
  DIETA_ESPECIAL,
  RELATORIO_RECREIO_NAS_FERIAS,
} from "src/configs/constants";
import { HOME } from "src/constants/config";

const atual = {
  href: `/${DIETA_ESPECIAL}/${RELATORIO_RECREIO_NAS_FERIAS}`,
  titulo: "Relatório de Dietas para Recreio nas Férias",
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

export const RelatorioRecreioFeriasPage = () => (
  <Page botaoVoltar voltarPara="/" titulo={atual.titulo}>
    <Breadcrumb home={HOME} anteriores={anteriores} atual={atual} />
    <RelatorioRecreioFerias />
  </Page>
);
