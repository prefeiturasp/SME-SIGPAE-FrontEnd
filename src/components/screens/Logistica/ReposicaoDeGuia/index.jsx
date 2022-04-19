import React, { useEffect, useState, useRef, Fragment } from "react";
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
const FORMATOS_IMAGEM = ".png, .jpeg, .jpg";

export default () => {
  const [guia, setGuia] = useState({});
  const [uuid, setUuid] = useState();
  const [carregando, setCarregando] = useState(false);
  const [HoraRecebimento, setHoraRecebimento] = useState("00:00");
  const [HoraRecebimentoAlterada, setHoraRecebimentoAlterada] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [alimentoAtual, setAlimentoAtual] = useState(0);
  const [valoresForm, setValoresForm] = useState([]);
  const [fechada, setFechada] = useState({});
  const [fracionada, setFracionada] = useState({});
  const [status, setStatus] = useState({});
  const [arquivoAtual, setArquivoAtual] = useState([]);
  const [edicao, setEdicao] = useState(false);
  const inputFile = useRef(null);
  const autoFillButton = useRef(null);
  const editarButton = useRef(null);
  const history = useHistory();

  const [flagAtraso, setFlagAtraso] = useState(false);
  const [flagAlimento, setFlagAlimento] = useState(false);

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
    conf_alimentos.map(conferencia => {
      if (
        conferencia.status_alimento === "Recebido" ||
        conferencia.ocorrencia.includes("ATRASO_ENTREGA")
      ) {
        guiaResponse.alimentos = guiaResponse.alimentos.filter(
          alimento => alimento.nome_alimento !== conferencia.nome_alimento
        );
      }
    });

    if (edicao) {
      guiaResponse.alimentos.map(alimento => {
        alimento.embalagens.map(embalagem => {
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

    let primeiroItem = valoresConf[0];

    for (let i = 0; i < valoresConf.length; i++) {
      let item = valoresConf[i];

      if (
        valoresConf.length !== guiaConf.alimentos.length &&
        i < valoresConf.length - 1
      ) {
        let proxItem = valoresConf[i + 1];
        if (
          item.nome_alimento === proxItem.nome_alimento &&
          item.tipo_embalagem !== proxItem.tipo_embalagem
        ) {
          if (item.tipo_embalagem === "Fechada") {
            item.recebidos_fechada = item.qtd_recebido;
            item.recebidos_fracionada = proxItem.qtd_recebido;
          } else if (item.tipo_embalagem === "Fracionada") {
            item.recebidos_fechada = proxItem.qtd_recebido;
            item.recebidos_fracionada = item.qtd_recebido;
          }
          valoresConf.splice(i + 1, 1);
        }
      }

      if (item.tipo_embalagem === "Fechada")
        item.recebidos_fechada = item.qtd_recebido;
      if (item.tipo_embalagem === "Fracionada")
        item.recebidos_fracionada = item.qtd_recebido;
      item.ocorrencias = item.ocorrencia;
      item.observacoes = item.observacao;
      if (item.arquivo) {
        item.arquivo = [
          {
            nome: "imagem.png",
            arquivo: item.arquivo
          }
        ];
      } else {
        item.arquivo = [];
      }
    }

    if (primeiroItem) {
      values.recebidos_fechada = primeiroItem.recebidos_fechada;
      values.recebidos_fracionada = primeiroItem.recebidos_fracionada;
      values.status = primeiroItem.status;
      values.ocorrencias = primeiroItem.ocorrencias;
      values.observacoes = primeiroItem.observacoes;

      let newArquivo = primeiroItem.arquivo;
      setArquivoAtual(newArquivo);
      if (newArquivo) {
        inputFile.current.setState({ files: newArquivo });
      }
    }

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

    setValoresForm(valoresConf);
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

    let newValoresForm = valoresForm;
    newValoresForm[alimentoAtual] = Object.assign({}, values);
    setValoresForm(newValoresForm);

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

  const validaOcorrencias = value => {
    if (status === "Recebido") return undefined;
    if (!value || value.length === 0) return "Selecione uma ocorrência";
    if (flagAtraso && flagAlimento && value.length === 1)
      return "Selecionar ocorrência que justifique o recebimento menor que o previsto.";
  };

  const validaObservacoes = values => value => {
    if (!values.ocorrencias || !values.ocorrencias.length) return undefined;
    if (value === undefined)
      return "Campo obrigatório caso existam uma ou mais ocorrências";
  };

  const checaAtraso = values => {
    if (guia.status === "Insucesso de entrega") return;
    if (comparaDataEntrega(values.data_entrega_real)) {
      if (!values.ocorrencias) {
        values.ocorrencias = [];
        values.ocorrencias.push("ATRASO_ENTREGA");
      } else if (
        values.ocorrencias.length &&
        !values.ocorrencias.includes("ATRASO_ENTREGA")
      ) {
        values.ocorrencias.push("ATRASO_ENTREGA");
      }
      if (values.ocorrencias.length === 0) {
        values.ocorrencias.push("ATRASO_ENTREGA");
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

  const changePage = (values, change) => {
    let newValoresForm = valoresForm;
    let newAlimento = alimentoAtual + change;
    values.arquivo = arquivoAtual;
    newValoresForm[alimentoAtual] = Object.assign({}, values);
    setValoresForm(newValoresForm);

    values.recebidos_fechada = valoresForm[newAlimento]
      ? valoresForm[newAlimento].recebidos_fechada
      : undefined;
    values.recebidos_fracionada = valoresForm[newAlimento]
      ? valoresForm[newAlimento].recebidos_fracionada
      : undefined;
    values.status = valoresForm[newAlimento]
      ? valoresForm[newAlimento].status
      : undefined;
    values.ocorrencias = valoresForm[newAlimento]
      ? valoresForm[newAlimento].ocorrencias
      : undefined;
    values.observacoes = valoresForm[newAlimento]
      ? valoresForm[newAlimento].observacoes
      : undefined;
    let newArquivo = valoresForm[newAlimento]
      ? valoresForm[newAlimento].arquivo
      : [];

    setArquivoAtual(newArquivo);
    if (newArquivo) {
      inputFile.current.setState({ files: newArquivo });
    }
    setAlimentoAtual(newAlimento);
  };

  const validaStatus = values => {
    let recebidos_fechada = parseInt(values.recebidos_fechada);
    let recebidos_fracionada = parseInt(values.recebidos_fracionada);
    let dataEhDepois = comparaDataEntrega(values.data_entrega_real);
    if (guia.status === "Insucesso de entrega") dataEhDepois = false;
    let alimentoParcial =
      recebidos_fechada < fechada.qtd_a_receber ||
      recebidos_fracionada < fracionada.qtd_a_receber;
    let alimentoFaltante =
      recebidos_fechada === 0 || recebidos_fracionada === 0;

    setFlagAlimento(alimentoFaltante || alimentoParcial);
    setFlagAtraso(dataEhDepois);

    if (alimentoParcial) values.status = "Parcial";

    if (alimentoFaltante) values.status = "Não Recebido";

    if (values.data_entrega_real && !alimentoParcial && !alimentoFaltante)
      values.status = "Recebido";

    if (
      values.recebidos_fechada === undefined &&
      values.recebidos_fracionada === undefined &&
      !dataEhDepois
    )
      values.status = undefined;

    if (!values.data_entrega_real) values.status = undefined;

    setStatus(values.status);
  };

  const carregarLocalStorage = values => {
    setCarregando(true);

    let valoresConf = JSON.parse(localStorage.getItem("valoresReposicao"));
    let guiaConf = JSON.parse(localStorage.getItem("guiaReposicao"));
    let primeiroItem = valoresConf[0];
    let ultimoItem = valoresConf[valoresConf.length - 1];

    values.recebidos_fechada = primeiroItem.recebidos_fechada;
    values.recebidos_fracionada = primeiroItem.recebidos_fracionada;
    values.status = primeiroItem.status;
    values.ocorrencias = primeiroItem.ocorrencias;
    values.observacoes = primeiroItem.observacoes;

    values.data_entrega = ultimoItem.data_entrega;
    values.nome_motorista = ultimoItem.nome_motorista;
    values.hora_recebimento = ultimoItem.hora_recebimento;
    values.placa_veiculo = ultimoItem.placa_veiculo;
    values.data_entrega_real = moment(ultimoItem.data_entrega_real);

    let newArquivo = primeiroItem.arquivo;
    setArquivoAtual(newArquivo);
    if (newArquivo) {
      inputFile.current.setState({ files: newArquivo });
    }

    setHoraRecebimento(ultimoItem.hora_recebimento);
    setHoraRecebimentoAlterada(true);

    setValoresForm(valoresConf);
    setGuia(guiaConf);

    setCarregando(false);
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
                <div className="subtitulo text-right">
                  <span>{`Guia número: ${guia.numero_guia}`}</span>
                </div>
                <hr />
                <div className="card mt-3 header-alimento">
                  {guia.alimentos && guia.alimentos[alimentoAtual] && (
                    <span>{`Alimento: ${
                      guia.alimentos[alimentoAtual].nome_alimento
                    }`}</span>
                  )}
                </div>
                <div className="row mt-2">
                  <div className="col-6">
                    <Field
                      component={InputText}
                      label="Data de Entrega Prevista"
                      name="data_entrega"
                      className="input-busca-produto"
                      disabled
                    />
                  </div>
                  <div className="col-6">
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
                <Fragment>
                  {(() => {
                    if (!guia.alimentos || !guia.alimentos[alimentoAtual])
                      return;
                    const item = guia.alimentos[alimentoAtual];
                    const embalagens = item.total_embalagens
                      ? item.total_embalagens
                      : item.embalagens;
                    const fracionada = filtraEmbalagemPorTipo(
                      embalagens,
                      "FRACIONADA"
                    );
                    const fechada = filtraEmbalagemPorTipo(
                      embalagens,
                      "FECHADA"
                    );
                    setFracionada(fracionada);
                    setFechada(fechada);
                    return (
                      <>
                        <table
                          className={`table table-bordered table-reposicao`}
                        >
                          <thead>
                            <tr>
                              <th
                                scope="col"
                                colSpan="4"
                                className="text-center"
                              >
                                {fechada ? (
                                  <>EMBALAGEM FECHADA</>
                                ) : (
                                  <>EMBALAGEM FRACIONADA</>
                                )}
                              </th>
                            </tr>
                            <tr>
                              <th
                                scope="col"
                                colSpan="2"
                                className="text-center"
                              >
                                Previsto
                              </th>
                              <th scope="col">
                                A receber{" "}
                                <TooltipIcone tooltipText={TOOLTIP_A_RECEBER} />
                              </th>
                              <th scope="col" className="th-recebido">
                                Recebido{" "}
                                <TooltipIcone tooltipText={TOOLTIP_RECEBIDO} />
                              </th>
                            </tr>
                            <tr>
                              <th scope="col">Quantidade</th>
                              <th scope="col">Capacidade</th>
                              <th scope="col">Quantidade</th>
                              <th scope="col" className="th-recebido">
                                Quantidade de Embalagens
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <>
                              <tr>
                                {fechada ? (
                                  <>
                                    <td>{fechada.qtd_volume}</td>
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
                                          name="recebidos_fechada"
                                          className="input-busca-produto"
                                          validate={composeValidators(
                                            required,
                                            numericInteger
                                          )}
                                        />
                                      </div>
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td>{fracionada.qtd_volume}</td>
                                    <td>
                                      {fracionada.descricao_embalagem}.{" "}
                                      {fracionada.capacidade_embalagem}
                                      {fracionada.unidade_medida}
                                    </td>
                                    <td>{fracionada.qtd_a_receber}</td>
                                    <td>
                                      <div className="form-tabela">
                                        <Field
                                          component={InputText}
                                          name="recebidos_fracionada"
                                          className="input-busca-produto"
                                          validate={composeValidators(
                                            required,
                                            numericInteger
                                          )}
                                        />
                                      </div>
                                    </td>
                                  </>
                                )}
                              </tr>
                            </>
                          </tbody>
                        </table>
                      </>
                    );
                  })()}
                </Fragment>

                <div className="row">
                  <div className="col-6">
                    <Field
                      component={InputText}
                      label="Status de recebimento de alimento"
                      name="status"
                      className="input-busca-produto"
                      placeholder="---"
                      validate={composeValidators(required, maxLength(100))}
                      disabled
                    />
                  </div>

                  <div className="col-6">
                    <Field
                      component={MultiSelect}
                      label="Ocorrências"
                      name="ocorrencias"
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
                      validate={validaOcorrencias}
                      onChange={checaAtraso(values)}
                    />
                  </div>
                </div>

                <div className="mt-4 mb-4">
                  <div className="row">
                    <article className="col-9 produto">
                      <label className="mb-3">
                        Se possível, insira uma foto que demonstre a ocorrência
                        apontada.
                        <TooltipIcone
                          tooltipText={
                            "Os formatos de imagem aceitos são: " +
                            FORMATOS_IMAGEM
                          }
                        />
                      </label>
                      <InputFile
                        ref={inputFile}
                        className="inputfile"
                        texto="Inserir Imagem"
                        name="files"
                        accept={FORMATOS_IMAGEM}
                        setFiles={setFiles}
                        removeFile={removeFile}
                        toastSuccess={"Imagem incluída com sucesso!"}
                        alignLeft
                        disabled={arquivoAtual.length > 0}
                      />
                    </article>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <Field
                      component={TextArea}
                      label="Observações"
                      name="observacoes"
                      placeholder="Digite seus comentários aqui..."
                      required
                      contador={500}
                      validate={composeValidators(
                        validaObservacoes(values),
                        maxLength(500)
                      )}
                      disabled={
                        !values.ocorrencias || !values.ocorrencias.length
                      }
                    />
                  </div>
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

                  <Botao
                    texto="< Item Anterior"
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    disabled={alimentoAtual === 0}
                    onClick={() => {
                      changePage(values, -1);
                    }}
                  />

                  <Botao
                    texto="Próximo Item >"
                    className="ml-3"
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    disabled={
                      Object.keys(errors).length > 0 ||
                      !guia.alimentos ||
                      alimentoAtual === guia.alimentos.length - 1
                    }
                    onClick={() => {
                      changePage(values, 1);
                    }}
                  />

                  <span className="float-right tooltip-botao">
                    <Botao
                      texto="Finalizar reposição"
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      disabled={
                        Object.keys(errors).length > 0 ||
                        !guia.alimentos ||
                        alimentoAtual !== guia.alimentos.length - 1
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
