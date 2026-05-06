import HTTP_STATUS from "http-status-codes";
import { useEffect, useState } from "react";
import { Relatorio } from "src/components/InclusaoDeAlimentacao/Relatorio";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import { ModalCancelarInclusaoAlimentacao } from "src/components/Shareable/ModalCancelarInclusaoAlimentacao";
import { ModalCODAEAutoriza } from "src/components/Shareable/ModalCODAEAutoriza";
import { ModalCODAEQuestiona } from "src/components/Shareable/ModalCODAEQuestiona";
import { ModalNaoValidarSolicitacao } from "src/components/Shareable/ModalNaoValidarSolicitacaoReduxForm";
import ModalNegarSolicitacao from "src/components/Shareable/ModalNegarSolicitacao";
import { ModalTerceirizadaRespondeQuestionamento } from "src/components/Shareable/ModalTerceirizadaRespondeQuestionamento";
import Page from "src/components/Shareable/Page/Page";
import { CODAE, DRE, ESCOLA, TERCEIRIZADA } from "src/configs/constants";
import { HOME } from "src/constants/config";
import {
  codaeAutorizarSolicitacaoDeInclusaoDeAlimentacao,
  codaeNegarSolicitacaoDeInclusaoDeAlimentacao,
  codaeQuestionarSolicitacaoDeInclusaoDeAlimentacao,
  dreReprovarSolicitacaoDeInclusaoDeAlimentacao,
  dreValidarSolicitacaoDeInclusaoDeAlimentacao,
  escolaCancelarSolicitacaoDeInclusaoDeAlimentacao,
  terceirizadaResponderQuestionamentoDeInclusaoDeAlimentacao,
} from "src/services/inclusaoDeAlimentacao";
import { getMotivosDREnaoValida } from "src/services/relatorios";

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
