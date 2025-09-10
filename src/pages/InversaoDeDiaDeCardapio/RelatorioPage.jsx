import HTTP_STATUS from "http-status-codes";
import React, { useEffect, useState } from "react";
import { RelatorioGenerico } from "src/components/GestaoDeAlimentacao/Relatorios/RelatorioGenerico";
import { Container } from "src/components/InversaoDeDiaDeCardapio/Escola/components/Container";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import { ModalAprovarGenericoSimOpcional } from "src/components/Shareable/ModalAprovarGenericoSimOpcional";
import ModalCancelarSolicitacao from "src/components/Shareable/ModalCancelarSolicitacao_";
import { ModalCODAEQuestiona } from "src/components/Shareable/ModalCODAEQuestiona";
import { ModalNaoValidarSolicitacao } from "src/components/Shareable/ModalNaoValidarSolicitacaoReduxForm";
import ModalNegarSolicitacao from "src/components/Shareable/ModalNegarSolicitacao";
import { ModalTerceirizadaRespondeQuestionamento } from "src/components/Shareable/ModalTerceirizadaRespondeQuestionamento";
import Page from "src/components/Shareable/Page/Page";
import { CODAE, DRE, ESCOLA, TERCEIRIZADA } from "src/configs/constants";
import { HOME } from "src/constants/config";
import { CorpoRelatorio } from "src/pages/InversaoDeDiaDeCardapio/components/CorpoRelatorio";
import {
  CODAEAutorizaPedidoDRE,
  CODAENegaInversaoDeDiaDeCardapio,
  CODAEQuestionaInversaoDeDiaDeCardapio,
  DRENegaInversaoDeDiaDeCardapio,
  dreValidaPedidoEscola,
  escolaCancelaInversaoDiaCardapio,
  getInversaoDeDiaDeCardapio,
  TerceirizadaRespondeQuestionamentoInversaoDeDiaDeCardapio,
  terceirizadaTomaCiencia,
} from "src/services/inversaoDeDiaDeCardapio.service";
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
      <RelatorioGenerico
        getSolicitacao={getInversaoDeDiaDeCardapio}
        nomeSolicitacao="Inversão de dia de Cardápio"
        endpointMarcarConferencia={() => "inversoes-dia-cardapio"}
        motivosDREnaoValida={motivosDREnaoValida}
        CorpoRelatorio={CorpoRelatorio}
        {...props}
      ></RelatorioGenerico>
    </Page>
  );
};

export class InversaoDeDiaDeCardapioPage extends React.Component {
  render() {
    const atual = {
      href: "/escola/inversao-de-dia-de-cardapio",
      titulo: "Inversão de dia de Cardápio",
    };
    return (
      <Page titulo={atual.titulo} botaoVoltar>
        <Breadcrumb home={HOME} atual={atual} />
        <Container />
      </Page>
    );
  }
}

// Escola
export const RelatorioEscola = () => (
  <RelatorioBase
    visao={ESCOLA}
    ModalNaoAprova={ModalCancelarSolicitacao}
    toastNaoAprovaMensagem={
      "Inversão de dia de Cardápio cancelada com sucesso!"
    }
    endpointNaoAprovaSolicitacao={escolaCancelaInversaoDiaCardapio}
    textoBotaoNaoAprova="Cancelar"
  />
);
// DRE
export const RelatorioDRE = () => (
  <RelatorioBase
    visao={DRE}
    endpointAprovaSolicitacao={dreValidaPedidoEscola}
    endpointNaoAprovaSolicitacao={DRENegaInversaoDeDiaDeCardapio}
    ModalNaoAprova={ModalNaoValidarSolicitacao}
    toastAprovaMensagem={"Inversão de dia de Cardápio validada com sucesso!"}
    toastAprovaMensagemErro={
      "Houve um erro ao validar a Inversão de dia de Cardápio. Tente novamente mais tarde."
    }
    textoBotaoNaoAprova="Não Validar"
    textoBotaoAprova="Validar"
  />
);

export const RelatorioCODAE = () => (
  <RelatorioBase
    visao={CODAE}
    ModalNaoAprova={ModalNegarSolicitacao}
    ModalCODAEAutoriza={ModalAprovarGenericoSimOpcional}
    HandleAprovaPedido={CODAEAutorizaPedidoDRE}
    ModalQuestionamento={ModalCODAEQuestiona}
    toastAprovaMensagem={"Inversão de dia de Cardápio autorizada com sucesso!"}
    toastAprovaMensagemErro={
      "Houve um erro ao autorizar a Inversão de dia de Cardápio"
    }
    textoBotaoNaoAprova="Negar"
    textoBotaoAprova="Autorizar"
    endpointNaoAprovaSolicitacao={CODAENegaInversaoDeDiaDeCardapio}
    endpointAprovaSolicitacao={CODAEAutorizaPedidoDRE}
    endpointQuestionamento={CODAEQuestionaInversaoDeDiaDeCardapio}
  />
);
// TERCEIRIZADA
export const RelatorioTerceirizada = () => (
  <RelatorioBase
    visao={TERCEIRIZADA}
    ModalNaoAprova={ModalTerceirizadaRespondeQuestionamento}
    ModalQuestionamento={ModalTerceirizadaRespondeQuestionamento}
    endpointQuestionamento={
      TerceirizadaRespondeQuestionamentoInversaoDeDiaDeCardapio
    }
    toastAprovaMensagem={
      "Ciência de Inversão de dia de Cardápio enviado com sucesso!"
    }
    toastAprovaMensagemErro={
      "Houve um erro ao tomar ciência da Inversão de dia de Cardápio"
    }
    textoBotaoNaoAprova="Não"
    textoBotaoAprova="Ciente"
    endpointAprovaSolicitacao={terceirizadaTomaCiencia}
    endpointNaoAprovaSolicitacao={
      TerceirizadaRespondeQuestionamentoInversaoDeDiaDeCardapio
    }
  />
);
