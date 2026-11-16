import React from "react";
import { useNavigate } from "react-router-dom";

import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import {
  MEMORANDO_OCORRENCIAS,
  POS_RECEBIMENTO,
  REGISTRAR_MEMORANDO_OCORRENCIA,
} from "src/configs/constants";

import "./styles.scss";

const MemorandoOcorrencias = () => {
  const navigate = useNavigate();

  return (
    <div className="card mt-3 card-memorando-ocorrencias">
      <div className="card-body d-flex justify-content-end">
        <Botao
          texto="Registrar Ocorrência"
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN}
          dataTestId="registrar-ocorrencia"
          onClick={() =>
            navigate(
              `/${POS_RECEBIMENTO}/${MEMORANDO_OCORRENCIAS}/${REGISTRAR_MEMORANDO_OCORRENCIA}`,
            )
          }
        />
      </div>
    </div>
  );
};

export default MemorandoOcorrencias;
