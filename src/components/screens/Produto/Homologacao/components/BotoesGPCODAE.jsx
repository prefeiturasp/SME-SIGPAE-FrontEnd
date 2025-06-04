import React, { useState } from "react";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import { ModalPadrao } from "src/components/Shareable/ModalPadrao";
import { ModalVincularEditais } from "./ModelVincularEditais";
import {
  CODAECancelaSoliticaoCorrecao,
  CODAENaoHomologaProduto,
  CODAEPedeAnaliseSensorialProduto,
  CODAEPedeCorrecao,
} from "src/services/produto.service";
import ModalAtivacaoSuspensaoProduto from "../../AtivacaoSuspensao/ModalAtivacaoSuspensaoProduto";

export const BotoesGPCODAE = ({
  homologacao,
  terceirizadas,
  protocoloAnalise,
  getHomologacaoProdutoAsync,
  editaisOptions,
  setEditais,
  editais,
  tipoModal,
  values,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showModalHomologar, setShowModalHomologar] = useState(false);
  const [showModalSuspender, setShowModalSuspender] = useState(false);
  const [propsModal, setPropsModal] = useState({});

  const onChangeEditais = (values) => {
    setEditais(values);
  };

  const setPropsModalPadrao = (tipoModal) => {
    switch (tipoModal) {
      case "analise":
        setPropsModal({
          toastSuccessMessage:
            "Solicitação de análise sensorial enviada com sucesso",
          modalTitle: "Deseja solicitar a análise sensorial do produto?",
          endpoint: CODAEPedeAnaliseSensorialProduto,
          labelJustificativa: "Informações Adicionais",
          helpText:
            "Solicitamos que seja informado a quantidade e descrição para análise sensorial",
          eAnalise: true,
          tipoModal: tipoModal,
        });
        break;

      case "corrigir":
        setPropsModal({
          toastSuccessMessage: "Solicitação de correção enviada com sucesso",
          modalTitle: "Deseja solicitar correção do cadastro do produto?",
          endpoint: CODAEPedeCorrecao,
          labelJustificativa: "Justificativa",
          helpText: undefined,
          eAnalise: false,
          tipoModal: tipoModal,
        });
        break;

      case "nao-homologar":
        setPropsModal({
          toastSuccessMessage:
            "Solicitação de não homologado enviada com sucesso",
          modalTitle: "Deseja não homologar (indeferir) este produto?",
          endpoint: CODAENaoHomologaProduto,
          labelJustificativa: "Justificativa",
          helpText: undefined,
          eAnalise: false,
          tipoModal: tipoModal,
        });
        break;

      case "cancelar":
        setPropsModal({
          toastSuccessMessage: "Cancelamento enviado com sucesso.",
          modalTitle: "Envio de Cancelamento da Solicitação de Correção",
          endpoint: CODAECancelaSoliticaoCorrecao,
          labelJustificativa: "Justificativa",
          helpText: undefined,
          eAnalise: false,
          tipoModal: tipoModal,
          cancelaSolicitacao: homologacao,
        });
        break;

      default:
        setPropsModal({});
        break;
    }
    setShowModal(true);
  };

  return (
    <div className="row mt-4">
      {/* homologar */}
      <ModalVincularEditais
        showModal={showModalHomologar}
        closeModal={() => setShowModalHomologar(false)}
        editaisOptions={editaisOptions}
        editais={editais}
        onChangeEditais={onChangeEditais}
        uuid={homologacao.uuid}
        loadSolicitacao={() => getHomologacaoProdutoAsync()}
        produto={homologacao?.produto}
        tituloModal={
          homologacao.esta_homologado
            ? "Aceitar alterações"
            : "Homologação do Produto"
        }
        ehSuspensaoFluxoAlteracaoDados
      />

      <ModalAtivacaoSuspensaoProduto
        showModal={showModalSuspender}
        closeModal={() => setShowModalSuspender(false)}
        acao="suspensão"
        produto={homologacao?.produto}
        idHomologacao={homologacao.uuid}
        atualizarDados={() => {
          getHomologacaoProdutoAsync();
        }}
        ehSuspensaoFluxoAlteracaoDados
      />
      {/* solicitar análise sensorial, correção ou não homologar */}
      <ModalPadrao
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        toastSuccessMessage={propsModal.toastSuccessMessage}
        modalTitle={propsModal.modalTitle}
        endpoint={propsModal.endpoint}
        uuid={homologacao.uuid}
        protocoloAnalise={protocoloAnalise}
        loadSolicitacao={() => {
          getHomologacaoProdutoAsync();
        }}
        justificativa={homologacao.justificativa}
        labelJustificativa={propsModal.labelJustificativa}
        helpText={propsModal.helpText}
        eAnalise={propsModal.eAnalise}
        terceirizadas={terceirizadas}
        status={homologacao.status}
        terceirizada={
          homologacao.logs.filter(
            (log) => log.status_evento_explicacao === "Solicitação Realizada"
          )[
            homologacao.logs.filter(
              (log) => log.status_evento_explicacao === "Solicitação Realizada"
            ).length - 1
          ].usuario
        }
        tipoModal={tipoModal}
        cancelaAnaliseSensorial={propsModal.cancelaSolicitacao}
      />
      <div className="col-12">
        {homologacao.status === "CODAE_QUESTIONADO" ? (
          <>
            <Botao
              texto="Cancelar Solicitação"
              className="float-end"
              type={BUTTON_TYPE.BUTTON}
              onClick={() => setPropsModalPadrao("cancelar")}
              style={BUTTON_STYLE.GREEN_OUTLINE}
            />
          </>
        ) : (
          <>
            <Botao
              texto={
                homologacao.esta_homologado ? "Aceitar alterações" : "Homologar"
              }
              className="float-end"
              type={BUTTON_TYPE.BUTTON}
              onClick={() => setShowModalHomologar(true)}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              disabled={values.necessita_analise_sensorial === "1"}
            />
            <Botao
              texto={
                homologacao.esta_homologado ? "Suspender" : "Não homologar"
              }
              className="me-3 float-end"
              onClick={() =>
                homologacao.esta_homologado
                  ? setShowModalSuspender(true)
                  : setPropsModalPadrao("nao-homologar")
              }
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              disabled={values.necessita_analise_sensorial === "1"}
            />
            <Botao
              texto="Corrigir"
              className="me-3 float-end"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              onClick={() => setPropsModalPadrao("corrigir")}
              disabled={values.necessita_analise_sensorial === "0"}
            />
            <Botao
              texto="Solicitar análise sensorial"
              className="me-3 float-end"
              type={BUTTON_TYPE.BUTTON}
              onClick={() => setPropsModalPadrao("analise")}
              style={BUTTON_STYLE.GREEN}
              disabled={values.necessita_analise_sensorial === "0"}
            />
          </>
        )}
      </div>
      <div className="col-12">
        <hr />
      </div>
    </div>
  );
};
export default BotoesGPCODAE;
