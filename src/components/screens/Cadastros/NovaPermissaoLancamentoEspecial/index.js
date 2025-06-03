import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Field, Form } from "react-final-form";
import HTTP_STATUS from "http-status-codes";
import { Checkbox, Spin } from "antd";
import { format, parseISO } from "date-fns";
import AutoCompleteField from "src/components/Shareable/AutoCompleteField";
import { InputComData } from "src/components/Shareable/DatePicker";
import Botao from "src/components/Shareable/Botao";
import Select from "src/components/Shareable/Select";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { required } from "src/helpers/fieldValidators";
import {
  deepCopy,
  getAmanha,
  getError,
  maxEntreDatas,
} from "src/helpers/utilities";
import { getDiretoriaregionalSimplissima } from "src/services/diretoriaRegional.service";
import {
  getEscolaSimples,
  getEscolasTercTotal,
} from "src/services/escola.service";
import {
  getAlimentacoesLancamentosEspeciais,
  criarPermissaoLancamentoEspecial,
  atualizarPermissaoLancamentoEspecial,
} from "src/services/medicaoInicial/periodoLancamentoMedicao.service";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import "./style.scss";
export const NovaPermissaoLancamentoEspecial = () => {
  const { meusDados } = useContext(MeusDadosContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [erroAPI, setErroAPI] = useState("");
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFim, setDataFim] = useState(null);
  const [diretoriasRegionais, setDiretoriasRegionais] = useState([]);
  const [carregandoDREs, setCarregandoDREs] = useState(false);
  const [carregandoEscolas, setCarregandoEscolas] = useState(false);
  const [loading, setLoading] = useState(false);
  const [escolas, setEscolas] = useState([]);
  const [labelEscolas, setLabelEscolas] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [aliLancEspeciais, setAliLancEspeciais] = useState([]);
  const [aliLancEspeciaisSelecionadas, setAliLancEspeciaisSelecionadas] =
    useState([]);
  const ehEscolaValida = (labelEscola) => {
    return escolas?.find((escola) => escola.label === labelEscola);
  };
  const [valoresIniciais, setValoresIniciais] = useState();
  const getDiretoriasRegionaisAsync = async () => {
    setCarregandoDREs(true);
    const response = await getDiretoriaregionalSimplissima();
    if (response.status === HTTP_STATUS.OK) {
      setDiretoriasRegionais(
        response.data.results.map((dre) => {
          return {
            nome: dre.nome,
            uuid: dre.uuid,
          };
        })
      );
    } else {
      setErroAPI("Erro ao carregar DREs. Tente novamente mais tarde.");
    }
    setCarregandoDREs(false);
  };
  const getAlimentacoesLancamentosEspeciaisAsync = async () => {
    setLoading(true);
    const response = await getAlimentacoesLancamentosEspeciais();
    if (response.status === HTTP_STATUS.OK) {
      setAliLancEspeciais(
        response.data.map((alimentacao) => {
          return {
            nome: alimentacao.nome,
            uuid: alimentacao.uuid,
          };
        })
      );
    } else {
      setErroAPI(
        "Erro ao carregar Alimentações de Lançamentos Especiais. Tente novamente mais tarde."
      );
    }
    setLoading(false);
  };
  const getEscolasTercTotalAsync = async (dreUuid) => {
    setCarregandoEscolas(true);
    const response = await getEscolasTercTotal({ dre: dreUuid });
    if (response.status === HTTP_STATUS.OK) {
      setEscolas(
        response.data.map((escola) => {
          return {
            uuid: escola.uuid,
            label: `${escola.codigo_eol} - ${escola.nome}`,
          };
        })
      );
      setLabelEscolas(
        response.data.map((escola) => {
          return {
            label: `${escola.codigo_eol} - ${escola.nome}`,
            value: `${escola.codigo_eol} - ${escola.nome}`,
          };
        })
      );
    } else {
      setErroAPI("Erro ao carregar escolas. Tente novamente mais tarde.");
    }
    setCarregandoEscolas(false);
  };
  const getEscolaSimplesAsync = async (labelEscola) => {
    setLoading(true);
    const uuidEscola = escolas.find((escola) => escola.label === labelEscola);
    if (ehEscolaValida(labelEscola) && uuidEscola) {
      const response = await getEscolaSimples(uuidEscola.uuid);
      if (response.status === HTTP_STATUS.OK) {
        const unidadeEducacional = response.data;
        setPeriodos(
          unidadeEducacional.periodos_escolares.map((periodo) => {
            return {
              nome: periodo.nome,
              uuid: periodo.uuid,
            };
          })
        );
      } else {
        setErroAPI(
          "Erro ao carregar unidade educacional. Tente novamente mais tarde."
        );
      }
    }
    setLoading(false);
  };
  const getInitialValues = async () => {
    let initialValues = {
      uuid: null,
      diretoria_regional: null,
      escola: null,
      periodo_escolar: null,
      data_inicial: getAmanha(),
      data_final: null,
      alimentacoes_lancamento_especial: [],
    };
    if (location.state && location.state.permissao) {
      const permissao = location.state.permissao;
      await getEscolasTercTotalAsync(permissao.diretoria_regional.uuid);
      const escolaLabel = `${permissao.escola.codigo_eol} - ${permissao.escola.nome}`;
      await getEscolaSimplesAsync(escolaLabel);
      const alimentacoesPermissao =
        permissao.alimentacoes_lancamento_especial.map((ali) => ali.uuid);
      setAliLancEspeciaisSelecionadas(alimentacoesPermissao);
      initialValues = {
        uuid: permissao.uuid,
        diretoria_regional: permissao.diretoria_regional.uuid,
        escola: escolaLabel,
        periodo_escolar: permissao.periodo_escolar.uuid,
        data_inicial: permissao.data_inicial,
        data_final: permissao.data_final,
        alimentacoes_lancamento_especial: alimentacoesPermissao,
      };
    }
    setValoresIniciais(initialValues);
  };
  useEffect(() => {
    getDiretoriasRegionaisAsync();
    getAlimentacoesLancamentosEspeciaisAsync();
    getInitialValues();
  }, []);
  const onChangeCheckBox = (form, e) => {
    let listaSelecionados = [];
    if (
      e.target.value ===
      aliLancEspeciais.find((ali) => ali.nome === "2ª Refeição 1ª oferta").uuid
    ) {
      if (
        e.target.checked &&
        !aliLancEspeciaisSelecionadas.includes(
          aliLancEspeciais.find((ali) => ali.nome === "2ª Refeição 1ª oferta")
            .uuid
        )
      ) {
        listaSelecionados = [
          ...aliLancEspeciaisSelecionadas,
          e.target.value,
          aliLancEspeciais.find((ali) => ali.nome === "Repetição 2ª Refeição")
            .uuid,
        ];
      } else {
        listaSelecionados = aliLancEspeciaisSelecionadas.filter(
          (ali) =>
            ali !==
              aliLancEspeciais.find(
                (ali) => ali.nome === "2ª Refeição 1ª oferta"
              ).uuid &&
            ali !==
              aliLancEspeciais.find(
                (ali) => ali.nome === "Repetição 2ª Refeição"
              ).uuid
        );
      }
    } else if (
      e.target.value ===
      aliLancEspeciais.find((ali) => ali.nome === "Repetição 2ª Refeição").uuid
    ) {
      if (
        e.target.checked &&
        !aliLancEspeciaisSelecionadas.includes(
          aliLancEspeciais.find((ali) => ali.nome === "Repetição 2ª Refeição")
            .uuid
        )
      ) {
        listaSelecionados = [
          ...aliLancEspeciaisSelecionadas,
          e.target.value,
          aliLancEspeciais.find((ali) => ali.nome === "2ª Refeição 1ª oferta")
            .uuid,
        ];
      } else {
        listaSelecionados = aliLancEspeciaisSelecionadas.filter(
          (ali) =>
            ali !==
              aliLancEspeciais.find(
                (ali) => ali.nome === "Repetição 2ª Refeição"
              ).uuid &&
            ali !==
              aliLancEspeciais.find(
                (ali) => ali.nome === "2ª Refeição 1ª oferta"
              ).uuid
        );
      }
    } else if (
      e.target.value ===
      aliLancEspeciais.find((ali) => ali.nome === "2ª Sobremesa 1ª oferta").uuid
    ) {
      if (
        e.target.checked &&
        !aliLancEspeciaisSelecionadas.includes(
          aliLancEspeciais.find((ali) => ali.nome === "2ª Sobremesa 1ª oferta")
            .uuid
        )
      ) {
        listaSelecionados = [
          ...aliLancEspeciaisSelecionadas,
          e.target.value,
          aliLancEspeciais.find((ali) => ali.nome === "Repetição 2ª Sobremesa")
            .uuid,
        ];
      } else {
        listaSelecionados = aliLancEspeciaisSelecionadas.filter(
          (ali) =>
            ali !==
              aliLancEspeciais.find(
                (ali) => ali.nome === "2ª Sobremesa 1ª oferta"
              ).uuid &&
            ali !==
              aliLancEspeciais.find(
                (ali) => ali.nome === "Repetição 2ª Sobremesa"
              ).uuid
        );
      }
    } else if (
      e.target.value ===
      aliLancEspeciais.find((ali) => ali.nome === "Repetição 2ª Sobremesa").uuid
    ) {
      if (
        e.target.checked &&
        !aliLancEspeciaisSelecionadas.includes(
          aliLancEspeciais.find((ali) => ali.nome === "Repetição 2ª Sobremesa")
            .uuid
        )
      ) {
        listaSelecionados = [
          ...aliLancEspeciaisSelecionadas,
          e.target.value,
          aliLancEspeciais.find((ali) => ali.nome === "2ª Sobremesa 1ª oferta")
            .uuid,
        ];
      } else {
        listaSelecionados = aliLancEspeciaisSelecionadas.filter(
          (ali) =>
            ali !==
              aliLancEspeciais.find(
                (ali) => ali.nome === "Repetição 2ª Sobremesa"
              ).uuid &&
            ali !==
              aliLancEspeciais.find(
                (ali) => ali.nome === "2ª Sobremesa 1ª oferta"
              ).uuid
        );
      }
    } else {
      if (
        e.target.checked &&
        !aliLancEspeciaisSelecionadas.includes(
          aliLancEspeciais.find((ali) => ali.uuid === e.target.value).uuid
        )
      ) {
        listaSelecionados = [...aliLancEspeciaisSelecionadas, e.target.value];
      } else {
        listaSelecionados = aliLancEspeciaisSelecionadas.filter(
          (ali) =>
            ali !==
            aliLancEspeciais.find((ali) => ali.uuid === e.target.value).uuid
        );
      }
    }
    form.change("alimentacoes_lancamento_especial", listaSelecionados);
    setAliLancEspeciaisSelecionadas(listaSelecionados);
  };
  const formatarValues = (values) => {
    let values_ = deepCopy(values);
    values_.escola = escolas?.find(
      (escola) => escola.label === values.escola
    )?.uuid;
    values_.criado_por = meusDados.uuid;
    if (values_?.data_inicial?.includes("-")) {
      values_.data_inicial = format(
        parseISO(values_.data_inicial),
        "dd/MM/yyy"
      );
    }
    if (values_?.data_final?.includes("-")) {
      values_.data_final = format(parseISO(values_.data_final), "dd/MM/yyy");
    }
    return values_;
  };
  const onSubmit = async (values) => {
    const payload = formatarValues(values);
    let response = undefined;
    if (values.uuid) {
      response = await atualizarPermissaoLancamentoEspecial(
        payload,
        values.uuid
      );
    } else {
      response = await criarPermissaoLancamentoEspecial(payload);
    }
    if ([HTTP_STATUS.CREATED, HTTP_STATUS.OK].includes(response.status)) {
      toastSuccess("Permissão de Lançamento Especial salva com sucesso!");
      navigate(
        "/configuracoes/cadastros/tipos-alimentacao/permissao-lancamentos-especiais"
      );
    } else {
      toastError(getError(response.data));
    }
  };
  const LOADING = carregandoDREs;
  return _jsxs("div", {
    className: "card mt-3",
    children: [
      erroAPI && _jsx("div", { children: erroAPI }),
      _jsx("div", {
        className: "card-body",
        children: _jsx(Spin, {
          tip: "Carregando...",
          spinning: LOADING || carregandoEscolas || loading,
          children:
            !erroAPI &&
            !LOADING &&
            diretoriasRegionais &&
            _jsx(Form, {
              onSubmit: (values) => onSubmit(values),
              initialValues: valoresIniciais,
              children: ({ handleSubmit, form, values }) =>
                _jsxs("form", {
                  onSubmit: handleSubmit,
                  children: [
                    _jsxs("div", {
                      className: "row",
                      children: [
                        _jsx("div", {
                          className: "col-4",
                          children: _jsx(Field, {
                            className: "diretoria-regional-select",
                            component: Select,
                            options: [
                              { nome: "Selecione uma DRE", uuid: "" },
                              ...diretoriasRegionais,
                            ],
                            name: "diretoria_regional",
                            label: "Diretoria Regional",
                            naoDesabilitarPrimeiraOpcao: true,
                            validate: required,
                            required: true,
                            disabled: values.uuid ? true : false,
                            onChangeEffect: (e) => {
                              const value = e.target.value;
                              getEscolasTercTotalAsync(value);
                            },
                          }),
                        }),
                        _jsx("div", {
                          className: "col-8",
                          children: _jsx(Field, {
                            component: AutoCompleteField,
                            options: labelEscolas,
                            filterOption: (inputValue, option) =>
                              option.label
                                .toUpperCase()
                                .indexOf(inputValue.toUpperCase()) !== -1,
                            name: "escola",
                            label:
                              "Pesquisar por C\u00F3digo EOL e/ou Unidade Educacional",
                            placeholder: "Selecione uma unidade educacional",
                            required: true,
                            disabled:
                              !values.diretoria_regional ||
                              carregandoEscolas ||
                              values.uuid,
                            inputOnChange: (value) => {
                              getEscolaSimplesAsync(value);
                            },
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
                            component: Select,
                            options: [
                              { nome: "Selecione o período", uuid: "" },
                              ...periodos,
                            ],
                            name: "periodo_escolar",
                            label: "Per\u00EDodo",
                            naoDesabilitarPrimeiraOpcao: true,
                            validate: required,
                            required: true,
                            disabled:
                              !ehEscolaValida(values.escola) ||
                              (valoresIniciais?.uuid &&
                                dataInicio &&
                                dataInicio <= new Date()),
                          }),
                        }),
                        _jsx("div", {
                          className: "col-4",
                          children: _jsx(Field, {
                            component: InputComData,
                            label: "Data In\u00EDcio da Permiss\u00E3o",
                            name: "data_inicial",
                            minDate: getAmanha(),
                            disabled:
                              !values.diretoria_regional ||
                              !ehEscolaValida(values.escola) ||
                              (valoresIniciais?.uuid &&
                                dataInicio &&
                                dataInicio <= new Date()),
                            placeholder: "De",
                            inputOnChange: (value) => {
                              if (value) {
                                const [dia, mes, ano] = value.split("/");
                                const dataInicioSelecionada = new Date(
                                  Number(ano),
                                  Number(mes) - 1,
                                  Number(dia)
                                );
                                setDataInicio(dataInicioSelecionada);
                                if (
                                  dataFim &&
                                  dataInicioSelecionada > dataFim
                                ) {
                                  form.change("data_final", null);
                                }
                              } else {
                                setDataInicio(null);
                              }
                            },
                          }),
                        }),
                        _jsx("div", {
                          className: "col-4",
                          children: _jsx(Field, {
                            component: InputComData,
                            label: "Data Fim da Permiss\u00E3o",
                            name: "data_final",
                            minDate: maxEntreDatas([getAmanha(), dataInicio]),
                            disabled:
                              !values.diretoria_regional ||
                              !ehEscolaValida(values.escola) ||
                              (valoresIniciais?.uuid &&
                                dataInicio &&
                                dataFim &&
                                dataInicio <= new Date() &&
                                dataFim <= new Date()),
                            placeholder: "At\u00E9",
                            inputOnChange: (value) => {
                              if (value) {
                                if (value) {
                                  const [dia, mes, ano] = value.split("/");
                                  setDataFim(
                                    new Date(
                                      Number(ano),
                                      Number(mes) - 1,
                                      Number(dia)
                                    )
                                  );
                                } else {
                                  setDataFim(null);
                                }
                              }
                            },
                          }),
                        }),
                      ],
                    }),
                    _jsxs("div", {
                      className: "row mt-3",
                      children: [
                        _jsx(Field, {
                          component: "input",
                          type: "hidden",
                          name: "alimentacoes_lancamento_especial",
                        }),
                        _jsx("div", {
                          className: "titulo-permissoes-lancamentos col-3",
                          children:
                            "Permiss\u00F5es de Lan\u00E7amentos Especiais:",
                        }),
                        _jsx("div", {
                          className: "col-9",
                          children: _jsx("div", {
                            children: _jsx(Checkbox.Group, {
                              className: "check-boxes-lancamentos-especiais",
                              value: aliLancEspeciaisSelecionadas,
                              children: aliLancEspeciais.map((alimentacao) =>
                                _jsx(
                                  Checkbox,
                                  {
                                    onChange: (e) => onChangeCheckBox(form, e),
                                    className:
                                      "ck-lancamentos-especiais mb-3 me-4 ms-3",
                                    value: alimentacao.uuid,
                                    name: `ck_lancamentos_especiais__${alimentacao.uuid}`,
                                    disabled:
                                      valoresIniciais?.uuid &&
                                      dataInicio &&
                                      dataInicio <= new Date(),
                                    children: alimentacao.nome,
                                  },
                                  alimentacao.uuid
                                )
                              ),
                            }),
                          }),
                        }),
                      ],
                    }),
                    _jsx("div", {
                      className: "row float-end mt-4",
                      children: _jsxs("div", {
                        className: "col-12",
                        children: [
                          _jsx(Link, {
                            to: "/configuracoes/cadastros/tipos-alimentacao/permissao-lancamentos-especiais",
                            style: { display: "contents" },
                            children: _jsx(Botao, {
                              texto: "Cancelar",
                              style: BUTTON_STYLE.GREEN_OUTLINE,
                              className: "me-3",
                            }),
                          }),
                          _jsx(Botao, {
                            texto: "Salvar",
                            style: BUTTON_STYLE.GREEN,
                            type: BUTTON_TYPE.SUBMIT,
                            disabled:
                              !values.diretoria_regional ||
                              !ehEscolaValida(values.escola) ||
                              !values.periodo_escolar ||
                              !values.alimentacoes_lancamento_especial ||
                              !values.alimentacoes_lancamento_especial.length,
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
            }),
        }),
      }),
    ],
  });
};
