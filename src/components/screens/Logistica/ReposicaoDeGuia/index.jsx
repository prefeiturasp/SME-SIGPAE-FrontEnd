import React, { useEffect, useState, useRef } from "react";
import { Spin } from "antd";
import {
  getGuiaParaConferencia,
  getReposicaoParaEdicao,
  getConferenciaParaEdicao
} from "../../../../services/logistica.service.js";
import { Form, Field } from "react-final-form";
import { InputComData } from "components/Shareable/DatePicker";
import FinalFormToRedux from "components/Shareable/FinalFormToRedux";
import { InputText } from "components/Shareable/Input/InputText";
import { TextArea } from "components/Shareable/TextArea/TextArea";
import MultiSelect from "components/Shareable/FinalForm/MultiSelect";
import { InputHorario } from "components/Shareable/Input/InputHorario";
import { REPOSICAO_RESUMO_FINAL, LOGISTICA } from "configs/constants";
import TooltipIcone from "components/Shareable/TooltipIcone";
import InputFile from "components/Shareable/Input/InputFile";
import {
  required,
  maxLength,
  apenasLetras,
  alphaNumeric,
  peloMenosUmNumeroEUmaLetra,
  numericInteger
} from "../../../../helpers/fieldValidators";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE
} from "components/Shareable/Botao/constants";
import { composeValidators } from "../../../../helpers/utilities";
import { toastError } from "components/Shareable/Toast/dialogs";
import { useHistory } from "react-router-dom";
import moment from "moment";
import "./styles.scss";

import { gerarParametrosConsulta } from "helpers/utilities";

const FORM_NAME = "reposicaoGuiaRemessa";
const TOOLTIP_DATA = `Preencher com a data em que o alimento foi efetivamente recebido pela Unidade Educacional.
                      Tratando-se de uma reposição de alimentos faltantes, será aberta ocorrência a ser detalhada pelo usuário.`;
const TOOLTIP_HORA = `Preencher com a hora em que o alimento foi entregue na Unidade Educacional.`;
const TOOLTIP_PLACA = `Preencher com o registro da placa do veículo que transportou os alimentos à Unidade Educacional.`;
const TOOLTIP_NOME = `Preencher com o nome do motorista que entregou os alimentos na Unidade Educacional.`;
const TOOLTIP_RECEBIDO = `Preencher com a quantidade de embalagens do alimento que a Unidade Educacional efetivamente
                          recebeu como reposição aos alimentos faltantes. Se ainda restarem alimentos a receber, será
                          aberta ocorrência a ser detalhada pelo usuário.`;
const TOOLTIP_A_RECEBER = `Quantidade de embalagens de alimento faltantes (isto é, que o fornecedor deixou de entregar
                          na Unidade Educacional) em relação à quantidade prevista na Guia de Remessa.`;
const FORMATOS_IMAGEM = "PNG, JPG ou JPEG";

let ocorrenciasApagadas = [];

