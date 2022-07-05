import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Spin } from "antd";
import {
  getGuiaParaConferencia,
  imprimirGuiaRemessa
} from "../../../../services/logistica.service.js";
import { Form, Field } from "react-final-form";
import FinalFormToRedux from "components/Shareable/FinalFormToRedux";
import { InputText } from "components/Shareable/Input/InputText";
import TabelaAlimentoConsolidado from "components/Logistica/TabelaAlimentoConsolidado";
import { toastError } from "components/Shareable/Toast/dialogs";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE
} from "components/Shareable/Botao/constants";
import "./styles.scss";

import { gerarParametrosConsulta } from "helpers/utilities";
import {
  CONFERENCIA_GUIA,
  LOGISTICA,
  REPOSICAO_GUIA
} from "configs/constants.js";

const FORM_NAME = "detalhamentoGuiaRemessa";

export default () => {
  const [guia, setGuia] = useState({});
  const [carregando, setCarregando] = useState(false);
  const [initialValues, setInitialValues] = useState({});

  const carregarGuia = async uuid => {
    let response;
    try {
      setCarregando(true);
      const params = gerarParametrosConsulta({ uuid: uuid });
      response = await getGuiaParaConferencia(params);
      setGuia(response.data);
      setInitialValues({
        numero_guia: response.data.numero_guia,
        data_entrega: response.data.data_entrega,
        status: response.data.status
      });
      setCarregando(false);
    } catch (e) {
      toastError(e.response.data.detail);
      setCarregando(false);
    }
  };

  const baixarPDFGuiaRemessa = () => {
    setCarregando(true);
    let uuid = guia.uuid;
    imprimirGuiaRemessa(uuid)
      .then(() => {
        setCarregando(false);
      })
      .catch(error => {
        error.response.data.text().then(text => toastError(text));
        setCarregando(false);
      });
  };

  const checaReposicao = guia => {
    let alimentosPendentes = guia.alimentos.filter(alimento => {
      return (
        alimento.embalagens.filter(embalagem => embalagem.qtd_a_receber !== 0)
          .length > 0
      );
    });
    return alimentosPendentes.length > 0;
  };

  const retornaBotaoAcao = () => {
    if (
      ["Recebimento parcial", "Não recebida"].includes(guia.status) &&
      checaReposicao(guia) &&
      guia.situacao === "ATIVA"
    ) {
      return (
        <NavLink to={`/${LOGISTICA}/${REPOSICAO_GUIA}?uuid=${guia.uuid}`}>
          <Botao
            texto={`Realizar reposição`}
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN_OUTLINE}
            className="float-right ml-3"
          />
        </NavLink>
      );
    } else if (
      ["Pendente de conferência", "Insucesso de entrega"].includes(
        guia.status
      ) &&
      guia.situacao === "ATIVA"
    ) {
      return (
        <NavLink to={`/${LOGISTICA}/${CONFERENCIA_GUIA}?uuid=${guia.uuid}`}>
          <Botao
            texto={`Realizar conferência`}
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN_OUTLINE}
            className="float-right ml-3"
          />
        </NavLink>
      );
    }
  };

  useEffect(() => {
    const queryString = window.location.search;

    if (queryString) {
      const urlParams = new URLSearchParams(window.location.search);
      const uuidParametro = urlParams.get("uuid");
      carregarGuia(uuidParametro);
    }
  }, []);

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-conferencia-guia">
        <div className="card-body conferencia-guia">
          <Form
            onSubmit={() => {}}
            initialValues={initialValues}
            validate={() => {}}
            render={({ form, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <FinalFormToRedux form={FORM_NAME} />
                <div className="row">
                  <div className="col-4">
                    <Field
                      component={InputText}
                      label="Número da guia de remessa"
                      name="numero_guia"
                      className="input-busca-produto"
                      disabled
                    />
                  </div>
                  <div className="col-4">
                    <Field
                      component={InputText}
                      label="Data de entrega prevista"
                      name="data_entrega"
                      className="input-busca-produto"
                      disabled
                    />
                  </div>
                  <div className="col-4">
                    <Field
                      component={InputText}
                      label="Status da guia"
                      name="status"
                      className="input-busca-produto"
                      disabled
                    />
                  </div>
                </div>
                <hr />
                {guia.alimentos && (
                  <TabelaAlimentoConsolidado
                    className="table-sm tabela-conferencia-guia"
                    alimentosConsolidado={guia.alimentos}
                  />
                )}

                <hr />

                <div className="mt-4 mb-4">
                  {retornaBotaoAcao()}

                  <Botao
                    texto="Imprimir Guia"
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    className="float-right ml-3"
                    onClick={() => baixarPDFGuiaRemessa()}
                  />
                </div>
              </form>
            )}
          />
        </div>
      </div>
    </Spin>
  );
};
