import React, { useEffect, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import {
  dreReprovarSolicitacaoDeAlteracaoDeCardapio,
  dreValidarSolicitacaoDeAlteracaoDeCardapio,
  escolaCancelarSolicitacaoDeAlteracaoDeCardapioCEMEI
} from "services/alteracaoDeCardapio";
import { getMotivosDREnaoValida } from "services/relatorios";
import Breadcrumb from "components/Shareable/Breadcrumb";
import { Relatorio } from "components/AlteracaoDeCardapioCEMEI/Relatorio";
import Page from "components/Shareable/Page/Page";
import { ESCOLA, CODAE, TERCEIRIZADA, DRE } from "configs/constants";
import { HOME } from "constants/config";
import { ModalNaoValidarFinalForm } from "components/Shareable/ModalNaoValidarFinalForm";
import { TIPO_SOLICITACAO } from "constants/shared";
import { ModalEscolaCancela } from "components/AlteracaoDeCardapioCEMEI/Relatorio/componentes/ModalEscolaCancela";

export const RelatorioBase = ({ ...props }) => {
  const [motivosDREnaoValida, setMotivosDREnaoValida] = useState();

  useEffect(() => {
    const getMotivosDREnaoValidaData = async () => {
      const response = await getMotivosDREnaoValida();
      if (response.status === HTTP_STATUS.OK) {
        setMotivosDREnaoValida(response.data.results);
      }
    };
    getMotivosDREnaoValidaData();
  }, []);

  const urlParams = new URLSearchParams(window.location.search);
  const uuid = urlParams.get("uuid");

  const anteriores = [
    {
      href: `#`,
      titulo: "Gestão de Alimentação"
    },
    {
      href: `/painel-gestao-alimentacao`,
      titulo: "Painel de Solicitações"
    }
  ];

  const atual = {
    href: `/alteracao-do-tipo-de-alimentacao-cemei/relatorio?uuid=${uuid}&ehInclusaoContinua=false&tipoSolicitacao=solicitacao-cemei&card=undefined`,
    titulo: "Relatório"
  };

  return (
    <Page>
      <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
      <Relatorio motivosDREnaoValida={motivosDREnaoValida} {...props} />
    </Page>
  );
};

// Escola
export const RelatorioEscola = () => (
  <RelatorioBase
    visao={ESCOLA}
    ModalNaoAprova={ModalEscolaCancela}
    toastNaoAprovaMensagem={
      "Alteração do Tipo de Alimentação cancelada com sucesso!"
    }
    textoBotaoNaoAprova="Cancelar"
    tipoSolicitacao={TIPO_SOLICITACAO.SOLICITACAO_CEMEI}
    endpointNaoAprovaSolicitacao={
      escolaCancelarSolicitacaoDeAlteracaoDeCardapioCEMEI
    }
  />
);

// DRE
export const RelatorioDRE = () => (
  <RelatorioBase
    visao={DRE}
    ModalNaoAprova={ModalNaoValidarFinalForm}
    toastNaoAprovaMensagem={
      "Alteração do Tipo de Alimentação não validada com sucesso!"
    }
    toastAprovaMensagem={
      "Alteração do Tipo de Alimentação validada com sucesso!"
    }
    toastAprovaMensagemErro={
      "Houve um erro ao validar a Alteração do Tipo de Alimentação"
    }
    endpointAprovaSolicitacao={dreValidarSolicitacaoDeAlteracaoDeCardapio}
    endpointNaoAprovaSolicitacao={dreReprovarSolicitacaoDeAlteracaoDeCardapio}
    textoBotaoNaoAprova="Não Validar"
    textoBotaoAprova="Validar"
    tipoSolicitacao={TIPO_SOLICITACAO.SOLICITACAO_CEMEI}
  />
);

// CODAE
export const RelatorioCODAE = () => <RelatorioBase visao={CODAE} />;

// TERCEIRIZADA
export const RelatorioTerceirizada = () => (
  <RelatorioBase
    visao={TERCEIRIZADA}
    endpointNaoAprovaSolicitacao={
      escolaCancelarSolicitacaoDeAlteracaoDeCardapioCEMEI
    }
  />
);
