import React, { useState } from "react";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import ModalCancelarHomologacaoProduto from "./ModalCancelarHomologacaoProduto";

export const BotoesTerceirizada = ({
  homologacao,
  produto,
  getHomologacaoProdutoAsync,
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="row">
      <ModalCancelarHomologacaoProduto
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        produto={produto || {}}
        idHomologacao={homologacao.uuid}
        onAtualizarHomologacao={() => getHomologacaoProdutoAsync()}
      />
      <div className="col-12">
        <Botao
          texto="Cancelar Solicitação"
          className="float-end"
          type={BUTTON_TYPE.BUTTON}
          onClick={() => setShowModal(true)}
          style={BUTTON_STYLE.GREEN}
        />
      </div>
      <div className="col-12">
        <hr />
      </div>
    </div>
  );
};
export default BotoesTerceirizada;
