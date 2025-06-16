import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import {
  RELATORIO_FISCALIZACAO,
  RELATORIO_FISCALIZACAO_TERCEIRIZADAS,
  SUPERVISAO,
  TERCEIRIZADAS,
} from "src/configs/constants";
import React from "react";
import { useNavigate } from "react-router-dom";

export const ListaRelatorios = () => {
  const navigate = useNavigate();

  return (
    <div className="lista-relatorios-fiscalizacao-terceirizadas">
      <div className="card mt-3">
        <div className="card-body">
          <Botao
            texto="Cadastrar Novo Relatório de Fiscalização"
            type={BUTTON_TYPE.BUTTON}
            onClick={() =>
              navigate(
                `/${SUPERVISAO}/${TERCEIRIZADAS}/${RELATORIO_FISCALIZACAO_TERCEIRIZADAS}/${RELATORIO_FISCALIZACAO}`
              )
            }
            style={BUTTON_STYLE.GREEN}
            className="ms-3"
          />
        </div>
      </div>
    </div>
  );
};
