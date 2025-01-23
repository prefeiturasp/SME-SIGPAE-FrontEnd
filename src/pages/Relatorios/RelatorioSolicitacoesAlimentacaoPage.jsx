import { RelatorioSolicitacoesAlimentacao } from "components/screens/Relatorios/SolicitacoesAlimentacao";
import Breadcrumb from "components/Shareable/Breadcrumb";
import Page from "components/Shareable/Page/Page";
import { RELATORIO_SOLICITACOES_ALIMENTACAO } from "configs/constants";
import {
  ehUsuarioRelatorios,
  usuarioEhCODAEGabinete,
  usuarioEhCODAEGestaoAlimentacao,
  usuarioEhCODAENutriManifestacao,
  usuarioEhDinutreDiretoria,
  usuarioEhDRE,
  usuarioEhEmpresaTerceirizada,
  usuarioEhEscolaTerceirizada,
  usuarioEhEscolaTerceirizadaDiretor,
  usuarioEhGticCODAE,
  usuarioEhMedicao,
} from "helpers/utilities";
import React from "react";
import {
  filtrarSolicitacoesAlimentacaoCODAE,
  filtrarSolicitacoesAlimentacaoDRE,
  filtrarSolicitacoesAlimentacaoEscola,
  filtrarSolicitacoesAlimentacaoTerceirizadas,
  gerarExcelRelatorioSolicitacoesAlimentacaoCODAE,
  gerarExcelRelatorioSolicitacoesAlimentacaoDRE,
  gerarExcelRelatorioSolicitacoesAlimentacaoEscola,
  gerarExcelRelatorioSolicitacoesAlimentacaoTerceirizadas,
  gerarPDFRelatorioSolicitacoesAlimentacaoCODAE,
  gerarPDFRelatorioSolicitacoesAlimentacaoDRE,
  gerarPDFRelatorioSolicitacoesAlimentacaoEscola,
  gerarPDFRelatorioSolicitacoesAlimentacaoTerceirizadas,
} from "services/relatorios.service";

const atual = {
  href: `/${RELATORIO_SOLICITACOES_ALIMENTACAO}`,
  titulo: "Solicitações de Alimentações",
};

const anteriores = [
  {
    href: `/painel-gestao-alimentacao`,
    titulo: "Gestão de Alimentação",
  },
  {
    href: `/`,
    titulo: "Relatórios",
  },
];

const endpointPorPerfil = () => {
  if (usuarioEhDRE()) {
    return filtrarSolicitacoesAlimentacaoDRE;
  } else if (
    usuarioEhCODAEGestaoAlimentacao() ||
    usuarioEhMedicao() ||
    usuarioEhCODAENutriManifestacao() ||
    usuarioEhCODAEGabinete() ||
    ehUsuarioRelatorios() ||
    usuarioEhGticCODAE() ||
    usuarioEhDinutreDiretoria()
  ) {
    return filtrarSolicitacoesAlimentacaoCODAE;
  } else if (
    usuarioEhEscolaTerceirizada() ||
    usuarioEhEscolaTerceirizadaDiretor()
  ) {
    return filtrarSolicitacoesAlimentacaoEscola;
  } else if (usuarioEhEmpresaTerceirizada()) {
    return filtrarSolicitacoesAlimentacaoTerceirizadas;
  } else {
    return "PERFIL_INVALIDO";
  }
};

const endpointGerarExcel = () => {
  if (usuarioEhDRE()) {
    return gerarExcelRelatorioSolicitacoesAlimentacaoDRE;
  } else if (
    usuarioEhEscolaTerceirizada() ||
    usuarioEhEscolaTerceirizadaDiretor()
  ) {
    return gerarExcelRelatorioSolicitacoesAlimentacaoEscola;
  } else if (
    usuarioEhCODAEGestaoAlimentacao() ||
    usuarioEhMedicao() ||
    usuarioEhCODAENutriManifestacao() ||
    usuarioEhCODAEGabinete() ||
    ehUsuarioRelatorios() ||
    usuarioEhGticCODAE() ||
    usuarioEhDinutreDiretoria()
  ) {
    return gerarExcelRelatorioSolicitacoesAlimentacaoCODAE;
  } else if (usuarioEhEmpresaTerceirizada()) {
    return gerarExcelRelatorioSolicitacoesAlimentacaoTerceirizadas;
  } else {
    return "PERFIL_INVALIDO";
  }
};

const endpointGerarPDF = () => {
  if (usuarioEhDRE()) {
    return gerarPDFRelatorioSolicitacoesAlimentacaoDRE;
  } else if (
    usuarioEhEscolaTerceirizada() ||
    usuarioEhEscolaTerceirizadaDiretor()
  ) {
    return gerarPDFRelatorioSolicitacoesAlimentacaoEscola;
  } else if (
    usuarioEhCODAEGestaoAlimentacao() ||
    usuarioEhMedicao() ||
    usuarioEhCODAENutriManifestacao() ||
    usuarioEhCODAEGabinete() ||
    ehUsuarioRelatorios() ||
    usuarioEhGticCODAE() ||
    usuarioEhDinutreDiretoria()
  ) {
    return gerarPDFRelatorioSolicitacoesAlimentacaoCODAE;
  } else if (usuarioEhEmpresaTerceirizada()) {
    return gerarPDFRelatorioSolicitacoesAlimentacaoTerceirizadas;
  } else {
    return "PERFIL_INVALIDO";
  }
};

export default (props) => (
  <Page
    titulo="Relatório de Solicitações de Alimentação"
    botaoVoltar
    {...props}
  >
    <Breadcrumb home={"/"} anteriores={anteriores} atual={atual} />
    <RelatorioSolicitacoesAlimentacao
      endpoint={endpointPorPerfil()}
      endpointGerarExcel={endpointGerarExcel()}
      endpointGerarPDF={endpointGerarPDF()}
      {...props}
    />
  </Page>
);
