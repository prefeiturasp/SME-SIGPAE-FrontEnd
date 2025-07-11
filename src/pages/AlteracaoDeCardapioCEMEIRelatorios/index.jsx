import { Relatorio } from "src/components/AlteracaoDeCardapioCEMEI/Relatorio";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import { ModalCancelarAlteracaoCardapio } from "src/components/Shareable/ModalCancelaAlteracaoCardapio";
import { ModalCODAEAutoriza } from "src/components/Shareable/ModalCODAEAutoriza";
import { ModalCODAEQuestionaFinalForm } from "src/components/Shareable/ModalCODAEQuestionaFinalForm";
import { ModalNaoValidarFinalForm } from "src/components/Shareable/ModalNaoValidarFinalForm";
import { ModalNegarFinalForm } from "src/components/Shareable/ModalNegarFinalForm";
import { ModalTercRespondeQuestFinalForm } from "src/components/Shareable/ModalTercRespondeQuestFinalForm";
import Page from "src/components/Shareable/Page/Page";
import { CODAE, DRE, ESCOLA, TERCEIRIZADA } from "src/configs/constants";
import { HOME } from "src/constants/config";
import { TIPO_SOLICITACAO } from "src/constants/shared";
import HTTP_STATUS from "http-status-codes";
import { useEffect, useState } from "react";
import {
  codaeAutorizarSolicitacaoDeAlteracaoDeCardapio,
  codaeNegarSolicitacaoDeAlteracaoDeCardapio,
  codaeQuestionarSolicitacaoDeAlteracaoDeCardapio,
  dreReprovarSolicitacaoDeAlteracaoDeCardapio,
  dreValidarSolicitacaoDeAlteracaoDeCardapio,
  escolaCancelarSolicitacaoDeAlteracaoDeCardapioCEMEI,
  terceirizadaRespondeQuestionamentoAlteracaoCardapio,
  TerceirizadaTomaCienciaAlteracaoCardapio,
} from "src/services/alteracaoDeCardapio";
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

  const urlParams = new URLSearchParams(window.location.search);
  const uuid = urlParams.get("uuid");

  const anteriores = [
    {
      href: `#`,
      titulo: "Gestão de Alimentação",
    },
    {
      href: `/painel-gestao-alimentacao`,
      titulo: "Painel de Solicitações",
    },
  ];

  const atual = {
    href: `/alteracao-do-tipo-de-alimentacao-cemei/relatorio?uuid=${uuid}&ehInclusaoContinua=false&tipoSolicitacao=solicitacao-cemei&card=undefined`,
    titulo: "Relatório",
  };

  return (
    <Page botaoVoltar>
      <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
      <Relatorio motivosDREnaoValida={motivosDREnaoValida} {...props} />
    </Page>
  );
};

// Escola
export const RelatorioEscola = () => (
  <RelatorioBase
    visao={ESCOLA}
    ModalNaoAprova={ModalCancelarAlteracaoCardapio}
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
      "Houve um erro ao validar a Alteração do Tipo de Alimentação. Tente novamente mais tarde."
    }
    toastNaoAprovaMensagemErro={
      "Houve um erro ao não validar a Alteração do Tipo de Alimentação. Tente novamente mais tarde."
    }
    endpointAprovaSolicitacao={dreValidarSolicitacaoDeAlteracaoDeCardapio}
    endpointNaoAprovaSolicitacao={dreReprovarSolicitacaoDeAlteracaoDeCardapio}
    textoBotaoNaoAprova="Não Validar"
    textoBotaoAprova="Validar"
    tipoSolicitacao={TIPO_SOLICITACAO.SOLICITACAO_CEMEI}
  />
);

// CODAE
export const RelatorioCODAE = () => (
  <RelatorioBase
    visao={CODAE}
    ModalNaoAprova={ModalNegarFinalForm}
    ModalQuestionamento={ModalCODAEQuestionaFinalForm}
    ModalCODAEAutoriza={ModalCODAEAutoriza}
    toastAprovaMensagem={
      "Alteração do Tipo de Alimentação autorizada com sucesso!"
    }
    toastAprovaMensagemErro={
      "Houve um erro ao autorizar a Alteração do Tipo de Alimentação"
    }
    endpointNaoAprovaSolicitacao={codaeNegarSolicitacaoDeAlteracaoDeCardapio}
    endpointAprovaSolicitacao={codaeAutorizarSolicitacaoDeAlteracaoDeCardapio}
    endpointQuestionamento={codaeQuestionarSolicitacaoDeAlteracaoDeCardapio}
    textoBotaoNaoAprova="Negar"
    textoBotaoAprova="Autorizar"
    tipoSolicitacao={TIPO_SOLICITACAO.SOLICITACAO_CEMEI}
  />
);

// TERCEIRIZADA
export const RelatorioTerceirizada = () => (
  <RelatorioBase
    visao={TERCEIRIZADA}
    ModalNaoAprova={ModalTercRespondeQuestFinalForm}
    ModalQuestionamento={ModalTercRespondeQuestFinalForm}
    toastAprovaMensagem={
      "Ciência de Alteração do Tipo de Alimentação enviado com sucesso!"
    }
    toastAprovaMensagemErro={
      "Houve um erro ao tomar ciência da Alteração do Tipo de Alimentação"
    }
    endpointAprovaSolicitacao={TerceirizadaTomaCienciaAlteracaoCardapio}
    endpointNaoAprovaSolicitacao={
      terceirizadaRespondeQuestionamentoAlteracaoCardapio
    }
    endpointQuestionamento={terceirizadaRespondeQuestionamentoAlteracaoCardapio}
    textoBotaoNaoAprova="Não"
    textoBotaoAprova="Ciente"
    tipoSolicitacao={TIPO_SOLICITACAO.SOLICITACAO_CEMEI}
  />
);
