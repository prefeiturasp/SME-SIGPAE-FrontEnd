import React, { useState } from "react";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
  BUTTON_ICON,
} from "src/components/Shareable/Botao/constants";
import {
  CODAECancelaAnaliseSensorialProduto,
  imprimeFichaIdentificacaoProduto,
} from "src/services/produto.service";
import { useNavigate } from "react-router-dom";
import { usuarioEhCODAEGestaoProduto } from "src/helpers/utilities";
import { ModalPadrao } from "src/components/Shareable/ModalPadrao";
import { PAINEL_GESTAO_PRODUTO } from "src/configs/constants";

export const BotoesRodape = ({ homologacao }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="row">
      <ModalPadrao
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        toastSuccessMessage="Análise Sensorial cancelada com sucesso"
        modalTitle="Deseja cancelar a solicitação de amostra para análise sensorial deste produto?"
        labelJustificativa="Justificativa"
        uuid={homologacao.uuid}
        cancelaAnaliseSensorial={homologacao}
        endpoint={CODAECancelaAnaliseSensorialProduto}
        loadSolicitacao={() => navigate(`/${PAINEL_GESTAO_PRODUTO}`)}
      />
      <div className="col-12">
        <Botao
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN}
          texto="Imprimir"
          icon={BUTTON_ICON.PRINT}
          onClick={() => imprimeFichaIdentificacaoProduto(homologacao.uuid)}
          className="float-end"
        />
        {usuarioEhCODAEGestaoProduto() &&
          homologacao.status === "CODAE_PEDIU_ANALISE_SENSORIAL" && (
            <Botao
              type={BUTTON_TYPE.BUTTON}
              style={BUTTON_STYLE.GREEN}
              texto="Cancelar Análise Sensorial"
              icon={BUTTON_ICON.TIMES_CIRCLE}
              onClick={() => setShowModal(true)}
              className="me-2 float-end"
            />
          )}

        <Botao
          type={BUTTON_TYPE.BUTTON}
          texto="Voltar"
          style={BUTTON_STYLE.GREEN_OUTLINE}
          icon={BUTTON_ICON.ARROW_LEFT}
          onClick={() => navigate(-1)}
          className="me-2 float-end"
        />
      </div>
    </div>
  );
};
export default BotoesRodape;
