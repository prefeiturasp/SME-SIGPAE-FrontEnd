import React from "react";
import { useNavigate } from "react-router-dom";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import * as constants from "src/configs/constants";

const BotaoCadastrarDuvidasFrequentes = () => {
  const navegar = useNavigate();

  const acessarCadastroDuvidasFrequentes = () => {
    navegar(
      `/${constants.AJUDA}/${constants.CADASTRO_DUVIDAS_FREQUENTES}/${constants.CADASTRO_DUVIDAS_FREQUENTES}`,
    );
  };

  return (
    <Botao
      texto="Cadastrar Dúvidas Frequentes"
      type={BUTTON_TYPE.BUTTON}
      style={BUTTON_STYLE.GREEN}
      onClick={acessarCadastroDuvidasFrequentes}
    />
  );
};

export default BotaoCadastrarDuvidasFrequentes;
