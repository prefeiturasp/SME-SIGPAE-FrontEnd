import React, { useState } from "react";
import Botao from "../../../../../Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "../../../../../Shareable/Botao/constants";
import ModalCancelaDietaEspecial from "../ModalCancelaDietaEspecial";
import {
  usuarioEhNutricionistaSupervisao,
  usuarioEhDRE,
} from "src/helpers/utilities";

const EscolaCancelaDietaEspecial = ({ uuid, onCancelar }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <ModalCancelaDietaEspecial
        uuid={uuid}
        showModal={showModal}
        onCloseModal={() => setShowModal(false)}
        onCancelar={() => {
          setShowModal(false);
          onCancelar();
        }}
      />
      {!usuarioEhNutricionistaSupervisao() && !usuarioEhDRE() && (
        <div className="form-group row float-end mt-4">
          <Botao
            texto="Cancelar"
            className="ms-3"
            onClick={() => setShowModal(true)}
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN_OUTLINE}
          />
        </div>
      )}
    </>
  );
};

export default EscolaCancelaDietaEspecial;
