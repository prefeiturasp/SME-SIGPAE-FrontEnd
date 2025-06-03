import {
  jsx as _jsx,
  Fragment as _Fragment,
  jsxs as _jsxs,
} from "react/jsx-runtime";
import { Spin } from "antd";
import { useCallback, useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { useNavigate } from "react-router-dom";
import { RECEBIMENTO, QUESTOES_POR_PRODUTO } from "src/configs/constants";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import Botao from "src/components/Shareable/Botao";
import AutoCompleteSelectField from "src/components/Shareable/AutoCompleteSelectField";
import { toastSuccess } from "src/components/Shareable/Toast/dialogs";
import { getListaFiltradaAutoCompleteSelect } from "src/helpers/autoCompleteSelect";
import { required } from "src/helpers/fieldValidators";
import { formatarNumeroEProdutoFichaTecnica } from "src/helpers/preRecebimento";
import ModalGenerico from "src/components/Shareable/ModalGenerico";
import TransferMultiSelect from "src/components/Shareable/TransferMultiSelect";
import { useTransferMultiSelect } from "src/components/Shareable/TransferMultiSelect/useTransferMultiSelect";
import { getListaFichasTecnicasSimplesSemQuestoesConferencia } from "src/services/fichaTecnica.service";
import {
  listarQuestoesConferencia,
  atribuirQuestoesPorProduto,
  detalharQuestoesPorProduto,
  editarAtribuicaoQuestoesPorProduto,
} from "src/services/recebimento/questoesConferencia.service";
import "./styles.scss";
const labelsTransferPrimarias = [
  _jsxs(_Fragment, {
    children: [
      "Quest\u00F5es para Atribuir a",
      " ",
      _jsx("span", {
        className: "lable-destacado-verde",
        children: "Embalagem Prim\u00E1ria",
      }),
    ],
  }),
  _jsxs(_Fragment, {
    children: [
      "Quest\u00F5es Atribu\u00EDdas a",
      " ",
      _jsx("span", {
        className: "lable-destacado-verde",
        children: "Embalagem Prim\u00E1ria",
      }),
    ],
  }),
];
const labelsTransferSecundarias = [
  _jsxs(_Fragment, {
    children: [
      "Quest\u00F5es para Atribuir a",
      " ",
      _jsx("span", {
        className: "lable-destacado-verde",
        children: "Embalagem Secund\u00E1ria",
      }),
    ],
  }),
  _jsxs(_Fragment, {
    children: [
      "Quest\u00F5es Atribu\u00EDdas a",
      " ",
      _jsx("span", {
        className: "lable-destacado-verde",
        children: "Embalagem Secund\u00E1ria",
      }),
    ],
  }),
];
export default () => {
  const [carregando, setCarregando] = useState(true);
  const [modalConfig, setModalConfig] = useState({});
  const [fichasTecnicas, setFichasTecnicas] = useState([]);
  const [initialValues, setInitialValues] = useState();
  const searchParams = new URLSearchParams(window.location.search);
  const uuid = searchParams.get("uuid");
  const copia = searchParams.get("copia");
  const transferConfigPrimarias = useTransferMultiSelect({
    required: true,
  });
  const transferConfigSecundarias = useTransferMultiSelect({
    required: true,
  });
  const navigate = useNavigate();
  const exibirModalConfirmacao = async (values) =>
    setModalConfig({
      show: true,
      handleClose: fecharModal,
      handleSim: () => salvarOuEditarAtribuicao(values),
      titulo: uuid && !copia ? "Salvar Edição" : "Salvar Cadastro",
      texto:
        "Deseja salvar a atribuição das questões de conferência para esse produto?",
    });
  const exibirModalCancelar = () =>
    setModalConfig({
      show: true,
      handleClose: fecharModal,
      handleSim: voltarPagina,
      titulo: "Cancelar Cadastro",
      texto:
        "Deseja cancelar a atribuição das questões de conferência para esse produto?",
    });
  const fecharModal = () => setModalConfig({ ...modalConfig, show: false });
  const salvarOuEditarAtribuicao = async (values) => {
    try {
      setCarregando(true);
      uuid && !copia
        ? await editarAtribuicao(uuid)
        : await salvarAtribuicao(values);
    } finally {
      setCarregando(false);
    }
  };
  const editarAtribuicao = async (uuid) => {
    const payload = formatarPayloadEdicao(
      transferConfigPrimarias.targetKeys,
      transferConfigSecundarias.targetKeys
    );
    const { status } = await editarAtribuicaoQuestoesPorProduto(uuid, payload);
    if (status === 200) {
      voltarPagina();
      toastSuccess("Edição Salva com sucesso!");
    }
  };
  const salvarAtribuicao = async (values) => {
    const payload = formatarPayloadSalvamento(
      values,
      transferConfigPrimarias.targetKeys,
      transferConfigSecundarias.targetKeys
    );
    const { status } = await atribuirQuestoesPorProduto(payload);
    if (status === 201) {
      voltarPagina();
      toastSuccess("Atribuição salva com sucesso!");
    }
  };
  const formatarPayloadSalvamento = (
    values,
    questoesPrimarias,
    questoesSecundarias
  ) => {
    return {
      ficha_tecnica: fichasTecnicas.find(buscarFichaPeloNumero(values))?.uuid,
      questoes_primarias: questoesPrimarias,
      questoes_secundarias: questoesSecundarias,
    };
  };
  const formatarPayloadEdicao = (questoesPrimarias, questoesSecundarias) => {
    return {
      questoes_primarias: questoesPrimarias,
      questoes_secundarias: questoesSecundarias,
    };
  };
  const buscarFichaPeloNumero =
    (values) =>
    ({ numero }) =>
      numero === values.ficha_tecnica.split("-")[0].trim();
  const voltarPagina = () =>
    navigate(`/${RECEBIMENTO}/${QUESTOES_POR_PRODUTO}`);
  const carregarDados = useCallback(async () => {
    setCarregando(true);
    try {
      const [responseFichasTecnicas, responseQuestoesConferencia] =
        await Promise.all([
          getListaFichasTecnicasSimplesSemQuestoesConferencia(),
          listarQuestoesConferencia(),
        ]);
      setFichasTecnicas(responseFichasTecnicas.data.results);
      transferConfigPrimarias.setDataSource(
        transferDataSource(responseQuestoesConferencia.data.results.primarias)
      );
      transferConfigSecundarias.setDataSource(
        transferDataSource(responseQuestoesConferencia.data.results.secundarias)
      );
      uuid
        ? await carregarObjetoEmEdicao(uuid)
        : carregarQuestoesObrigatoriasNoTransfer(responseQuestoesConferencia);
    } finally {
      setCarregando(false);
    }
  }, []);
  const transferDataSource = (questoes) =>
    questoes?.map(({ uuid, questao }) => {
      return { title: questao, key: uuid };
    });
  const carregarObjetoEmEdicao = async (uuid) => {
    const questoes = (await detalharQuestoesPorProduto(uuid)).data;
    !copia &&
      setInitialValues({
        ficha_tecnica: formatarNumeroEProdutoFichaTecnica(
          questoes.ficha_tecnica
        ),
      });
    transferConfigPrimarias.setInitialTagetKeys(questoes.questoes_primarias);
    transferConfigSecundarias.setInitialTagetKeys(
      questoes.questoes_secundarias
    );
  };
  const carregarQuestoesObrigatoriasNoTransfer = (
    responseQuestoesConferencia
  ) => {
    transferConfigPrimarias.setInitialTagetKeys(
      questoesObrigatorias(responseQuestoesConferencia.data.results.primarias)
    );
    transferConfigSecundarias.setInitialTagetKeys(
      questoesObrigatorias(responseQuestoesConferencia.data.results.secundarias)
    );
  };
  const questoesObrigatorias = (questoes) =>
    questoes
      ?.filter(({ pergunta_obrigatoria }) => pergunta_obrigatoria)
      .map(({ uuid }) => uuid);
  const optionsFichasTecnicas = (values) =>
    getListaFiltradaAutoCompleteSelect(
      fichasTecnicas?.map((e) => formatarNumeroEProdutoFichaTecnica(e)),
      values.ficha_tecnica,
      true
    );
  const botaoSalvarDesabilitado = (values) =>
    !values.ficha_tecnica ||
    !transferConfigPrimarias.targetKeys.length ||
    !transferConfigSecundarias.targetKeys.length;
  useEffect(() => {
    carregarDados();
  }, []);
  return _jsx(Spin, {
    tip: "Carregando...",
    spinning: carregando,
    children: _jsx("div", {
      className: "card mt-3 card-atribuir-questoes-conferencia",
      children: _jsx("div", {
        className: "card-body atribuir-questoes-conferencia",
        children: _jsx(Form, {
          initialValues: initialValues,
          onSubmit: exibirModalConfirmacao,
          render: ({ handleSubmit, values }) =>
            _jsxs("form", {
              onSubmit: handleSubmit,
              children: [
                _jsx("div", {
                  className: "row mt-3",
                  children: _jsx("div", {
                    className: "col",
                    children: _jsx(Field, {
                      component: AutoCompleteSelectField,
                      options: optionsFichasTecnicas(values),
                      label: "Ficha T\u00E9cnica e Produto",
                      name: `ficha_tecnica`,
                      className: "input-busca-produto",
                      placeholder: "Selecione uma ficha t\u00E9cnica e produto",
                      required: true,
                      validate: required,
                      disabled: uuid && !copia,
                    }),
                  }),
                }),
                _jsx("div", {
                  className: "row mt-3",
                  children: _jsx("div", {
                    className: "col",
                    children: _jsx(TransferMultiSelect, {
                      ...transferConfigPrimarias,
                      required: true,
                      labels: labelsTransferPrimarias,
                    }),
                  }),
                }),
                _jsx("div", {
                  className: "row mt-3",
                  children: _jsx("div", {
                    className: "col",
                    children: _jsx(TransferMultiSelect, {
                      ...transferConfigSecundarias,
                      required: true,
                      labels: labelsTransferSecundarias,
                    }),
                  }),
                }),
                _jsx("div", {
                  className: "row mt-5 mb-3",
                  children: _jsxs("div", {
                    className: "col",
                    children: [
                      _jsx(Botao, {
                        texto: "Salvar",
                        type: BUTTON_TYPE.SUBMIT,
                        style: BUTTON_STYLE.GREEN,
                        className: "float-end ms-3",
                        disabled: botaoSalvarDesabilitado(values),
                        tooltipExterno:
                          botaoSalvarDesabilitado(values) &&
                          "É necessário preencher todos os campos obrigatórios antes de prosseguir.",
                      }),
                      _jsx(Botao, {
                        texto: "Cancelar",
                        type: BUTTON_TYPE.BUTTON,
                        style: BUTTON_STYLE.GREEN_OUTLINE,
                        className: "float-end ms-3",
                        onClick: exibirModalCancelar,
                      }),
                    ],
                  }),
                }),
                _jsx(ModalGenerico, { ...modalConfig }),
              ],
            }),
        }),
      }),
    }),
  });
};
