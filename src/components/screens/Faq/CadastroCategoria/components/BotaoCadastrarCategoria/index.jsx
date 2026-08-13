import React from "react";
import { useNavigate } from "react-router-dom";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import * as constants from "src/configs/constants";

const CAMINHO_CADASTRAR_CATEGORIA = `/${constants.AJUDA}/${constants.CADASTRO_CATEGORIA}/${constants.CADASTRAR_CATEGORIA}`;

const BotaoCadastrarCategoria = () => {
  const navegar = useNavigate();

  const acessarCadastroCategoria = () => {
    navegar(CAMINHO_CADASTRAR_CATEGORIA);
  };

  return (
    <Botao
      texto="Cadastrar Categoria"
      type={BUTTON_TYPE.BUTTON}
      style={BUTTON_STYLE.GREEN}
      onClick={acessarCadastroCategoria}
    />
  );
};

export default BotaoCadastrarCategoria;
