import { Relatorio } from "components/InclusaoDeAlimentacao/Relatorio";
import { ModalCancelarInclusaoAlimentacao } from "components/Shareable/ModalCancelarInclusaoAlimentacao";
import { ModalCODAEAutoriza } from "components/Shareable/ModalCODAEAutoriza";
import HTTP_STATUS from "http-status-codes";
import React, { useEffect, useState } from "react";
import {
  // CODAE
  codaeAutorizarSolicitacaoDeInclusaoDeAlimentacao,
  codaeNegarSolicitacaoDeInclusaoDeAlimentacao,
  codaeQuestionarSolicitacaoDeInclusaoDeAlimentacao,
  dreReprovarSolicitacaoDeInclusaoDeAlimentacao,
  // DRE
  dreValidarSolicitacaoDeInclusaoDeAlimentacao,
  // escola
  escolaCancelarSolicitacaoDeInclusaoDeAlimentacao,
  // terceirizada
  terceirizadaResponderQuestionamentoDeInclusaoDeAlimentacao,
} from "services/inclusaoDeAlimentacao";
import { getMotivosDREnaoValida } from "services/relatorios";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import { ModalCODAEQuestiona } from "../../components/Shareable/ModalCODAEQuestiona";
import { ModalNaoValidarSolicitacao } from "../../components/Shareable/ModalNaoValidarSolicitacaoReduxForm";
import ModalNegarSolicitacao from "../../components/Shareable/ModalNegarSolicitacao";
import { ModalTerceirizadaRespondeQuestionamento } from "../../components/Shareable/ModalTerceirizadaRespondeQuestionamento";
import Page from "../../components/Shareable/Page/Page";
import { CODAE, DRE, ESCOLA, TERCEIRIZADA } from "../../configs/constants";
import { HOME } from "../../constants/config";

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

  const atual = {
    href: "#",
    titulo: "Relatório",
  };

  return (
    <Page botaoVoltar>
      <Breadcrumb home={HOME} atual={atual} />
      <Relatorio motivosDREnaoValida={motivosDREnaoValida} {...props} />
    </Page>
  );
};

// Escola
export const RelatorioEscola = () => {
  return (
    <RelatorioBase
      visao={ESCOLA}
      ModalNaoAprova={ModalCancelarInclusaoAlimentacao}
      toastNaoAprovaMensagem={"Inclusão de Alimentação cancelada com sucesso!"}
      endpointNaoAprovaSolicitacao={
        escolaCancelarSolicitacaoDeInclusaoDeAlimentacao
      }
      textoBotaoNaoAprova="Cancelar"
    />
  );
};

// DRE
export const RelatorioDRE = () => {
  return (
    <RelatorioBase
      visao={DRE}
      ModalNaoAprova={ModalNaoValidarSolicitacao}
      toastAprovaMensagem={"Inclusão de Alimentação validada com sucesso!"}
      toastAprovaMensagemErro={
        "Houve um erro ao validar a Inclusão de Alimentação"
      }
      endpointAprovaSolicitacao={dreValidarSolicitacaoDeInclusaoDeAlimentacao}
      endpointNaoAprovaSolicitacao={
        dreReprovarSolicitacaoDeInclusaoDeAlimentacao
      }
      textoBotaoNaoAprova="Não Validar"
      textoBotaoAprova="Validar"
    />
  );
};

// CODAE
export const RelatorioCODAE = () => {
  return (
    <RelatorioBase
      visao={CODAE}
      ModalNaoAprova={ModalNegarSolicitacao}
      ModalQuestionamento={ModalCODAEQuestiona}
      ModalCodaeAutoriza={ModalCODAEAutoriza}
      toastAprovaMensagem={"Inclusão de Alimentação autorizada com sucesso!"}
      toastAprovaMensagemErro={
        "Houve um erro ao autorizar a Inclusão de Alimentação"
      }
      endpointNaoAprovaSolicitacao={
        codaeNegarSolicitacaoDeInclusaoDeAlimentacao
      }
      endpointAprovaSolicitacao={
        codaeAutorizarSolicitacaoDeInclusaoDeAlimentacao
      }
      endpointQuestionamento={codaeQuestionarSolicitacaoDeInclusaoDeAlimentacao}
      textoBotaoNaoAprova="Negar"
      textoBotaoAprova="Autorizar"
    />
  );
};

// Terceirizada
export const RelatorioTerceirizada = () => {
  return (
    <RelatorioBase
      visao={TERCEIRIZADA}
      ModalNaoAprova={ModalTerceirizadaRespondeQuestionamento}
      ModalQuestionamento={ModalTerceirizadaRespondeQuestionamento}
      endpointQuestionamento={
        terceirizadaResponderQuestionamentoDeInclusaoDeAlimentacao
      }
    />
  );
};
