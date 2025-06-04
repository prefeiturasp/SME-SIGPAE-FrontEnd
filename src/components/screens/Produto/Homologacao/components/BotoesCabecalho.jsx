import React, { useState } from "react";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON,
} from "src/components/Shareable/Botao/constants";
import ModalHistorico from "src/components/Shareable/ModalHistorico";
import { TIPO_PERFIL } from "src/constants/shared";
import { ModalPadrao } from "src/components/Shareable/ModalPadrao";
import {
  CODAEPedeAnaliseSensorialProduto,
  imprimeFichaIdentificacaoProduto,
} from "src/services/produto.service";
import ModalAtivacaoSuspensaoProduto from "../../AtivacaoSuspensao/ModalAtivacaoSuspensaoProduto";
import { usuarioEhEmpresaTerceirizada } from "src/helpers/utilities";

export const BotoesCabecalho = ({
  homologacao,
  getHomologacaoProdutoAsync,
  terceirizadas,
  protocoloAnalise,
  ehCardSuspensos,
}) => {
  const ehGPCODAE =
    localStorage.getItem("tipo_perfil") === TIPO_PERFIL.GESTAO_PRODUTO;
  const [showModal, setShowModal] = useState(false);
  const [showModalAnaliseSensorial, setShowModalAnaliseSensorial] =
    useState(false);
  const [showModalSuspender, setShowModalSuspender] = useState(false);
  const [acao, setAcao] = useState();

  const checaStatus = (status) => {
    return [
      "CODAE_HOMOLOGADO",
      "CODAE_AUTORIZOU_RECLAMACAO",
      "ESCOLA_OU_NUTRICIONISTA_RECLAMOU",
    ].includes(status);
  };

  const getHistorico = () => {
    getHomologacaoProdutoAsync();
    return homologacao.logs;
  };

  return (
    <>
      <div className="row">
        <ModalHistorico
          visible={showModal}
          onOk={() => setShowModal(false)}
          onCancel={() => setShowModal(false)}
          logs={homologacao.logs}
          getHistorico={() => getHistorico}
        />
        <ModalPadrao
          showModal={showModalAnaliseSensorial}
          closeModal={() => setShowModalAnaliseSensorial(false)}
          toastSuccessMessage="Solicitação de análise sensorial enviada com sucesso"
          modalTitle="Deseja solicitar a análise sensorial do produto?"
          endpoint={CODAEPedeAnaliseSensorialProduto}
          uuid={homologacao.uuid}
          protocoloAnalise={protocoloAnalise}
          loadSolicitacao={() => getHomologacaoProdutoAsync()}
          justificativa={homologacao.justificativa}
          labelJustificativa="Informações Adicionais"
          helpText="Solicitamos que seja informado a quantidade e descrição para análise sensorial"
          eAnalise={true}
          terceirizadas={terceirizadas}
          status={homologacao.status}
          terceirizada={homologacao.rastro_terceirizada}
          tipoModal="analise"
        />
        <ModalAtivacaoSuspensaoProduto
          showModal={showModalSuspender}
          closeModal={() => setShowModalSuspender(false)}
          acao={acao}
          produto={homologacao.produto}
          idHomologacao={homologacao.uuid}
          atualizarDados={() => getHomologacaoProdutoAsync()}
          ehCardSuspensos={ehCardSuspensos}
          status={homologacao.status}
        />
        <div className="col-12">
          {usuarioEhEmpresaTerceirizada() && homologacao.tem_copia && (
            <span className="msg-atualizacao-em-andamento">
              Não é possível realizar edições neste produto no momento, pois já
              existe uma solicitação de atualização de dados em andamento.
            </span>
          )}
          <Botao
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN}
            icon={BUTTON_ICON.PRINT}
            onClick={() => imprimeFichaIdentificacaoProduto(homologacao.uuid)}
            className="float-end"
          />
          <Botao
            type={BUTTON_TYPE.BUTTON}
            texto="Histórico"
            style={BUTTON_STYLE.GREEN_OUTLINE}
            onClick={() => setShowModal(true)}
            className="me-2 float-end"
          />
          {checaStatus(homologacao.status) && ehGPCODAE && ehCardSuspensos && (
            <Botao
              texto="Ativar"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              onClick={() => {
                setShowModalSuspender(true);
                setAcao("ativação");
              }}
              className="me-2 float-end"
            />
          )}
          {checaStatus(homologacao.status) && ehGPCODAE && !ehCardSuspensos && (
            <Botao
              texto="Suspender"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN_OUTLINE}
              onClick={() => {
                setShowModalSuspender(true);
                setAcao("suspensão");
              }}
              className="me-2 float-end"
            />
          )}
          {homologacao.status === "CODAE_HOMOLOGADO" &&
            ehGPCODAE &&
            !ehCardSuspensos && (
              <Botao
                texto="Solicitar análise sensorial"
                type={BUTTON_TYPE.BUTTON}
                onClick={() => setShowModalAnaliseSensorial(true)}
                style={BUTTON_STYLE.GREEN_OUTLINE}
                className="me-2 float-end"
              />
            )}
        </div>
      </div>
      <hr />
    </>
  );
};
export default BotoesCabecalho;
