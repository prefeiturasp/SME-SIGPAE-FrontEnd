import Container from "src/components/InclusaoDeAlimentacaoCEMEI/componentes/Container";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { ESCOLA, INCLUSAO_ALIMENTACAO } from "src/configs/constants";
import { HOME } from "./constants";

const atual = {
  href: `/${ESCOLA}/${INCLUSAO_ALIMENTACAO}`,
  titulo: "Inclusão de Alimentação",
};

export const InclusaoDeAlimentacaoCEMEIPage = () => (
  <Page titulo={atual.titulo} botaoVoltar>
    <Breadcrumb home={HOME} atual={atual} />
    <Container />
  </Page>
);
