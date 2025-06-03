import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { Spin } from "antd";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import arrayMutators from "final-form-arrays";
import HTTP_STATUS from "http-status-codes";
import { useContext, useEffect, useState } from "react";
import { Form } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createFormularioDiretor,
  getTiposOcorrenciaPorEditalDiretor,
} from "src/services/imr/relatorioFiscalizacaoTerceirizadas";
import { AdicionarResposta } from "../Terceirizadas/RelatorioFiscalizacaoTerceirizadas/NovoRelatorioVisitas/components/Formulario/components/BotaoAdicionar";
import RenderComponentByParametrizacao from "../Terceirizadas/RelatorioFiscalizacaoTerceirizadas/NovoRelatorioVisitas/components/Formulario/components/Ocorrencia/RenderComponentByParametrizacao";
import { SeletorDeDatas } from "../Terceirizadas/RelatorioFiscalizacaoTerceirizadas/NovoRelatorioVisitas/components/Formulario/components/Ocorrencia/Seletores/SeletorDeDatas";
import { ModalCancelaPreenchimento } from "./components/ModalCancelaPreenchimento";
import { ModalSalvar } from "./components/ModalSalvar";
import { SeletorCategoria } from "./components/SeletorCategoria";
import { SeletorTipoOcorrencia } from "./components/SeletorTipoOcorrencia";
import { formataPayload } from "./helpers";
import "./style.scss";
export const RegistrarNovaOcorrencia = () => {
  const [tiposOcorrencia, setTiposOcorrencia] = useState();
  const [loadingTiposOcorrencia, setLoadingTiposOcorrencia] = useState(false);
  const [categorias, setCategorias] = useState();
  const [tiposOcorrenciaDaCategoria, setTiposOcorrenciaDaCategoria] = useState(
    []
  );
  const [tipoOcorrencia, setTipoOcorrencia] = useState();
  const [escolaSelecionada, setEscolaSelecionada] = useState();
  const [showModalCancelaPreenchimento, setShowModalCancelaPreenchimento] =
    useState(false);
  const [showModalSalvar, setShowModalSalvar] = useState(false);
  const [erroAPI, setErroAPI] = useState("");
  const { meusDados } = useContext(MeusDadosContext);
  const location = useLocation();
  const navigate = useNavigate();
  const getTiposOcorrenciaPorEditalNutrisupervisaoAsync = async () => {
    setLoadingTiposOcorrencia(true);
    const response = await getTiposOcorrenciaPorEditalDiretor({
      edital_uuid: location.state?.editalUuid,
    });
    if (response.status === HTTP_STATUS.OK) {
      setTiposOcorrencia(response.data);
      setCategorias(
        response.data
          .map((tipoOcorrencia) => {
            return {
              nome: tipoOcorrencia.categoria.nome,
              uuid: tipoOcorrencia.categoria.uuid,
            };
          })
          .filter(
            (value, index, self) =>
              index ===
              self.findIndex(
                (tipoOcorrencia) =>
                  tipoOcorrencia.nome === value.nome &&
                  tipoOcorrencia.uuid === value.uuid
              )
          )
      );
    } else {
      setErroAPI(
        "Erro ao carregar tipos de ocorrência do edital da unidade educacional. Tente novamente mais tarde."
      );
    }
    setLoadingTiposOcorrencia(false);
  };
  useEffect(() => {
    if (meusDados) {
      getTiposOcorrenciaPorEditalNutrisupervisaoAsync();
      setEscolaSelecionada({
        label: "",
        value: "",
        lote_nome: "",
        terceirizada: "",
        edital: location.state?.editalUuid,
        uuid: meusDados.vinculo_atual.instituicao.uuid,
      });
    }
  }, [meusDados]);
  const onSubmit = async (values) => {
    if (!showModalSalvar) {
      setShowModalSalvar(true);
      return;
    }
    const response = await createFormularioDiretor(
      formataPayload(values, location.state?.solicitacaoMedicaoInicialUuid)
    );
    if (response.status === HTTP_STATUS.CREATED) {
      toastSuccess("Registro de Ocorrência realizado com sucesso!");
      navigate(-1);
    } else {
      toastError(
        "Erro ao criar Registro de Ocorrência. Tente novamente mais tarde."
      );
    }
  };
  const exibeBotaoAdicionar = (tipoOcorrencia) => {
    return (
      tipoOcorrencia.aceita_multiplas_respostas &&
      tipoOcorrencia.parametrizacoes.length > 0
    );
  };
  const excluiGrupoDeResposta = (form, indexFieldArray) => {
    const grupos = [...form.getState().values["grupos"]];
    grupos.splice(indexFieldArray, 1);
    form.change("grupos", grupos);
  };
  return _jsx("div", {
    className: "card registrar-nova-ocorrencia mt-3",
    children: _jsx("div", {
      className: "card-body",
      children:
        !erroAPI &&
        _jsx(Spin, {
          spinning: loadingTiposOcorrencia,
          children:
            tiposOcorrencia &&
            _jsx(Form, {
              destroyOnUnregister: true,
              keepDirtyOnReinitialize: true,
              initialValues: { grupos: [{}] },
              mutators: {
                ...arrayMutators,
              },
              onSubmit: onSubmit,
              children: ({
                handleSubmit,
                form,
                form: {
                  mutators: { push },
                },
                submitting,
              }) =>
                _jsxs("form", {
                  onSubmit: handleSubmit,
                  children: [
                    _jsxs("div", {
                      className: "row",
                      children: [
                        _jsx("div", {
                          className: "col-6",
                          children: _jsx(SeletorCategoria, {
                            categorias: categorias,
                            setTiposOcorrenciaDaCategoria:
                              setTiposOcorrenciaDaCategoria,
                            tiposOcorrencia: tiposOcorrencia,
                          }),
                        }),
                        _jsx("div", {
                          className: "col-6",
                          children: _jsx(SeletorTipoOcorrencia, {
                            setTipoOcorrencia: setTipoOcorrencia,
                            tiposOcorrenciaDaCategoria:
                              tiposOcorrenciaDaCategoria,
                            tiposOcorrencia: tiposOcorrencia,
                            values: form.getState().values,
                            form: form,
                          }),
                        }),
                      ],
                    }),
                    tipoOcorrencia &&
                      _jsxs("section", {
                        className: "tipo-ocorrencia",
                        children: [
                          _jsx("div", {
                            className: "row",
                            children: _jsxs("div", {
                              className: "col-12",
                              children: [
                                _jsx("div", {
                                  className: "title-label mt-3 mb-1",
                                  children:
                                    "Descri\u00E7\u00E3o do Tipo de Ocorr\u00EAncia e Penalidades:",
                                }),
                                _jsxs("div", {
                                  className: "box-descricao",
                                  children: [
                                    _jsxs("div", {
                                      children: [
                                        _jsxs("b", {
                                          children: [
                                            tipoOcorrencia.titulo,
                                            ":",
                                          ],
                                        }),
                                        " ",
                                        tipoOcorrencia.descricao,
                                      ],
                                    }),
                                    _jsx("div", {
                                      children: _jsxs("b", {
                                        children: [
                                          "Penalidade:",
                                          " ",
                                          tipoOcorrencia.penalidade
                                            .numero_clausula,
                                          " ",
                                          "Obriga\u00E7\u00E3o:",
                                          " ",
                                          tipoOcorrencia.penalidade.obrigacoes.toString(),
                                        ],
                                      }),
                                    }),
                                  ],
                                }),
                                tipoOcorrencia.parametrizacoes.length > 0 &&
                                  _jsx("h2", {
                                    className: "mt-3 mb-3",
                                    children:
                                      "Detalhe a ocorr\u00EAncia nos itens abaixo:",
                                  }),
                              ],
                            }),
                          }),
                          tipoOcorrencia.parametrizacoes.length > 0 &&
                            _jsx("div", {
                              className: "row",
                              children: _jsx(SeletorDeDatas, {
                                titulo: "Data da Ocorr\u00EAncia",
                                name: "datas",
                                name_grupos: "datas_ocorrencias[0]",
                                form: form,
                                ehDataOcorrencia: true,
                                somenteLeitura: false,
                              }),
                            }),
                          _jsx(FieldArray, {
                            name: "grupos",
                            children: ({ fields }) =>
                              fields.map((name, indexFieldArray) =>
                                _jsxs(_Fragment, {
                                  children: [
                                    indexFieldArray > 0 &&
                                      _jsxs("div", {
                                        className: "row",
                                        children: [
                                          _jsx("div", {
                                            className: "col-11",
                                            children: _jsx("hr", {}),
                                          }),
                                          _jsx("div", {
                                            className: "col-1 text-end",
                                            children: _jsx(Botao, {
                                              className: "no-border",
                                              titulo: "Excluir",
                                              onClick: () =>
                                                excluiGrupoDeResposta(
                                                  form,
                                                  indexFieldArray
                                                ),
                                              type: BUTTON_TYPE.BUTTON,
                                              style: BUTTON_STYLE.GREEN_OUTLINE,
                                              icon: BUTTON_ICON.TRASH,
                                            }),
                                          }),
                                        ],
                                      }),
                                    tipoOcorrencia.parametrizacoes.length
                                      ? tipoOcorrencia.parametrizacoes.map(
                                          (parametrizacao) => {
                                            return _jsx(
                                              "div",
                                              {
                                                className: "row",
                                                children: _jsx(
                                                  RenderComponentByParametrizacao,
                                                  {
                                                    parametrizacao:
                                                      parametrizacao,
                                                    name_grupos: name,
                                                    tipoOcorrencia:
                                                      tipoOcorrencia,
                                                    form: form,
                                                    escolaSelecionada:
                                                      escolaSelecionada,
                                                    somenteLeitura: false,
                                                  }
                                                ),
                                              },
                                              indexFieldArray
                                            );
                                          }
                                        )
                                      : _jsx(
                                          "div",
                                          {
                                            className: "row mt-3",
                                            children: _jsx("div", {
                                              className: "col-12",
                                              children:
                                                "N\u00E3o h\u00E1 parametriza\u00E7\u00E3o para esse item.",
                                            }),
                                          },
                                          indexFieldArray
                                        ),
                                  ],
                                })
                              ),
                          }),
                          exibeBotaoAdicionar(tipoOcorrencia) &&
                            _jsx("div", {
                              className: "text-center mt-3",
                              children: _jsx(AdicionarResposta, {
                                push: push,
                                nameFieldArray: "grupos",
                              }),
                            }),
                          _jsx("div", {
                            className: "row float-end mt-4",
                            children: _jsxs("div", {
                              className: "col-12",
                              children: [
                                _jsx(Botao, {
                                  texto: "Cancelar",
                                  onClick: () => {
                                    setShowModalCancelaPreenchimento(true);
                                  },
                                  style: BUTTON_STYLE.GREEN_OUTLINE,
                                }),
                                _jsx(Botao, {
                                  texto: "Salvar",
                                  className: "ms-3",
                                  disabled: submitting,
                                  type: BUTTON_TYPE.SUBMIT,
                                  style: BUTTON_STYLE.GREEN_OUTLINE,
                                }),
                              ],
                            }),
                          }),
                          _jsx(ModalCancelaPreenchimento, {
                            show: showModalCancelaPreenchimento,
                            handleClose: () =>
                              setShowModalCancelaPreenchimento(false),
                            form: form,
                            navigate: navigate,
                          }),
                          _jsx(ModalSalvar, {
                            show: showModalSalvar,
                            handleClose: () => setShowModalSalvar(false),
                            values: form.getState().values,
                            salvar: onSubmit,
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
