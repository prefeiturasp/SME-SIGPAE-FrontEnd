import React from "react";
import { useNavigate } from "react-router-dom";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { EscolaAbertaForm } from "./components/EscolaAbertaForm";
import {
  CADASTROS,
  CONFIGURACOES,
  ESCOLA_ABERTA_CADASTRADAS,
} from "src/configs/constants";
import { cadastrarEscolaAberta } from "./escolaAberta.service";
import "./styles.scss";

export const CadastrarEscolaAberta = () => {
  const navigate = useNavigate();

  const initialValues = {
    periodo_realizacao_de: null,
    periodo_realizacao_ate: null,
    recorrencias: { dias_semana: [] },
    unidades_participantes: [],
  };

  const onSubmitApi = async (payload) => {
    await cadastrarEscolaAberta(payload);
  };

  return (
    <div className="card escola-aberta-container">
      <div className="card-body">
        <div className="header-container row">
          <div className="col-4" />
          <Botao
            className="text-end escola-aberta-botao"
            texto="Escola Aberta Cadastradas"
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN_OUTLINE}
            onClick={() =>
              navigate(
                `/${CONFIGURACOES}/${CADASTROS}/${ESCOLA_ABERTA_CADASTRADAS}`,
              )
            }
          />
        </div>

        <hr />

        <EscolaAbertaForm
          mode="create"
          initialValues={initialValues}
          onSubmitApi={onSubmitApi}
        />
      </div>
    </div>
  );
};
