import RelatorioReclamacaoProduto from "src/components/screens/Produto/RelatorioReclamacaoProduto";
import { RelatorioReclamacaoProduto as RelatorioReclamacaoProdutoNovo } from "src/components/screens/Produto/RelatorioReclamacaoProdutoNovo";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  GESTAO_PRODUTO,
  RELATORIO_RECLAMACAO_PRODUTO,
} from "src/configs/constants";
import { ENVIRONMENT } from "src/constants/config";

const atual = {
  href: `/${GESTAO_PRODUTO}/${RELATORIO_RECLAMACAO_PRODUTO}`,
  titulo: "Relatório de Reclamação de Produto",
};

const anteriores = [
  {
    href: "/",
    titulo: "Relatórios",
  },
];

export const RelatorioReclamacaoProdutoPage = () => (
  <Page
    titulo="Relatório de Reclamação de Produto"
    botaoVoltar
    voltarPara={"/"}
  >
    <Breadcrumb home={"/"} anteriores={anteriores} atual={atual} />
    {!ENVIRONMENT.includes("production") && <RelatorioReclamacaoProdutoNovo />}
    {ENVIRONMENT.includes("production") && <RelatorioReclamacaoProduto />}
  </Page>
);
