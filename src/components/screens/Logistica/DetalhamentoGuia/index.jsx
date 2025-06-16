import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Spin } from "antd";
import {
  getGuiaDetalhe,
  imprimirGuiaRemessa,
} from "../../../../services/logistica.service";
import { Form, Field } from "react-final-form";
import FinalFormToRedux from "src/components/Shareable/FinalFormToRedux";
import { InputText } from "src/components/Shareable/Input/InputText";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";

import {
  CONFERENCIA_GUIA,
  LOGISTICA,
  REPOSICAO_GUIA,
} from "src/configs/constants";
import DetalheGuiaRemessa from "src/components/Logistica/DetalheGuiaRemessa/index.jsx";

const FORM_NAME = "detalhamentoGuiaRemessa";

export default () => {
  const [guia, setGuia] = useState({});
  const [carregando, setCarregando] = useState(false);
  const [initialValues, setInitialValues] = useState({});

  const baixarPDFGuiaRemessa = (guia) => {
    setCarregando(true);
    let uuid = guia.uuid;
    let numero = guia.numero_guia;
    imprimirGuiaRemessa(uuid, numero)
      .then(() => {
        setCarregando(false);
      })
      .catch((error) => {
        error.response.data.text().then((text) => toastError(text));
        setCarregando(false);
      });
  };

  const checaReposicao = (guia) => {
    let alimentosPendentes = guia.alimentos.filter((alimento) => {
      return (
        alimento.embalagens.filter((embalagem) => embalagem.qtd_a_receber !== 0)
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
            className="float-end ms-3"
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
            className="float-end ms-3"
          />
        </NavLink>
      );
    }
  };

  useEffect(() => {
    const carregarGuia = async (uuid) => {
      let response;
      try {
        setCarregando(true);
        response = await getGuiaDetalhe(uuid);
        setGuia(response.data);
        setInitialValues({
          numero_guia: response.data.numero_guia,
          data_entrega: response.data.data_entrega,
          status: response.data.status,
        });
        setCarregando(false);
      } catch (e) {
        toastError(e.response.data.detail);
        setCarregando(false);
      }
    };

    const queryString = window.location.search;

    if (queryString) {
      const urlParams = new URLSearchParams(window.location.search);
      const uuidParametro = urlParams.get("uuid");
      carregarGuia(uuidParametro);
    }
  }, []);

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-detalhamento-guia">
        <div className="card-body detalhamento-guia">
          <Form
            onSubmit={() => {}}
            initialValues={initialValues}
            validate={() => {}}
            render={({ handleSubmit }) => (
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

                <DetalheGuiaRemessa guia={guia} />

                <hr />

                <div className="mt-4 mb-4">
                  {retornaBotaoAcao()}

                  <Botao
                    texto="Imprimir Guia"
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    className="float-end ms-3"
                    onClick={() => baixarPDFGuiaRemessa(guia)}
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
