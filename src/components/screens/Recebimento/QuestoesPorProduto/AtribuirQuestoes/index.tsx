import { Spin } from "antd";
import React, { useCallback, useEffect, useState } from "react";
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
import { FichaTecnicaSimples } from "src/interfaces/pre_recebimento.interface";
import {
  QuestaoConferencia,
  ResponseListarQuestoesConferencia,
} from "src/interfaces/recebimento.interface";
import { formatarNumeroEProdutoFichaTecnica } from "src/helpers/preRecebimento";
import ModalGenerico, {
  ModalGenericoProps,
} from "src/components/Shareable/ModalGenerico";
import TransferMultiSelect from "src/components/Shareable/TransferMultiSelect";
import { TransferOptions } from "src/components/Shareable/TransferMultiSelect/interfaces";
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
  <>
    Questões para Atribuir a{" "}
    <span className="lable-destacado-verde">Embalagem Primária</span>
  </>,
  <>
    Questões Atribuídas a{" "}
    <span className="lable-destacado-verde">Embalagem Primária</span>
  </>,
];

const labelsTransferSecundarias = [
  <>
    Questões para Atribuir a{" "}
    <span className="lable-destacado-verde">Embalagem Secundária</span>
  </>,
  <>
    Questões Atribuídas a{" "}
    <span className="lable-destacado-verde">Embalagem Secundária</span>
  </>,
];

export default () => {
  const [carregando, setCarregando] = useState(true);
  const [modalConfig, setModalConfig] = useState({} as ModalGenericoProps);
  const [fichasTecnicas, setFichasTecnicas] = useState<FichaTecnicaSimples[]>(
    []
  );

  const [initialValues, setInitialValues] = useState<Record<string, string>>();

  const searchParams = new URLSearchParams(window.location.search);
  const uuid = searchParams.get("uuid");
  const copia = searchParams.get("copia");

  const transferConfigPrimarias = useTransferMultiSelect({
    required: true,
  });

  const transferConfigSecundarias = useTransferMultiSelect({
    required: false,
  });

  const navigate = useNavigate();

  const exibirModalConfirmacao = async (values: Record<string, string>) =>
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

  const salvarOuEditarAtribuicao = async (values: Record<string, string>) => {
    try {
      setCarregando(true);
      uuid && !copia
        ? await editarAtribuicao(uuid)
        : await salvarAtribuicao(values);
    } finally {
      setCarregando(false);
    }
  };

  const editarAtribuicao = async (uuid: string) => {
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

  const salvarAtribuicao = async (values: Record<string, string>) => {
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
    values: Record<string, string>,
    questoesPrimarias: string[],
    questoesSecundarias: string[]
  ) => {
    return {
      ficha_tecnica: fichasTecnicas.find(buscarFichaPeloNumero(values))?.uuid,
      questoes_primarias: questoesPrimarias,
      questoes_secundarias: questoesSecundarias,
    };
  };

  const formatarPayloadEdicao = (
    questoesPrimarias: string[],
    questoesSecundarias: string[]
  ) => {
    return {
      questoes_primarias: questoesPrimarias,
      questoes_secundarias: questoesSecundarias,
    };
  };

  const buscarFichaPeloNumero =
    (values: Record<string, string>) =>
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

  const transferDataSource = (
    questoes: QuestaoConferencia[]
  ): TransferOptions[] =>
    questoes?.map(({ uuid, questao }) => {
      return { title: questao, key: uuid };
    });

  const carregarObjetoEmEdicao = async (uuid: string) => {
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
    responseQuestoesConferencia: ResponseListarQuestoesConferencia
  ) => {
    transferConfigPrimarias.setInitialTagetKeys(
      questoesObrigatorias(responseQuestoesConferencia.data.results.primarias)
    );
    transferConfigSecundarias.setInitialTagetKeys(
      questoesObrigatorias(responseQuestoesConferencia.data.results.secundarias)
    );
  };

  const questoesObrigatorias = (questoes: QuestaoConferencia[]) =>
    questoes
      ?.filter(({ pergunta_obrigatoria }) => pergunta_obrigatoria)
      .map(({ uuid }) => uuid);

  const optionsFichasTecnicas = (values: Record<string, string>) =>
    getListaFiltradaAutoCompleteSelect(
      fichasTecnicas?.map((e) => formatarNumeroEProdutoFichaTecnica(e)),
      values.ficha_tecnica,
      true
    );

  const botaoSalvarDesabilitado = (values: Record<string, string>) =>
    !values.ficha_tecnica || !transferConfigPrimarias.targetKeys.length;

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-atribuir-questoes-conferencia">
        <div className="card-body atribuir-questoes-conferencia">
          <Form
            initialValues={initialValues}
            onSubmit={exibirModalConfirmacao}
            render={({ handleSubmit, values }) => (
              <form onSubmit={handleSubmit}>
                <div className="row mt-3">
                  <div className="col">
                    <Field
                      component={AutoCompleteSelectField}
                      options={optionsFichasTecnicas(values)}
                      label="Ficha Técnica e Produto"
                      name={`ficha_tecnica`}
                      className="input-busca-produto"
                      placeholder="Selecione uma ficha técnica e produto"
                      required
                      validate={required}
                      disabled={uuid && !copia}
                    />
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col">
                    <TransferMultiSelect
                      {...transferConfigPrimarias}
                      required
                      labels={labelsTransferPrimarias}
                    />
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col">
                    <TransferMultiSelect
                      {...transferConfigSecundarias}
                      labels={labelsTransferSecundarias}
                    />
                  </div>
                </div>

                <div className="row mt-5 mb-3">
                  <div className="col">
                    <Botao
                      texto="Salvar"
                      type={BUTTON_TYPE.SUBMIT}
                      style={BUTTON_STYLE.GREEN}
                      className="float-end ms-3"
                      disabled={botaoSalvarDesabilitado(values)}
                      tooltipExterno={
                        botaoSalvarDesabilitado(values) &&
                        "É necessário preencher todos os campos obrigatórios antes de prosseguir."
                      }
                    />

                    <Botao
                      texto="Cancelar"
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      className="float-end ms-3"
                      onClick={exibirModalCancelar}
                    />
                  </div>
                </div>

                <ModalGenerico {...modalConfig} />
              </form>
            )}
          />
        </div>
      </div>
    </Spin>
  );
};
