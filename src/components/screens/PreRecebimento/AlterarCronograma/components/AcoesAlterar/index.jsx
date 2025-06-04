import React, { useState } from "react";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import {
  usuarioEhCronograma,
  usuarioEhDilogDiretoria,
  usuarioEhEmpresaFornecedor,
  usuarioEhCodaeDilog,
  usuarioEhDilogAbastecimento,
} from "src/helpers/utilities";
import ModalEnviarSolicitacao from "../Modals/ModalEnviarSolicitacao";
import ModalAnalise from "../Modals/ModalAnalise";
import ModalAnaliseAbastecimento from "../Modals/ModalAnaliseAbastecimento";
import ModalAnaliseDilog from "../Modals/ModalAnaliseDilog";
import ModalEnviarAlteracao from "../Modals/ModalEnviarAlteracao";
import ModalCienciaAlteracao from "../Modals/ModalCienciaAlteracao";
import ModalVoltar from "../../../../../Shareable/Page/ModalVoltar";

export default ({
  handleSubmit,
  handleSubmitCronograma,
  podeSubmeter,
  solicitacaoAlteracaoCronograma,
  disabledAbastecimento,
  disabledDilog,
}) => {
  const [show, setShow] = useState(false);
  const [showVoltar, setShowVoltar] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleShowVoltar = () => setShowVoltar(true);

  const enviaAnaliseCronograma = async (values) => {
    setLoading(true);
    await handleSubmitCronograma(values);
    setLoading(false);
  };

  const handleSim = async () => {
    setLoading(true);
    handleSubmit();
    setLoading(false);
  };

  return (
    <>
      {usuarioEhEmpresaFornecedor() &&
        solicitacaoAlteracaoCronograma &&
        solicitacaoAlteracaoCronograma.status ===
          "Alteração Enviada ao Fornecedor" && (
          <>
            <Botao
              texto="Ciente da Alteração"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN}
              className="float-end ms-3"
              onClick={() => {
                handleShow();
              }}
            />
            <ModalCienciaAlteracao
              show={show}
              handleClose={handleClose}
              loading={loading}
              handleSim={handleSim}
            />
          </>
        )}

      {usuarioEhEmpresaFornecedor() && !solicitacaoAlteracaoCronograma && (
        <>
          <Botao
            texto="Enviar Solicitação"
            type={BUTTON_TYPE.BUTTON}
            disabled={!podeSubmeter}
            style={BUTTON_STYLE.GREEN}
            className="float-end ms-3"
            onClick={() => {
              if (!podeSubmeter) {
                toastError("Selecione os campos obrigatórios");
                return;
              }
              handleShow();
            }}
          />
          <ModalEnviarSolicitacao
            show={show}
            handleClose={handleClose}
            loading={loading}
            handleSim={handleSim}
          />
        </>
      )}

      {(usuarioEhCronograma() || usuarioEhCodaeDilog()) &&
        !solicitacaoAlteracaoCronograma && (
          <>
            <Botao
              texto="Enviar Alteração"
              type={BUTTON_TYPE.BUTTON}
              disabled={!podeSubmeter}
              style={BUTTON_STYLE.GREEN}
              className="float-end ms-3"
              onClick={() => {
                if (!podeSubmeter) {
                  toastError("Selecione os campos obrigatórios");
                  return;
                }
                handleShow();
              }}
            />
            <ModalEnviarAlteracao
              show={show}
              handleClose={handleClose}
              loading={loading}
              handleSim={handleSim}
            />
          </>
        )}
      {(usuarioEhCronograma() || usuarioEhCodaeDilog()) &&
        solicitacaoAlteracaoCronograma &&
        solicitacaoAlteracaoCronograma.status === "Em análise" && (
          <>
            <Botao
              texto="Enviar Abastecimento"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN}
              className="float-end ms-3"
              onClick={() => handleShow()}
              disabled={!podeSubmeter}
            />
            <ModalAnalise
              show={show}
              setShow={setShow}
              handleClose={handleClose}
              loading={loading}
              handleSim={enviaAnaliseCronograma}
            />
          </>
        )}

      {usuarioEhDilogAbastecimento() &&
        solicitacaoAlteracaoCronograma.status === "Cronograma ciente" && (
          <>
            <Botao
              texto="Enviar DILOG"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN}
              className="float-end ms-3"
              onClick={() => handleShow()}
              disabled={disabledAbastecimento}
            />
            <ModalAnaliseAbastecimento
              show={show}
              handleClose={handleClose}
              loading={loading}
              handleSim={handleSim}
            />
          </>
        )}

      {usuarioEhDilogDiretoria() &&
        ["Aprovado Abastecimento", "Reprovado Abastecimento"].includes(
          solicitacaoAlteracaoCronograma.status
        ) && (
          <>
            <Botao
              texto="Enviar Fornecedor"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN}
              className="float-end ms-3"
              onClick={() => handleShow()}
              disabled={disabledDilog}
            />
            <ModalAnaliseDilog
              show={show}
              handleClose={handleClose}
              loading={loading}
              handleSim={handleSim}
            />
          </>
        )}
      <Botao
        texto="Voltar"
        type={BUTTON_TYPE.BUTTON}
        style={BUTTON_STYLE.GREEN_OUTLINE}
        className="float-end ms-3"
        onClick={() => handleShowVoltar()}
      />
      <ModalVoltar modalVoltar={showVoltar} setModalVoltar={handleClose} />
    </>
  );
};