export default () => {
  const [guia, setGuia] = useState({});
  const [uuid, setUuid] = useState();
  const [carregando, setCarregando] = useState(false);
  const [collapseAlimentos, setCollapseAlimentos] = useState(false);
  const [HoraRecebimento, setHoraRecebimento] = useState("00:00");
  const [HoraRecebimentoAlterada, setHoraRecebimentoAlterada] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [arquivoAtual, setArquivoAtual] = useState([]);
  const [edicao, setEdicao] = useState(false);
  const inputFile = useRef([]);
  const autoFillButton = useRef(null);
  const editarButton = useRef(null);
  const history = useHistory();

  const [flagAtraso, setFlagAtraso] = useState(false);
  const [flagAlimento, setFlagAlimento] = useState([]);

  const carregarGuia = async uuid => {
    let response;
    try {
      setCarregando(true);
      const params = gerarParametrosConsulta({ uuid: uuid });
      response = await getGuiaParaConferencia(params);
      const guiaResponse = response.data;
      let conferencias = guiaResponse.conferencias[0];

      filtrarAlimentos(conferencias.conferencia_dos_alimentos, guiaResponse);
      setGuia(guiaResponse);
      setInitialValues({
        numero_guia: response.data.numero_guia,
        data_entrega: response.data.data_entrega,
        hora_recebimento: "00:00"
      });
      setCarregando(false);
    } catch (e) {
      toastError(e.response.data.detail);
      setCarregando(false);
    }
  };

  const filtrarAlimentos = (conf_alimentos, guiaResponse, edicao) => {
    if (edicao) {
      guiaResponse.alimentos.forEach(alimento => {
        alimento.embalagens.forEach(embalagem => {
          let conf = conf_alimentos.find(
            element =>
              element.tipo_embalagem === embalagem.tipo_embalagem &&
              element.nome_alimento === alimento.nome_alimento
          );
          if (conf)
            embalagem.qtd_a_receber = embalagem.qtd_volume - conf.qtd_recebido;
        });
      });
    }

    guiaResponse.alimentos = guiaResponse.alimentos.filter(alimento => {
      alimento.embalagens = alimento.embalagens.filter(
        embalagem => embalagem.qtd_a_receber !== 0
      );
      return alimento.embalagens.length !== 0;
    });
  };

  const carregarReposicaoEdicao = async uuid => {
    let response;
    try {
      setCarregando(true);
      const params = gerarParametrosConsulta({ uuid: uuid });
      response = await getReposicaoParaEdicao(params);
      let response2 = await getConferenciaParaEdicao(params);
      let conferencia = response.data.results;

      filtrarAlimentos(
        response2.data.results.conferencia_dos_alimentos,
        conferencia.guia,
        true
      );

      setGuia(conferencia.guia);
      setEdicao(true);
      setCarregando(false);
      return conferencia;
    } catch (e) {
      toastError(e.response.data.detail);
      setCarregando(false);
    }
  };

  const carregarEdicao = (values, conferencia) => {
    setCarregando(true);

    let valoresConf = conferencia.conferencia_dos_alimentos;
    let guiaConf = conferencia.guia;

    valoresConf.forEach((item, index) => {
      if (item.tipo_embalagem === "Fechada")
        values[`recebidos_fechada_${index}`] = item.qtd_recebido;
      if (item.tipo_embalagem === "Fracionada")
        values[`recebidos_fracionada_${index}`] = item.qtd_recebido;
      values[`status_${index}`] = item.status_alimento;
      values[`ocorrencias_${index}`] = item.ocorrencia;
      values[`observacoes_${index}`] = item.observacao;
      if (item.arquivo) {
        item.arquivo = [
          {
            nome: "imagem.png",
            arquivo: item.arquivo
          }
        ];
        let arquivos = arquivoAtual;
        arquivos[index] = item.arquivo;
        setArquivoAtual(arquivos);
      }
    });

    values.numero_guia = guiaConf.numero_guia;
    values.data_entrega = guiaConf.data_entrega;
    values.nome_motorista = conferencia.nome_motorista;
    values.hora_recebimento = conferencia.hora_recebimento;
    values.placa_veiculo = conferencia.placa_veiculo;
    values.data_entrega_real = moment(
      conferencia.data_recebimento,
      "DD/MM/YYYY"
    );

    values.uuid_conferencia = conferencia.uuid;

    setHoraRecebimento(conferencia.hora_recebimento);
    setHoraRecebimentoAlterada(true);

    setGuia(guiaConf);

    setCarregando(false);
  };

  const setFiles = files => {
    let arquivos = arquivoAtual;
    arquivos = files;
    setArquivoAtual(arquivos);
  };

  const removeFile = () => {
    setArquivoAtual([]);
  };

  const escolherHora = hora => {
    if (hora) {
      const horario = moment(hora).format("HH:mm");
      setHoraRecebimento(horario);
      setHoraRecebimentoAlterada(true);
    } else {
      setHoraRecebimento("00:00");
      setHoraRecebimentoAlterada(false);
    }
  };

  const processarEdicao = async (event, values) => {
    event.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const param = urlParams.get("uuid");
    setUuid(param);
    let conf = await carregarReposicaoEdicao(param);
    carregarEdicao(values, conf);
  };

  const onSubmit = async values => {
    values.hora_recebimento = HoraRecebimento;
    values.data_recebimento = moment(values.data_entrega_real).format(
      "DD/MM/YYYY"
    );
    values.guia = uuid;
    values.arquivo = arquivoAtual;

    let valoresForm = [];

    for (let i = 0; i < guia.alimentos.length; i++) {
      let x = {};
      if (edicao) x.uuid_conferencia = values.uuid_conferencia;
      x.data_entrega = values.data_entrega;
      x.arquivo = values.arquivo[i];
      x.data_recebimento = values.data_recebimento;
      x.data_entrega_real = values.data_entrega_real;
      x.hora_recebimento = values.hora_recebimento;
      x.nome_motorista = values.nome_motorista;
      x.placa_veiculo = values.placa_veiculo;
      x.ocorrencias = values[`ocorrencias_${i}`];
      x.recebidos_fechada = values[`recebidos_fechada_${i}`];
      x.recebidos_fracionada = values[`recebidos_fracionada_${i}`];
      x.status = values[`status_${i}`];
      x.observacoes = values[`observacoes_${i}`];

      valoresForm[i] = x;
    }

    localStorage.setItem("valoresReposicao", JSON.stringify(valoresForm));
    localStorage.setItem("guiaReposicao", JSON.stringify(guia));
    history.push(`/${LOGISTICA}/${REPOSICAO_RESUMO_FINAL}?editar=${edicao}`);
  };

  const comparaDataEntrega = value => {
    let dataPrevista = moment(guia.data_entrega, "DD/MM/YYYY");
    let dataReal = moment(value, "DD/MM/YYYY");
    if (moment(dataReal).isAfter(dataPrevista)) return true;
    else return false;
  };

  const validaDataEntrega = value => {
    let dataEhDepois = comparaDataEntrega(value);
    if (value === null) return "Digite uma data válida";
    if (!dataEhDepois)
      return "Por se tratar de uma reposição a data de recebimento deve ser posterior a data prevista.";
    if (guia.status === "Insucesso de entrega") return undefined;
  };

  const validaOcorrencias = (values, index, errors) => {
    let value = values[`ocorrencias_${index}`];

    if (values[`status_${index}`] === "Recebido") {
      if (errors[`ocorrencias_${index}`]) delete errors[`ocorrencias_${index}`];
      return;
    }
    if (!value || value.length === 0) {
      errors[`ocorrencias_${index}`] = "Selecione uma ocorrência";
      return;
    }
    if (flagAtraso && flagAlimento[index] && value.length === 1)
      errors[`ocorrencias_${index}`] =
        "Selecionar ocorrência que justifique o recebimento menor que o previsto.";
  };

  const validaObservacoes = (values, index) => value => {
    if (
      !values[`ocorrencias_${index}`] ||
      !values[`ocorrencias_${index}`].length
    )
      return undefined;
    if (value === undefined)
      return "Campo obrigatório caso existam uma ou mais ocorrências";
  };

  const checaAtraso = (values, index) => {
    if (comparaDataEntrega(values.data_entrega_real)) {
      if (!values[`ocorrencias_${index}`]) {
        values[`ocorrencias_${index}`] = [];
        values[`ocorrencias_${index}`].push("ATRASO_ENTREGA");
      } else if (
        values[`ocorrencias_${index}`].length &&
        !values[`ocorrencias_${index}`].includes("ATRASO_ENTREGA")
      ) {
        values[`ocorrencias_${index}`].push("ATRASO_ENTREGA");
      }
      if (values[`ocorrencias_${index}`].length === 0) {
        values[`ocorrencias_${index}`].push("ATRASO_ENTREGA");
      }
    }
  };

  const validaHoraRecebimento = value => {
    value = HoraRecebimentoAlterada ? HoraRecebimento : undefined;
    return value !== undefined ? "" : "Campo obrigatório";
  };

  const filtraEmbalagemPorTipo = (embalagens, tipo) => {
    const embalagensFiltradas = embalagens.filter(value => {
      return value.tipo_embalagem.toUpperCase() === tipo;
    });
    if (embalagensFiltradas.length) return embalagensFiltradas[0];
    else return false;
  };

  const validaStatus = values => {
    if (guia.alimentos)
      guia.alimentos.forEach((item, index) => {
        let recebidos_fechada = parseInt(values[`recebidos_fechada_${index}`]);
        let recebidos_fracionada = parseInt(
          values[`recebidos_fracionada_${index}`]
        );
        let dataEhDepois = comparaDataEntrega(values.data_entrega_real);
        let embalagensAlimento = guia.alimentos[index].embalagens;
        let fechada;
        let fracionada;
        let alimentoFaltante;
        if (embalagensAlimento.length > 1) {
          fechada =
            embalagensAlimento[0].tipo_embalagem === "Fechada"
              ? embalagensAlimento[0]
              : embalagensAlimento[1];
          fracionada =
            embalagensAlimento[0].tipo_embalagem === "Fracionada"
              ? embalagensAlimento[0]
              : embalagensAlimento[1];
        } else {
          fechada =
            embalagensAlimento[0].tipo_embalagem === "Fechada"
              ? embalagensAlimento[0]
              : {};
          fracionada =
            embalagensAlimento[0].tipo_embalagem === "Fracionada"
              ? embalagensAlimento[0]
              : {};
        }

        if (guia.status === "Insucesso de entrega") dataEhDepois = false;

        let alimentoParcial =
          recebidos_fechada < fechada.qtd_a_receber ||
          recebidos_fracionada < fracionada.qtd_a_receber;
        if (
          fechada.tipo_embalagem === "Fechada" &&
          fracionada.tipo_embalagem === "Fracionada"
        ) {
          alimentoFaltante =
            recebidos_fechada === 0 && recebidos_fracionada === 0;
        } else {
          alimentoFaltante =
            recebidos_fechada === 0 || recebidos_fracionada === 0;
        }

        let newFlagAlimento = flagAlimento;
        newFlagAlimento[index] = alimentoFaltante || alimentoParcial;
        setFlagAlimento(newFlagAlimento);
        setFlagAtraso(dataEhDepois);

        if (alimentoParcial) values[`status_${index}`] = "Parcial";

        if (alimentoFaltante) values[`status_${index}`] = "Não Recebido";

        if (
          values.data_entrega_real &&
          !alimentoParcial &&
          !alimentoFaltante &&
          (!isNaN(recebidos_fechada) || !isNaN(recebidos_fracionada))
        ) {
          values[`status_${index}`] = "Recebido";
          if (
            values[`ocorrencias_${index}`] &&
            values[`ocorrencias_${index}`].length
          ) {
            let oldOcorrenciasApagadas = ocorrenciasApagadas[index]
              ? ocorrenciasApagadas[index]
              : [];
            ocorrenciasApagadas[index] = [
              ...oldOcorrenciasApagadas,
              ...values[`ocorrencias_${index}`]
            ];
          }

          values[`ocorrencias_${index}`] = [];
        } else if (
          ocorrenciasApagadas[index] &&
          ocorrenciasApagadas[index].length
        ) {
          values[`ocorrencias_${index}`] = ocorrenciasApagadas[index];
          ocorrenciasApagadas[index] = [];
        }

        if (
          values[`recebidos_fechada_${index}`] === undefined &&
          values[`recebidos_fracionada_${index}`] === undefined
        )
          values[`status_${index}`] = undefined;

        if (!values.data_entrega_real) {
          values[`status_${index}`] = undefined;
        }
      });
  };

  const carregarLocalStorage = values => {
    setCarregando(true);

    let valoresConf = JSON.parse(localStorage.getItem("valoresReposicao"));
    let guiaConf = JSON.parse(localStorage.getItem("guiaReposicao"));
    let ultimoItem = valoresConf[valoresConf.length - 1];
    let arquivos = arquivoAtual;

    valoresConf.forEach((item, index) => {
      values[`recebidos_fechada_${index}`] = item.recebidos_fechada;
      values[`recebidos_fracionada_${index}`] = item.recebidos_fracionada;
      values[`status_${index}`] = item.status;
      values[`ocorrencias_${index}`] = item.ocorrencias;
      values[`observacoes_${index}`] = item.observacoes;
      arquivos[index] = item.arquivo;
    });

    setArquivoAtual(arquivos);

    values.data_entrega = ultimoItem.data_entrega;
    values.nome_motorista = ultimoItem.nome_motorista;
    values.hora_recebimento = ultimoItem.hora_recebimento;
    values.placa_veiculo = ultimoItem.placa_veiculo;
    values.data_entrega_real = moment(ultimoItem.data_entrega_real);

    setHoraRecebimento(ultimoItem.hora_recebimento);
    setHoraRecebimentoAlterada(true);

    setGuia(guiaConf);

    setCarregando(false);
  };

  const checaErrosCard = (errors, index) => {
    const errorsNameList = [
      `recebidos_fechada_${index}`,
      `recebidos_fracionada_${index}`,
      `ocorrencias_${index}`,
      `observacoes_${index}`,
      `status_${index}`
    ];
    if (errorsNameList.some(r => Object.keys(errors).includes(r))) return "red";
    else return "green";
  };

  const toggleBtnAlimentos = (uuid, index) => {
    if (arquivoAtual[index])
      inputFile.current[index].setState({ files: arquivoAtual[index] });
    setCollapseAlimentos({
      [uuid]: !collapseAlimentos[uuid]
    });
  };

  useEffect(() => {
    const queryString = window.location.search;

    if (queryString) {
      const urlParams = new URLSearchParams(window.location.search);

      let autofill = urlParams.get("autofill");
      let edicao = urlParams.get("editar");

      if (autofill) {
        autoFillButton.current.click();
      } else if (edicao === "true") {
        editarButton.current.click();
      } else {
        const param = urlParams.get("uuid");
        setUuid(param);
        carregarGuia(param);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-conferencia-guia-reposicao">
        <div className="card-body conferencia-guia-reposicao">
          <Form
            onSubmit={onSubmit}
            initialValues={initialValues}
            validate={() => {}}
            render={({ form, handleSubmit, values, errors }) => (
              <form onSubmit={handleSubmit}>
                <FinalFormToRedux form={FORM_NAME} />
                <span className="subtitulo">
                  Conferência individual dos itens da guia
                </span>
                <hr />

                <div className="row mt-2">
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
                      label="Data de Entrega Prevista"
                      name="data_entrega"
                      className="input-busca-produto"
                      disabled
                    />
                  </div>
                  <div className="col-4">
                    <Field
                      component={InputComData}
                      label="Data de recebimento na Unidade Educacional"
                      name="data_entrega_real"
                      className="data-inicial"
                      tooltipText={TOOLTIP_DATA}
                      validate={composeValidators(required, validaDataEntrega)}
                      minDate={
                        moment(values.data_entrega, "DD/MM/YYYY").add(1, "days")
                          ._d
                      }
                      maxDate={null}
                      required
                      writable
                      onChange={validaStatus(values)}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-4">
                    <Field
                      component={InputHorario}
                      label="Hora da Entrega"
                      name="hora_recebimento"
                      placeholder="Selecione a Hora"
                      horaAtual={HoraRecebimento}
                      onChangeFunction={data => {
                        escolherHora(data);
                      }}
                      className="input-busca-produto"
                      tooltipText={TOOLTIP_HORA}
                      validate={validaHoraRecebimento}
                      required
                      functionComponent
                    />
                  </div>
                  <div className="col-4">
                    <Field
                      component={InputText}
                      label="Nome do Motorista"
                      name="nome_motorista"
                      className="input-busca-produto"
                      contador={100}
                      tooltipText={TOOLTIP_NOME}
                      validate={composeValidators(
                        required,
                        maxLength(100),
                        apenasLetras
                      )}
                      required
                    />
                  </div>
                  <div className="col-4">
                    <Field
                      component={InputText}
                      label="Placa do Veículo"
                      name="placa_veiculo"
                      className="input-busca-produto"
                      contador={7}
                      tooltipText={TOOLTIP_PLACA}
                      validate={composeValidators(
                        required,
                        maxLength(7),
                        alphaNumeric,
                        peloMenosUmNumeroEUmaLetra
                      )}
                      toUppercaseActive
                      required
                    />
                  </div>
                </div>

                <hr />

                <div className="aviso-alimentos">
                  Atenção: Os itens marcados em{" "}
                  <span className="green"> verde </span> são os que foram
                  preenchidos corretamente, os{" "}
                  <span className="red"> vermelhos </span> são os que estão
                  pendentes ou que possuem erros no preenchimento.
                </div>

                <div className="accordion mt-1" id="accordionAlimentos">
                  {guia.alimentos &&
                    guia.alimentos.map((alimento, index) => (
                      <div className="card mt-3" key={alimento.uuid}>
                        <div
                          className={`card-header card-tipo-${checaErrosCard(
                            errors,
                            index
                          )}`}
                          id={`heading_${alimento.uuid}`}
                        >
                          <div className="row card-header-content">
                            <span className="nome-alimento">{`${
                              alimento.nome_alimento
                            }`}</span>
                            <div className="col-1 align-self-center">
                              <button
                                onClick={() =>
                                  toggleBtnAlimentos(alimento.uuid, index)
                                }
                                className="btn btn-link btn-block text-left px-0"
                                type="button"
                                data-toggle="collapse"
                                data-target={`#collapse_${alimento.uuid}`}
                                aria-expanded="true"
                                aria-controls={`collapse_${alimento.uuid}`}
                              >
                                <span className="span-icone-toogle">
                                  <i
                                    className={
                                      collapseAlimentos[alimento.uuid]
                                        ? "fas fa-chevron-up"
                                        : "fas fa-chevron-down"
                                    }
                                  />
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>

                        <div
                          id={`collapse_${alimento.uuid}`}
                          className="collapse"
                          aria-labelledby="headingOne"
                          data-parent="#accordionAlimentos"
                        >
                          <div className="card-body">
                            <div className="row">
                              <>
                                {(() => {
                                  if (!guia.alimentos) return;
                                  const item = alimento;
                                  const embalagens = item.total_embalagens
                                    ? item.total_embalagens
                                    : item.embalagens;
                                  const fechada = filtraEmbalagemPorTipo(
                                    embalagens,
                                    "FECHADA"
                                  );
                                  const fracionada = filtraEmbalagemPorTipo(
                                    embalagens,
                                    "FRACIONADA"
                                  );
                                  const value_col =
                                    fechada && fracionada ? "col-6" : "col-12";
                                  return (
                                    <>
                                      {fechada && (
                                        <div className={value_col}>
                                          <div className="titulo-tabela">
                                            Embalagem Fechada
                                          </div>
                                          <table
                                            className={`table table-bordered table-reposicao`}
                                          >
                                            <thead>
                                              <tr>
                                                <th scope="col">
                                                  Qtde Prevista
                                                </th>
                                                <th scope="col">Capacidade</th>
                                                <th scope="col">
                                                  A receber{" "}
                                                  <TooltipIcone
                                                    tooltipText={
                                                      TOOLTIP_A_RECEBER
                                                    }
                                                  />
                                                </th>
                                                <th
                                                  scope="col"
                                                  className="th-recebido"
                                                >
                                                  Recebido{" "}
                                                  <TooltipIcone
                                                    tooltipText={
                                                      TOOLTIP_RECEBIDO
                                                    }
                                                  />
                                                </th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              <tr>
                                                <td>
                                                  {fechada.qtd_volume}{" "}
                                                  {fechada.descricao_embalagem}.
                                                </td>
                                                <td>
                                                  {fechada.descricao_embalagem}.{" "}
                                                  {fechada.capacidade_embalagem}
                                                  {fechada.unidade_medida}
                                                </td>
                                                <td>{fechada.qtd_a_receber}</td>
                                                <td>
                                                  <div className="form-tabela">
                                                    <Field
                                                      component={InputText}
                                                      apenasNumeros
                                                      name={`recebidos_fechada_${index}`}
                                                      className="input-busca-produto"
                                                      placeholder={
                                                        fechada.descricao_embalagem
                                                      }
                                                      validate={composeValidators(
                                                        required,
                                                        numericInteger
                                                      )}
                                                      onChange={validaOcorrencias(
                                                        values,
                                                        index,
                                                        errors
                                                      )}
                                                    />
                                                  </div>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </div>
                                      )}
                                      {fracionada && (
                                        <div className={value_col}>
                                          <div className="titulo-tabela">
                                            Embalagem Fracionada
                                          </div>
                                          <table
                                            className={`table table-bordered table-reposicao`}
                                          >
                                            <thead>
                                              <tr>
                                                <th scope="col">
                                                  Qtde Prevista
                                                </th>
                                                <th scope="col">Capacidade</th>
                                                <th scope="col">
                                                  A receber{" "}
                                                  <TooltipIcone
                                                    tooltipText={
                                                      TOOLTIP_A_RECEBER
                                                    }
                                                  />
                                                </th>
                                                <th
                                                  scope="col"
                                                  className="th-recebido"
                                                >
                                                  Recebido{" "}
                                                  <TooltipIcone
                                                    tooltipText={
                                                      TOOLTIP_RECEBIDO
                                                    }
                                                  />
                                                </th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              <tr>
                                                <td>
                                                  {fracionada.qtd_volume}{" "}
                                                  {
                                                    fracionada.descricao_embalagem
                                                  }
                                                  .
                                                </td>
                                                <td>
                                                  {
                                                    fracionada.descricao_embalagem
                                                  }
                                                  .{" "}
                                                  {
                                                    fracionada.capacidade_embalagem
                                                  }
                                                  {fracionada.unidade_medida}
                                                </td>
                                                <td>
                                                  {fracionada.qtd_a_receber}
                                                </td>
                                                <td>
                                                  <div className="form-tabela">
                                                    <Field
                                                      component={InputText}
                                                      apenasNumeros
                                                      name={`recebidos_fracionada_${index}`}
                                                      className="input-busca-produto"
                                                      placeholder={
                                                        fracionada.descricao_embalagem
                                                      }
                                                      validate={composeValidators(
                                                        required,
                                                        numericInteger
                                                      )}
                                                      onChange={validaOcorrencias(
                                                        values,
                                                        index,
                                                        errors
                                                      )}
                                                    />
                                                  </div>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </div>
                                      )}
                                    </>
                                  );
                                })()}
                              </>
                            </div>
                            <div className="row">
                              <div className="col-6">
                                <Field
                                  component={InputText}
                                  label="Status de recebimento de alimento"
                                  name={`status_${index}`}
                                  className="input-busca-produto"
                                  placeholder="---"
                                  disabled
                                />
                              </div>

                              <div className="col-6">
                                <Field
                                  component={MultiSelect}
                                  label="Ocorrências"
                                  name={`ocorrencias_${index}`}
                                  disableSearch
                                  multiple
                                  nomeDoItemNoPlural="ocorrências"
                                  options={[
                                    {
                                      value: "QTD_MENOR",
                                      label: "Quantidade menor que a prevista"
                                    },
                                    {
                                      value: "PROBLEMA_QUALIDADE",
                                      label: "Problema de qualidade do produto"
                                    },
                                    {
                                      value: "ALIMENTO_DIFERENTE",
                                      label: "Alimento diferente do previsto"
                                    },
                                    {
                                      value: "EMBALAGEM_DANIFICADA",
                                      label: "Embalagem danificada"
                                    },
                                    {
                                      value: "EMBALAGEM_VIOLADA",
                                      label: "Embalagem violada"
                                    },
                                    {
                                      value: "VALIDADE_EXPIRADA",
                                      label: "Prazo de validade expirado"
                                    },
                                    {
                                      value: "ATRASO_ENTREGA",
                                      label: "Atraso na entrega"
                                    },
                                    {
                                      value: "AUSENCIA_PRODUTO",
                                      label: "Ausência do produto"
                                    }
                                  ]}
                                  className="input-busca-produto"
                                  onChange={checaAtraso(values, index)}
                                  disabled={
                                    !["Parcial", "Não Recebido"].includes(
                                      values[`status_${index}`]
                                    )
                                  }
                                />
                              </div>
                            </div>

                            <div className="mt-4 mb-4">
                              <div className="row">
                                <article className="col-9 produto">
                                  <label className="mb-3">
                                    Se possível, insira uma foto que demonstre a
                                    ocorrência apontada.
                                  </label>
                                  <InputFile
                                    ref={inputFile}
                                    className="inputfile"
                                    texto="Inserir Imagem"
                                    name="files"
                                    accept={FORMATOS_IMAGEM}
                                    setFiles={setFiles}
                                    removeFile={removeFile}
                                    toastSuccess={
                                      "Imagem incluída com sucesso!"
                                    }
                                    alignLeft
                                    disabled={arquivoAtual.length > 0}
                                  />
                                  <label className="mb-3">
                                    {"Formatos aceitos: " + FORMATOS_IMAGEM}
                                  </label>
                                </article>
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-12">
                                <Field
                                  component={TextArea}
                                  label="Observações"
                                  name={`observacoes_${index}`}
                                  placeholder="Digite seus comentários aqui..."
                                  required
                                  contador={500}
                                  validate={composeValidators(
                                    validaObservacoes(values, index),
                                    maxLength(500)
                                  )}
                                  disabled={
                                    !values[`ocorrencias_${index}`] ||
                                    !values[`ocorrencias_${index}`].length
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <hr />

                <div>
                  <button
                    onClick={event => {
                      event.preventDefault();
                      carregarLocalStorage(values);
                    }}
                    style={{ display: "none" }}
                    ref={autoFillButton}
                  />

                  <button
                    onClick={async event => {
                      processarEdicao(event, values);
                    }}
                    style={{ display: "none" }}
                    ref={editarButton}
                  />

                  <span className="float-right tooltip-botao">
                    <Botao
                      texto="Finalizar reposição"
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      disabled={
                        Object.keys(errors).length > 0 || !guia.alimentos
                      }
                      onClick={() => onSubmit(values)}
                    />
                    <span className="tooltiptext">
                      Para finalizar, preencha todos os campos de conferência de
                      alimentos, com suas respectivas datas de entrega e
                      quantidades.
                    </span>
                  </span>
                </div>
              </form>
            )}
          />
        </div>
      </div>
    </Spin>
  );
};
