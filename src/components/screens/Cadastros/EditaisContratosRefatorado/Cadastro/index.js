import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { Spin, Switch } from "antd";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { InputText } from "src/components/Shareable/Input/InputText";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import {
  CADASTROS,
  CONFIGURACOES,
  EDITAIS_CADASTRADOS,
} from "src/configs/constants";
import arrayMutators from "final-form-arrays";
import { required } from "src/helpers/fieldValidators";
import HTTP_STATUS from "http-status-codes";
import { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { useLocation, useNavigate } from "react-router-dom";
import { getDiretoriaregionalSimplissima } from "src/services/diretoriaRegional.service";
import {
  criarEditalEContrato,
  getEditalContrato,
  updateEditalContrato,
} from "src/services/edital.service";
import { getLotesSimples } from "src/services/lote.service";
import { getNomesTerceirizadas } from "src/services/produto.service";
import { FieldArrayContratos } from "./components/FieldArrayContratos";
import { ModalCadastroEdital } from "./components/ModalCadastroEdital";
import { formataEditalContratoParaForm } from "./helper";
import "./style.scss";
export const EditaisContratosRefatorado = () => {
  const [objEditalContrato, setObjEditalContrato] = useState(undefined);
  const [lotes, setLotes] = useState(undefined);
  const [DREs, setDREs] = useState(undefined);
  const [empresas, setEmpresas] = useState(undefined);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [switchAtivoImr, setSwitchAtivoImrl] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const getEditalContratoAsync = async (uuid) => {
    const response = await getEditalContrato(uuid);
    if (response.status === HTTP_STATUS.OK) {
      const editalFormatadoParaForm = formataEditalContratoParaForm(
        response.data,
        setSwitchAtivoImrl
      );
      setObjEditalContrato(editalFormatadoParaForm);
    } else {
      setErro("Erro ao carregar edital ");
    }
  };
  const getLotesSimplesAsync = async () => {
    const response = await getLotesSimples();
    if (response.status === HTTP_STATUS.OK) {
      setLotes(response.data.results);
    } else {
      setErro("Erro ao carregar lotes. Tente novamente mais tarde.");
    }
  };
  const getDiretoriareginalSimplissimaAsync = async () => {
    const response = await getDiretoriaregionalSimplissima();
    if (response.status === HTTP_STATUS.OK) {
      setDREs(response.data.results);
    } else {
      setErro(
        "Erro ao carregar diretorias regionais. Tente novamente mais tarde."
      );
    }
  };
  const getNomesTerceirizadasAsync = async () => {
    const response = await getNomesTerceirizadas({
      tipo_empresa: "Terceirizada",
    });
    if (response.status === HTTP_STATUS.OK) {
      setEmpresas(response.data.results);
    } else {
      setErro("Erro ao carregar empresas. Tente novamente mais tarde.");
    }
  };
  useEffect(() => {
    requisicoesPreRender();
  }, []);
  const requisicoesPreRender = async () => {
    await Promise.all([
      getLotesSimplesAsync(),
      getDiretoriareginalSimplissimaAsync(),
      getNomesTerceirizadasAsync(),
      location?.state?.uuid && getEditalContratoAsync(location.state.uuid),
    ]).then(() => {
      setLoading(false);
    });
  };
  const onSubmit = async (values) => {
    if (!showModal && !location?.state?.uuid) {
      setShowModal(true);
      return;
    }
    const values_ = { ...values, eh_imr: switchAtivoImr };
    if (!values.uuid) {
      const response = await criarEditalEContrato(values_);
      if (response.status === HTTP_STATUS.CREATED) {
        toastSuccess("Edital salvo com sucesso");
        navigate("/configuracoes/cadastros/editais-cadastrados");
      } else {
        toastError("Houve um erro ao salvar o edital");
      }
    } else {
      const response = await updateEditalContrato(values_, values_.uuid);
      if (response.status === HTTP_STATUS.OK) {
        toastSuccess("Edição salva com sucesso!");
        navigate("/configuracoes/cadastros/editais-cadastrados");
      } else {
        toastError("Houve um erro ao atualizar o edital");
      }
    }
  };
  const cancelarForm = (form) => {
    if (location?.state?.uuid) {
      navigate(-1);
    } else {
      form.change("tipo_contratacao", undefined);
      form.change("numero", undefined);
      form.change("processo", undefined);
      form.change("objeto", undefined);
      form.change("contratos", [DEFAULT_CONTRATOS]);
    }
  };
  const REQUISICOES_FINALIZADAS =
    !loading &&
    lotes &&
    DREs &&
    empresas &&
    (location?.state?.uuid ? objEditalContrato : true);
  const DEFAULT_CONTRATOS = {
    vigencias: [
      {
        numero_contrato: undefined,
        data_inicial: undefined,
        data_final: undefined,
      },
    ],
  };
  const onChangeSwitchImr = (checked) => {
    setSwitchAtivoImrl(checked);
  };
  return _jsx(Spin, {
    tip: "Carregando...",
    spinning: !REQUISICOES_FINALIZADAS,
    children: _jsx("div", {
      className: "form-editais-contratos",
      children: _jsx("div", {
        className: "card mt-3",
        children: _jsxs("div", {
          className: "card-body",
          children: [
            erro && _jsx("div", { className: "mt-3", children: erro }),
            !erro &&
              REQUISICOES_FINALIZADAS &&
              _jsxs(_Fragment, {
                children: [
                  _jsxs("div", {
                    className: "row mt-3 mb-3",
                    children: [
                      _jsx("div", {
                        className: "col-6",
                        children: _jsx("div", {
                          className: "title",
                          children: "Novo Cadastro de Editais e Contratos",
                        }),
                      }),
                      !location?.state?.uuid &&
                        _jsx("div", {
                          className: "col-6 text-end",
                          children: _jsx(Botao, {
                            texto: "Editais e Contratos Cadastrados",
                            onClick: () =>
                              navigate(
                                `/${CONFIGURACOES}/${CADASTROS}/${EDITAIS_CADASTRADOS}`
                              ),
                            type: BUTTON_TYPE.BUTTON,
                            style: BUTTON_STYLE.GREEN_OUTLINE,
                          }),
                        }),
                    ],
                  }),
                  _jsx(Form, {
                    keepDirtyOnReinitialize: true,
                    mutators: {
                      ...arrayMutators,
                    },
                    initialValues: objEditalContrato || {
                      contratos: [DEFAULT_CONTRATOS],
                    },
                    onSubmit: onSubmit,
                    children: ({
                      handleSubmit,
                      form,
                      submitting,
                      form: {
                        mutators: { push },
                      },
                      values,
                    }) =>
                      _jsxs("form", {
                        onSubmit: handleSubmit,
                        children: [
                          _jsxs("div", {
                            className: "row",
                            children: [
                              _jsx("div", {
                                className: "col-3",
                                children: _jsx(Field, {
                                  component: InputText,
                                  label: "Tipo de contrata\u00E7\u00E3o",
                                  name: "tipo_contratacao",
                                  placeholder:
                                    "Digite o tipo de contrata\u00E7\u00E3o",
                                  required: true,
                                  validate: required,
                                  max: 50,
                                }),
                              }),
                              _jsx("div", {
                                className: "col-3",
                                children: _jsx(Field, {
                                  component: InputText,
                                  className: "form-control",
                                  label: "N\u00B0 do Edital",
                                  name: "numero",
                                  placeholder: "Digite o n\u00FAmero do edital",
                                  required: true,
                                  validate: required,
                                  max: 50,
                                }),
                              }),
                              _jsxs("div", {
                                className: "col-2 switch-imr",
                                children: [
                                  _jsx("label", {
                                    className: "col-form-label",
                                    children: "Edital com IMR?",
                                  }),
                                  _jsx("br", {}),
                                  _jsxs("div", {
                                    children: [
                                      _jsx("label", {
                                        className: `col-form-label ${
                                          !switchAtivoImr && "green"
                                        }`,
                                        children: "N\u00E3o",
                                      }),
                                      _jsx("br", {}),
                                      _jsx(Switch, {
                                        size: "small",
                                        onChange: onChangeSwitchImr,
                                        checked: switchAtivoImr,
                                      }),
                                      _jsx("label", {
                                        className: `col-form-label ${
                                          switchAtivoImr && "green"
                                        }`,
                                        children: "Sim",
                                      }),
                                      _jsx("br", {}),
                                    ],
                                  }),
                                ],
                              }),
                              _jsx("div", {
                                className: "col-4",
                                children: _jsx(Field, {
                                  component: InputText,
                                  label: "N\u00BA do processo administrativo",
                                  name: "processo",
                                  placeholder:
                                    "Digite o n\u00FAmero do processo",
                                  required: true,
                                  validate: required,
                                  max: 50,
                                }),
                              }),
                            ],
                          }),
                          _jsx("div", {
                            className: "row",
                            children: _jsx("div", {
                              className: "col-12",
                              children: _jsx(Field, {
                                component: TextArea,
                                label: "Objeto resumido",
                                name: "objeto",
                                required: true,
                                validate: required,
                                height: "120",
                              }),
                            }),
                          }),
                          _jsx(FieldArrayContratos, {
                            form: form,
                            values: values,
                            push: push,
                            lotes: lotes,
                            DREs: DREs,
                            empresas: empresas,
                            getEditalContratoAsync: getEditalContratoAsync,
                          }),
                          _jsx("div", {
                            className: "row mt-3",
                            children: _jsx("div", {
                              className: "col-12 text-center",
                              children: _jsx(Botao, {
                                texto: "+ Adicionar outro contrato relacionado",
                                onClick: () =>
                                  push("contratos", DEFAULT_CONTRATOS),
                                style: BUTTON_STYLE.GREEN_OUTLINE,
                                type: BUTTON_TYPE.BUTTON,
                              }),
                            }),
                          }),
                          _jsx("div", {
                            className: "row",
                            children: _jsxs("div", {
                              className: "col-12 text-end",
                              children: [
                                _jsx(Botao, {
                                  onClick: () => cancelarForm(form),
                                  texto: "Cancelar",
                                  className: "me-3",
                                  disabled: submitting,
                                  type: BUTTON_TYPE.BUTTON,
                                  style: BUTTON_STYLE.GREEN_OUTLINE,
                                }),
                                _jsx(Botao, {
                                  texto: "Salvar",
                                  disabled: submitting,
                                  type: BUTTON_TYPE.SUBMIT,
                                  style: BUTTON_STYLE.GREEN,
                                }),
                              ],
                            }),
                          }),
                          _jsx(ModalCadastroEdital, {
                            showModal: showModal,
                            closeModal: () => setShowModal(false),
                            values: values,
                            submitting: submitting,
                            onSubmit: onSubmit,
                            lotes: lotes,
                            DREs: DREs,
                            empresas: empresas,
                          }),
                        ],
                      }),
                  }),
                ],
              }),
          ],
        }),
      }),
    }),
  });
};
