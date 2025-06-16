import HTTP_STATUS from "http-status-codes";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { Field, Form } from "react-final-form";

import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { InputComData } from "src/components/Shareable/DatePicker";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import Select from "src/components/Shareable/Select";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import { meusDados } from "src/services/perfil.service";

import { TIPO_PERFIL } from "src/constants/shared";

import {
  formFiltrosObtemDreEEscolasNovo,
  getDadosIniciais,
  validateFormDreEscola,
} from "src/helpers/dietaEspecial";

import { getAlergiasIntolerancias } from "src/services/dietaEspecial.service";

import "./styles.scss";

export default ({ onSubmit, loading, setLoading }) => {
  const [diretoriasRegionais, setDiretoriasRegionais] = useState([
    { value: "", label: "Carregando..." },
  ]);
  const [escolas, setEscolas] = useState([
    { value: "", label: "Carregando...", dre: { uuid: "" } },
  ]);
  const [diagnosticos, setDiagnosticos] = useState([
    { value: "", label: "Carregando..." },
  ]);
  const [dadosIniciais, setDadosIniciais] = useState({});

  const tipoUsuario = localStorage.getItem("tipo_perfil");

  useEffect(() => {
    async function effect() {
      const dadosUsuario = await meusDados();
      const promiseDreEscolas = formFiltrosObtemDreEEscolasNovo(
        setEscolas,
        setDiretoriasRegionais,
        dadosUsuario
      );
      const promiseDadosIniciais = getDadosIniciais(dadosUsuario);
      const promiseDiagnosticos = getAlergiasIntolerancias();
      const [, responseDadosIniciais, responseDiagnosticos] = await Promise.all(
        [promiseDreEscolas, promiseDadosIniciais, promiseDiagnosticos]
      );
      setDadosIniciais(responseDadosIniciais);
      if (responseDiagnosticos.status === HTTP_STATUS.OK) {
        setDiagnosticos(
          responseDiagnosticos.data.map((d) => {
            return {
              value: d.id,
              label: d.descricao,
            };
          })
        );
      } else {
        toastError("Erro ao obter os diagnósticos");
      }
      setLoading(false);
    }
    effect();
  }, []);

  const getEscolasFiltrado = (dre) => {
    if (
      tipoUsuario === TIPO_PERFIL.DIRETORIA_REGIONAL ||
      tipoUsuario === TIPO_PERFIL.ESCOLA
    ) {
      return escolas;
    } else if (dre) {
      if (dre.length === 0) {
        return escolas;
      } else {
        return escolas.filter((e) => dre.includes(e.dre.uuid));
      }
    }
    return escolas;
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={dadosIniciais}
      subscription={{ submitting: true, values: true }}
      validate={validateFormDreEscola}
      render={({ handleSubmit, form, submitting, values }) => {
        return (
          <form
            onSubmit={handleSubmit}
            className="form-filtros-rel-quant-diag-dieta-esp"
          >
            <div className="row">
              <div className="col-6">
                <span
                  onClick={(e) => {
                    const value = e.target.checked;
                    if (value) {
                      form.change(
                        "dre",
                        diretoriasRegionais.map((v) => v.value)
                      );
                      form.change("status", "ativas");
                    } else {
                      if (
                        tipoUsuario !== TIPO_PERFIL.ESCOLA &&
                        tipoUsuario !== TIPO_PERFIL.DIRETORIA_REGIONAL
                      ) {
                        form.change("dre", undefined);
                        form.change("status", undefined);
                      }
                    }
                  }}
                >
                  <Field
                    component={"input"}
                    type="checkbox"
                    name="somente_dietas_ativas"
                  />
                </span>
                <span className="checkbox-custom" />
                <label
                  htmlFor="somente_dietas_ativas"
                  className="checkbox-label"
                >
                  Visualizar somente diagnóstico ativo
                </label>
              </div>
            </div>
            <div className="row">
              <div className="col-5">
                <Field
                  label="Diretoria Regional de Educação"
                  component={MultiSelect}
                  name="dre"
                  multiple
                  disableSearch
                  disabled={
                    loading ||
                    values.somente_dietas_ativas ||
                    (values.escola && values.escola.length > 0) ||
                    tipoUsuario === TIPO_PERFIL.DIRETORIA_REGIONAL ||
                    tipoUsuario === TIPO_PERFIL.ESCOLA
                  }
                  isLoading={loading}
                  options={diretoriasRegionais}
                  nomeDoItemNoPlural="diretorias regionais"
                  pluralFeminino
                  required={
                    tipoUsuario !== TIPO_PERFIL.DIRETORIA_REGIONAL &&
                    tipoUsuario !== TIPO_PERFIL.ESCOLA
                  }
                  onChangeEffect={() => {
                    tipoUsuario !== TIPO_PERFIL.ESCOLA &&
                      form.change("escola", []);
                  }}
                />
              </div>
              <div className="col-7">
                <Field
                  label="Unidade Escolar"
                  component={MultiSelect}
                  name="escola"
                  multiple
                  disableSearch
                  disabled={
                    loading ||
                    values.somente_dietas_ativas ||
                    tipoUsuario === TIPO_PERFIL.ESCOLA ||
                    (values.dre && values.dre.length > 1)
                  }
                  isLoading={loading}
                  options={getEscolasFiltrado(values.dre)}
                  nomeDoItemNoPlural="escolas"
                  pluralFeminino
                  required={
                    tipoUsuario !== TIPO_PERFIL.DIRETORIA_REGIONAL &&
                    tipoUsuario !== TIPO_PERFIL.ESCOLA
                  }
                />
              </div>
            </div>
            <div className="row">
              <div className="col-4">
                <Field
                  label="Diagnóstico"
                  component={MultiSelect}
                  name="diagnostico"
                  multiple
                  disableSearch
                  disabled={loading}
                  isLoading={loading}
                  options={diagnosticos}
                  nomeDoItemNoPlural="diagnósticos"
                />
              </div>
              <div className="col-2">
                <Field
                  label="Status"
                  component={Select}
                  name="status"
                  disabled={values.somente_dietas_ativas}
                  options={[
                    { uuid: "", nome: "Todos" },
                    { uuid: "ativas", nome: "Ativa" },
                    { uuid: "inativas", nome: "Inativa" },
                    { uuid: "pendentes", nome: "Pendente de aprovação" },
                  ]}
                  naoDesabilitarPrimeiraOpcao
                />
              </div>
              <div className="col-3">
                <Field
                  key={values.somente_dietas_ativas ? 1 : 0}
                  component={InputComData}
                  label="Data da solicitação"
                  name="data_inicial"
                  className="data-inicial"
                  placeholder="De"
                  minDate={null}
                  maxDate={
                    values.data_final
                      ? moment(values.data_final, "DD/MM/YYYY")._d
                      : moment()._d
                  }
                  required={!values.somente_dietas_ativas}
                />
              </div>
              <div className="col-3">
                <Field
                  key={values.somente_dietas_ativas ? 3 : 2}
                  component={InputComData}
                  label="&nbsp;"
                  name="data_final"
                  popperPlacement="bottom-end"
                  placeholder="Até"
                  minDate={
                    values.data_inicial
                      ? moment(values.data_inicial, "DD/MM/YYYY")._d
                      : null
                  }
                  maxDate={moment()._d}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12 botoes-envio">
                <Botao
                  texto="Limpar Filtros"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                  disabled={submitting}
                  onClick={form.reset}
                />
                <Botao
                  style={BUTTON_STYLE.GREEN}
                  texto="Consultar"
                  className="ms-3"
                  type={BUTTON_TYPE.SUBMIT}
                  disabled={loading || submitting}
                />
              </div>
            </div>
          </form>
        );
      }}
    />
  );
};
