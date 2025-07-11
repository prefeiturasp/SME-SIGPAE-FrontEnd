import HTTP_STATUS from "http-status-codes";
import { useEffect, useState } from "react";
import { RelatorioInclusaoDeAlimentacaoCEMEI } from "src/components/InclusaoDeAlimentacaoCEMEI/Relatorio";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import { ModalCancelarInclusaoAlimentacao } from "src/components/Shareable/ModalCancelarInclusaoAlimentacao";
import { ModalCODAEAutoriza } from "src/components/Shareable/ModalCODAEAutoriza";
import { ModalCODAEQuestionaFinalForm } from "src/components/Shareable/ModalCODAEQuestionaFinalForm";
import { ModalNaoValidarFinalForm } from "src/components/Shareable/ModalNaoValidarFinalForm";
import { ModalNegarFinalForm } from "src/components/Shareable/ModalNegarFinalForm";
import { ModalTercRespondeQuestFinalForm } from "src/components/Shareable/ModalTercRespondeQuestFinalForm";
import Page from "src/components/Shareable/Page/Page";
import { CODAE, DRE, ESCOLA, TERCEIRIZADA } from "src/configs/constants";
import { HOME } from "src/constants/config";
import { TIPO_SOLICITACAO } from "src/constants/shared";
import {
  codaeAutorizarSolicitacaoDeInclusaoDeAlimentacao,
  codaeNegarSolicitacaoDeInclusaoDeAlimentacao,
  codaeQuestionarSolicitacaoDeInclusaoDeAlimentacao,
  dreReprovarSolicitacaoDeInclusaoDeAlimentacao,
  dreValidarSolicitacaoDeInclusaoDeAlimentacao,
  escolaCancelarSolicitacaoDeInclusaoDeAlimentacao,
  terceirizadaDarCienciaDeInclusaoDeAlimentacao,
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

  const anteriores = [
    {
      href: `/painel-gestao-alimentacao`,
      titulo: "Gestão de Alimentação",
    },
    {
      href: `/painel-gestao-alimentacao`,
      titulo: "Painel de Solicitações",
    },
  ];

  const atual = {
    href: "#",
    titulo: "Relatório",
  };

  return (
    motivosDREnaoValida && (
      <Page botaoVoltar>
        <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
        <RelatorioInclusaoDeAlimentacaoCEMEI
          motivosDREnaoValida={motivosDREnaoValida}
          {...props}
        />
      </Page>
    )
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
      tipoSolicitacao={TIPO_SOLICITACAO.SOLICITACAO_CEMEI}
    />
  );
};

export const RelatorioDRE = () => {
  return (
    <RelatorioBase
      visao={DRE}
      ModalNaoAprova={ModalNaoValidarFinalForm}
      toastNaoAprovaMensagem={
        "Inclusão de Alimentação não validada com sucesso!"
      }
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
      tipoSolicitacao={TIPO_SOLICITACAO.SOLICITACAO_CEMEI}
    />
  );
};

export const RelatorioCODAE = () => {
  return (
    <RelatorioBase
      visao={CODAE}
      ModalNaoAprova={ModalNegarFinalForm}
      ModalQuestionamento={ModalCODAEQuestionaFinalForm}
      ModalCodaeAutoriza={ModalCODAEAutoriza}
      toastAprovaMensagem={"Inclusão de alimentação autorizada com sucesso!"}
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
      tipoSolicitacao={TIPO_SOLICITACAO.SOLICITACAO_CEMEI}
    />
  );
};

export const RelatorioTerceirizada = () => {
  return (
    <RelatorioBase
      visao={TERCEIRIZADA}
      ModalNaoAprova={ModalTercRespondeQuestFinalForm}
      ModalQuestionamento={ModalTercRespondeQuestFinalForm}
      toastAprovaMensagem={
        "Ciência de Inclusão de Alimentação enviado com sucesso!"
      }
      toastAprovaMensagemErro={
        "Houve um erro ao tomar ciência da Inclusão de Alimentação"
      }
      endpointAprovaSolicitacao={terceirizadaDarCienciaDeInclusaoDeAlimentacao}
      endpointNaoAprovaSolicitacao={
        terceirizadaResponderQuestionamentoDeInclusaoDeAlimentacao
      }
      endpointQuestionamento={
        terceirizadaResponderQuestionamentoDeInclusaoDeAlimentacao
      }
      textoBotaoNaoAprova="Não"
      textoBotaoAprova="Ciente"
      tipoSolicitacao={TIPO_SOLICITACAO.SOLICITACAO_CEMEI}
    />
  );
};
