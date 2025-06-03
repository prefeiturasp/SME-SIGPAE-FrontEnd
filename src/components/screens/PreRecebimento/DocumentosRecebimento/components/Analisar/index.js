import {
  Fragment as _Fragment,
  jsx as _jsx,
  jsxs as _jsxs,
} from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { Spin } from "antd";
import moment from "moment";
import "./styles.scss";
import {
  PAINEL_DOCUMENTOS_RECEBIMENTO,
  PRE_RECEBIMENTO,
} from "src/configs/constants";
import { useNavigate } from "react-router-dom";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "../../../../../Shareable/Botao/constants";
import Botao from "../../../../../Shareable/Botao";
import SelectSelecione from "src/components/Shareable/SelectSelecione";
import { FluxoDeStatusPreRecebimento } from "src/components/Shareable/FluxoDeStatusPreRecebimento";
import {
  analisaDocumentoRecebimento,
  analisaDocumentoRecebimentoRascunho,
  detalharDocumentoParaAnalise,
} from "src/services/documentosRecebimento.service";
import { getNomesEAbreviacoesUnidadesMedida } from "src/services/qualidade.service";
import { getListaLaboratoriosCredenciados } from "src/services/laboratorio.service";
import InputText from "src/components/Shareable/Input/InputText";
import { required } from "src/helpers/fieldValidators";
import { deletaValues } from "src/helpers/formHelper";
import { PRAZO_RECEBIMENTO_OPTIONS } from "../../constants";
import { Field, Form } from "react-final-form";
import { InputComData } from "src/components/Shareable/DatePicker";
import ModalGenerico from "../../../../../Shareable/ModalGenerico";
import ModalCorrecao from "./components/ModalCorrecao";
import createDecorator from "final-form-calculate";
import { exibeError } from "src/helpers/utilities";
import {
  toastError,
  toastSuccess,
} from "../../../../../Shareable/Toast/dialogs";
import ArquivosTipoRecebimento from "../ArquivosTipoDocumento";
import OutrosDocumentos from "../OutrosDocumentos";
import { STATUS_DOCUMENTOS_DE_RECEBIMENTO } from "src/constants/shared";
export default () => {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);
  const [objeto, setObjeto] = useState({});
  const [laudo, setLaudo] = useState({});
  const [showModalCancelar, setShowModalCancelar] = useState(false);
  const [showModalSalvar, setShowModalSalvar] = useState(false);
  const [showModalAprovar, setShowModalAprovar] = useState(false);
  const [showModalCorrecao, setShowModalCorrecao] = useState(false);
  const [prazos, setPrazos] = useState([true]);
  const [unidades, setUnidades] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const voltarPagina = () =>
    navigate(`/${PRE_RECEBIMENTO}/${PAINEL_DOCUMENTOS_RECEBIMENTO}`);
  const carregarDados = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    const response = await detalharDocumentoParaAnalise(uuid);
    const objeto = response.data;
    const laudoIndex = objeto.tipos_de_documentos.findIndex(
      (tipo) => tipo.tipo_documento === "LAUDO"
    );
    if (laudoIndex !== -1) {
      const laudo = objeto.tipos_de_documentos.splice(laudoIndex, 1)[0];
      setLaudo(laudo);
    }
    setObjeto(objeto);
    geraInitialValues(objeto);
  };
  const carregarUnidadesMedida = async () => {
    const response = await getNomesEAbreviacoesUnidadesMedida();
    const objeto = response.data.results.map((unidade) => ({
      uuid: unidade.uuid,
      nome: unidade.nome,
    }));
    setUnidades(objeto);
  };
  const carregarLaboratorios = async () => {
    const response = await getListaLaboratoriosCredenciados();
    const objeto = response.data.results;
    setLaboratorios(objeto);
  };
  const adicionaPrazo = () => {
    setPrazos([...prazos, true]);
  };
  const deletaPrazo = (values, index) => {
    let listaChaves = [
      "data_fabricacao",
      "data_validade",
      "prazo_maximo",
      "data_maxima",
      "justificativa",
    ];
    deletaValues(prazos, listaChaves, values, index);
    let prazosNovo = [...prazos];
    prazosNovo.splice(index, 1);
    setPrazos(prazosNovo);
  };
  const dataMaxima = createDecorator(
    {
      field: /data_fabricacao_\d/,
      updates: (value, name, allValues) => {
        let index = name.split("_")[2];
        calculaDataMaxima(allValues, Number(index));
        return {};
      },
    },
    {
      field: /prazo_maximo_\d/,
      updates: (value, name, allValues) => {
        let index = name.split("_")[2];
        return calculaDataMaxima(allValues, Number(index));
      },
    }
  );
  const calculaDataMaxima = (values, index) => {
    let data = values[`data_fabricacao_${index}`];
    let prazo = values[`prazo_maximo_${index}`];
    if (data && prazo && prazo !== "OUTRO") {
      let novaData = moment(data, "DD/MM/YYYY").add(prazo, "days");
      values[`data_maxima_${index}`] = novaData.format("DD/MM/YYYY");
      setCarregando(true);
      setCarregando(false);
    }
    return values;
  };
  const formataPayload = (values) => {
    let payload = {
      laboratorio: values.laboratorio,
      quantidade_laudo: values.quantidade_laudo?.split(".").join(""),
      unidade_medida: values.unidade_medida,
      data_final_lote: values.data_final_lote,
      numero_lote_laudo: values.numero_lote_laudo,
      saldo_laudo: values.saldo_laudo?.split(".").join(""),
      datas_fabricacao_e_prazos: prazos.map((prazo, index) => ({
        data_fabricacao: values[`data_fabricacao_${index}`],
        data_validade: values[`data_validade_${index}`],
        prazo_maximo_recebimento: values[`prazo_maximo_${index}`],
        justificativa: values[`justificativa_${index}`],
      })),
      correcao_solicitada: values.correcao_solicitada,
    };
    return payload;
  };
  const salvarRascunho = async (values) => {
    let payload = formataPayload(values);
    try {
      let response = await analisaDocumentoRecebimentoRascunho(
        payload,
        objeto.uuid
      );
      if (response.status === 201 || response.status === 200) {
        setCarregando(false);
        toastSuccess("Alterações salvas com sucesso!");
        setShowModalSalvar(false);
        voltarPagina();
      } else {
        toastError("Ocorreu um erro ao salvar as alterações");
        setCarregando(false);
      }
    } catch (error) {
      exibeError(error, "Ocorreu um erro ao salvar as alterações");
    }
  };
  const salvarAnalise = async (values) => {
    let payload = formataPayload(values);
    try {
      let response = await analisaDocumentoRecebimento(payload, objeto.uuid);
      if (response.status === 201 || response.status === 200) {
        setCarregando(false);
        toastSuccess(
          values.correcao_solicitada
            ? "Correções solicitadas ao Fornecedor com sucesso!"
            : "Documentos aprovados com sucesso!"
        );
        setShowModalAprovar(false);
        setShowModalCorrecao(false);
        voltarPagina();
      } else {
        toastError("Ocorreu um erro ao salvar a Analise");
        setCarregando(false);
      }
    } catch (error) {
      exibeError(error, "Ocorreu um erro ao salvar a Analise");
    }
  };
  const geraInitialValues = (doc) => {
    let newPrazos = [];
    let iniciais = {
      laboratorio: doc.laboratorio?.uuid,
      quantidade_laudo: doc.quantidade_laudo?.toString(),
      unidade_medida: doc.unidade_medida?.uuid,
      data_final_lote: doc.data_final_lote ? doc.data_final_lote : undefined,
      numero_lote_laudo: doc.numero_lote_laudo
        ? doc.numero_lote_laudo
        : undefined,
      saldo_laudo: doc.saldo_laudo?.toString(),
    };
    doc.datas_fabricacao_e_prazos?.map((obj, index) => {
      iniciais[`data_fabricacao_${index}`] = obj.data_fabricacao;
      iniciais[`data_validade_${index}`] = obj.data_validade;
      iniciais[`prazo_maximo_${index}`] = obj.prazo_maximo_recebimento;
      iniciais[`justificativa_${index}`] = obj.justificativa;
      newPrazos.push(true);
    });
    if (newPrazos.length > prazos.length) setPrazos(newPrazos);
    setInitialValues(iniciais);
  };
  useEffect(() => {
    (async () => {
      setCarregando(true);
      await carregarDados();
      await carregarUnidadesMedida();
      await carregarLaboratorios();
      setCarregando(false);
    })();
  }, []);
  const documentoRecebimentoPassouPorAprovacao = useMemo(() => {
    return (
      objeto.logs &&
      objeto.logs.filter(
        (_log) =>
          _log.status_evento_explicacao ===
          STATUS_DOCUMENTOS_DE_RECEBIMENTO.APROVADO
      ).length > 0
    );
  }, [objeto.logs]);
  return _jsx(Spin, {
    tip: "Carregando...",
    spinning: carregando,
    children: _jsx("div", {
      className: "card mt-3 card-analisar-documentos-recebimento",
      children: _jsx("div", {
        className: "card-body",
        children: _jsx(Form, {
          onSubmit: () => {},
          initialValues: initialValues,
          decorators: [dataMaxima],
          render: ({ handleSubmit, values, errors }) =>
            _jsxs("form", {
              onSubmit: handleSubmit,
              children: [
                _jsx(ModalGenerico, {
                  show: showModalCancelar,
                  handleSim: () => {
                    voltarPagina();
                  },
                  handleClose: () => {
                    setShowModalCancelar(false);
                  },
                  loading: carregando,
                  titulo: _jsx(_Fragment, {
                    children: "Cancelar Altera\u00E7\u00F5es",
                  }),
                  texto: _jsxs(_Fragment, {
                    children: [
                      "Deseja ",
                      _jsx("strong", { children: "cancelar" }),
                      " as altera\u00E7\u00F5es realizadas no documento de recebimento?",
                    ],
                  }),
                }),
                _jsx(ModalGenerico, {
                  show: showModalSalvar,
                  handleSim: () => {
                    salvarRascunho(values);
                  },
                  handleClose: () => {
                    setShowModalSalvar(false);
                  },
                  loading: carregando,
                  titulo: _jsx(_Fragment, {
                    children: "Salvar Altera\u00E7\u00F5es",
                  }),
                  texto: _jsx(_Fragment, {
                    children:
                      "Deseja salvar as altera\u00E7\u00F5es realizadas no documento de recebimento?",
                  }),
                }),
                _jsx(ModalCorrecao, {
                  show: showModalCorrecao,
                  handleSim: () => {
                    salvarAnalise(values);
                  },
                  handleClose: () => {
                    delete values["correcao_solicitada"];
                    setShowModalCorrecao(false);
                  },
                  loading: carregando,
                  errors: errors,
                }),
                _jsx(ModalGenerico, {
                  show: showModalAprovar,
                  handleSim: () => {
                    salvarAnalise(values);
                  },
                  handleClose: () => {
                    setShowModalAprovar(false);
                  },
                  loading: carregando,
                  titulo: _jsx(_Fragment, { children: "Aprovar Documentos" }),
                  texto: _jsxs(_Fragment, {
                    children: [
                      "Deseja aprovar os Documentos de Recebimento referente ao Laudo ",
                      _jsxs("strong", {
                        children: ["N\u00BA ", objeto.numero_laudo],
                      }),
                      "?",
                    ],
                  }),
                }),
                objeto.logs &&
                  _jsx("div", {
                    className: "row my-4",
                    children: _jsx(FluxoDeStatusPreRecebimento, {
                      listaDeStatus: objeto.logs,
                    }),
                  }),
                _jsx("div", {
                  className: "subtitulo",
                  children: "Dados Gerais",
                }),
                _jsxs("div", {
                  className: "row",
                  children: [
                    _jsx("div", {
                      className: "col-12",
                      children: _jsx(InputText, {
                        label: "Fornecedor",
                        valorInicial: objeto.fornecedor,
                        required: true,
                        disabled: true,
                      }),
                    }),
                    _jsx("div", {
                      className: "col-6",
                      children: _jsx(InputText, {
                        label: "N\u00BA do Cronograma",
                        valorInicial: objeto.numero_cronograma,
                        required: true,
                        disabled: true,
                      }),
                    }),
                    _jsx("div", {
                      className: "col-6",
                      children: _jsx(InputText, {
                        label: "N\u00BA do Preg\u00E3o/Chamada P\u00FAblica",
                        valorInicial: objeto.pregao_chamada_publica,
                        required: true,
                        disabled: true,
                      }),
                    }),
                    _jsx("div", {
                      className: "col-6",
                      children: _jsx(InputText, {
                        label: "Nome do Produto",
                        valorInicial: objeto.nome_produto,
                        required: true,
                        disabled: true,
                      }),
                    }),
                    _jsx("div", {
                      className: "col-6",
                      children: _jsx(InputText, {
                        label: "N\u00BA do Processo SEI",
                        valorInicial: objeto.numero_sei,
                        required: true,
                        disabled: true,
                      }),
                    }),
                    _jsx("div", {
                      className: "col-6",
                      children: _jsx(InputText, {
                        label: "N\u00BA do Laudo",
                        valorInicial: objeto.numero_laudo,
                        required: true,
                        disabled: true,
                      }),
                    }),
                  ],
                }),
                _jsx("div", {
                  className: "subtitulo-documento",
                  children: "Laudo enviado pelo Fornecedor:",
                }),
                _jsx(ArquivosTipoRecebimento, { lista: laudo }),
                _jsx("hr", {}),
                _jsx("div", {
                  className: "subtitulo",
                  children: "Dados do Laudo",
                }),
                _jsxs("div", {
                  className: "row",
                  children: [
                    _jsx("div", {
                      className: "col-6",
                      children: _jsx(Field, {
                        component: SelectSelecione,
                        naoDesabilitarPrimeiraOpcao: true,
                        options: laboratorios,
                        label: "Nome do Laborat\u00F3rio",
                        name: `laboratorio`,
                        placeholder: "Selecione um Laborat\u00F3rio",
                        className: "input-analise",
                        required: true,
                        validate: required,
                        disabled: documentoRecebimentoPassouPorAprovacao,
                      }),
                    }),
                    values["laboratorio"] &&
                      _jsxs("div", {
                        className: "col-5 aviso-laboratorio",
                        children: [
                          _jsx("i", {
                            className: "fas fa-exclamation-triangle",
                          }),
                          _jsx("span", {
                            children:
                              "N\u00E3o se esque\u00E7a de verificar se o Laborat\u00F3rio \u00E9 credenciado em \u00D3rg\u00E3os ou Universidades Oficiais.",
                          }),
                        ],
                      }),
                  ],
                }),
                _jsxs("div", {
                  className: "row",
                  children: [
                    _jsx("div", {
                      className: "col-4",
                      children: _jsx(Field, {
                        component: InputText,
                        label: "Quantidade do Laudo",
                        name: `quantidade_laudo`,
                        placeholder: "Digite a Quantidade",
                        required: true,
                        validate: required,
                        agrupadorMilhar: true,
                        disabled: documentoRecebimentoPassouPorAprovacao,
                      }),
                    }),
                    _jsx("div", {
                      className: "col-4",
                      children: _jsx(Field, {
                        component: SelectSelecione,
                        naoDesabilitarPrimeiraOpcao: true,
                        options: unidades,
                        label: "Unidade de Medida",
                        name: `unidade_medida`,
                        placeholder: "Selecione uma Unidade",
                        className: "input-analise",
                        required: true,
                        validate: required,
                        disabled: documentoRecebimentoPassouPorAprovacao,
                      }),
                    }),
                    _jsx("div", {
                      className: "col-4",
                      children: _jsx(Field, {
                        component: InputText,
                        label: "Saldo do Laudo",
                        name: `saldo_laudo`,
                        placeholder: "Digite o Saldo do Lote",
                        required: true,
                        validate: required,
                        agrupadorMilhar: true,
                        disabled: documentoRecebimentoPassouPorAprovacao,
                      }),
                    }),
                    _jsx("div", {
                      className: "col-4",
                      children: _jsx(Field, {
                        component: InputComData,
                        label: "Data de Conclus\u00E3o do Laudo",
                        name: `data_final_lote`,
                        placeholder: "Selecione uma Data",
                        className: "input-analise",
                        required: true,
                        validate: required,
                        minDate: null,
                        maxDate: null,
                        disabled: documentoRecebimentoPassouPorAprovacao,
                      }),
                    }),
                    _jsx("div", {
                      className: "col-8",
                      children: _jsx(Field, {
                        component: InputText,
                        label: "N\u00BA do(s) Lote(s) do(s) Laudo(s)",
                        name: `numero_lote_laudo`,
                        placeholder: "Digite o(s) n\u00BA do(s) lote(s)",
                        required: true,
                        validate: required,
                        disabled: documentoRecebimentoPassouPorAprovacao,
                      }),
                    }),
                    prazos.map((prazo, index) =>
                      _jsxs(
                        "div",
                        {
                          className: "row",
                          children: [
                            _jsx("div", {
                              className: "col",
                              children: _jsx(Field, {
                                component: InputComData,
                                label: "Data de Fabrica\u00E7\u00E3o",
                                name: `data_fabricacao_${index}`,
                                placeholder: "Selecione uma Data",
                                className: "input-analise",
                                required: true,
                                validate: required,
                                minDate: null,
                                maxDate: new Date(),
                                disabled:
                                  documentoRecebimentoPassouPorAprovacao,
                              }),
                            }),
                            _jsx("div", {
                              className: "col",
                              children: _jsx(Field, {
                                component: InputComData,
                                label: "Data de Validade",
                                name: `data_validade_${index}`,
                                placeholder: "Selecione uma Data",
                                className: "input-analise",
                                required: true,
                                validate: required,
                                minDate: new Date(),
                                disabled:
                                  documentoRecebimentoPassouPorAprovacao,
                              }),
                            }),
                            _jsx("div", {
                              className: "col",
                              children: _jsx(Field, {
                                component: SelectSelecione,
                                naoDesabilitarPrimeiraOpcao: true,
                                options: PRAZO_RECEBIMENTO_OPTIONS,
                                className: "input-analise",
                                label: "Prazo M\u00E1ximo de Recebimento",
                                name: `prazo_maximo_${index}`,
                                placeholder: "Selecione um prazo",
                                required: true,
                                validate: required,
                                disabled:
                                  documentoRecebimentoPassouPorAprovacao,
                              }),
                            }),
                            values[`prazo_maximo_${index}`] !== "OUTRO" &&
                              _jsx("div", {
                                className: "col",
                                children: _jsx(InputText, {
                                  label: "Data M\u00E1xima de Recebimento",
                                  placeholder: "Selecione um prazo",
                                  valorInicial: values[`data_maxima_${index}`],
                                  required: true,
                                  disabled: true,
                                }),
                              }),
                            _jsx("div", {
                              className: "col-1 btn-acao",
                              children:
                                index === 0
                                  ? _jsx(Botao, {
                                      texto: "+",
                                      type: BUTTON_TYPE.BUTTON,
                                      style: BUTTON_STYLE.GREEN_OUTLINE,
                                      className: "input-analise",
                                      onClick: () => adicionaPrazo(),
                                      tooltipExterno:
                                        "Adicionar data de fabricação",
                                      disabled:
                                        documentoRecebimentoPassouPorAprovacao,
                                    })
                                  : _jsx(Botao, {
                                      texto: "",
                                      icon: "fas fa-trash",
                                      type: BUTTON_TYPE.BUTTON,
                                      style: BUTTON_STYLE.GREEN_OUTLINE,
                                      className: "input-analise",
                                      onClick: () => deletaPrazo(values, index),
                                      tooltipExterno:
                                        "Remover data de fabricação",
                                    }),
                            }),
                            values[`prazo_maximo_${index}`] === "OUTRO" &&
                              _jsx("div", {
                                className: "col-12",
                                children: _jsx(Field, {
                                  component: InputText,
                                  label:
                                    "Justifique Outro prazo m\u00E1ximo para Recebimento",
                                  name: `justificativa_${index}`,
                                  placeholder: "Insira sua Justificativa",
                                  required: true,
                                  validate: required,
                                }),
                              }),
                          ],
                        },
                        index
                      )
                    ),
                  ],
                }),
                _jsx("hr", {}),
                _jsx(OutrosDocumentos, { documento: objeto }),
                _jsx("hr", {}),
                _jsxs("div", {
                  className: "mt-4 mb-4",
                  children: [
                    _jsx(Botao, {
                      texto: "Aprovar Documentos",
                      type: BUTTON_TYPE.BUTTON,
                      style: BUTTON_STYLE.GREEN,
                      className: "float-end ms-3",
                      icon: "fas fa-check",
                      disabled: Object.keys(errors).length > 0,
                      onClick: () => setShowModalAprovar(true),
                    }),
                    _jsx(Botao, {
                      texto: "Solicitar Corre\u00E7\u00E3o",
                      type: BUTTON_TYPE.BUTTON,
                      style: BUTTON_STYLE.ORANGE_OUTLINE,
                      icon: "fas fa-pen",
                      className: "float-end ms-3",
                      disabled: Object.keys(errors).length > 0,
                      onClick: () => setShowModalCorrecao(true),
                    }),
                    _jsx(Botao, {
                      texto: "Salvar Altera\u00E7\u00F5es",
                      type: BUTTON_TYPE.BUTTON,
                      style: BUTTON_STYLE.GREEN_OUTLINE,
                      className: "float-end ms-3",
                      onClick: () => setShowModalSalvar(true),
                    }),
                    _jsx(Botao, {
                      texto: "Cancelar",
                      type: BUTTON_TYPE.BUTTON,
                      style: BUTTON_STYLE.GREEN_OUTLINE,
                      className: "float-end ms-3",
                      onClick: () => setShowModalCancelar(true),
                    }),
                  ],
                }),
              ],
            }),
        }),
      }),
    }),
  });
};
