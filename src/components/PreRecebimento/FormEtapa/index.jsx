import React, { useEffect, useState } from "react";
import { Field } from "react-final-form";
import moment from "moment";

import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import InputText from "src/components/Shareable/Input/InputText";
import AutoCompleteField from "src/components/Shareable/AutoCompleteField";
import { InputComData } from "src/components/Shareable/DatePicker";
import Select from "src/components/Shareable/Select";
import { getEtapas } from "src/services/cronograma.service";
import { getFeriadosAnoAtualEProximo } from "src/services/diasUteis.service";
import { deletaValues } from "src/helpers/formHelper";
import {
  formataMilharDecimal,
  getAmanha,
  usuarioEhCronograma,
} from "src/helpers/utilities";
import { required } from "src/helpers/fieldValidators";

import "./styles.scss";
import {
  usuarioEhCronogramaOuCodae,
  usuarioEhCodaeDilog,
  usuarioEhEmpresaFornecedor,
} from "../../../helpers/utilities";

export default ({
  etapas,
  setEtapas,
  values,
  errors,
  duplicados,
  restante,
  unidadeMedida,
  ehAlteracao = false,
  form,
}) => {
  const [etapasOptions, setEtapasOptions] = useState([{}]);
  const [desabilitar, setDesabilitar] = useState([]);
  const [desabilitarData, setDesabilitarData] = useState([]);
  const [feriados, setFeriados] = useState([{}]);

  const getEtapasFiltrado = (etapa) => {
    if (etapa) {
      const reg = new RegExp(etapa, "iu");
      return etapasOptions.filter((a) => reg.test(a.value));
    }
    return etapasOptions;
  };

  const adicionaEtapa = () => {
    setEtapas([...etapas, {}]);
  };

  const deletaEtapa = (index) => {
    let listaChaves = [
      "empenho",
      "etapa",
      "parte",
      "data_programada",
      "quantidade",
      "total_embalagens",
    ];
    deletaValues(etapas, listaChaves, values, index);

    let etapasNovo = [...etapas];
    etapasNovo.splice(index, 1);

    setEtapas(etapasNovo);
  };

  const textoFaltante = () => {
    let textoPadrao = (
      <div>
        Faltam
        <span className="fw-bold">
          &nbsp;
          {formataMilharDecimal(restante?.toString().replace(",", "."))}
          &nbsp;
          {unidadeMedida && unidadeMedida.nome}
          &nbsp;
        </span>
        para programar
      </div>
    );

    let textoQuantidadeMaior = (
      <div>Quantidade maior que a prevista em contrato</div>
    );

    return (
      <div className="row">
        <div
          className={`col-12 texto-alimento-faltante ${
            restante === 0 ? "mensagem-verde" : "mensgagem-vermelho"
          }`}
        >
          {restante < 0 ? textoQuantidadeMaior : textoPadrao}
        </div>
      </div>
    );
  };

  const buscaEtapas = async () => {
    const response = await getEtapas();
    setEtapasOptions(response.data);
  };

  const buscaFeriados = async () => {
    const response = await getFeriadosAnoAtualEProximo();
    const datas = response.data.results.map((dateString) =>
      moment(dateString, "YYYY-MM-DD").toDate(),
    );
    setFeriados(datas);
  };

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  const requisicoesPreRender = async () => {
    await Promise.all([buscaFeriados(), buscaEtapas()]);
  };

  const desativaAdicionarEtapa = () => {
    let index = etapas.length - 1;
    const camposObrigatorios = [
      `empenho_${index}`,
      `qtd_total_empenho_${index}`,
      `etapa_${index}`,
      `parte_${index}`,
      `data_programada_${index}`,
      `quantidade_${index}`,
    ];

    return camposObrigatorios.some((campo) => Boolean(errors[campo]));
  };

  useEffect(() => {
    requisicoesPreRender();
  }, []);

  useEffect(() => {
    const desativaCampos = () => {
      if (ehAlteracao) {
        let arrayDesabilitar = [];
        let arrayData = [];
        etapas.forEach((etapa, index) => {
          let dataProgramada = moment(
            values[`data_programada_${index}`],
            "DD/MM/YYYY",
          ).toDate();
          if (dataProgramada <= new Date().setHours(0, 0, 0, 0)) {
            arrayDesabilitar[index] = true;
          }
          let hoje = new Date();
          hoje.setDate(hoje.getDate() - 8);
          if (
            dataProgramada <= hoje.setHours(0, 0, 0, 0) ||
            usuarioEhEmpresaFornecedor()
          ) {
            arrayData[index] = true;
          }
        });
        setDesabilitar(arrayDesabilitar);
        setDesabilitarData(arrayData);
      }
    };

    desativaCampos();
  }, []);

  return (
    <>
      {etapas &&
        etapas.map((etapa, index) => (
          <>
            {index !== 0 && (
              <>
                <hr />
                <div className="row">
                  <div className="w-100">
                    <Botao
                      dataTestId={`remover_etapa_${index}`}
                      texto=""
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      icon="fas fa-trash"
                      className="float-end ms-3"
                      onClick={() => deletaEtapa(index)}
                      tooltipExterno="Remover Etapa"
                      disabled={desabilitar[index]}
                    />
                  </div>
                </div>
              </>
            )}
            <div className="row">
              {(usuarioEhCronograma() || usuarioEhCodaeDilog()) && (
                <>
                  <div className="col">
                    <Field
                      dataTestId={`numero_empenho_${index}`}
                      component={InputText}
                      label="Nº do Empenho"
                      name={`empenho_${index}`}
                      placeholder="Informe o Nº do Empenho"
                      required
                      validate={required}
                      proibeLetras
                      disabled={desabilitar[index]}
                    />
                  </div>
                  <div className="col">
                    <Field
                      dataTestId={`quantidade_empenho_${index}`}
                      component={InputText}
                      label="Qtde. Total do Empenho"
                      name={`qtd_total_empenho_${index}`}
                      placeholder="Informe a quantidade"
                      required
                      agrupadorMilharComDecimal
                      validate={required}
                      proibeLetras
                      disabled={desabilitar[index]}
                    />
                  </div>
                </>
              )}
              <div className="col">
                <Field
                  dataTestId={`etapa_${index}`}
                  component={AutoCompleteField}
                  options={getEtapasFiltrado(values[`etapa_${index}`])}
                  label="Etapa"
                  name={`etapa_${index}`}
                  className="input-busca-produto"
                  placeholder="Selecione a Etapa"
                  required
                  validate={required}
                  esconderIcone
                  disabled={desabilitar[index]}
                  inputOnChange={() => {
                    ehAlteracao &&
                      form.mutators.setFieldTouched(`parte_${index}`, true);
                  }}
                />
              </div>
              <div className="col">
                <Field
                  dataTestId={`parte_${index}`}
                  component={Select}
                  naoDesabilitarPrimeiraOpcao
                  options={[
                    {
                      uuid: "",
                      nome: "Selecione a Parte",
                    },
                    {
                      uuid: "Parte 1",
                      nome: "Parte 1",
                    },
                    {
                      uuid: "Parte 2",
                      nome: "Parte 2",
                    },
                    {
                      uuid: "Parte 3",
                      nome: "Parte 3",
                    },
                    {
                      uuid: "Parte 4",
                      nome: "Parte 4",
                    },
                    {
                      uuid: "Parte 5",
                      nome: "Parte 5",
                    },
                  ]}
                  label="Parte"
                  name={`parte_${index}`}
                  validate={() =>
                    duplicados.includes(index) && "Parte já selecionada"
                  }
                  disabled={desabilitar[index]}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-4">
                <Field
                  dataTestId={`data_programada_${index}`}
                  component={InputComData}
                  label="Data Programada"
                  name={`data_programada_${index}`}
                  placeholder="Selecionar a Data"
                  required
                  validate={required}
                  writable={false}
                  minDate={
                    ehAlteracao && usuarioEhCronogramaOuCodae()
                      ? null
                      : getAmanha()
                  }
                  disabled={desabilitar[index] && desabilitarData[index]}
                  filterDate={isWeekday}
                  excludeDates={feriados}
                />
              </div>
              <div className="col-4">
                <Field
                  dataTestId={`quantidade_${index}`}
                  component={InputText}
                  label="Quantidade"
                  name={`quantidade_${index}`}
                  placeholder="Digite a Quantidade"
                  validate={required}
                  required
                  apenasNumeros
                  agrupadorMilharComDecimal
                  disabled={desabilitar[index]}
                />
              </div>
              <div className="col-4">
                <Field
                  dataTestId={`total_embalagens_${index}`}
                  component={InputText}
                  label="Total de Embalagens"
                  name={`total_embalagens_${index}`}
                  required
                  valorInicial={""}
                  validate={required}
                  agrupadorMilharComDecimal
                />
              </div>
            </div>
          </>
        ))}

      {values.quantidade_total && textoFaltante()}

      <div className="text-center mb-2 mt-2">
        <Botao
          dataTestId="adicionar-etapa"
          texto="+ Adicionar Etapa"
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          className=""
          onClick={() => adicionaEtapa()}
          disabled={desativaAdicionarEtapa()}
          tooltipExterno={
            desativaAdicionarEtapa()
              ? "É necessário preencher todos os campos obrigatórios para adicionar uma nova Etapa"
              : ""
          }
        />
      </div>
    </>
  );
};
