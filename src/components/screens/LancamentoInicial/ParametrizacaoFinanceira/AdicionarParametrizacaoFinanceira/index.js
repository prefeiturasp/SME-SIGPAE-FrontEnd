import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Field, Form } from "react-final-form";
import { Modal } from "react-bootstrap";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import { Botao } from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import "./style.scss";
import Filtros from "./components/Filtros";
import TabelasGruposEMEIeEMEF from "./components/TabelasGruposEMEIeEMEF";
import TabelasGrupoCEI from "./components/TabelasGrupoCEI";
import TabelasGrupoCEMEI from "./components/TabelasGrupoCEMEI";
import TabelasGrupoEMEBS from "./components/TabelasGrupoEMEBS";
import ParametrizacaoFinanceiraService from "src/services/medicaoInicial/parametrizacao_financeira.service";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
const VALORES_INICIAIS = {
  edital: null,
  lote: null,
  tipos_unidades: null,
  legenda:
    "Fonte: Relatório de Medição Inicial do Serviço de Alimentação e Nutrição Escolar realizada pela direção das unidades educacionais, conforme disposto no edital Pregão XXX/XXX e nas Portarias Intersecretariais SMG/SME n° 005/2006 e 001/2008.",
  tabelas: null,
};
export default () => {
  const [tiposAlimentacao, setTiposAlimentacao] = useState([]);
  const [grupoSelecionado, setGrupoSelecionado] = useState("");
  const [faixasEtarias, setFaixasEtarias] = useState([]);
  const [showModalCancelar, setShowModalCancelar] = useState(false);
  const [parametrizacao, setParametrizacao] = useState(VALORES_INICIAIS);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const uuidParametrizacao = searchParams.get("uuid");
  const onSubmit = async (values) => {
    const payload = formataPayload(values);
    try {
      await ParametrizacaoFinanceiraService.addParametrizacaoFinanceira(
        payload
      );
      toastSuccess("Parametrização Financeira salva com sucesso!");
      navigate(-1);
    } catch (err) {
      const data = err.response.data;
      if (data) {
        if (data.non_field_errors) {
          toastError(data.non_field_errors[0]);
        } else {
          toastError(
            "Não foi possível finalizar a inclusão da parametrização. Verifique se todos os campos da tabela foram preenchidos"
          );
        }
      } else {
        toastError("Ocorreu um erro inesperado");
      }
    }
  };
  const editarParametrizacao = async (uuid, values) => {
    const payload = formataPayload(values);
    try {
      await ParametrizacaoFinanceiraService.editParametrizacaoFinanceira(
        uuid,
        payload
      );
      toastSuccess("Parametrização Financeira editada com sucesso!");
      navigate(-1);
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        if (data.non_field_errors) {
          toastError(data.non_field_errors[0]);
        } else {
          toastError(
            "Não foi possível finalizar a edição da parametrização. Verifique se todos os campos da tabela foram preenchidos"
          );
        }
      } else {
        toastError("Ocorreu um erro inesperado");
      }
    }
  };
  const formataPayload = (values) => {
    const tabelas = Object.entries(values.tabelas).map(([tabela, valores]) => ({
      nome: tabela,
      valores: Object.values(valores).map((valor) => {
        const { tipo_alimentacao, grupo, faixa_etaria, ...valor_colunas } =
          valor;
        return {
          faixa_etaria,
          tipo_alimentacao,
          grupo,
          valor_colunas,
        };
      }),
    }));
    const payload = {
      ...values,
      tabelas,
      tipos_unidades: values.tipos_unidades.split(","),
    };
    return payload;
  };
  const exibeTabelasCEI =
    faixasEtarias.length && grupoSelecionado === "grupo_1";
  const exibeTabelasEMEFeEMEI =
    tiposAlimentacao.length &&
    ["grupo_3", "grupo_5"].includes(grupoSelecionado);
  const exibeTabelasCEMEI =
    faixasEtarias.length &&
    tiposAlimentacao.length &&
    grupoSelecionado === "grupo_2";
  const exibeTabelasEMEBS =
    tiposAlimentacao.length && grupoSelecionado === "grupo_4";
  return _jsxs(_Fragment, {
    children: [
      _jsx("div", {
        className: "adicionar-parametrizacao card mt-4",
        children: _jsx("div", {
          className: "card-body",
          children: _jsx(Form, {
            onSubmit: (values) =>
              uuidParametrizacao
                ? editarParametrizacao(uuidParametrizacao, values)
                : onSubmit(values),
            initialValues: parametrizacao,
            destroyOnUnregister: true,
            render: ({ form, handleSubmit, submitting }) =>
              _jsxs("form", {
                onSubmit: handleSubmit,
                children: [
                  _jsx(Filtros, {
                    setTiposAlimentacao: setTiposAlimentacao,
                    setGrupoSelecionado: setGrupoSelecionado,
                    setFaixasEtarias: setFaixasEtarias,
                    setParametrizacao: setParametrizacao,
                    form: form,
                    uuidParametrizacao: uuidParametrizacao,
                    ehCadastro: true,
                  }),
                  exibeTabelasEMEFeEMEI
                    ? _jsx(TabelasGruposEMEIeEMEF, {
                        form: form,
                        tiposAlimentacao: tiposAlimentacao,
                        grupoSelecionado: grupoSelecionado,
                      })
                    : null,
                  exibeTabelasCEI
                    ? _jsx(TabelasGrupoCEI, {
                        form: form,
                        faixasEtarias: faixasEtarias,
                        grupoSelecionado: grupoSelecionado,
                      })
                    : null,
                  exibeTabelasCEMEI
                    ? _jsx(TabelasGrupoCEMEI, {
                        form: form,
                        faixasEtarias: faixasEtarias,
                        tiposAlimentacao: tiposAlimentacao,
                        grupoSelecionado: grupoSelecionado,
                      })
                    : null,
                  exibeTabelasEMEBS
                    ? _jsx(TabelasGrupoEMEBS, {
                        form: form,
                        tiposAlimentacao: tiposAlimentacao,
                        grupoSelecionado: grupoSelecionado,
                      })
                    : null,
                  exibeTabelasEMEFeEMEI ||
                  exibeTabelasCEI ||
                  exibeTabelasCEMEI ||
                  exibeTabelasEMEBS
                    ? _jsx("div", {
                        className: "row mt-5",
                        children: _jsx("div", {
                          className: "col",
                          children: _jsx(Field, {
                            component: TextArea,
                            label: "Legenda",
                            name: "legenda",
                            maxLength: 1500,
                            height: "150",
                          }),
                        }),
                      })
                    : null,
                  _jsxs("div", {
                    className: "d-flex justify-content-end gap-3 mt-5",
                    children: [
                      _jsx(Botao, {
                        texto: "Cancelar",
                        onClick: () => {
                          uuidParametrizacao
                            ? navigate(-1)
                            : setShowModalCancelar(true);
                        },
                        style: BUTTON_STYLE.GREEN_OUTLINE,
                      }),
                      _jsx(Botao, {
                        texto: "Salvar",
                        style: BUTTON_STYLE.GREEN,
                        type: BUTTON_TYPE.SUBMIT,
                        disabled: submitting,
                      }),
                    ],
                  }),
                ],
              }),
          }),
        }),
      }),
      _jsxs(Modal, {
        show: showModalCancelar,
        onHide: () => {
          setShowModalCancelar(false);
        },
        children: [
          _jsx(Modal.Header, {
            closeButton: true,
            children: _jsx(Modal.Title, {
              children:
                "Cancelar Adi\u00E7\u00E3o de Parametriza\u00E7\u00E3o Financeira",
            }),
          }),
          _jsx(Modal.Body, {
            children:
              "Voc\u00EA deseja cancelar a Adi\u00E7\u00E3o da Parametriza\u00E7\u00E3o Financeira?",
          }),
          _jsxs(Modal.Footer, {
            children: [
              _jsx(Botao, {
                texto: "N\u00E3o",
                type: BUTTON_TYPE.BUTTON,
                onClick: () => {
                  setShowModalCancelar(false);
                },
                style: BUTTON_STYLE.GREEN_OUTLINE,
                className: "ms-3",
              }),
              _jsx(Botao, {
                texto: "Sim",
                type: BUTTON_TYPE.BUTTON,
                onClick: () => {
                  navigate(-1);
                },
                style: BUTTON_STYLE.GREEN,
                className: "ms-3",
              }),
            ],
          }),
        ],
      }),
    ],
  });
};
