import React from "react";
import { NavLink } from "react-router-dom";

import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import Botao from "src/components/Shareable/Botao";
import {
  CADASTRO_TERMO_RECEBIMENTO_DEFINITIVO,
  POS_RECEBIMENTO,
} from "src/configs/constants";

const TermoRecebimentoDefinitivo = () => (
  <div className="card mt-3 card-termo-recebimento-definitivo">
    <div className="card-body">
      <div className="botoes pt-4">
        <NavLink
          to={`/${POS_RECEBIMENTO}/${CADASTRO_TERMO_RECEBIMENTO_DEFINITIVO}`}
        >
          <Botao
            texto="Cadastrar"
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN}
            dataTestId="cadastrar-termo"
            onClick={() => {}}
          />
        </NavLink>
      </div>
    </div>
  </div>
);

export default TermoRecebimentoDefinitivo;
