import React, { useState, useEffect } from "react";
import { Form, Field } from "react-final-form";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import InputText from "src/components/Shareable/Input/InputText";
import Select from "src/components/Shareable/Select";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import AutoCompleteField from "src/components/Shareable/AutoCompleteField";
import FinalFormToRedux from "src/components/Shareable/FinalFormToRedux";
import { obtemDadosAlunoPeloEOL } from "src/services/perfil.service";
import { length } from "src/helpers/fieldValidators";

import { TIPO_PERFIL } from "src/constants/shared";

import {
  formFiltrosObtemDreEEscolasNovo,
  getDadosIniciais,
} from "src/helpers/dietaEspecial";

import { meusDados } from "src/services/perfil.service";
import { getAlunosListagem } from "src/services/perfil.service";

import "./styles.scss";

const FORM_NAME = "buscaAvancadaProduto";

export default ({ setLoading, setFiltros }) => {
  const [carregandoAluno, setCarregandoAluno] = useState(false);
  const [dadosIniciais, setDadosIniciais] = useState({});
  const [diretoriasRegionais, setDiretoriasRegionais] = useState([]);
  const [desabilitarAluno, setDesabilitarAluno] = useState(null);
  const [escolas, setEscolas] = useState([]);
  const [alunos, setAlunos] = useState([]);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      const dadosUsuario = await meusDados();
      formFiltrosObtemDreEEscolasNovo(
        setEscolas,
        setDiretoriasRegionais,
        dadosUsuario
      );
      const dadosIniciais = await getDadosIniciais(dadosUsuario);
      setDadosIniciais(dadosIniciais);
      setLoading(false);
      getAlunos(dadosIniciais);
    }
    fetch();
  }, []);

  const onSubmit = async (formValues) => {
    setFiltros({ ...formValues });
  };

  const getAlunos = async (dadosIniciais) => {
    const response = await getAlunosListagem({
      escola: dadosIniciais.escola[0],
    });
    setAlunos(response.data.results.map((aluno) => aluno.nome));
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
        return escolas.filter((escola) => dre.includes(escola.dre.uuid));
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
    if (codigoEol.length !== 7) {
      setDesabilitarAluno(false);
      setDadosIniciais({ ...values });
      return;
    }
    setCarregandoAluno(true);

    const eolResponse = await obtemDadosAlunoPeloEOL(codigoEol);

    if (!eolResponse || eolResponse.status === 400) {
      toastError("Não há aluno para código Eol informado.");
    } else {
      const alunoResponse = await getAlunosListagem({
        codigo_eol: codigoEol,
        nao_tem_dieta_especial: false,
      });

      if (!alunoResponse.data.count) {
        toastError("Aluno informado não tem Dieta Especial.");
        setDesabilitarAluno(false);
        setDadosIniciais({ ...values, nome_aluno: "" });
      } else {
        if (alunoResponse.data.results[0].escola !== values.escola[0]) {
          toastError(
            "Código EOL do aluno não pertence a esta unidade escolar."
          );
          setDesabilitarAluno(false);
          setDadosIniciais({ ...values, nome_aluno: "" });
        } else {
          setDadosIniciais({
            ...values,
            nome_aluno: alunoResponse.data.results[0].nome,
          });
          setDesabilitarAluno(true);
        }
      }
    }
    setCarregandoAluno(false);
  };

  const tipoUsuario = localStorage.getItem("tipo_perfil");
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={dadosIniciais}
      subscription={{ submitting: true, values: true }}
      render={({ form, handleSubmit, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <FinalFormToRedux form={FORM_NAME} />
          <div className="row">
            <div className="col-5">
              <Field
                label="Diretoria Regional de Educação"
                component={Select}
                className="input-busca-dre form-control"
                name="dre"
                options={[{ uuid: "", nome: "Todas" }].concat(
                  diretoriasRegionais.map((dre) => {
                    return { uuid: dre.value, nome: dre.label };
                  })
                )}
                disabled={
                  tipoUsuario === TIPO_PERFIL.DIRETORIA_REGIONAL ||
                  tipoUsuario === TIPO_PERFIL.ESCOLA
                }
                naoDesabilitarPrimeiraOpcao
              />
            </div>
            <div className="col-7">
              <Field
                label="Unidade Escolar"
                component={Select}
                name="escola"
                className="input-busca-escola form-control"
                options={[{ uuid: "", nome: "Todas" }].concat(
                  getEscolasFiltrado(values.dre).map((escola) => {
                    return { uuid: escola.value, nome: escola.label };
                  })
                )}
                disabled={tipoUsuario === TIPO_PERFIL.ESCOLA}
                naoDesabilitarPrimeiraOpcao
              />
            </div>
          </div>
          <div className="row">
            <div className="col-3">
              <Field
                label="Cód. EOL do Aluno"
                component={InputText}
                name="codigo_eol_aluno"
                data-testid="input-codigo-eol"
                placeholder="Insira o Código"
                type="number"
                validate={length(7)}
                disabled={carregandoAluno}
                inputOnChange={(e) => {
                  const value = e.target.value;
                  const values_ = form.getState().values;
                  getAlunoPorEol(value, values_);
                }}
              />
            </div>
            <div className="col-9 auto-complete-field">
              <Field
                label="Nome Completo do Aluno"
                component={AutoCompleteField}
                dataSource={getAlunosFiltrado(values.nome_aluno)}
                name="nome_aluno"
                placeholder="Insira o Nome do Aluno"
                className="input-busca-aluno"
                disabled={carregandoAluno | desabilitarAluno}
                data-testid="input-nome-aluno"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12 botoes-envio">
              <div className="mt-4">
                <Botao
                  texto="Consultar"
                  className="float-end ms-3"
                  type={BUTTON_TYPE.SUBMIT}
                  style={BUTTON_STYLE.GREEN}
                />
                <Botao
                  texto="Limpar Filtros"
                  className="float-end ms-3"
                  onClick={() => {
                    form.reset({ dre: values.dre, escola: values.escola });
                  }}
                  disabled={pristine}
                  style={BUTTON_STYLE.GREEN_OUTLINE}
                />
              </div>
            </div>
          </div>
        </form>
      )}
    />
  );
};
