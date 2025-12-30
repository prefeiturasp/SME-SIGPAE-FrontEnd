import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { Container } from "src/components/SolicitacaoUnificada/DRE/Container";
import { HOME } from "./constants";

const atual = {
  href: "/dre/solicitacao-unificada",
  titulo: "Solicitação Unificada",
};

export const SolicitacaoUnificadaPage = () => (
  <Page titulo={atual.titulo} botaoVoltar>
    <Breadcrumb home={HOME} atual={atual} />
    <Container />
  </Page>
);
