import { Relatorio } from "components/AlteracaoDeCardapio/Relatorio";
import Breadcrumb from "components/Shareable/Breadcrumb";
import { ModalCancelarAlteracaoCardapio } from "components/Shareable/ModalCancelaAlteracaoCardapio";
import { ModalCODAEAutoriza } from "components/Shareable/ModalCODAEAutoriza";
import { ModalCODAEQuestiona } from "components/Shareable/ModalCODAEQuestiona";
import { ModalNaoValidarSolicitacao } from "components/Shareable/ModalNaoValidarSolicitacaoReduxForm";
import ModalNegarSolicitacao from "components/Shareable/ModalNegarSolicitacao";
import { ModalTerceirizadaRespondeQuestionamento } from "components/Shareable/ModalTerceirizadaRespondeQuestionamento";
import Page from "components/Shareable/Page/Page";
import { CODAE, DRE, ESCOLA, TERCEIRIZADA } from "configs/constants";

import { HOME } from "constants/config";
import HTTP_STATUS from "http-status-codes";
import React, { useEffect, useState } from "react";
import {
  // CODAE
  codaeAutorizarSolicitacaoDeAlteracaoDeCardapio,
  codaeNegarSolicitacaoDeAlteracaoDeCardapio,
  codaeQuestionarSolicitacaoDeAlteracaoDeCardapio,
  dreReprovarSolicitacaoDeAlteracaoDeCardapio,
  // DRE
  dreValidarSolicitacaoDeAlteracaoDeCardapio,
  // escola
  escolaCancelarSolicitacaoDeAlteracaoDeCardapio,
  terceirizadaRespondeQuestionamentoAlteracaoCardapio,
  TerceirizadaTomaCienciaAlteracaoCardapio,
} from "services/alteracaoDeCardapio";
import { getMotivosDREnaoValida } from "services/relatorios";

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
export const RelatorioEscola = () => (
  <RelatorioBase
    visao={ESCOLA}
    ModalNaoAprova={ModalCancelarAlteracaoCardapio}
    toastNaoAprovaMensagem={
      "Alteração do Tipo de Alimentação cancelada com sucesso!"
    }
    endpointNaoAprovaSolicitacao={
      escolaCancelarSolicitacaoDeAlteracaoDeCardapio
    }
    textoBotaoNaoAprova="Cancelar"
  />
);

// DRE
export const RelatorioDRE = () => (
  <RelatorioBase
    visao={DRE}
    ModalNaoAprova={ModalNaoValidarSolicitacao}
    toastAprovaMensagem={
      "Alteração do Tipo de Alimentação validada com sucesso!"
    }
    toastAprovaMensagemErro={
      "Houve um erro ao validar a Alteração do Tipo de Alimentação"
    }
    endpointNaoAprovaSolicitacao={dreReprovarSolicitacaoDeAlteracaoDeCardapio}
    endpointAprovaSolicitacao={dreValidarSolicitacaoDeAlteracaoDeCardapio}
    textoBotaoNaoAprova="Não Validar"
    textoBotaoAprova="Validar"
  />
);

// CODAE
export const RelatorioCODAE = () => (
  <RelatorioBase
    visao={CODAE}
    ModalNaoAprova={ModalNegarSolicitacao}
    ModalQuestionamento={ModalCODAEQuestiona}
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
  />
);

// Terceirizada
export const RelatorioTerceirizada = () => (
  <RelatorioBase
    visao={TERCEIRIZADA}
    ModalNaoAprova={ModalTerceirizadaRespondeQuestionamento}
    ModalQuestionamento={ModalTerceirizadaRespondeQuestionamento}
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
  />
);
