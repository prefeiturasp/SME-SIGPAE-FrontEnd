import moment from "moment";
import React, { useState, useEffect } from "react";
import { Field, Form } from "react-final-form";
import AutoCompleteField from "src/components/Shareable/AutoCompleteField";
import SSelect from "src/components/Shareable/Select";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import {
  getAlergiasIntolerancias,
  getClassificacoesDietaEspecial,
} from "src/services/dietaEspecial.service";
import { dadosDoAluno, getAlunosListagem } from "src/services/perfil.service";
import InputText from "src/components/Shareable/Input/InputText";
import { meusDados } from "src/services/perfil.service";
import { length, required } from "src/helpers/fieldValidators";

import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { InputComData } from "src/components/Shareable/DatePicker";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";

import { TIPO_PERFIL } from "src/constants/shared";

import {
  formFiltrosObtemDreEEscolasNovo,
  getDadosIniciais,
} from "src/helpers/dietaEspecial";

import "./styles.scss";
import { getStatus } from "./helpers";

export default ({ onSubmit, setCarregando }) => {
  const [diretoriasRegionais, setDiretoriasRegionais] = useState([]);
  const [escolas, setEscolas] = useState([]);
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [classificacoesDieta, setClassificacoesDieta] = useState([]);
  const [carregandoAluno, setCarregandoAluno] = useState(null);
  const [desabilitarAluno, setDesabilitarAluno] = useState(null);
  const [dadosIniciais, setDadosIniciais] = useState({});
  const [alunos, setAlunos] = useState([]);

  const tipoUsuario = localStorage.getItem("tipo_perfil");

  const length7 = length(7);

  useEffect(() => {
    async function effect() {
      setCarregando(true);
      const dadosUsuario = await meusDados();
      const promiseDiagnosticos = getAlergiasIntolerancias();
      const promiseClassificoesDieta = getClassificacoesDietaEspecial();
      const promiseDreEscolas = formFiltrosObtemDreEEscolasNovo(
        setEscolas,
        setDiretoriasRegionais,
        dadosUsuario
      );
      const promiseDadosIniciais = getDadosIniciais(dadosUsuario);
      const [
        ,
        dadosIniciaisObtidos,
        responseDiagnosticos,
        responseClassificacoesDieta,
      ] = await Promise.all([
        promiseDreEscolas,
        promiseDadosIniciais,
        promiseDiagnosticos,
        promiseClassificoesDieta,
      ]);
      setDadosIniciais(dadosIniciaisObtidos);
      setDiagnosticos(
        responseDiagnosticos.data.map((d) => {
          return { value: d.id, label: d.descricao };
        })
      );
      getAlunos(dadosIniciaisObtidos);
      setClassificacoesDieta(
        responseClassificacoesDieta.data.map((c) => {
          return { value: c.id, label: c.nome };
        })
      );
      setCarregando(false);
    }
    effect();
  }, []);

  const getAlunos = async (dadosIniciais) => {
    if (tipoUsuario === TIPO_PERFIL.DIRETORIA_REGIONAL) {
      const response = await getAlunosListagem({ dre: dadosIniciais.dre[0] });
      setAlunos(response.data.results.map((aluno) => aluno.nome));
    } else if (tipoUsuario === TIPO_PERFIL.ESCOLA) {
      const response = await getAlunosListagem({
        escola: dadosIniciais.escola[0],
      });
      setAlunos(response.data.results.map((aluno) => aluno.nome));
    } else {
      const response = await getAlunosListagem();
      setAlunos(response.data.results.map((aluno) => aluno.nome));
    }
  };

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
    return [];
  };

  const getAlunosFiltrado = (nomeAluno) => {
    if (nomeAluno) {
      const reg = new RegExp(nomeAluno, "i");
      return alunos.filter((a) => reg.test(a));
    }
    return [];
  };

  const getAlunoPorEol = async (codigoEol, values) => {
    if (isNaN(parseInt(codigoEol)) || codigoEol.length !== 7) {
      setDesabilitarAluno(false);
      setDadosIniciais({ ...values, nome_aluno: "" });
      return;
    }
    setCarregandoAluno(true);
    const resposta = await dadosDoAluno(codigoEol);
    if (resposta.status !== 200) {
      setDesabilitarAluno(false);
      setDadosIniciais({ ...values, nome_aluno: "" });
      toastError("Não há dieta especial para o aluno informado.");
    } else if (resposta.status === 200) {
      if (
        tipoUsuario === TIPO_PERFIL.ESCOLA &&
        resposta.data.escola.uuid !== values.escola[0]
      ) {
        toastError("Código EOL do aluno não pertence a esta unidade escolar.");
        setDesabilitarAluno(false);
        setDadosIniciais({ ...values, nome_aluno: "" });
      } else if (
        tipoUsuario === TIPO_PERFIL.DIRETORIA_REGIONAL &&
        resposta.data.escola.diretoria_regional.uuid !== values.dre[0]
      ) {
        toastError("Código EOL do aluno não pertence a esta DRE.");
        setDesabilitarAluno(false);
        setDadosIniciais({ ...values, nome_aluno: "" });
      } else {
        setDesabilitarAluno(true);
        setDadosIniciais({ ...values, nome_aluno: resposta.data.nome });
      }
    }
    setCarregandoAluno(false);
  };

  const onReset = (form, values) => {
    if (tipoUsuario === TIPO_PERFIL.DIRETORIA_REGIONAL) {
      form.reset({ dre: values.dre });
    } else if (tipoUsuario === TIPO_PERFIL.ESCOLA) {
      form.reset({ dre: values.dre, escola: values.escola });
    } else {
      form.restart({});
    }
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={dadosIniciais}
      subscription={{ submitting: true, values: true }}
      render={({ handleSubmit, form, submitting, values }) => {
        return (
          <form
            onSubmit={handleSubmit}
            className="form-filtros-rel-quant-solic-dieta-esp"
          >
            <div className="row">
              <div className="col-4">
                <Field
                  dataTestId="select-dre"
                  label="Diretoria Regional de Educação"
                  component={SSelect}
                  className="input-busca-dre form-control"
                  name="dre"
                  disabled={
                    tipoUsuario === TIPO_PERFIL.DIRETORIA_REGIONAL ||
                    tipoUsuario === TIPO_PERFIL.ESCOLA
                  }
                  options={[{ nome: "Selecione...", uuid: "" }].concat(
                    diretoriasRegionais.map((dre) => {
                      return { uuid: dre.value, nome: dre.label };
                    })
                  )}
                  validate={required}
                  required={true}
                />
              </div>
              <div className="col-4">
                <Field
                  label="Unidade Escolar"
                  component={MultiSelect}
                  disableSearch
                  name="escola"
                  multiple
                  disabled={tipoUsuario === TIPO_PERFIL.ESCOLA}
                  options={getEscolasFiltrado(values.dre)}
                  nomeDoItemNoPlural="escolas"
                  pluralFeminino
                />
              </div>
              <div className="col-4">
                <Field
                  label="Diagnóstico"
                  component={MultiSelect}
                  disableSearch
                  name="diagnostico"
                  multiple
                  options={diagnosticos}
                  nomeDoItemNoPlural="diagnósticos"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-4">
                <Field
                  label="Cód. EOL do Aluno"
                  component={InputText}
                  name="codigo_eol_aluno"
                  placeholder="Insira o Código"
                  className="form-control"
                  type="number"
                  disabled={carregandoAluno}
                  validate={length7}
                  inputOnChange={(e) => {
                    const value = e.target.value;
                    const values_ = form.getState().values;
                    getAlunoPorEol(value, values_);
                  }}
                />
              </div>
              <div className="col-8 pt-2">
                <Field
                  component={AutoCompleteField}
                  dataSource={getAlunosFiltrado(values.nome_aluno)}
                  label="Nome do Aluno"
                  placeholder="Digite nome do aluno"
                  name="nome_aluno"
                  className="input-busca-aluno"
                  disabled={desabilitarAluno}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-4">
                <Field
                  label="Classificação da dieta"
                  component={MultiSelect}
                  disableSearch
                  name="classificacao"
                  multiple
                  nomeDoItemNoPlural="classificações"
                  pluralFeminino
                  options={classificacoesDieta}
                />
              </div>
              <div className="col-4">
                <Field
                  label="Situação"
                  component={MultiSelect}
                  disableSearch
                  name="status"
                  multiple
                  nomeDoItemNoPlural="Situações"
                  pluralFeminino
                  options={getStatus()}
                />
              </div>
              <div className="col-2">
                <Field
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
                />
              </div>
              <div className="col-2">
                <Field
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
                  onClick={() => onReset(form, values)}
                />
                <Botao
                  style={BUTTON_STYLE.GREEN}
                  texto="Consultar"
                  className="ms-3"
                  type={BUTTON_TYPE.SUBMIT}
                  disabled={submitting}
                />
              </div>
            </div>
          </form>
        );
      }}
    />
  );
};
