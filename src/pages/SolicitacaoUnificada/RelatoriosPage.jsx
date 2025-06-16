import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Relatorio from "src/components/SolicitacaoUnificada/Relatorio";
import Page from "src/components/Shareable/Page/Page";
import { HOME } from "src/constants/config";
import { DRE, CODAE, TERCEIRIZADA, ESCOLA } from "src/configs/constants";
import {
  cancelaKitLancheUnificadoDre,
  TerceirizadaTomaCienciaSolicitacoUnificada,
  CODAENegaKitLancheUnificadoEscola,
  CODAEAutorizaPedidoKitLancheUnificado,
  terceirizadaRespondeQuestionamentoSolitacaoUnificada,
  CODAEquestionaSolicitacaoUnificada,
  cancelaKitLancheUnificadoEscola,
} from "../../services/solicitacaoUnificada.service";
import ModalCancelarSolicitacao from "../../components/Shareable/ModalCancelarSolicitacao_";
import ModalNegarSolicitacao from "../../components/Shareable/ModalNegarSolicitacao";
import { ModalTerceirizadaRespondeQuestionamento } from "../../components/Shareable/ModalTerceirizadaRespondeQuestionamento";
import { ModalCODAEQuestionaFinalForm } from "src/components/Shareable/ModalCODAEQuestionaFinalForm";

class RelatorioBase extends React.Component {
  render() {
    const atual = {
      href: "#",
      titulo: "Relatório",
    };
    const anteriores = [
      {
        href: "/painel-gestao-alimentacao",
        titulo: "Solicitação Unificada",
      },
    ];

    return (
      <Page botaoVoltar>
        <Breadcrumb home={HOME} anteriores={anteriores} atual={atual} />
        <Relatorio {...this.props} />
      </Page>
    );
  }
}

// DRE
export const RelatorioDRE = () => (
  <RelatorioBase
    visao={DRE}
    ModalNaoAprova={ModalCancelarSolicitacao}
    toastNaoAprovaMensagem={"Solicitação Unificada cancelada com sucesso!"}
    endpointNaoAprovaSolicitacao={cancelaKitLancheUnificadoDre}
    textoBotaoNaoAprova="Cancelar"
  />
);

// ESCOLA
export const RelatorioEscola = () => (
  <RelatorioBase
    visao={ESCOLA}
    ModalNaoAprova={ModalCancelarSolicitacao}
    toastNaoAprovaMensagem={"Solicitação Unificada cancelada com sucesso!"}
    endpointNaoAprovaSolicitacao={cancelaKitLancheUnificadoEscola}
    textoBotaoNaoAprova="Cancelar"
  />
);

// CODAE
export const RelatorioCODAE = () => (
  <RelatorioBase
    visao={CODAE}
    ModalNaoAprova={ModalNegarSolicitacao}
    ModalQuestionamento={ModalCODAEQuestionaFinalForm}
    toastAprovaMensagem={"Solicitação Unificada autorizada com sucesso!"}
    toastAprovaMensagemErro={
      "Houve um erro ao autorizar a Solicitação Unificada"
    }
    endpointNaoAprovaSolicitacao={CODAENegaKitLancheUnificadoEscola}
    endpointAprovaSolicitacao={CODAEAutorizaPedidoKitLancheUnificado}
    endpointQuestionamento={CODAEquestionaSolicitacaoUnificada}
    textoBotaoNaoAprova="Negar"
    textoBotaoAprova="Autorizar"
  />
);

// Terceirizada
export const RelatorioTerceirizada = () => (
  <RelatorioBase
    visao={TERCEIRIZADA}
    ModalNaoAprova={ModalTerceirizadaRespondeQuestionamento}
    ModalQuestionamento={ModalTerceirizadaRespondeQuestionamento}
    toastAprovaMensagem={
      "Ciência de Solicitação Unificada enviado com sucesso!"
    }
    toastAprovaMensagemErro={
      "Houve um erro ao tomar ciência da Solicitação Unificada"
    }
    endpointAprovaSolicitacao={TerceirizadaTomaCienciaSolicitacoUnificada}
    endpointNaoAprovaSolicitacao={
      terceirizadaRespondeQuestionamentoSolitacaoUnificada
    }
    endpointQuestionamento={
      terceirizadaRespondeQuestionamentoSolitacaoUnificada
    }
    textoBotaoNaoAprova="Não"
    textoBotaoAprova="Ciente"
  />
);
