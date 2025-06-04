import React from "react";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";

type AdicionarRespostaType = {
  push: (_string) => {};
  nameFieldArray: string;
};

export const AdicionarResposta = ({ ...props }: AdicionarRespostaType) => {
  const { push, nameFieldArray } = props;

  return (
    <Botao
      className="col-3 mb-3"
      texto="Adicionar +"
      onClick={() => push(nameFieldArray)}
      style={BUTTON_STYLE.GREEN_OUTLINE}
      type={BUTTON_TYPE.BUTTON}
    />
  );
};
