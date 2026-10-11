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

export const CadastrarEscolaAberta = () => {
  const navigate = useNavigate();

  const initialValues = {
    titulo_cadastro: "",
    periodo_realizacao_de: null,
    periodo_realizacao_ate: null,
    unidades_participantes: [
      {
        id: "123",
        dreLoteNome: "DRE/LOTE",
        unidadeEducacional: "EMEF TESTE",
        participantes_num: 5,
        alimentacaoParticipantes: "Lanche 4h",
      },
    ],
  };

  const onSubmitApi = async () => {
    // await cadastrarRecreioNasFerias(payload);
  };

  return (
    <div className="card recreio-nas-ferias-container">
      <div className="card-body">
        <div className="row mt-3 mb-3 header-container">
          <div className="col-4">
            <div className="title"></div>
          </div>
          <Botao
            className="text-end recreio-cadastrados-botao"
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

        <EscolaAbertaForm
          mode="create"
          initialValues={initialValues}
          onSubmitApi={onSubmitApi}
        />
      </div>
    </div>
  );
};
