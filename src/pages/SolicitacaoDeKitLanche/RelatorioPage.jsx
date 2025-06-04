import HTTP_STATUS from "http-status-codes";
import React, { useEffect, useState } from "react";
import {
  cancelaKitLancheAvulsoEscola,
  CODAEAutorizaKitLancheAvulso,
  CODAENegaKitLancheAvulso,
  CODAEquestionaKitLancheAvulso,
  DRENaoValidaKitLancheAvulso,
  DREValidaKitLancheAvulso,
  terceirizadaRespondeQuestionamentoKitLanche,
  terceirizadaTomaCienciaKitLanche,
} from "src/services/kitLanche";
import { getMotivosDREnaoValida } from "src/services/relatorios";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import ModalCancelarSolicitacao from "../../components/Shareable/ModalCancelarSolicitacao_";
import { ModalCODAEQuestiona } from "../../components/Shareable/ModalCODAEQuestiona";
import { ModalNaoValidarSolicitacao } from "../../components/Shareable/ModalNaoValidarSolicitacaoReduxForm";
import ModalNegarSolicitacao from "../../components/Shareable/ModalNegarSolicitacao";
import { ModalTerceirizadaRespondeQuestionamento } from "../../components/Shareable/ModalTerceirizadaRespondeQuestionamento";
import Page from "../../components/Shareable/Page/Page";
import Relatorio from "../../components/SolicitacaoDeKitLanche/Relatorio";
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

  return (
    <Page botaoVoltar>
      <Breadcrumb home={HOME} anteriores={anteriores} atual={atual} />
      <Relatorio motivosDREnaoValida={motivosDREnaoValida} {...props} />
    </Page>
  );
};

// Escola
export const RelatorioEscola = () => (
  <RelatorioBase
    visao={ESCOLA}
    ModalNaoAprova={ModalCancelarSolicitacao}
    toastNaoAprovaMensagem={"Kit Lanche Passeio cancelado com sucesso!"}
    endpointNaoAprovaSolicitacao={cancelaKitLancheAvulsoEscola}
    textoBotaoNaoAprova="Cancelar"
  />
);

// DRE
export const RelatorioDRE = () => (
  <RelatorioBase
    visao={DRE}
    ModalNaoAprova={ModalNaoValidarSolicitacao}
    toastAprovaMensagem={"Kit Lanche Passeio validado com sucesso!"}
    toastAprovaMensagemErro={"Houve um erro ao validar o Kit Lanche Passeio"}
    endpointNaoAprovaSolicitacao={DRENaoValidaKitLancheAvulso}
    endpointAprovaSolicitacao={DREValidaKitLancheAvulso}
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
    toastAprovaMensagem={"Kit Lanche Passeio autorizado com sucesso!"}
    toastAprovaMensagemErro={"Houve um erro ao autorizar o Kit Lanche Passeio"}
    endpointNaoAprovaSolicitacao={CODAENegaKitLancheAvulso}
    endpointAprovaSolicitacao={CODAEAutorizaKitLancheAvulso}
    endpointQuestionamento={CODAEquestionaKitLancheAvulso}
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
    toastAprovaMensagem={"Ciência de Kit Lanche Passeio enviado com sucesso!"}
    toastAprovaMensagemErro={
      "Houve um erro ao tomar ciência do Kit Lanche Passeio"
    }
    endpointAprovaSolicitacao={terceirizadaTomaCienciaKitLanche}
    endpointNaoAprovaSolicitacao={terceirizadaRespondeQuestionamentoKitLanche}
    endpointQuestionamento={terceirizadaRespondeQuestionamentoKitLanche}
    textoBotaoNaoAprova="Não"
    textoBotaoAprova="Ciente"
  />
);
