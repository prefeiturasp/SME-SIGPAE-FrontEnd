import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Spin } from "antd";
import {
  getGuiaDetalhe,
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
import ConferenciaDetalhe from "./components/ConferenciaDetalhe";
import "./styles.scss";

import {
  CONFERENCIA_GUIA,
  LOGISTICA,
  REPOSICAO_GUIA
} from "configs/constants.js";
import InsucessoDetalhe from "./components/InsucessoDetalhe/index.jsx";

const FORM_NAME = "detalhamentoGuiaRemessa";

export default () => {
  const [guia, setGuia] = useState({});
  const [conferencia, setConferencia] = useState();
  const [reposicao, setReposicao] = useState();
  const [carregando, setCarregando] = useState(false);
  const [initialValues, setInitialValues] = useState({});

  const montaConferencia = (guia, reposicao) => {
    let conferencia = guia.conferencias.find(
      conf => conf.eh_reposicao === reposicao
    );
    if (conferencia) {
      conferencia.conferencia_dos_alimentos = guia.alimentos.map(alimento => {
        alimento.embalagens = alimento.embalagens.map(emb => {
          let conf = conferencia.conferencia_dos_alimentos.find(
            conf =>
              alimento.nome_alimento === conf.nome_alimento &&
              emb.tipo_embalagem === conf.tipo_embalagem
          );
          if (guia.status === "Recebida") {
            conf = {};
            conf.status_alimento = "Recebido";
            conf.qtd_recebido = emb.qtd_volume;
          }

          return { ...emb, ...conf };
        });

        return { ...alimento };
      });
    }
    return conferencia;
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
    const carregarGuia = async uuid => {
      let response;
      try {
        setCarregando(true);
        response = await getGuiaDetalhe(uuid);
        setGuia(response.data);
        setConferencia(montaConferencia(response.data, false));
        setReposicao(montaConferencia(response.data, true));
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
                {guia.alimentos &&
                  [
                    "Pendente de conferência",
                    "Insucesso de entrega",
                    "Cancelada"
                  ].includes(guia.status) && (
                    <>
                      <hr />
                      <div className="titulo-secao">
                        Alimentos pendentes de conferência:
                      </div>
                      <TabelaAlimentoConsolidado
                        className="table-sm tabela-conferencia-guia"
                        alimentosConsolidado={guia.alimentos}
                      />
                    </>
                  )}

                {guia && guia.insucessos && guia.insucessos[0] && (
                  <>
                    <hr />
                    <InsucessoDetalhe insucesso={guia.insucessos[0]} />
                  </>
                )}

                {conferencia && (
                  <>
                    <hr />
                    <ConferenciaDetalhe conferencia={conferencia} />
                  </>
                )}

                {reposicao && (
                  <>
                    <hr />
                    <ConferenciaDetalhe
                      conferencia={reposicao}
                      reposicaoFlag={true}
                    />
                  </>
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
