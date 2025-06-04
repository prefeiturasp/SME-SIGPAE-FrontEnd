import moment from "moment";
import React from "react";
import { Form, Field } from "react-final-form";
import FinalFormToRedux from "src/components/Shareable/FinalFormToRedux";
import { InputComData } from "src/components/Shareable/DatePicker";
import { InputText } from "src/components/Shareable/Input/InputText";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import { useLocation } from "react-router-dom";
import SelectSelecione from "src/components/Shareable/SelectSelecione";
import { useState } from "react";
import {
  getNomesDistribuidores,
  getNotificacoesOcorrenciaByUuid,
} from "src/services/logistica.service";
import { useEffect } from "react";
import { TIPOS_OCORRENCIAS_OPTIONS } from "src/constants/shared";
import { Checkbox, Spin } from "antd";
import HTTP_STATUS from "http-status-codes";
import "./style.scss";

const FORM_NAME = "guiasOcorrencias";

export default ({
  setFiltros,
  setGuias,
  setGuiasVinculadas,
  travaEmpresa,
  showVinculadas,
  setShowVinculadas,
  setNotificacaoIndex,
}) => {
  const [distribuidores, setDistribuidores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notificacao, setNotificacao] = useState(null);
  const [erro, setErro] = useState("");

  let initialValues = {};
  const location = useLocation();

  const onSubmit = async (values) => {
    const filtros = { ...values };
    setFiltros({ ...filtros });
  };

  const onChangeVinculadas = (event) => {
    setShowVinculadas(event.target.checked);
  };

  useEffect(() => {
    const buscaDistribuidores = async () => {
      const response = await getNomesDistribuidores();
      setDistribuidores(
        response.data.results.map((distribuidor) => ({
          nome: distribuidor.nome_fantasia,
          uuid: distribuidor.uuid,
        }))
      );
    };

    buscaDistribuidores();
  }, []);

  const getNotificacoesOcorrenciaAsync = async (uuid) => {
    const response = await getNotificacoesOcorrenciaByUuid(uuid);
    if (response.status === HTTP_STATUS.OK) {
      setNotificacao(response.data);
      setNotificacaoIndex(response.data);
      setGuiasVinculadas(response.data.guias_notificadas);
      setFiltros({
        empresa: response.data.empresa.uuid,
        notificacao_uuid: response.data.uuid,
      });
      setLoading(false);
    } else {
      setErro(
        "Erro ao carregar Notificação da Guia. Tente novamente mais tarde"
      );
    }
  };

  useEffect(() => {
    if (location.state) {
      getNotificacoesOcorrenciaAsync(location.state.guia.uuid);
    } else {
      setLoading(false);
    }
  }, [location]);

  return (
    <>
      <div className="filtros-guias-ocorrencias">
        <div className="titulo-verde">Guias com Notificações para Vincular</div>
        {erro && <div>{erro}</div>}
        <Spin tip="Carregando..." spinning={loading && !erro}>
          {((location.state && !!notificacao) || !location.state) && (
            <Form
              onSubmit={onSubmit}
              initialValues={initialValues}
              render={({ form, handleSubmit, values }) => (
                <form onSubmit={handleSubmit}>
                  <FinalFormToRedux form={FORM_NAME} />
                  <div className="row">
                    <div className="col-6">
                      <Field
                        component={SelectSelecione}
                        naoDesabilitarPrimeiraOpcao
                        defaultValue={notificacao && notificacao.empresa.uuid}
                        options={distribuidores}
                        label="Empresa"
                        name="empresa"
                        required
                        placeholder={"Selecione uma Empresa"}
                        disabled={travaEmpresa || notificacao}
                      />
                    </div>
                    <div className="col-6">
                      <Field
                        component={InputText}
                        apenasNumeros
                        label="Nº da Guia de Remessa"
                        name="numero_guia"
                        placeholder="Digite o Nº da Guia de Remessa"
                        className="input-numero-guia"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <Field
                        label="Motivo da Ocorrência"
                        component={MultiSelect}
                        disableSearch
                        name="motivos_ocorrencia"
                        multiple
                        nomeDoItemNoPlural="ocorrências"
                        options={TIPOS_OCORRENCIAS_OPTIONS}
                        placeholder="Selecione a Ocorrência"
                      />
                    </div>
                    <div className="col-3">
                      <Field
                        component={InputComData}
                        label="Período de Entrega"
                        name="data_inicial"
                        className="data-inicial"
                        placeholder="De"
                        writable={false}
                        minDate={null}
                        maxDate={
                          values.data_final
                            ? moment(values.data_final, "DD/MM/YYYY")._d
                            : null
                        }
                      />
                    </div>
                    <div className="col-3">
                      <Field
                        component={InputComData}
                        label="&nbsp;"
                        name="data_final"
                        className="data-final"
                        popperPlacement="bottom-end"
                        placeholder="Até"
                        writable={false}
                        strictParsing
                        minDate={
                          values.data_inicial
                            ? moment(values.data_inicial, "DD/MM/YYYY")._d
                            : null
                        }
                        maxDate={null}
                      />
                    </div>
                  </div>

                  <div className="mt-4 mb-4">
                    <div className="float-start">
                      <Checkbox
                        checked={showVinculadas}
                        onChange={onChangeVinculadas}
                      >
                        Exibir somente as guias já vinculadas
                      </Checkbox>
                    </div>

                    <Botao
                      texto="Consultar"
                      type={BUTTON_TYPE.SUBMIT}
                      style={BUTTON_STYLE.GREEN}
                      className="float-end ms-3"
                      disabled={!values.empresa}
                    />

                    {!travaEmpresa && (
                      <Botao
                        texto="Limpar Filtros"
                        type={BUTTON_TYPE.BUTTON}
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                        className="float-end ms-3"
                        onClick={() => {
                          form.reset({});
                          setShowVinculadas(false);
                          setGuias(undefined);
                        }}
                      />
                    )}
                  </div>
                </form>
              )}
            />
          )}
        </Spin>
      </div>
    </>
  );
};
