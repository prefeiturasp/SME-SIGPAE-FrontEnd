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
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleShowVoltar = () => {
    if (
      ehCronogramaNovo ||
      ehFornecedorNovo ||
      ehFornecedorCiente ||
      ehDilogDiretoriaAbastecimento ||
      ehDilogAbastecimentoCiente ||
      ehCronogramaEmAnalise
    ) {
      setShowVoltar(true);
    } else {
      navigate(-1);
    }
  };

  const handleSim = async () => {
    setLoading(true);
    await handleSubmit();
    setLoading(false);
  };

  const enviaAnaliseCronograma = async (values) => {
    setLoading(true);
    await handleSubmitCronograma(values);
    setLoading(false);
  };

  const validarEnvio = () => {
    if (!podeSubmeter) {
      toastError("Selecione os campos obrigatórios");
      return false;
    }
    return true;
  };

  const ehFornecedorCiente =
    usuarioEhEmpresaFornecedor() &&
    solicitacaoAlteracaoCronograma?.status ===
      "Alteração Enviada ao Fornecedor";

  const ehFornecedorNovo =
    usuarioEhEmpresaFornecedor() && !solicitacaoAlteracaoCronograma;

  const ehCronogramaNovo =
    (usuarioEhCronograma() ||
      usuarioEhDilogDiretoria() ||
      usuarioEhCodaeDilog()) &&
    !solicitacaoAlteracaoCronograma;

  const ehCronogramaEmAnalise =
    (usuarioEhCronograma() || usuarioEhCodaeDilog()) &&
    solicitacaoAlteracaoCronograma?.status === "Em análise";

  const ehDilogAbastecimentoCiente =
    usuarioEhDilogAbastecimento() &&
    solicitacaoAlteracaoCronograma?.status === "Cronograma ciente";

  const ehDilogDiretoriaAbastecimento =
    usuarioEhDilogDiretoria() &&
    ["Aprovado Abastecimento", "Reprovado Abastecimento"].includes(
      solicitacaoAlteracaoCronograma?.status,
    );

  const botoes = [
    {
      cond: ehFornecedorCiente,
      texto: "Ciente da Alteração",
      Modal: ModalCienciaAlteracao,
      handleSim,
    },
    {
      cond: ehFornecedorNovo,
      texto: "Enviar Solicitação",
      Modal: ModalEnviarSolicitacao,
      handleSim,
      validar: validarEnvio,
    },
    {
      cond: ehCronogramaNovo,
      texto: "Enviar Alteração",
      Modal: ModalEnviarAlteracao,
      handleSim,
      validar: validarEnvio,
    },
    {
      cond: ehCronogramaEmAnalise,
      texto: "Enviar Abastecimento",
      Modal: ModalAnalise,
      handleSim: enviaAnaliseCronograma,
    },
    {
      cond: ehDilogAbastecimentoCiente,
      texto: "Enviar DILOG",
      Modal: ModalAnaliseAbastecimento,
      handleSim,
      disabled: disabledAbastecimento,
    },
    {
      cond: ehDilogDiretoriaAbastecimento,
      texto: "Enviar Fornecedor",
      Modal: ModalAnaliseDilog,
      handleSim,
      disabled: disabledDilog,
    },
  ];

  return (
    <>
      {botoes.map(({ cond, texto, Modal, handleSim, disabled, validar }, i) =>
        cond ? (
          <React.Fragment key={i}>
            <Botao
              texto={texto}
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN}
              className="float-end ms-3"
              disabled={disabled}
              onClick={() => {
                if (validar && !validar()) return;
                handleShow();
              }}
            />
            <Modal
              show={show}
              handleClose={handleClose}
              loading={loading}
              handleSim={handleSim}
              setShow={setShow}
            />
          </React.Fragment>
        ) : null,
      )}
      <Botao
        texto="Voltar"
        type={BUTTON_TYPE.BUTTON}
        style={BUTTON_STYLE.GREEN_OUTLINE}
        className="float-end ms-3"
        onClick={handleShowVoltar}
      />
      <ModalVoltar
        modalVoltar={showVoltar}
        setModalVoltar={() => setShowVoltar(false)}
      />
    </>
  );
};
