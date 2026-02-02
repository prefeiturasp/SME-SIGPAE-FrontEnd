import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  MEDICAO_INICIAL,
  RELATORIO_FINANCEIRO,
  ANALISAR_RELATORIO_FINANCEIRO,
} from "src/configs/constants";
import { RelatorioFinanceiroConsolidado } from "src/components/screens/LancamentoInicial/RelatorioFinanceiro/RelatorioFinanceiroConsolidado";

const atual = {
  href: `/${MEDICAO_INICIAL}/${RELATORIO_FINANCEIRO}/${ANALISAR_RELATORIO_FINANCEIRO}`,
  titulo: "Analisar Relatório Financeiro",
};

const anterior = [
  {
    href: "#",
    titulo: "Medição Inicial",
  },
  {
    href: `/${MEDICAO_INICIAL}/${RELATORIO_FINANCEIRO}`,
    titulo: "Relatório Financeiro",
  },
];

export const RelatorioFinanceiroConsolidadoPage = () => (
  <Page titulo="Relatório Financeiro" botaoVoltar>
    <Breadcrumb home={"/"} anteriores={anterior} atual={atual} />
    <RelatorioFinanceiroConsolidado />
  </Page>
);
