import { NavLink } from "react-router-dom";

import { CADASTRO_SALDO_LAUDO, RECEBIMENTO } from "src/configs/constants";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import Botao from "src/components/Shareable/Botao";

import "./style.scss";

export default () => {
  return (
    <div className="filtros-layouts-embalagens">
      <div className="pt-4 pb-4">
        <NavLink to={`/${RECEBIMENTO}/${CADASTRO_SALDO_LAUDO}`}>
          <Botao
            texto="Cadastrar Saldo do Laudo"
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN}
          />
        </NavLink>
      </div>
    </div>
  );
};
