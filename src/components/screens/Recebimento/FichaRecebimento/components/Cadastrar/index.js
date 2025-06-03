import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { Field, Form } from "react-final-form";
import moment from "moment";
import {
  FICHA_RECEBIMENTO,
  RECEBIMENTO,
  QUESTOES_POR_PRODUTO,
} from "src/configs/constants";
import {
  getListaCronogramasPraFichaRecebimento,
  getCronogramaPraCadastroRecebimento,
} from "src/services/cronograma.service";
import { cadastraRascunhoFichaRecebimento } from "src/services/fichaRecebimento.service";
import AutoCompleteSelectField from "src/components/Shareable/AutoCompleteSelectField";
import Select from "src/components/Shareable/Select";
import MultiSelect from "src/components/Shareable/FinalForm/MultiSelect";
import InputText from "src/components/Shareable/Input/InputText";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import { InputComData } from "src/components/Shareable/DatePicker";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "src/components/Shareable/Botao/constants";
import Botao from "src/components/Shareable/Botao";
import StepsSigpae from "src/components/Shareable/StepsSigpae";
import Collapse from "src/components/Shareable/Collapse";
import ModalGenerico from "src/components/Shareable/ModalGenerico";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import RadioButtonField from "src/components/Shareable/RadioButtonField";
import Label from "src/components/Shareable/Label";
import InputFileField from "src/components/Shareable/InputFileField";
import { getListaFiltradaAutoCompleteSelect } from "src/helpers/autoCompleteSelect";
import { required } from "src/helpers/fieldValidators";
import { exibeError } from "src/helpers/utilities";
import { deletaValues } from "src/helpers/formHelper";
import { stringToBoolean } from "src/helpers/parsers";
import "./styles.scss";
import { detalharQuestoesPorCronograma } from "src/services/recebimento/questoesConferencia.service";
const ITENS_STEPS = [
  {
    title: "Cronograma",
  },
  {
    title: "Dados do Recebimento",
  },
  {
    title: "Embalagens e Rotulagens",
  },
];
const collapseConfigStep3 = [
  {
    titulo: "Sistema de Vedação da Embalagem Secundária",
    camposObrigatorios: true,
  },
  {
    titulo: "Conferência das Rotulagens",
    camposObrigatorios: true,
  },
  {
    titulo: "Observações",
    camposObrigatorios: false,
  },
];
export default () => {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);
  const [cronogramas, setCronogramas] = useState([]);
  const [collapse1, setCollapse1] = useState({ 0: true });
  const [collapse2, setCollapse2] = useState({ 0: true });
  const [collapse3, setCollapse3] = useState({ 0: true });
  const [cronograma, setCronograma] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showModalAtribuir, setShowModalAtribuir] = useState(false);
  const [stepAtual, setStepAtual] = useState(0);
  const [veiculos, setVeiculos] = useState([{}]);
  const [arquivos, setArquivos] = useState([]);
  const [questoesPrimarias, setQuestoesPrimarias] = useState([]);
  const [questoesSecundarias, setQuestoesSecundarias] = useState([]);
  const onSubmit = () => {};
  const buscaCronogramas = async () => {
    setCarregando(true);
    try {
      let response = await getListaCronogramasPraFichaRecebimento();
      setCronogramas(response.data.results);
    } finally {
      setCarregando(false);
    }
  };
  const getOpcoesEtapas = () => {
    let options = [];
    cronograma.etapas?.forEach((etapa) => {
      if (etapa.desvinculada_recebimento) {
        options.push({
          uuid: etapa.uuid,
          nome: `${etapa.etapa} - ${etapa.parte}`,
        });
      }
    });
    return options;
  };
  const getOpcoesDocumentos = () => {
    let options = [];
    cronograma.documentos_de_recebimento?.forEach((doc) => {
      options.push({
        value: doc,
        label: doc.numero_laudo,
      });
    });
    return options;
  };
  const formataPayloadQuestoes = (values, listaQuestoes, tipoQuestao) => {
    return listaQuestoes
      ? listaQuestoes
          .map((questao) => {
            let resposta = stringToBoolean(
              values[`${tipoQuestao}_${questao.uuid}`]
            );
            return resposta !== undefined
              ? {
                  questao_conferencia: questao.uuid,
                  resposta,
                  tipo_questao: tipoQuestao,
                }
              : null;
          })
          .filter((x) => x !== null)
      : [];
  };
  const formataPayload = (values) => {
    let payloadQuestoes = [
      ...formataPayloadQuestoes(values, questoesPrimarias, "PRIMARIA"),
      ...formataPayloadQuestoes(values, questoesSecundarias, "SECUNDARIA"),
    ];
    let payload = {
      etapa: values.etapa,
      data_entrega: values.data_entrega
        ? moment(values.data_entrega, "DD/MM/YYYY").format("YYYY-MM-DD")
        : undefined,
      documentos_recebimento: values.documentos_recebimento?.map((x) => x.uuid),
      lote_fabricante_de_acordo: stringToBoolean(
        values.lote_fabricante_de_acordo
      ),
      lote_fabricante_divergencia: values.lote_fabricante_divergencia,
      data_fabricacao_de_acordo: stringToBoolean(
        values.data_fabricacao_de_acordo
      ),
      data_fabricacao_divergencia: values.data_fabricacao_divergencia,
      data_validade_de_acordo: stringToBoolean(values.data_validade_de_acordo),
      data_validade_divergencia: values.data_validade_divergencia,
      numero_lote_armazenagem: values.numero_lote_armazenagem,
      numero_paletes: values.numero_paletes,
      peso_embalagem_primaria_1: values.peso_embalagem_primaria_1,
      peso_embalagem_primaria_2: values.peso_embalagem_primaria_2,
      peso_embalagem_primaria_3: values.peso_embalagem_primaria_3,
      peso_embalagem_primaria_4: values.peso_embalagem_primaria_4,
      veiculos: values.numero_0
        ? veiculos.map((v, index) => ({
            numero: values[`numero_${index}`],
            temperatura_recebimento: values[`temperatura_recebimento_${index}`],
            temperatura_produto: values[`temperatura_produto_${index}`],
            placa: values[`placa_${index}`],
            lacre: values[`lacre_${index}`],
            numero_sif_sisbi_sisp: values[`numero_sif_sisbi_sisp_${index}`],
            numero_nota_fiscal: values[`numero_nota_fiscal_${index}`],
            quantidade_nota_fiscal: values[`quantidade_nota_fiscal_${index}`],
            embalagens_nota_fiscal: values[`embalagens_nota_fiscal_${index}`],
            quantidade_recebida: values[`quantidade_recebida_${index}`],
            embalagens_recebidas: values[`embalagens_recebidas_${index}`],
            estado_higienico_adequado: stringToBoolean(
              values[`estado_higienico_adequado_${index}`]
            ),
            termografo: stringToBoolean(values[`termografo_${index}`]),
          }))
        : undefined,
      sistema_vedacao_embalagem_secundaria:
        values.sistema_vedacao_embalagem_secundaria === "0"
          ? cronograma.sistema_vedacao_embalagem_secundaria
          : values.sistema_vedacao_embalagem_secundaria_outra_opcao,
      observacao: values.observacao,
      arquivos: arquivos,
      observacoes_conferencia: values.observacoes_conferencia,
      questoes: payloadQuestoes,
    };
    return payload;
  };
  const salvarRascunho = async (values, redirecionarPara) => {
    setCarregando(true);
    let payload = formataPayload(values);
    try {
      let response = await cadastraRascunhoFichaRecebimento(payload);
      if (response.status === 201 || response.status === 200) {
        toastSuccess("Rascunho salvo com sucesso!");
        redirecionarPara();
      } else {
        toastError("Ocorreu um erro ao salvar o Rascunho");
      }
    } catch (error) {
      exibeError(error, "Ocorreu um erro ao salvar o Rascunho");
    } finally {
      setShowModal(false);
      setCarregando(false);
    }
  };
  const paginaAnterior = () => navigate(`/${RECEBIMENTO}/${FICHA_RECEBIMENTO}`);
  const paginaQuestoesPorProduto = () =>
    navigate(`/${RECEBIMENTO}/${QUESTOES_POR_PRODUTO}`);
  useEffect(() => {
    buscaCronogramas();
  }, []);
  const optionsCronograma = (values) =>
    getListaFiltradaAutoCompleteSelect(
      cronogramas.map(({ numero }) => numero),
      values.cronograma,
      true
    );
  const atualizarCamposCronograma = async (value, form) => {
    setCarregando(true);
    try {
      let cronogramaSelecionado = cronogramas.find((c) => c.numero === value);
      if (cronogramaSelecionado?.uuid) {
        let { data } = await getCronogramaPraCadastroRecebimento(
          cronogramaSelecionado.uuid
        );
        let cronograma = data.results;
        setCronograma(cronograma);
        let dataQuestoes = await detalharQuestoesPorCronograma(cronograma.uuid);
        setQuestoesPrimarias(dataQuestoes.data.questoes_primarias);
        setQuestoesSecundarias(dataQuestoes.data.questoes_secundarias);
        form.change("fornecedor", cronograma.fornecedor);
        form.change("numero_contrato", cronograma.contrato);
        form.change("pregao", cronograma.pregao_chamada_publica);
        form.change("numero_ata", cronograma.ata);
        form.change("produto", cronograma.produto);
        form.change("marca", cronograma.marca);
        form.change("qtd_total_programada", cronograma.qtd_total_programada);
      } else {
        setCronograma({});
        form.reset({});
      }
    } finally {
      setCarregando(false);
    }
  };
  const atualizarCamposEtapa = (value, form) => {
    let etapa = cronograma.etapas.find((e) => e.uuid === value);
    form.change("data_programada", etapa?.data_programada);
    form.change("qtd_programada", etapa?.quantidade);
    form.change("emb_programadas", etapa?.total_embalagens);
    form.change("emb_primaria", cronograma.embalagem_primaria);
    form.change("emb_secundaria", cronograma.embalagem_secundaria);
    form.change(
      "peso_emb_primaria",
      cronograma.peso_liquido_embalagem_primaria
    );
    form.change(
      "peso_emb_secundaria",
      cronograma.peso_liquido_embalagem_secundaria
    );
  };
  const adicionaVeiculo = () => {
    setVeiculos([...veiculos, {}]);
  };
  const deletaVeiculo = (index, values) => {
    let listaChaves = [
      "numero",
      "temperatura_recebimento",
      "temperatura_produto",
      "placa",
      "lacre",
      "numero_sif_sisbi_sisp",
      "numero_nota_fiscal",
      "quantidade_nota_fiscal",
      "embalagens_nota_fiscal",
      "quantidade_recebida",
      "embalagens_recebidas",
      "estado_higienico_adequado",
      "termografo",
    ];
    deletaValues(veiculos, listaChaves, values, index);
    let veiculosNovo = [...veiculos];
    veiculosNovo.splice(index, 1);
    setVeiculos(veiculosNovo);
  };
  const setFiles = (files) => {
    const arquivosAtualizados = files.map((arquivo) => {
      return {
        nome: arquivo.nome,
        arquivo: arquivo.base64,
      };
    });
    setArquivos(arquivosAtualizados);
  };
  const removeFiles = (index) => {
    let newFiles = [...arquivos];
    newFiles.splice(index, 1);
    setArquivos(newFiles);
  };
  return _jsx(Spin, {
    tip: "Carregando...",
    spinning: carregando,
    children: _jsx("div", {
      className: "card mt-3 card-cadastro-ficha-recebimento",
      children: _jsx("div", {
        className: "card-body cadastro-ficha-recebimento",
        children: _jsx(Form, {
          onSubmit: onSubmit,
          initialValues: {},
          render: ({ handleSubmit, values, form, errors }) =>
            _jsxs("form", {
              onSubmit: handleSubmit,
              children: [
                _jsx(ModalGenerico, {
                  show: showModal,
                  handleClose: () => setShowModal(false),
                  loading: carregando,
                  handleSim: () => salvarRascunho(values, paginaAnterior),
                  titulo: _jsx("span", { children: "Salvar Rascunho" }),
                  texto: _jsx("span", {
                    children:
                      "Deseja salvar o rascunho da Ficha de Recebimento?",
                  }),
                }),
                _jsx(ModalGenerico, {
                  show: showModalAtribuir,
                  handleClose: () => setShowModalAtribuir(false),
                  loading: carregando,
                  handleSim: () =>
                    salvarRascunho(values, paginaQuestoesPorProduto),
                  titulo: "Salvar Rascunho e Atribuir Quest\u00F5es",
                  texto:
                    "Deseja salvar o rascunho e ir para a p\u00E1gina de Atribui\u00E7\u00E3o\n                  de Quest\u00F5es por Produto?",
                  textoBotaoSim: "Salvar e Ir para P\u00E1gina",
                }),
                _jsx(StepsSigpae, { current: stepAtual, items: ITENS_STEPS }),
                _jsx("hr", {}),
                stepAtual === 0 &&
                  _jsxs(Collapse, {
                    collapse: collapse1,
                    setCollapse: setCollapse1,
                    titulos: [
                      _jsx(
                        "span",
                        { children: "Dados do Cronograma de Entregas" },
                        0
                      ),
                      _jsx(
                        "span",
                        { children: "Etapa, Parte e Data do Recebimento" },
                        1
                      ),
                    ],
                    id: "collapseFichaRecebimentoStep1",
                    children: [
                      _jsxs("section", {
                        id: "dadosCronograma",
                        children: [
                          _jsxs("div", {
                            className: "row",
                            children: [
                              _jsx("div", {
                                className: "col-4",
                                children: _jsx(Field, {
                                  component: AutoCompleteSelectField,
                                  options: optionsCronograma(values),
                                  label: "Cronograma",
                                  name: `cronograma`,
                                  dataTestId: "cronograma",
                                  className: "input-busca-produto",
                                  placeholder: "Digite um cronograma",
                                  required: true,
                                  validate: required,
                                  onChange: (value) => {
                                    atualizarCamposCronograma(value, form);
                                  },
                                }),
                              }),
                              _jsx("div", {
                                className: "col-8",
                                children: _jsx(Field, {
                                  component: InputText,
                                  label: "Fornecedor",
                                  name: `fornecedor`,
                                  placeholder: "Nome da Empresa",
                                  disabled: true,
                                }),
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
                                  label: "N\u00BA do Contrato",
                                  name: `numero_contrato`,
                                  placeholder: "N\u00BA do Contrato",
                                  disabled: true,
                                }),
                              }),
                              _jsx("div", {
                                className: "col-4",
                                children: _jsx(Field, {
                                  component: InputText,
                                  label:
                                    "N\u00BA do Preg\u00E3o/Chamada P\u00FAblica",
                                  name: `pregao`,
                                  placeholder:
                                    "N\u00BA do Preg\u00E3o/Chamada P\u00FAblica",
                                  disabled: true,
                                }),
                              }),
                              _jsx("div", {
                                className: "col-4",
                                children: _jsx(Field, {
                                  component: InputText,
                                  label: "N\u00BA da Ata",
                                  name: `numero_ata`,
                                  placeholder: "N\u00BA da Ata",
                                  disabled: true,
                                }),
                              }),
                            ],
                          }),
                          _jsx("div", {
                            className: "row",
                            children: _jsx("div", {
                              className: "col-12",
                              children: _jsx(Field, {
                                component: InputText,
                                label: "Produto",
                                name: `produto`,
                                placeholder: "Nome do Produto",
                                disabled: true,
                              }),
                            }),
                          }),
                          _jsxs("div", {
                            className: "row",
                            children: [
                              _jsx("div", {
                                className: "col-8",
                                children: _jsx(Field, {
                                  component: InputText,
                                  label: "Marca",
                                  name: `marca`,
                                  placeholder: "Nome da Marca",
                                  disabled: true,
                                }),
                              }),
                              _jsx("div", {
                                className: "col-4",
                                children: _jsx(Field, {
                                  component: InputText,
                                  label: "Quantidade Total Programada",
                                  name: `qtd_total_programada`,
                                  placeholder: "Quantidade Total",
                                  disabled: true,
                                }),
                              }),
                            ],
                          }),
                          cronograma.etapas &&
                            _jsx("div", {
                              className: "row mt-3",
                              children: _jsx("div", {
                                className: "col-12",
                                children: _jsxs("table", {
                                  className: "table tabela-dados-cronograma",
                                  children: [
                                    _jsxs("thead", {
                                      className: "head-crono",
                                      children: [
                                        _jsx("th", {
                                          className: "borda-crono",
                                          children: "N\u00B0 do Empenho",
                                        }),
                                        _jsx("th", {
                                          className: "borda-crono",
                                          children: "Qtde. Total do Empenho",
                                        }),
                                        _jsx("th", {
                                          className: "borda-crono",
                                          children: "Etapa",
                                        }),
                                        _jsx("th", {
                                          className: "borda-crono",
                                          children: "Parte",
                                        }),
                                        _jsx("th", {
                                          className: "borda-crono",
                                          children: "Data Programada",
                                        }),
                                        _jsx("th", {
                                          className: "borda-crono",
                                          children: "Quantidade",
                                        }),
                                        _jsx("th", {
                                          className: "borda-crono",
                                          children: "Total de Embalagens",
                                        }),
                                      ],
                                    }),
                                    _jsx("tbody", {
                                      children: cronograma.etapas.map(
                                        (etapa, key) => {
                                          return _jsxs(
                                            "tr",
                                            {
                                              children: [
                                                _jsx("td", {
                                                  className: "borda-crono",
                                                  children:
                                                    etapa.numero_empenho,
                                                }),
                                                _jsx("td", {
                                                  className: "borda-crono",
                                                  children:
                                                    etapa.qtd_total_empenho,
                                                }),
                                                _jsx("td", {
                                                  className: "borda-crono",
                                                  children: etapa.etapa,
                                                }),
                                                _jsx("td", {
                                                  className: "borda-crono",
                                                  children: etapa.parte,
                                                }),
                                                _jsx("td", {
                                                  className: "borda-crono",
                                                  children:
                                                    etapa.data_programada,
                                                }),
                                                _jsx("td", {
                                                  className: "borda-crono",
                                                  children: etapa.quantidade,
                                                }),
                                                _jsx("td", {
                                                  className: "borda-crono",
                                                  children:
                                                    etapa.total_embalagens,
                                                }),
                                              ],
                                            },
                                            key
                                          );
                                        }
                                      ),
                                    }),
                                  ],
                                }),
                              }),
                            }),
                        ],
                      }),
                      _jsxs("section", {
                        id: "dadosEtapa",
                        children: [
                          _jsxs("div", {
                            className: "row",
                            children: [
                              _jsx("div", {
                                className: "col-6",
                                children: _jsx(Field, {
                                  component: Select,
                                  naoDesabilitarPrimeiraOpcao: true,
                                  options: [
                                    {
                                      nome: "Selecione a Etapa - Parte",
                                      uuid: "",
                                    },
                                    ...getOpcoesEtapas(),
                                  ],
                                  label: "Etapa e Parte",
                                  name: "etapa",
                                  dataTestId: "etapa",
                                  required: true,
                                  validate: required,
                                  onChangeEffect: (e) => {
                                    atualizarCamposEtapa(e.target.value, form);
                                  },
                                }),
                              }),
                              _jsx("div", {
                                className: "col-3",
                                children: _jsx(Field, {
                                  component: InputComData,
                                  label: "Data Programada",
                                  name: `data_programada`,
                                  placeholder: "Data do Cronograma",
                                  disabled: true,
                                }),
                              }),
                              _jsx("div", {
                                className: "col-3",
                                children: _jsx(Field, {
                                  component: InputComData,
                                  label: "Data da Entrega",
                                  name: `data_entrega`,
                                  dataTestId: "data_entrega",
                                  placeholder: "Selecionar a Data",
                                  required: true,
                                  validate: required,
                                  writable: false,
                                }),
                              }),
                            ],
                          }),
                          _jsxs("div", {
                            className: "row",
                            children: [
                              _jsx("div", {
                                className: "col-3",
                                children: _jsx(Field, {
                                  component: InputText,
                                  label: "Quantidade Programada",
                                  name: `qtd_programada`,
                                  placeholder: "Quantidade Programada",
                                  disabled: true,
                                }),
                              }),
                              _jsx("div", {
                                className: "col-3",
                                children: _jsx(Field, {
                                  component: InputText,
                                  label: "Embalagens Programadas",
                                  name: `emb_programadas`,
                                  placeholder: "Embalagens Programadas",
                                  disabled: true,
                                }),
                              }),
                              _jsx("div", {
                                className: "col-3",
                                children: _jsx(Field, {
                                  component: InputText,
                                  label: "Peso Embalagem Prim\u00E1ria",
                                  name: `peso_emb_primaria`,
                                  placeholder: "Peso Embalagem Prim\u00E1ria",
                                  disabled: true,
                                }),
                              }),
                              _jsx("div", {
                                className: "col-3",
                                children: _jsx(Field, {
                                  component: InputText,
                                  label: "Peso Embalagem Secund\u00E1ria",
                                  name: `peso_emb_secundaria`,
                                  placeholder: "Peso Embalagem Secund\u00E1ria",
                                  disabled: true,
                                }),
                              }),
                            ],
                          }),
                          _jsxs("div", {
                            className: "row",
                            children: [
                              _jsx("div", {
                                className: "col-6",
                                children: _jsx(Field, {
                                  component: InputText,
                                  label: "Embalagem Prim\u00E1ria",
                                  name: `emb_primaria`,
                                  placeholder: "Embalagem Prim\u00E1ria",
                                  disabled: true,
                                }),
                              }),
                              _jsx("div", {
                                className: "col-6",
                                children: _jsx(Field, {
                                  component: InputText,
                                  label: "Embalagem Secund\u00E1ria",
                                  name: `emb_secundaria`,
                                  placeholder: "Embalagem Secund\u00E1ria",
                                  disabled: true,
                                }),
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                stepAtual === 1 &&
                  _jsxs(Collapse, {
                    collapse: collapse2,
                    setCollapse: setCollapse2,
                    titulos: [
                      _jsx(
                        "span",
                        { children: "Valida\u00E7\u00F5es do Produto" },
                        0
                      ),
                      _jsx(
                        "span",
                        {
                          children:
                            "Ve\u00EDculos e Quantidades do Recebimento",
                        },
                        1
                      ),
                    ],
                    id: "collapseFichaRecebimentoStep2",
                    children: [
                      _jsxs("section", {
                        id: "dadosValidacoes",
                        children: [
                          _jsx("div", {
                            className: "row",
                            children: _jsx("div", {
                              className: "col-6",
                              children: _jsx(Field, {
                                label:
                                  "Laudo(s) de An\u00E1lise Dispon\u00EDvel(eis) para Recebimento",
                                component: MultiSelect,
                                disableSearch: true,
                                name: "documentos_recebimento",
                                multiple: true,
                                nomeDoItemNoPlural: "laudos",
                                options: getOpcoesDocumentos(),
                                placeholder: "Selecione os Laudos",
                                required: true,
                                validate: required,
                              }),
                            }),
                          }),
                          values.documentos_recebimento?.length > 0 &&
                            _jsx("div", {
                              className: "row mt-3",
                              children: _jsx("div", {
                                className: "col-12",
                                children: _jsxs("table", {
                                  className: "table tabela-dados-cronograma",
                                  children: [
                                    _jsxs("thead", {
                                      className: "head-crono",
                                      children: [
                                        _jsx("th", {
                                          className: "borda-crono",
                                          children: "N\u00BA do Laudo",
                                        }),
                                        _jsx("th", {
                                          className: "borda-crono",
                                          children: "Lote(s) do Laudo",
                                        }),
                                        _jsx("th", {
                                          className: "borda-crono",
                                          children:
                                            "Data(s) de Fabrica\u00E7\u00E3o",
                                        }),
                                        _jsx("th", {
                                          className: "borda-crono",
                                          children: "Data(s) de Validade",
                                        }),
                                      ],
                                    }),
                                    _jsx("tbody", {
                                      children:
                                        values.documentos_recebimento.map(
                                          (doc, key) => {
                                            return _jsxs(
                                              "tr",
                                              {
                                                children: [
                                                  _jsx("td", {
                                                    className: "borda-crono",
                                                    children: doc.numero_laudo,
                                                  }),
                                                  _jsx("td", {
                                                    className: "borda-crono",
                                                    children:
                                                      doc.numero_lote_laudo,
                                                  }),
                                                  _jsx("td", {
                                                    className: "borda-crono",
                                                    children:
                                                      doc.datas_fabricacao,
                                                  }),
                                                  _jsx("td", {
                                                    className: "borda-crono",
                                                    children:
                                                      doc.datas_validade,
                                                  }),
                                                ],
                                              },
                                              key
                                            );
                                          }
                                        ),
                                    }),
                                  ],
                                }),
                              }),
                            }),
                          _jsxs("div", {
                            className: "row",
                            children: [
                              _jsx("div", {
                                className: "col-12",
                                children: _jsx(RadioButtonField, {
                                  label: "Lote(s) do Fabricante Observado(s)",
                                  name: `lote_fabricante_de_acordo`,
                                  options: [
                                    {
                                      value: "1",
                                      label: "De acordo com o Laudo",
                                    },
                                    {
                                      value: "0",
                                      label: "Divergente",
                                    },
                                  ],
                                }),
                              }),
                              values.lote_fabricante_de_acordo === "0" &&
                                _jsx("div", {
                                  className: "row",
                                  children: _jsx("div", {
                                    className: "col-12",
                                    children: _jsx(Field, {
                                      component: InputText,
                                      label:
                                        "Descri\u00E7\u00E3o da Diverg\u00EAncia Observada",
                                      name: `lote_fabricante_divergencia`,
                                      placeholder:
                                        "Descreva a diverg\u00EAncia",
                                      required: true,
                                      validate: required,
                                    }),
                                  }),
                                }),
                            ],
                          }),
                          _jsxs("div", {
                            className: "row",
                            children: [
                              _jsx("div", {
                                className: "col-12",
                                children: _jsx(RadioButtonField, {
                                  label:
                                    "Data(s) de Fabrica\u00E7\u00E3o Observada(s)",
                                  name: `data_fabricacao_de_acordo`,
                                  options: [
                                    {
                                      value: "1",
                                      label: "De acordo com o Laudo",
                                    },
                                    {
                                      value: "0",
                                      label: "Divergente",
                                    },
                                  ],
                                }),
                              }),
                              values.data_fabricacao_de_acordo === "0" &&
                                _jsx("div", {
                                  className: "row",
                                  children: _jsx("div", {
                                    className: "col-12",
                                    children: _jsx(Field, {
                                      component: InputText,
                                      label:
                                        "Descri\u00E7\u00E3o da Diverg\u00EAncia Observada",
                                      name: `data_fabricacao_divergencia`,
                                      placeholder:
                                        "Descreva a diverg\u00EAncia",
                                      required: true,
                                      validate: required,
                                    }),
                                  }),
                                }),
                            ],
                          }),
                          _jsxs("div", {
                            className: "row",
                            children: [
                              _jsx("div", {
                                className: "col-12",
                                children: _jsx(RadioButtonField, {
                                  label: "Data(s) de Validade Observada(s)",
                                  name: `data_validade_de_acordo`,
                                  options: [
                                    {
                                      value: "1",
                                      label: "De acordo com o Laudo",
                                    },
                                    {
                                      value: "0",
                                      label: "Divergente",
                                    },
                                  ],
                                }),
                              }),
                              values.data_validade_de_acordo === "0" &&
                                _jsx("div", {
                                  className: "row",
                                  children: _jsx("div", {
                                    className: "col-12",
                                    children: _jsx(Field, {
                                      component: InputText,
                                      label:
                                        "Descri\u00E7\u00E3o da Diverg\u00EAncia Observada",
                                      name: `data_validade_divergencia`,
                                      placeholder:
                                        "Descreva a diverg\u00EAncia",
                                      required: true,
                                      validate: required,
                                    }),
                                  }),
                                }),
                            ],
                          }),
                          _jsxs("div", {
                            className: "row",
                            children: [
                              _jsx("div", {
                                className: "col-6",
                                children: _jsx(Field, {
                                  component: InputText,
                                  label: "N\u00BA do Lote Armazenagem",
                                  name: `numero_lote_armazenagem`,
                                  placeholder:
                                    "Digite o n\u00FAmero do lote de armazenagem",
                                  required: true,
                                  validate: required,
                                }),
                              }),
                              _jsx("div", {
                                className: "col-6",
                                children: _jsx(Field, {
                                  component: InputText,
                                  label: "N\u00BA de Paletes",
                                  name: `numero_paletes`,
                                  placeholder:
                                    "Digite o n\u00FAmero de paletes",
                                  required: true,
                                  validate: required,
                                }),
                              }),
                            ],
                          }),
                          _jsx("div", {
                            className: "row",
                            children: _jsx("div", {
                              className: "col-12",
                              children: _jsx(Label, {
                                content: "Peso da Embalagem Prim\u00E1ria",
                                required: true,
                              }),
                            }),
                          }),
                          _jsxs("div", {
                            className: "row",
                            children: [
                              _jsx("div", {
                                className: "col",
                                children: _jsx(Field, {
                                  component: InputText,
                                  name: `peso_embalagem_primaria_1`,
                                  placeholder: "Digite o peso",
                                  required: true,
                                  validate: required,
                                }),
                              }),
                              _jsx("div", {
                                className: "w-auto label-peso-embalagem",
                                children: _jsx("span", { children: "Kg" }),
                              }),
                              _jsx("div", {
                                className: "col",
                                children: _jsx(Field, {
                                  component: InputText,
                                  name: `peso_embalagem_primaria_2`,
                                  placeholder: "Digite o peso",
                                  validate: required,
                                }),
                              }),
                              _jsx("div", {
                                className: "w-auto label-peso-embalagem",
                                children: _jsx("span", { children: "Kg" }),
                              }),
                              _jsx("div", {
                                className: "col",
                                children: _jsx(Field, {
                                  component: InputText,
                                  name: `peso_embalagem_primaria_3`,
                                  placeholder: "Digite o peso",
                                  validate: required,
                                }),
                              }),
                              _jsx("div", {
                                className: "w-auto label-peso-embalagem",
                                children: _jsx("span", { children: "Kg" }),
                              }),
                              _jsx("div", {
                                className: "col",
                                children: _jsx(Field, {
                                  component: InputText,
                                  name: `peso_embalagem_primaria_4`,
                                  placeholder: "Digite o peso",
                                  validate: required,
                                }),
                              }),
                              _jsx("div", {
                                className: "w-auto label-peso-embalagem",
                                children: _jsx("span", { children: "Kg" }),
                              }),
                            ],
                          }),
                        ],
                      }),
                      _jsx("section", {
                        id: "dadosVeiculos",
                        children: veiculos.map((v, index) =>
                          _jsxs(_Fragment, {
                            children: [
                              index === veiculos.length - 1 &&
                                index > 0 &&
                                _jsxs(_Fragment, {
                                  children: [
                                    index > 0 && _jsx("hr", {}),
                                    _jsx("div", {
                                      className: "row",
                                      children: _jsx("div", {
                                        className: "w-100",
                                        children: _jsx(Botao, {
                                          texto: "",
                                          type: BUTTON_TYPE.BUTTON,
                                          style: BUTTON_STYLE.RED_OUTLINE,
                                          icon: "fas fa-trash",
                                          className: "float-end ms-3",
                                          onClick: () =>
                                            deletaVeiculo(index, values),
                                          tooltipExterno:
                                            "Remover Ve\u00EDculo",
                                        }),
                                      }),
                                    }),
                                  ],
                                }),
                              _jsxs("div", {
                                className: "row",
                                children: [
                                  _jsx("div", {
                                    className: "col-3",
                                    children: _jsx(Field, {
                                      component: InputText,
                                      label: "N\u00BA do Ve\u00EDculo",
                                      name: `numero_${index}`,
                                      disabled: true,
                                      defaultValue: `Veículo ${index + 1}`,
                                    }),
                                  }),
                                  cronograma.categoria === "PERECIVEIS" &&
                                    _jsxs(_Fragment, {
                                      children: [
                                        _jsx("div", {
                                          className: "col-3",
                                          children: _jsx(Field, {
                                            component: InputText,
                                            label:
                                              "T \u00B0C (\u00C1rea de Recebimento)",
                                            name: `temperatura_recebimento_${index}`,
                                            placeholder:
                                              "T \u00B0C da \u00E1rea",
                                            required: true,
                                            validate: required,
                                          }),
                                        }),
                                        _jsx("div", {
                                          className: "col-3",
                                          children: _jsx(Field, {
                                            component: InputText,
                                            label: "T \u00B0C (Produto)",
                                            name: `temperatura_produto_${index}`,
                                            placeholder: "T \u00B0C do produto",
                                            required: true,
                                            validate: required,
                                          }),
                                        }),
                                      ],
                                    }),
                                  _jsx("div", {
                                    className: "col-3",
                                    children: _jsx(Field, {
                                      component: InputText,
                                      label: "Placa do Ve\u00EDculo",
                                      name: `placa_${index}`,
                                      placeholder:
                                        "Digite a placa do ve\u00EDculo",
                                    }),
                                  }),
                                  cronograma.categoria === "PERECIVEIS" &&
                                    _jsxs(_Fragment, {
                                      children: [
                                        _jsx("div", {
                                          className: "col-3",
                                          children: _jsx(Field, {
                                            component: InputText,
                                            label: "Lacre",
                                            name: `lacre_${index}`,
                                            placeholder:
                                              "Digite o n\u00FAmero do lacre",
                                            required: true,
                                            validate: required,
                                          }),
                                        }),
                                        _jsx("div", {
                                          className: "col-3",
                                          children: _jsx(Field, {
                                            component: InputText,
                                            label: "N\u00BA SIF, SISBI ou SISP",
                                            name: `numero_sif_sisbi_sisp_${index}`,
                                            placeholder: "Digite o n\u00FAmero",
                                            required: true,
                                            validate: required,
                                          }),
                                        }),
                                      ],
                                    }),
                                  _jsx("div", {
                                    className: "col-3",
                                    children: _jsx(Field, {
                                      component: InputText,
                                      label: "N\u00BA Nota Fiscal",
                                      name: `numero_nota_fiscal_${index}`,
                                      placeholder:
                                        "Digite o n\u00FAmero da nota",
                                      required: true,
                                      validate: required,
                                    }),
                                  }),
                                  _jsx("div", {
                                    className: "col-3",
                                    children: _jsx(Field, {
                                      component: InputText,
                                      label: "Quantidade Nota Fiscal",
                                      name: `quantidade_nota_fiscal_${index}`,
                                      placeholder: "Digite a qtde da nota",
                                      required: true,
                                      validate: required,
                                    }),
                                  }),
                                  _jsx("div", {
                                    className: "col-3",
                                    children: _jsx(Field, {
                                      component: InputText,
                                      label: "Embalagens Nota Fiscal",
                                      name: `embalagens_nota_fiscal_${index}`,
                                      placeholder:
                                        "Digite a qtde de embalagens",
                                      required: true,
                                      validate: required,
                                    }),
                                  }),
                                  _jsx("div", {
                                    className: "col-3",
                                    children: _jsx(Field, {
                                      component: InputText,
                                      label: "Quantidade Recebida",
                                      name: `quantidade_recebida_${index}`,
                                      placeholder: "Digite a qtde recebida",
                                      required: true,
                                      validate: required,
                                    }),
                                  }),
                                  _jsx("div", {
                                    className: "col-3",
                                    children: _jsx(Field, {
                                      component: InputText,
                                      label: "Embalagens Recebidas",
                                      name: `embalagens_recebidas_${index}`,
                                      placeholder: "Digite qtde recebida",
                                      required: true,
                                      validate: required,
                                    }),
                                  }),
                                ],
                              }),
                              _jsxs("div", {
                                className: "row",
                                children: [
                                  _jsx("div", {
                                    className: "col-6",
                                    children: _jsx(RadioButtonField, {
                                      label:
                                        "Estado Higi\u00EAnico-Sanit\u00E1rio",
                                      name: `estado_higienico_adequado_${index}`,
                                      options: [
                                        {
                                          value: "1",
                                          label: "ADEQUADO",
                                        },
                                        {
                                          value: "0",
                                          label: "INADEQUADO",
                                        },
                                      ],
                                    }),
                                  }),
                                  cronograma.categoria === "PERECIVEIS" &&
                                    _jsx("div", {
                                      className: "col-6",
                                      children: _jsx(RadioButtonField, {
                                        label: "Term\u00F3grafo",
                                        name: `termografo_${index}`,
                                        options: [
                                          {
                                            value: "0",
                                            label: "NÃO",
                                          },
                                          {
                                            value: "1",
                                            label: "SIM",
                                          },
                                        ],
                                      }),
                                    }),
                                ],
                              }),
                              _jsx("div", {
                                className: "text-center mb-3 mt-3",
                                children: _jsx(Botao, {
                                  texto: "+ Adicionar Ve\u00EDculo",
                                  type: BUTTON_TYPE.BUTTON,
                                  style: BUTTON_STYLE.GREEN_OUTLINE,
                                  onClick: () => adicionaVeiculo(),
                                }),
                              }),
                            ],
                          })
                        ),
                      }),
                    ],
                  }),
                stepAtual === 2 &&
                  _jsxs(Collapse, {
                    collapse: collapse3,
                    setCollapse: setCollapse3,
                    id: "collapseFichaRecebimentoStep3",
                    collapseConfigs: collapseConfigStep3,
                    children: [
                      _jsx("section", {
                        id: "sistemaVedacaoSecundaria",
                        children: _jsxs("div", {
                          className: "row",
                          children: [
                            _jsx("div", {
                              className: "col mt-3",
                              children: _jsx(RadioButtonField, {
                                name: `sistema_vedacao_embalagem_secundaria`,
                                options: [
                                  {
                                    value: "0",
                                    label:
                                      cronograma.sistema_vedacao_embalagem_secundaria,
                                  },
                                  {
                                    value: "1",
                                    label: "Outra Opção",
                                  },
                                ],
                                className: "radio-sistema-vedacao",
                              }),
                            }),
                            values.sistema_vedacao_embalagem_secundaria ===
                              "1" &&
                              _jsx("div", {
                                className: "row",
                                children: _jsx("div", {
                                  className: "col",
                                  children: _jsx(Field, {
                                    component: InputText,
                                    label: "Qual?",
                                    name: `sistema_vedacao_embalagem_secundaria_outra_opcao`,
                                    placeholder:
                                      "Descreva a outra op\u00E7\u00E3o",
                                    required: true,
                                    validate: required,
                                  }),
                                }),
                              }),
                          ],
                        }),
                      }),
                      _jsx("section", {
                        id: "conferenciaRotulagens",
                        children:
                          questoesPrimarias || questoesSecundarias
                            ? _jsx(_Fragment, {
                                children: _jsxs("div", {
                                  children: [
                                    _jsxs("table", {
                                      className:
                                        "table tabela-conferencia-embalagens",
                                      children: [
                                        _jsx("thead", {
                                          children: _jsxs("tr", {
                                            children: [
                                              _jsx("th", {
                                                className: "",
                                                children:
                                                  "Confer\u00EAncia Embalagem Prim\u00E1ria",
                                              }),
                                              _jsx("th", {
                                                className: "",
                                                children:
                                                  "Confer\u00EAncia Embalagem Secund\u00E1ria",
                                              }),
                                            ],
                                          }),
                                        }),
                                        _jsx("tbody", {
                                          children: Array.from({
                                            length: Math.max(
                                              questoesPrimarias.length,
                                              questoesSecundarias.length
                                            ),
                                          }).map((_, index) => {
                                            const primaria =
                                              questoesPrimarias[index];
                                            const secundaria =
                                              questoesSecundarias[index];
                                            return _jsxs(
                                              "tr",
                                              {
                                                className: "",
                                                children: [
                                                  _jsx("td", {
                                                    className: "",
                                                    children:
                                                      primaria &&
                                                      _jsx(RadioButtonField, {
                                                        name: `PRIMARIA_${primaria.uuid}`,
                                                        label: primaria.questao,
                                                        options: [
                                                          {
                                                            value: "1",
                                                            label: "SIM",
                                                          },
                                                          {
                                                            value: "0",
                                                            label: "NÃO",
                                                          },
                                                        ],
                                                        modoTabela: true,
                                                      }),
                                                  }),
                                                  _jsx("td", {
                                                    className: "",
                                                    children:
                                                      secundaria &&
                                                      _jsx(RadioButtonField, {
                                                        name: `SECUNDARIA_${secundaria.uuid}`,
                                                        label:
                                                          secundaria.questao,
                                                        options: [
                                                          {
                                                            value: "1",
                                                            label: "SIM",
                                                          },
                                                          {
                                                            value: "0",
                                                            label: "NÃO",
                                                          },
                                                        ],
                                                        modoTabela: true,
                                                      }),
                                                  }),
                                                ],
                                              },
                                              index
                                            );
                                          }),
                                        }),
                                      ],
                                    }),
                                    _jsx(Field, {
                                      component: TextArea,
                                      label:
                                        "Observa\u00E7\u00F5es da Confer\u00EAncia",
                                      name: `observacoes_conferencia`,
                                      placeholder:
                                        "Descreva as observa\u00E7\u00F5es das confer\u00EAncias",
                                    }),
                                  ],
                                }),
                              })
                            : _jsxs(_Fragment, {
                                children: [
                                  _jsx("div", {
                                    className: "row",
                                    children: _jsxs("div", {
                                      className: "col mt-5 text-center",
                                      children: [
                                        _jsxs("p", {
                                          children: [
                                            "N\u00E3o h\u00E1 quest\u00F5es para confer\u00EAncia cadastradas para esse produto, por favor acesse a \u00E1rea de",
                                            " ",
                                            _jsx("strong", {
                                              children:
                                                "Quest\u00F5es por Produto",
                                            }),
                                            " e atribua quest\u00F5es.",
                                          ],
                                        }),
                                        _jsxs("p", {
                                          children: [
                                            _jsx("strong", {
                                              children: "Salve o rascunho",
                                            }),
                                            " da Ficha de Recebimento para n\u00E3o perder as informa\u00E7\u00F5es inseridas at\u00E9 o momento.",
                                          ],
                                        }),
                                      ],
                                    }),
                                  }),
                                  _jsx("div", {
                                    className: "row my-5",
                                    children: _jsx("div", {
                                      className:
                                        "col d-flex justify-content-center",
                                      children: _jsx(Botao, {
                                        texto:
                                          "Ir para Atribui\u00E7\u00E3o de Quest\u00F5es por Produto",
                                        type: BUTTON_TYPE.BUTTON,
                                        style: BUTTON_STYLE.GREEN_OUTLINE,
                                        onClick: () =>
                                          setShowModalAtribuir(true),
                                      }),
                                    }),
                                  }),
                                ],
                              }),
                      }),
                      _jsxs("section", {
                        id: "observacoes",
                        children: [
                          _jsx("div", {
                            className: "row",
                            children: _jsx("div", {
                              className: "col",
                              children: _jsx(Field, {
                                component: TextArea,
                                label:
                                  "Descreva as observa\u00E7\u00F5es necess\u00E1rias",
                                name: `observacao`,
                                placeholder:
                                  "Descreva as observa\u00E7\u00F5es necess\u00E1rias",
                              }),
                            }),
                          }),
                          _jsx("div", {
                            className: "row",
                            children: _jsx(InputFileField, {
                              name: "arquivo",
                              setFiles: setFiles,
                              removeFile: removeFiles,
                              toastSuccess:
                                "Documento inclu\u00EDdo com sucesso!",
                              textoBotao: "Anexar Documento",
                              helpText:
                                "Envie arquivos nos formatos: PDF, PNG, JPG ou JPEG  com at\u00E9 10MB.",
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
                _jsx("hr", {}),
                _jsxs("div", {
                  className: "mt-4 mb-4",
                  children: [
                    stepAtual < ITENS_STEPS.length - 1 &&
                      _jsx("div", {
                        className: "mt-4 mb-4",
                        children: _jsx(Botao, {
                          texto: "Pr\u00F3ximo",
                          type: BUTTON_TYPE.BUTTON,
                          style: BUTTON_STYLE.GREEN_OUTLINE,
                          className: "float-end ms-3",
                          onClick: () =>
                            setStepAtual((stepAtual) => stepAtual + 1),
                          disabled: Object.keys(errors).length > 0,
                        }),
                      }),
                    _jsx(Botao, {
                      texto: "Salvar Rascunho",
                      type: BUTTON_TYPE.BUTTON,
                      style: BUTTON_STYLE.GREEN_OUTLINE,
                      className: "float-end ms-3",
                      disabled: !values.cronograma || !values.etapa,
                      onClick: () => {
                        setShowModal(true);
                      },
                    }),
                    stepAtual > 0 &&
                      _jsx("div", {
                        className: "mt-4 mb-4",
                        children: _jsx(Botao, {
                          texto: "Anterior",
                          type: BUTTON_TYPE.BUTTON,
                          style: BUTTON_STYLE.GREEN_OUTLINE,
                          className: "float-end ms-3",
                          onClick: () =>
                            setStepAtual((stepAtual) => stepAtual - 1),
                        }),
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
