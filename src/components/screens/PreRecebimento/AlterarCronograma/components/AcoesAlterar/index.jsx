import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "components/Shareable/Botao/constants";
import { toastError } from "components/Shareable/Toast/dialogs";
import {
  usuarioEhCronograma,
  usuarioEhDilogDiretoria,
  usuarioEhDinutreDiretoria,
  usuarioEhEmpresaFornecedor,
} from "helpers/utilities";
import ModalEnviarSolicitacao from "../Modals/ModalEnviarSolicitacao";
import ModalAnalise from "../Modals/ModalAnalise";
import ModalAnaliseDinutre from "../Modals/ModalAnaliseDinutre";
import ModalAnaliseDilog from "../Modals/ModalAnaliseDilog";
import ModalEnviarAlteracao from "../Modals/ModalEnviarAlteracao";
import ModalCienciaAlteracao from "../Modals/ModalCienciaAlteracao";

export default ({
  handleSubmit,
  handleSubmitCronograma,
  podeSubmeter,
  solicitacaoAlteracaoCronograma,
  disabledDinutre,
  disabledDilog,
}) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    history.goBack();
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

      {usuarioEhCronograma() && !solicitacaoAlteracaoCronograma && (
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
      {usuarioEhCronograma() &&
        solicitacaoAlteracaoCronograma &&
        solicitacaoAlteracaoCronograma.status === "Em análise" && (
          <>
            <Botao
              texto="Enviar DINUTRE"
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

      {usuarioEhDinutreDiretoria() &&
        solicitacaoAlteracaoCronograma.status === "Cronograma ciente" && (
          <>
            <Botao
              texto="Enviar DILOG"
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN}
              className="float-end ms-3"
              onClick={() => handleShow()}
              disabled={disabledDinutre}
            />
            <ModalAnaliseDinutre
              show={show}
              handleClose={handleClose}
              loading={loading}
              handleSim={handleSim}
            />
          </>
        )}

      {usuarioEhDilogDiretoria() &&
        ["Aprovado DINUTRE", "Reprovado DINUTRE"].includes(
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
        onClick={() => handleBack()}
      />
    </>
  );
};
