import React, { useEffect, useState } from "react";
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
import {
  cadastrarEscolaAberta,
  atualizarEscolaAberta,
  getEscolaAberta,
} from "./escolaAberta.service";
import "./styles.scss";
import { Spin } from "antd";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { mapApiToForm } from "./helper";

const initialValuesCreate = {
  periodo_realizacao_de: null,
  periodo_realizacao_ate: null,
  recorrencias: { dias_semana: [] },
  unidades_participantes: [],
};

export const CadastrarEscolaAberta = ({ uuid }: { uuid?: string }) => {
  const navigate = useNavigate();
  const isEdit = !!uuid;
  const [loading, setLoading] = useState(isEdit);
  const [initialValues, setInitialValues] = useState<any>(initialValuesCreate);

  useEffect(() => {
    if (!uuid) {
      setInitialValues(initialValuesCreate);
      return;
    }
    const carregar = async () => {
      try {
        setLoading(true);
        const { data } = await getEscolaAberta(uuid);
        setInitialValues(mapApiToForm(data));
      } catch {
        toastError("Erro ao carregar Escola Aberta.");
        navigate(`/${CONFIGURACOES}/${CADASTROS}/${ESCOLA_ABERTA_CADASTRADAS}`);
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, [uuid]);

  const onSubmitApi = async (payload: any) => {
    if (isEdit) {
      await atualizarEscolaAberta(uuid, payload);
    } else {
      await cadastrarEscolaAberta(payload);
    }
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

        <Spin tip="Carregando..." spinning={loading}>
          {!loading && (
            <EscolaAbertaForm
              key={uuid ?? "novo"}
              mode={isEdit ? "edit" : "create"}
              initialValues={initialValues}
              onSubmitApi={onSubmitApi}
            />
          )}
        </Spin>
      </div>
    </div>
  );
};
