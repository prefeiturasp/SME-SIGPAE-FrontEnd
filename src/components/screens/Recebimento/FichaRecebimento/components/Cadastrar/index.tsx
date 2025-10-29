import React, { ChangeEvent, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { Field, Form } from "react-final-form";
import { FormApi } from "final-form";
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
import {
  cadastraRascunhoFichaRecebimento,
  cadastraFichaRecebimento,
  editarFichaRecebimento,
  editaRascunhoFichaRecebimento,
  cadastraReposicaoFichaRecebimento,
  editaReposicaoFichaRecebimento,
  listarOpcoesReposicao,
  cadastraFichaRecebimentoSaldoZero,
  editaFichaRecebimentoSaldoZero,
} from "src/services/fichaRecebimento.service";
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
import Collapse, { CollapseControl } from "src/components/Shareable/Collapse";
import ModalGenerico from "src/components/Shareable/ModalGenerico";
import { ModalAssinaturaUsuario } from "src/components/Shareable/ModalAssinaturaUsuario";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import RadioButtonField from "src/components/Shareable/RadioButtonField";
import Label from "src/components/Shareable/Label";
import InputFileField from "src/components/Shareable/InputFileField";
import { getListaFiltradaAutoCompleteSelect } from "src/helpers/autoCompleteSelect";
import {
  composeValidators,
  maxValue,
  required,
} from "src/helpers/fieldValidators";
import {
  converterDDMMYYYYparaYYYYMMDD,
  dataParaUTC,
  exibeError,
} from "src/helpers/utilities";
import { deletaValues } from "src/helpers/formHelper";
import { stringToBoolean } from "src/helpers/parsers";
import {
  ArquivoForm,
  CronogramaSimples,
} from "src/interfaces/pre_recebimento.interface";
import FormOcorrencia from "../FormOcorrencia";
import { carregarEdicaoFichaDeRecebimento } from "../../helpers";

import {
  CronogramaFicha,
  DocumentoFicha,
  DocumentoFichaPayload,
  FichaRecebimentoPayload,
  OcorrenciaFichaRecebimento,
  QuestoesPayload,
  VeiculoPayload,
} from "../../interfaces";

import "./styles.scss";
import { detalharQuestoesPorCronograma } from "src/services/recebimento/questoesConferencia.service";
import {
  ReposicaoCronograma,
  QuestaoConferenciaSimples,
} from "src/interfaces/recebimento.interface";

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
    titulo: "Ocorrências",
    camposObrigatorios: true,
  },
  {
    titulo: "Observações",
    camposObrigatorios: false,
  },
];

const iniciaStateCollapse = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const uuid = urlParams.get("uuid");

  if (!uuid) return { 0: true };
  else return { 0: false, 1: true };
};

export default () => {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState<boolean>(true);
  const [cronogramas, setCronogramas] = useState<Array<CronogramaSimples>>([]);
  const [collapse1, setCollapse1] = useState<CollapseControl>(
    iniciaStateCollapse(),
  );
  const [collapse2, setCollapse2] = useState<CollapseControl>({ 0: true });
  const [collapse3, setCollapse3] = useState<CollapseControl>({ 0: true });
  const [cronograma, setCronograma] = useState<CronogramaFicha>(
    {} as CronogramaFicha,
  );
  const [initialValues, setInitialValues] = useState<Record<string, any>>({});
  const [showModal, setShowModal] = useState(false);
  const [showModalAtribuir, setShowModalAtribuir] = useState(false);
  const [showModalAssinatura, setShowModalAssinatura] = useState(false);
  const [stepAtual, setStepAtual] = useState(0);
  const [veiculos, setVeiculos] = useState([{}]);
  const [arquivos, setArquivos] = useState<ArquivoForm[]>([]);
  const [questoesPrimarias, setQuestoesPrimarias] = useState<
    QuestaoConferenciaSimples[]
  >([]);
  const [questoesSecundarias, setQuestoesSecundarias] = useState<
    QuestaoConferenciaSimples[]
  >([]);
  const [ocorrenciasCount, setOcorrenciasCount] = useState(1);
  const [opcoesReposicao, setOpcoesReposicao] = useState<ReposicaoCronograma[]>(
    [],
  );
  const [showModalOcorrencia, setShowModalOcorrencia] = useState(false);
  const [modalZeroExibido, setModalZeroExibido] = useState<boolean>(false);

  const buscaCronogramas = async (): Promise<void> => {
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
      if (
        etapa.desvinculada_recebimento ||
        (!initialValues.etapa &&
          etapa.houve_ocorrencia &&
          !etapa.houve_reposicao)
      ) {
        options.push({
          uuid: etapa.uuid,
          nome: `${
            etapa.parte ? `${etapa.etapa} - ${etapa.parte}` : `${etapa.etapa}`
          }${
            etapa.houve_ocorrencia
              ? " - Reposição / Pagamento de Notificação"
              : ""
          }`,
          data_programada: etapa.data_programada,
          houve_ocorrencia: etapa.houve_ocorrencia,
        });
      }
    });
    if (initialValues.etapa) {
      let obj = {
        uuid: initialValues.etapa.uuid,
        nome: `${
          initialValues.etapa.parte
            ? `${initialValues.etapa.etapa} - ${initialValues.etapa.parte}`
            : `${initialValues.etapa.etapa}`
        }${
          initialValues.reposicao_cronograma &&
          initialValues.etapa.houve_ocorrencia
            ? " - Reposição / Pagamento de Notificação"
            : ""
        }`,
        data_programada: initialValues.etapa.data_programada,
        houve_ocorrencia: false,
      };
      if (initialValues.reposicao_cronograma) obj["houve_ocorrencia"] = true;
      options.push(obj);
    }
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

  const formataPayloadQuestoes = (
    values: Record<string, any>,
    listaQuestoes: QuestaoConferenciaSimples[],
    tipoQuestao: string,
  ): QuestoesPayload[] => {
    return listaQuestoes
      ? listaQuestoes
          .map((questao) => {
            let resposta = stringToBoolean(
              values[`${tipoQuestao}_${questao.uuid}`],
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

  const formataPayloadArquivos = (files: ArquivoForm[]) => {
    const arquivosAtualizados = files.map((arquivo: ArquivoForm) => {
      return {
        nome: arquivo.nome,
        arquivo: arquivo.base64,
      };
    });
    return arquivosAtualizados;
  };

  const extraiOcorrenciasDoFormulario = (values: Record<string, any>) => {
    const ocorrencias: OcorrenciaFichaRecebimento[] = [];

    if (values.houve_ocorrencia === "0") {
      return ocorrencias;
    }

    for (let idx = 0; idx < ocorrenciasCount; idx++) {
      const tipo = values[`tipo_${idx}`];
      const relacao = values[`relacao_${idx}`];
      const numero_nota = values[`numero_nota_${idx}`];
      const quantidade = values[`quantidade_${idx}`];
      const descricao = values[`descricao_${idx}`];

      const ocorrencia: OcorrenciaFichaRecebimento = {
        tipo,
        descricao,
      };

      if (tipo === "FALTA") {
        ocorrencia.relacao = relacao;
        if (relacao === "NOTA_FISCAL") {
          ocorrencia.numero_nota = numero_nota;
        }
        ocorrencia.quantidade = quantidade;
      }

      if (tipo === "RECUSA") {
        ocorrencia.relacao = relacao;
        ocorrencia.numero_nota = numero_nota;
        ocorrencia.quantidade = quantidade;
      }

      ocorrencias.push(ocorrencia);
    }

    return ocorrencias.filter((ocorrencia) => ocorrencia.tipo !== undefined);
  };

  const formataPayload = (
    values: Record<string, any>,
    password?: string,
  ): FichaRecebimentoPayload => {
    const { saldoTotalZero } = getQuantidadesESaldo(values);

    let payloadQuestoes: QuestoesPayload[] = [
      ...formataPayloadQuestoes(values, questoesPrimarias, "PRIMARIA"),
      ...formataPayloadQuestoes(values, questoesSecundarias, "SECUNDARIA"),
    ];

    const questoes = payloadQuestoes.length > 0 ? payloadQuestoes : undefined;

    const payloadBase: Partial<FichaRecebimentoPayload> = {
      etapa: values.etapa,
      data_entrega: values.data_entrega
        ? moment(values.data_entrega, "DD/MM/YYYY").format("YYYY-MM-DD")
        : undefined,
      documentos_recebimento: values.documentos_recebimento?.map(
        (x: DocumentoFicha, key: number) =>
          ({
            documento_recebimento: x.uuid,
            quantidade_recebida: values[`qtd_recebida_laudo_${key}`],
          }) as DocumentoFichaPayload,
      ),
      observacao: values.observacao,
      arquivos: formataPayloadArquivos(arquivos),
      houve_ocorrencia: stringToBoolean(values.houve_ocorrencia),
      ocorrencias: extraiOcorrenciasDoFormulario(values),
      reposicao_cronograma: values.reposicao_cronograma,
      ...(password && { password }),
    };

    const payloadQuandoHaSaldo: Partial<FichaRecebimentoPayload> =
      saldoTotalZero
        ? {}
        : {
            lote_fabricante_de_acordo: stringToBoolean(
              values.lote_fabricante_de_acordo as string,
            ),
            lote_fabricante_divergencia: values.lote_fabricante_divergencia,
            data_fabricacao_de_acordo: stringToBoolean(
              values.data_fabricacao_de_acordo as string,
            ),
            data_fabricacao_divergencia: values.data_fabricacao_divergencia,
            data_validade_de_acordo: stringToBoolean(
              values.data_validade_de_acordo as string,
            ),
            data_validade_divergencia: values.data_validade_divergencia,
            numero_lote_armazenagem: values.numero_lote_armazenagem,
            numero_paletes: values.numero_paletes,
            peso_embalagem_primaria_1: values.peso_embalagem_primaria_1,
            peso_embalagem_primaria_2: values.peso_embalagem_primaria_2,
            peso_embalagem_primaria_3: values.peso_embalagem_primaria_3,
            peso_embalagem_primaria_4: values.peso_embalagem_primaria_4,
            veiculos: values.numero_0
              ? veiculos.map(
                  (v, index) =>
                    ({
                      numero: values[`numero_${index}`],
                      temperatura_recebimento:
                        values[`temperatura_recebimento_${index}`],
                      temperatura_produto:
                        values[`temperatura_produto_${index}`],
                      placa: values[`placa_${index}`],
                      lacre: values[`lacre_${index}`],
                      numero_sif_sisbi_sisp:
                        values[`numero_sif_sisbi_sisp_${index}`],
                      numero_nota_fiscal: values[`numero_nota_fiscal_${index}`],
                      quantidade_nota_fiscal:
                        values[`quantidade_nota_fiscal_${index}`],
                      embalagens_nota_fiscal:
                        values[`embalagens_nota_fiscal_${index}`],
                      quantidade_recebida:
                        values[`quantidade_recebida_${index}`],
                      embalagens_recebidas:
                        values[`embalagens_recebidas_${index}`],
                      estado_higienico_adequado: stringToBoolean(
                        values[`estado_higienico_adequado_${index}`],
                      ),
                      termografo: stringToBoolean(
                        values[`termografo_${index}`],
                      ),
                    }) as VeiculoPayload,
                )
              : undefined,
            sistema_vedacao_embalagem_secundaria:
              values.sistema_vedacao_embalagem_secundaria === "0"
                ? cronograma.sistema_vedacao_embalagem_secundaria
                : values.sistema_vedacao_embalagem_secundaria_outra_opcao,
            observacoes_conferencia: values.observacoes_conferencia,
            questoes: questoes,
          };

    return {
      ...payloadBase,
      ...payloadQuandoHaSaldo,
    } as FichaRecebimentoPayload;
  };

  const salvarRascunho = async (
    values: FichaRecebimentoPayload,
    redirecionarPara: () => void,
  ): Promise<void> => {
    setCarregando(true);

    let payload: FichaRecebimentoPayload = formataPayload(values);

    try {
      const response = initialValues.uuid
        ? await editaRascunhoFichaRecebimento(payload, initialValues.uuid)
        : await cadastraRascunhoFichaRecebimento(payload);
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

  const assinarFichaRecebimento = async (
    values: FichaRecebimentoPayload,
    redirecionarPara: () => void,
    password?: string,
  ) => {
    setCarregando(true);
    let payload: FichaRecebimentoPayload = formataPayload(values, password);

    try {
      let cadastrar = cadastraFichaRecebimento;
      let editar = editarFichaRecebimento;

      const { saldoTotalZero } = getQuantidadesESaldo(values);

      if (saldoTotalZero) {
        cadastrar = cadastraFichaRecebimentoSaldoZero;
        editar = editaFichaRecebimentoSaldoZero;
      } else if (
        opcoesReposicao.find(({ uuid }) => uuid === values.reposicao_cronograma)
          ?.tipo === "Credito"
      ) {
        cadastrar = cadastraReposicaoFichaRecebimento;
        editar = editaReposicaoFichaRecebimento;
      }

      const response = initialValues.uuid
        ? await editar(payload, initialValues.uuid)
        : await cadastrar(payload);

      if (response.status === 201 || response.status === 200) {
        toastSuccess("Ficha de recebimento Assinada com sucesso!");
        redirecionarPara();
      } else {
        toastError("Ocorreu um erro ao salvar a Ficha de Recebimento");
      }
    } catch (error) {
      exibeError(error);
    } finally {
      setShowModalAssinatura(false);
      setCarregando(false);
    }
  };

  const paginaAnterior = () => navigate(`/${RECEBIMENTO}/${FICHA_RECEBIMENTO}`);

  const paginaQuestoesPorProduto = () =>
    navigate(`/${RECEBIMENTO}/${QUESTOES_POR_PRODUTO}`);

  useEffect(() => {
    const inicializarComponente = async () => {
      await buscaCronogramas();
      await carregarEdicaoFichaDeRecebimento(
        setInitialValues,
        setCarregando,
        setVeiculos,
        setOcorrenciasCount,
        setArquivos,
      );
    };

    inicializarComponente();
  }, []);

  const formRef = useRef<FormApi | null>(null);

  useEffect(() => {
    if (initialValues.cronograma && formRef.current) {
      atualizarCamposCronograma(initialValues.cronograma, formRef.current);
    }
  }, [initialValues.cronograma, cronogramas]);

  useEffect(() => {
    if (
      initialValues.documentos_recebimento &&
      cronograma.documentos_de_recebimento &&
      formRef.current
    ) {
      const documentosSelecionados = initialValues.documentos_recebimento
        .map((doc) => {
          return cronograma.documentos_de_recebimento.find(
            (docOpcao) => docOpcao.uuid === doc.uuid,
          );
        })
        .filter(Boolean);
      formRef.current.change("documentos_recebimento", documentosSelecionados);
    }
  }, [
    initialValues.documentos_recebimento,
    cronograma.documentos_de_recebimento,
  ]);

  useEffect(() => {
    if (initialValues.etapa && formRef.current && cronograma.etapas) {
      const selectElement = document.querySelector(
        'select[data-cy="Etapa e Parte"]',
      ) as HTMLSelectElement;
      if (selectElement) {
        const optionToSelect = Array.from(selectElement.options).find(
          (option) => option.value === initialValues.etapa.uuid,
        );

        if (optionToSelect) {
          optionToSelect.selected = true;
          selectElement.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }
    }
  }, [cronograma.etapas, initialValues.etapa]);

  const optionsCronograma = (values: Record<string, any>) =>
    getListaFiltradaAutoCompleteSelect(
      cronogramas.map(({ numero }) => numero),
      values.cronograma,
      true,
    );

  const atualizarCamposCronograma = async (value: string, form: FormApi) => {
    setCarregando(true);
    try {
      let cronogramaSelecionado = cronogramas.find((c) => c.numero === value);
      if (cronogramaSelecionado?.uuid) {
        let { data } = await getCronogramaPraCadastroRecebimento(
          cronogramaSelecionado.uuid,
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
        setCronograma({} as CronogramaFicha);
        form.reset({});
        form.change("cronograma", value);
      }
    } finally {
      setCarregando(false);
    }
  };

  const atualizarCamposEtapa = (value: string, form: FormApi) => {
    let etapa = cronograma.etapas.find((e) => e.uuid === value);
    form.change("data_programada", etapa?.data_programada);
    form.change("qtd_programada", etapa?.quantidade);
    form.change("emb_programadas", etapa?.total_embalagens);

    form.change("emb_primaria", cronograma.embalagem_primaria);
    form.change("emb_secundaria", cronograma.embalagem_secundaria);
    form.change(
      "peso_emb_primaria",
      cronograma.peso_liquido_embalagem_primaria,
    );
    form.change(
      "peso_emb_secundaria",
      cronograma.peso_liquido_embalagem_secundaria,
    );
  };

  const adicionaVeiculo = () => {
    setVeiculos([...veiculos, {}]);
  };

  const deletaVeiculo = (index: number, values: Record<string, any>) => {
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

  const setFiles = (files: Array<ArquivoForm>): void => {
    setArquivos(files);
  };

  const removeFiles = (index: number): void => {
    let newFiles = [...arquivos];
    newFiles.splice(index, 1);
    setArquivos(newFiles);
  };

  const ehEdicao = !!initialValues.cronograma;
  const naoExistemLaudos = cronograma.documentos_de_recebimento?.length === 0;

  const observacoes = (
    <Field
      component={TextArea}
      label={
        stepAtual === 0 ? "Observações:" : "Descreva as observações necessárias"
      }
      required={stepAtual === 0}
      name={`observacao`}
      placeholder="Descreva as observações necessárias"
    />
  );

  const anexarArquivo = (
    <InputFileField
      name="arquivo"
      setFiles={setFiles}
      removeFile={removeFiles}
      arquivosIniciais={arquivos as ArquivoForm[]}
      toastSuccess="Documento incluído com sucesso!"
      textoBotao="Anexar Documento"
      helpText={
        stepAtual !== 0
          ? "Envie arquivos nos formatos: PDF, PNG, JPG ou JPEG  com até 10MB."
          : ""
      }
    />
  );

  const carregarOpcoesReposicao = async () => {
    try {
      const resposta = await listarOpcoesReposicao();
      if (resposta.status === 200) setOpcoesReposicao(resposta.data.results);
    } catch (error) {
      toastError("Erro ao carregar opções reposição de cronograma:", error);
    }
  };

  const getQuantidadesESaldo = (
    values: Record<string, any>,
  ): { saldoTotalZero: boolean; algumZero: boolean } => {
    const quantidades =
      values.documentos_recebimento?.map(
        (_: DocumentoFicha, index: number) =>
          parseInt(values[`qtd_recebida_laudo_${index}`]) || 0,
      ) || [];

    const saldoTotalZero: boolean =
      quantidades.length > 0 && quantidades.every((qtd: number) => qtd === 0);
    const algumZero: boolean = quantidades.some((qtd: number) => qtd === 0);

    return { saldoTotalZero, algumZero };
  };

  const handleQuantidadeChange = (
    value: string,
    values: Record<string, any>,
    fieldName: string,
    form: FormApi,
  ) => {
    const updatedValues = {
      ...values,
      [fieldName]: value,
    };

    const { algumZero, saldoTotalZero } = getQuantidadesESaldo(updatedValues);

    if (algumZero) {
      form.change("houve_ocorrencia", "1");
    }

    setCollapse3(
      saldoTotalZero ? { 0: false, 2: true } : { 0: true, 2: false },
    );

    if (parseInt(value) === 0 && !modalZeroExibido) {
      setShowModalOcorrencia(true);
      setModalZeroExibido(true);
    }

    setTimeout(() => {
      form.mutators.forceValidation();
    }, 10);
  };

  useEffect(() => {
    carregarOpcoesReposicao();
  }, []);

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-cadastro-ficha-recebimento">
        <div className="card-body cadastro-ficha-recebimento">
          <Form
            onSubmit={() => setShowModalAssinatura(true)}
            initialValues={initialValues}
            mutators={{
              forceValidation: (args, state) => {
                state.formState.valid = undefined;
                state.formState.errors = {};
              },
            }}
            render={({ handleSubmit, values, form, errors }) => {
              formRef.current = form;
              const reposicaoSelecionada = opcoesReposicao.find(
                ({ uuid }) => uuid === values.reposicao_cronograma,
              );
              const etapaSelecionada = getOpcoesEtapas()?.find(
                (opt) => opt.uuid === values.etapa,
              );

              const { saldoTotalZero, algumZero } =
                getQuantidadesESaldo(values);

              const requiredSaldoTotalZero =
                (validator: (_v: string) => string) => (value: string) => {
                  if (saldoTotalZero) {
                    return undefined;
                  }
                  return validator(value);
                };

              return (
                <form onSubmit={handleSubmit}>
                  <ModalGenerico
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    loading={carregando}
                    handleSim={() =>
                      salvarRascunho(
                        values as FichaRecebimentoPayload,
                        paginaAnterior,
                      )
                    }
                    titulo={<span>Salvar Rascunho</span>}
                    texto={
                      <span>
                        Deseja salvar o rascunho da Ficha de Recebimento?
                      </span>
                    }
                  />

                  <ModalGenerico
                    show={showModalAtribuir}
                    handleClose={() => setShowModalAtribuir(false)}
                    loading={carregando}
                    handleSim={() =>
                      salvarRascunho(
                        values as FichaRecebimentoPayload,
                        paginaQuestoesPorProduto,
                      )
                    }
                    titulo="Salvar Rascunho e Atribuir Questões"
                    texto="Deseja salvar o rascunho e ir para a página de Atribuição
                  de Questões por Produto?"
                    textoBotaoSim="Salvar e Ir para Página"
                  />

                  <ModalGenerico
                    show={showModalOcorrencia}
                    handleClose={() => setShowModalOcorrencia(false)}
                    handleSim={() => setShowModalOcorrencia(false)}
                    titulo="Registre uma ocorrência no próximo passo..."
                    texto={
                      <span>
                        Ao inserir{" "}
                        <strong>0 no campo de quantidade recebida</strong> do
                        laudo, será necessário registrar uma ocorrência para
                        salvar esse recebimento.
                      </span>
                    }
                    unicoBotao={true}
                    textoBotaoSim="Ciente"
                  />

                  <StepsSigpae current={stepAtual} items={ITENS_STEPS} />

                  <hr />

                  {stepAtual === 0 && (
                    <Collapse
                      collapse={collapse1}
                      setCollapse={setCollapse1}
                      titulos={[
                        <span key={0}>Dados do Cronograma de Entregas</span>,
                        <span key={1}>Etapa, Parte e Data do Recebimento</span>,
                      ]}
                      id="collapseFichaRecebimentoStep1"
                    >
                      <section id="dadosCronograma">
                        <div className="row">
                          <div className="col-4">
                            <Field
                              component={AutoCompleteSelectField}
                              options={optionsCronograma(values)}
                              label="Cronograma"
                              name={`cronograma`}
                              dataTestId={"cronograma"}
                              className="input-busca-produto"
                              placeholder="Digite um cronograma"
                              required
                              validate={required}
                              onChange={(value: string) => {
                                atualizarCamposCronograma(value, form);
                              }}
                              disabled={ehEdicao}
                            />
                          </div>
                          <div className="col-8">
                            <Field
                              component={InputText}
                              label="Fornecedor"
                              name={`fornecedor`}
                              placeholder="Nome da Empresa"
                              disabled={true}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-4">
                            <Field
                              component={InputText}
                              label="Nº do Contrato"
                              name={`numero_contrato`}
                              placeholder="Nº do Contrato"
                              disabled={true}
                            />
                          </div>
                          <div className="col-4">
                            <Field
                              component={InputText}
                              label="Nº do Pregão/Chamada Pública"
                              name={`pregao`}
                              placeholder="Nº do Pregão/Chamada Pública"
                              disabled={true}
                            />
                          </div>
                          <div className="col-4">
                            <Field
                              component={InputText}
                              label="Nº da Ata"
                              name={`numero_ata`}
                              placeholder="Nº da Ata"
                              disabled={true}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-12">
                            <Field
                              component={InputText}
                              label="Produto"
                              name={`produto`}
                              placeholder="Nome do Produto"
                              disabled={true}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-8">
                            <Field
                              component={InputText}
                              label="Marca"
                              name={`marca`}
                              placeholder="Nome da Marca"
                              disabled={true}
                            />
                          </div>
                          <div className="col-4">
                            <Field
                              component={InputText}
                              label="Quantidade Total Programada"
                              name={`qtd_total_programada`}
                              placeholder="Quantidade Total"
                              disabled={true}
                            />
                          </div>
                        </div>
                        {cronograma.etapas && (
                          <div className="row mt-3">
                            <div className="col-12">
                              <table className="table tabela-dados-cronograma">
                                <thead className="head-crono">
                                  <th className="borda-crono">N° do Empenho</th>
                                  <th className="borda-crono">
                                    Qtde. Total do Empenho
                                  </th>
                                  <th className="borda-crono">Etapa</th>
                                  <th className="borda-crono">Parte</th>
                                  <th className="borda-crono">
                                    Data Programada
                                  </th>
                                  <th className="borda-crono">Quantidade</th>
                                  <th className="borda-crono">
                                    Total de Embalagens
                                  </th>
                                </thead>
                                <tbody>
                                  {cronograma.etapas.map((etapa, key) => {
                                    return (
                                      <tr key={key}>
                                        <td className="borda-crono">
                                          {etapa.numero_empenho}
                                        </td>
                                        <td className="borda-crono">
                                          {etapa.qtd_total_empenho}
                                        </td>
                                        <td className="borda-crono">
                                          {etapa.etapa}
                                        </td>
                                        <td className="borda-crono">
                                          {etapa.parte}
                                        </td>
                                        <td className="borda-crono">
                                          {etapa.data_programada}
                                        </td>
                                        <td className="borda-crono">
                                          {etapa.quantidade}
                                        </td>
                                        <td className="borda-crono">
                                          {etapa.total_embalagens}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </section>

                      <section id="dadosEtapa">
                        <div className="row">
                          <div className="col-6">
                            <Field
                              component={Select}
                              naoDesabilitarPrimeiraOpcao
                              options={[
                                { nome: "Selecione a Etapa - Parte", uuid: "" },
                                ...getOpcoesEtapas(),
                              ]}
                              label="Etapa e Parte"
                              name="etapa"
                              dataTestId="etapa"
                              required
                              validate={required}
                              onChangeEffect={(
                                e: ChangeEvent<HTMLInputElement>,
                              ) => {
                                atualizarCamposEtapa(e.target.value, form);
                              }}
                              disabled={ehEdicao}
                            />
                          </div>
                          <div className="col-3">
                            <Field
                              component={InputComData}
                              label="Data Programada"
                              name={`data_programada`}
                              placeholder="Data do Cronograma"
                              disabled={true}
                            />
                          </div>
                          <div className="col-3">
                            <Field
                              component={InputComData}
                              label="Data da Entrega"
                              name={`data_entrega`}
                              dataTestId="data_entrega"
                              placeholder="Selecionar a Data"
                              required
                              validate={required}
                              writable={false}
                              disabled={!etapaSelecionada}
                              minDate={
                                etapaSelecionada?.data_programada
                                  ? dataParaUTC(
                                      new Date(
                                        converterDDMMYYYYparaYYYYMMDD(
                                          etapaSelecionada.data_programada,
                                        ),
                                      ),
                                    )
                                  : null
                              }
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-3">
                            <Field
                              component={InputText}
                              label="Quantidade Programada"
                              name={`qtd_programada`}
                              placeholder="Quantidade Programada"
                              disabled={true}
                            />
                          </div>
                          <div className="col-3">
                            <Field
                              component={InputText}
                              label="Embalagens Programadas"
                              name={`emb_programadas`}
                              placeholder="Embalagens Programadas"
                              disabled={true}
                            />
                          </div>
                          <div className="col-3">
                            <Field
                              component={InputText}
                              label="Peso Embalagem Primária"
                              name={`peso_emb_primaria`}
                              placeholder="Peso Embalagem Primária"
                              disabled={true}
                            />
                          </div>
                          <div className="col-3">
                            <Field
                              component={InputText}
                              label="Peso Embalagem Secundária"
                              name={`peso_emb_secundaria`}
                              placeholder="Peso Embalagem Secundária"
                              disabled={true}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-6">
                            <Field
                              component={InputText}
                              label="Embalagem Primária"
                              name={`emb_primaria`}
                              placeholder="Embalagem Primária"
                              disabled={true}
                            />
                          </div>
                          <div className="col-6">
                            <Field
                              component={InputText}
                              label="Embalagem Secundária"
                              name={`emb_secundaria`}
                              placeholder="Embalagem Secundária"
                              disabled={true}
                            />
                          </div>
                        </div>
                        {etapaSelecionada?.houve_ocorrencia && (
                          <div className="row reposicao">
                            <div className="col-6">
                              <RadioButtonField
                                label="Referente à ocorrência registrada nesta etapa, o Fornecedor optou por:"
                                name="reposicao_cronograma"
                                options={opcoesReposicao.map(
                                  (e: ReposicaoCronograma) => {
                                    return {
                                      value: e.uuid,
                                      label: e.descricao,
                                    };
                                  },
                                )}
                              />
                            </div>
                            {reposicaoSelecionada?.tipo === "Credito" && (
                              <div className="col-6">
                                <p>
                                  Anexe os documentos relacionados a reposição /
                                  pagamento da notificação:
                                </p>
                                {anexarArquivo}
                              </div>
                            )}
                          </div>
                        )}
                        {reposicaoSelecionada?.tipo === "Credito" && (
                          <div className="row">{observacoes}</div>
                        )}
                      </section>
                    </Collapse>
                  )}

                  {stepAtual === 1 && (
                    <Collapse
                      collapse={collapse2}
                      setCollapse={setCollapse2}
                      titulos={[
                        <span key={0}>Validações do Produto</span>,
                        <span key={1}>
                          Veículos e Quantidades do Recebimento
                        </span>,
                      ]}
                      id="collapseFichaRecebimentoStep2"
                    >
                      <section id="dadosValidacoes">
                        <div className="row">
                          <div className="col-6">
                            <Field
                              label="Laudo(s) de Análise Disponível(eis) para Recebimento"
                              component={MultiSelect}
                              disableSearch
                              name="documentos_recebimento"
                              multiple
                              nomeDoItemNoPlural="laudos"
                              options={getOpcoesDocumentos()}
                              placeholder={
                                naoExistemLaudos
                                  ? "Não existem laudos aprovados"
                                  : "Selecione os Laudos"
                              }
                              required
                              validate={required}
                              disabled={naoExistemLaudos}
                            />
                          </div>
                          <div className="col-6">
                            <div className="alerta-saldos">
                              <div>
                                <span className="required-asterisk bg-transparent">
                                  *
                                </span>
                                <span>
                                  Para calcular a quantidade a ser preenchida,
                                  desconte possíveis recusas ou faltas.
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {values.documentos_recebimento?.length > 0 && (
                          <div className="row mt-3">
                            <div className="col-12">
                              <table className="table tabela-dados-cronograma">
                                <thead className="head-crono">
                                  <th className="borda-crono">Nº do Laudo</th>
                                  <th className="borda-crono">
                                    Lote(s) do Laudo
                                  </th>
                                  <th className="borda-crono">
                                    Data(s) de Fabricação
                                  </th>
                                  <th className="borda-crono">
                                    Data(s) de Validade
                                  </th>
                                  <th className="borda-crono">
                                    Saldo do Laudo
                                  </th>
                                  <th className="borda-crono">
                                    Qtde Recebida
                                    <span className="required-asterisk bg-transparent">
                                      *
                                    </span>
                                  </th>
                                </thead>
                                <tbody>
                                  {values.documentos_recebimento.map(
                                    (doc: DocumentoFicha, key: number) => {
                                      return (
                                        <tr key={key}>
                                          <td className="borda-crono">
                                            {doc.numero_laudo}
                                          </td>
                                          <td className="borda-crono">
                                            {doc.numero_lote_laudo}
                                          </td>
                                          <td className="borda-crono">
                                            {doc.datas_fabricacao}
                                          </td>
                                          <td className="borda-crono">
                                            {doc.datas_validade}
                                          </td>
                                          <td className="borda-crono">
                                            {doc.saldo_laudo}
                                          </td>
                                          <td className="borda-crono">
                                            <Field
                                              component={InputText}
                                              name={`qtd_recebida_laudo_${key}`}
                                              dataTestId={`qtd_recebida_laudo_${key}`}
                                              placeholder="Digite a Quantidade"
                                              required
                                              apenasNumeros
                                              validate={composeValidators(
                                                required,
                                                maxValue(
                                                  doc.saldo_laudo,
                                                  "Não pode ser maior que o saldo do laudo",
                                                ),
                                              )}
                                              inputOnChange={(
                                                e: React.ChangeEvent<HTMLInputElement>,
                                              ) =>
                                                handleQuantidadeChange(
                                                  e.target.value,
                                                  values,
                                                  `qtd_recebida_laudo_${key}`,
                                                  form,
                                                )
                                              }
                                            />
                                          </td>
                                        </tr>
                                      );
                                    },
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        <div className="row">
                          <div className="col-12">
                            <RadioButtonField
                              label="Lote(s) do Fabricante Observado(s)"
                              name={`lote_fabricante_de_acordo`}
                              options={[
                                {
                                  value: "1",
                                  label: "De acordo com o Laudo",
                                },
                                {
                                  value: "0",
                                  label: "Divergente",
                                },
                              ]}
                              validate={requiredSaldoTotalZero(required)}
                              disabled={naoExistemLaudos || saldoTotalZero}
                            />
                          </div>
                          {values.lote_fabricante_de_acordo === "0" && (
                            <div className="row">
                              <div className="col-12">
                                <Field
                                  component={InputText}
                                  label="Descrição da Divergência Observada"
                                  name={`lote_fabricante_divergencia`}
                                  placeholder="Descreva a divergência"
                                  required
                                  validate={requiredSaldoTotalZero(required)}
                                  disabled={saldoTotalZero}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="row">
                          <div className="col-12">
                            <RadioButtonField
                              label="Data(s) de Fabricação Observada(s)"
                              name={`data_fabricacao_de_acordo`}
                              options={[
                                {
                                  value: "1",
                                  label: "De acordo com o Laudo",
                                },
                                {
                                  value: "0",
                                  label: "Divergente",
                                },
                              ]}
                              validate={requiredSaldoTotalZero(required)}
                              disabled={naoExistemLaudos || saldoTotalZero}
                            />
                          </div>
                          {values.data_fabricacao_de_acordo === "0" && (
                            <div className="row">
                              <div className="col-12">
                                <Field
                                  component={InputText}
                                  label="Descrição da Divergência Observada"
                                  name={`data_fabricacao_divergencia`}
                                  placeholder="Descreva a divergência"
                                  required
                                  validate={requiredSaldoTotalZero(required)}
                                  disabled={saldoTotalZero}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="row">
                          <div className="col-12">
                            <RadioButtonField
                              label="Data(s) de Validade Observada(s)"
                              name={`data_validade_de_acordo`}
                              options={[
                                {
                                  value: "1",
                                  label: "De acordo com o Laudo",
                                },
                                {
                                  value: "0",
                                  label: "Divergente",
                                },
                              ]}
                              validate={requiredSaldoTotalZero(required)}
                              disabled={naoExistemLaudos || saldoTotalZero}
                            />
                          </div>
                          {values.data_validade_de_acordo === "0" && (
                            <div className="row">
                              <div className="col-12">
                                <Field
                                  component={InputText}
                                  label="Descrição da Divergência Observada"
                                  name={`data_validade_divergencia`}
                                  placeholder="Descreva a divergência"
                                  required
                                  validate={requiredSaldoTotalZero(required)}
                                  disabled={saldoTotalZero}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="row">
                          <div className="col-6">
                            <Field
                              component={InputText}
                              label="Nº do Lote Armazenagem"
                              name={`numero_lote_armazenagem`}
                              placeholder="Digite o número do lote de armazenagem"
                              required
                              validate={requiredSaldoTotalZero(required)}
                              disabled={saldoTotalZero}
                            />
                          </div>
                          <div className="col-6">
                            <Field
                              component={InputText}
                              label="Nº de Paletes"
                              name={`numero_paletes`}
                              placeholder="Digite o número de paletes"
                              required
                              validate={requiredSaldoTotalZero(required)}
                              agrupadorMilharPositivo
                              disabled={saldoTotalZero}
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-12">
                            <Label
                              content="Peso da Embalagem Primária"
                              required
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col">
                            <Field
                              component={InputText}
                              name={`peso_embalagem_primaria_1`}
                              placeholder="Digite o peso"
                              required
                              validate={requiredSaldoTotalZero(required)}
                              agrupadorMilharComDecimal
                              disabled={saldoTotalZero}
                            />
                          </div>
                          <div className="w-auto label-peso-embalagem">
                            <span>Kg</span>
                          </div>
                          <div className="col">
                            <Field
                              component={InputText}
                              name={`peso_embalagem_primaria_2`}
                              placeholder="Digite o peso"
                              validate={requiredSaldoTotalZero(required)}
                              agrupadorMilharComDecimal
                              disabled={saldoTotalZero}
                            />
                          </div>
                          <div className="w-auto label-peso-embalagem">
                            <span>Kg</span>
                          </div>
                          <div className="col">
                            <Field
                              component={InputText}
                              name={`peso_embalagem_primaria_3`}
                              placeholder="Digite o peso"
                              validate={requiredSaldoTotalZero(required)}
                              agrupadorMilharComDecimal
                              disabled={saldoTotalZero}
                            />
                          </div>
                          <div className="w-auto label-peso-embalagem">
                            <span>Kg</span>
                          </div>
                          <div className="col">
                            <Field
                              component={InputText}
                              name={`peso_embalagem_primaria_4`}
                              placeholder="Digite o peso"
                              validate={requiredSaldoTotalZero(required)}
                              agrupadorMilharComDecimal
                              disabled={saldoTotalZero}
                            />
                          </div>
                          <div className="w-auto label-peso-embalagem">
                            <span>Kg</span>
                          </div>
                        </div>
                      </section>

                      <section id="dadosVeiculos">
                        {veiculos.map((v, index) => (
                          <>
                            {index === veiculos.length - 1 && index > 0 && (
                              <>
                                {index > 0 && <hr />}
                                <div className="row">
                                  <div className="w-100">
                                    <Botao
                                      texto=""
                                      type={BUTTON_TYPE.BUTTON}
                                      style={BUTTON_STYLE.RED_OUTLINE}
                                      icon="fas fa-trash"
                                      className="float-end ms-3"
                                      onClick={() =>
                                        deletaVeiculo(index, values)
                                      }
                                      tooltipExterno="Remover Veículo"
                                    />
                                  </div>
                                </div>
                              </>
                            )}
                            <div className="row">
                              <div className="col-3">
                                <Field
                                  component={InputText}
                                  label="Nº do Veículo"
                                  name={`numero_${index}`}
                                  disabled={true}
                                  defaultValue={`Veículo ${index + 1}`}
                                />
                              </div>
                              {cronograma.categoria === "PERECIVEIS" && (
                                <>
                                  <div className="col-3">
                                    <Field
                                      component={InputText}
                                      label="T °C (Área de Recebimento)"
                                      name={`temperatura_recebimento_${index}`}
                                      placeholder="T °C da área"
                                      required
                                      validate={requiredSaldoTotalZero(
                                        required,
                                      )}
                                      disabled={saldoTotalZero}
                                    />
                                  </div>
                                  <div className="col-3">
                                    <Field
                                      component={InputText}
                                      label="T °C (Produto)"
                                      name={`temperatura_produto_${index}`}
                                      placeholder="T °C do produto"
                                      required
                                      validate={requiredSaldoTotalZero(
                                        required,
                                      )}
                                      disabled={saldoTotalZero}
                                    />
                                  </div>
                                </>
                              )}
                              <div className="col-3">
                                <Field
                                  component={InputText}
                                  label="Placa do Veículo"
                                  name={`placa_${index}`}
                                  placeholder="Digite a placa do veículo"
                                  disabled={saldoTotalZero}
                                />
                              </div>

                              {cronograma.categoria === "PERECIVEIS" && (
                                <>
                                  <div className="col-3">
                                    <Field
                                      component={InputText}
                                      label="Lacre"
                                      name={`lacre_${index}`}
                                      placeholder="Digite o número do lacre"
                                      required
                                      validate={requiredSaldoTotalZero(
                                        required,
                                      )}
                                      disabled={saldoTotalZero}
                                    />
                                  </div>
                                  <div className="col-3">
                                    <Field
                                      component={InputText}
                                      label="Nº SIF, SISBI ou SISP"
                                      name={`numero_sif_sisbi_sisp_${index}`}
                                      placeholder="Digite o número"
                                      required
                                      validate={requiredSaldoTotalZero(
                                        required,
                                      )}
                                      disabled={saldoTotalZero}
                                    />
                                  </div>
                                </>
                              )}
                              <div className="col-3">
                                <Field
                                  component={InputText}
                                  label="Nº Nota Fiscal"
                                  name={`numero_nota_fiscal_${index}`}
                                  placeholder="Digite o número da nota"
                                  required
                                  validate={requiredSaldoTotalZero(required)}
                                  disabled={saldoTotalZero}
                                />
                              </div>
                              <div className="col-3">
                                <Field
                                  component={InputText}
                                  label="Quantidade Nota Fiscal"
                                  name={`quantidade_nota_fiscal_${index}`}
                                  placeholder="Digite a qtde da nota"
                                  required
                                  validate={requiredSaldoTotalZero(required)}
                                  disabled={saldoTotalZero}
                                />
                              </div>
                              <div className="col-3">
                                <Field
                                  component={InputText}
                                  label="Embalagens Nota Fiscal"
                                  name={`embalagens_nota_fiscal_${index}`}
                                  placeholder="Digite a qtde de embalagens"
                                  required
                                  validate={requiredSaldoTotalZero(required)}
                                  disabled={saldoTotalZero}
                                />
                              </div>
                              <div className="col-3">
                                <Field
                                  component={InputText}
                                  label="Quantidade Recebida"
                                  name={`quantidade_recebida_${index}`}
                                  placeholder="Digite a qtde recebida"
                                  required
                                  validate={requiredSaldoTotalZero(required)}
                                  disabled={saldoTotalZero}
                                />
                              </div>
                              <div className="col-3">
                                <Field
                                  component={InputText}
                                  label="Embalagens Recebidas"
                                  name={`embalagens_recebidas_${index}`}
                                  placeholder="Digite qtde recebida"
                                  required
                                  validate={requiredSaldoTotalZero(required)}
                                  disabled={saldoTotalZero}
                                />
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-6">
                                <RadioButtonField
                                  label="Estado Higiênico-Sanitário"
                                  name={`estado_higienico_adequado_${index}`}
                                  options={[
                                    {
                                      value: "1",
                                      label: "ADEQUADO",
                                    },
                                    {
                                      value: "0",
                                      label: "INADEQUADO",
                                    },
                                  ]}
                                  validate={requiredSaldoTotalZero(required)}
                                  disabled={saldoTotalZero}
                                />
                              </div>
                              {cronograma.categoria === "PERECIVEIS" && (
                                <div className="col-6">
                                  <RadioButtonField
                                    label="Termógrafo"
                                    name={`termografo_${index}`}
                                    options={[
                                      {
                                        value: "0",
                                        label: "NÃO",
                                      },
                                      {
                                        value: "1",
                                        label: "SIM",
                                      },
                                    ]}
                                    validate={requiredSaldoTotalZero(required)}
                                    disabled={saldoTotalZero}
                                  />
                                </div>
                              )}
                            </div>

                            <div className="text-center mb-3 mt-3">
                              <Botao
                                texto="+ Adicionar Veículo"
                                type={BUTTON_TYPE.BUTTON}
                                style={BUTTON_STYLE.GREEN_OUTLINE}
                                onClick={() => adicionaVeiculo()}
                                disabled={saldoTotalZero}
                              />
                            </div>
                          </>
                        ))}
                      </section>
                    </Collapse>
                  )}

                  {stepAtual === 2 && (
                    <Collapse
                      collapse={collapse3}
                      setCollapse={setCollapse3}
                      id="collapseFichaRecebimentoStep3"
                      collapseConfigs={collapseConfigStep3}
                    >
                      <section id="sistemaVedacaoSecundaria">
                        <div className="row">
                          <div className="col mt-3">
                            <RadioButtonField
                              name={`sistema_vedacao_embalagem_secundaria`}
                              options={[
                                {
                                  value: "0",
                                  label:
                                    cronograma.sistema_vedacao_embalagem_secundaria,
                                },
                                {
                                  value: "1",
                                  label: "Outra Opção",
                                },
                              ]}
                              className="radio-sistema-vedacao"
                              validate={requiredSaldoTotalZero(required)}
                              disabled={saldoTotalZero}
                            />
                          </div>
                          {values.sistema_vedacao_embalagem_secundaria ===
                            "1" && (
                            <div className="row">
                              <div className="col">
                                <Field
                                  component={InputText}
                                  label="Qual?"
                                  name={`sistema_vedacao_embalagem_secundaria_outra_opcao`}
                                  placeholder="Descreva a outra opção"
                                  required
                                  validate={required}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </section>

                      <section id="conferenciaRotulagens">
                        {questoesPrimarias || questoesSecundarias ? (
                          <>
                            <div>
                              <table
                                className={`table tabela-conferencia-embalagens ${
                                  questoesSecundarias.length === 0
                                    ? "only-primaria"
                                    : ""
                                }`}
                              >
                                <thead>
                                  <tr>
                                    {questoesSecundarias.length > 0 && (
                                      <th className="">
                                        Conferência Embalagem Secundária
                                      </th>
                                    )}
                                    <th className="">
                                      Conferência Embalagem Primária
                                    </th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {Array.from({
                                    length: Math.max(
                                      questoesPrimarias.length,
                                      questoesSecundarias.length,
                                    ),
                                  }).map((_, index) => {
                                    const primaria = questoesPrimarias[index];
                                    const secundaria =
                                      questoesSecundarias?.[index];

                                    return (
                                      <tr key={index} className="">
                                        {questoesSecundarias.length > 0 && (
                                          <td className="">
                                            {secundaria && (
                                              <RadioButtonField
                                                name={`SECUNDARIA_${secundaria.uuid}`}
                                                label={secundaria.questao}
                                                options={[
                                                  { value: "1", label: "SIM" },
                                                  { value: "0", label: "NÃO" },
                                                ]}
                                                modoTabela={true}
                                                validate={requiredSaldoTotalZero(
                                                  required,
                                                )}
                                                disabled={saldoTotalZero}
                                              />
                                            )}
                                          </td>
                                        )}

                                        <td className="">
                                          {primaria && (
                                            <RadioButtonField
                                              name={`PRIMARIA_${primaria.uuid}`}
                                              label={primaria.questao}
                                              options={[
                                                { value: "1", label: "SIM" },
                                                { value: "0", label: "NÃO" },
                                              ]}
                                              modoTabela={true}
                                              validate={requiredSaldoTotalZero(
                                                required,
                                              )}
                                              disabled={saldoTotalZero}
                                            />
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>

                              <Field
                                component={TextArea}
                                label="Observações da Conferência"
                                name={`observacoes_conferencia`}
                                placeholder="Descreva as observações das conferências"
                                disabled={saldoTotalZero}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="row">
                              <div className="col mt-5 text-center">
                                <p>
                                  Não há questões para conferência cadastradas
                                  para esse produto, por favor acesse a área de{" "}
                                  <strong>Questões por Produto</strong> e
                                  atribua questões.
                                </p>
                                <p>
                                  <strong>Salve o rascunho</strong> da Ficha de
                                  Recebimento para não perder as informações
                                  inseridas até o momento.
                                </p>
                              </div>
                            </div>

                            <div className="row my-5">
                              <div className="col d-flex justify-content-center">
                                <Botao
                                  texto="Ir para Atribuição de Questões por Produto"
                                  type={BUTTON_TYPE.BUTTON}
                                  style={BUTTON_STYLE.GREEN_OUTLINE}
                                  onClick={() => setShowModalAtribuir(true)}
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </section>

                      <section id="ocorrencias">
                        <div className="col-6">
                          <RadioButtonField
                            name="houve_ocorrencia"
                            label="Houve Ocorrência(s) no Recebimento?"
                            options={[
                              { value: "1", label: "SIM" },
                              { value: "0", label: "NÃO" },
                            ]}
                            disabled={algumZero}
                            defaultValue={algumZero ? "1" : undefined}
                          />
                        </div>
                        {values?.houve_ocorrencia === "1" && (
                          <>
                            <FormOcorrencia
                              ocorrenciasCount={ocorrenciasCount}
                              setOcorrenciasCount={setOcorrenciasCount}
                              values={values}
                            />
                            <div className="row mt-3">
                              <div className="col-12 d-flex justify-content-center">
                                <Botao
                                  texto="+ Adicionar Ocorrência"
                                  type={BUTTON_TYPE.BUTTON}
                                  style={BUTTON_STYLE.GREEN_OUTLINE}
                                  onClick={() =>
                                    setOcorrenciasCount(ocorrenciasCount + 1)
                                  }
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </section>

                      <section id="observacoes">
                        <div className="row">
                          <div className="col">{observacoes}</div>
                        </div>

                        <div className="row">{anexarArquivo}</div>
                      </section>
                    </Collapse>
                  )}

                  <hr />

                  <div className="mt-4 mb-4">
                    {stepAtual < ITENS_STEPS.length - 1 &&
                      reposicaoSelecionada?.tipo !== "Credito" && (
                        <div className="mt-4 mb-4">
                          <Botao
                            texto="Próximo"
                            type={BUTTON_TYPE.BUTTON}
                            style={BUTTON_STYLE.GREEN_OUTLINE}
                            className="float-end ms-3"
                            onClick={() =>
                              setStepAtual((stepAtual) => stepAtual + 1)
                            }
                            disabled={Object.keys(errors).length > 0}
                          />
                        </div>
                      )}

                    <div className="float-end">
                      <Botao
                        texto="Salvar Rascunho"
                        type={BUTTON_TYPE.BUTTON}
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                        className="ms-3"
                        disabled={!values.cronograma || !values.etapa}
                        onClick={(): void => {
                          setShowModal(true);
                        }}
                      />

                      {(stepAtual === 2 ||
                        reposicaoSelecionada?.tipo === "Credito") && (
                        <Botao
                          texto="Salvar e Assinar"
                          type={BUTTON_TYPE.SUBMIT}
                          style={BUTTON_STYLE.GREEN}
                          className="ms-3"
                          disabled={
                            ((!values.reposicao_cronograma ||
                              values.reposicao_cronograma === "Repor") &&
                              !questoesPrimarias?.length) ||
                            (values.reposicao_cronograma === "Credito" &&
                              (!values.cronograma || !values.etapa)) ||
                            Object.keys(errors).length > 0
                          }
                        />
                      )}
                    </div>

                    {stepAtual > 0 && (
                      <div className="mt-4 mb-4">
                        <Botao
                          texto="Anterior"
                          type={BUTTON_TYPE.BUTTON}
                          style={BUTTON_STYLE.GREEN_OUTLINE}
                          className="float-end ms-3"
                          onClick={() =>
                            setStepAtual((stepAtual) => stepAtual - 1)
                          }
                        />
                      </div>
                    )}
                  </div>

                  <ModalAssinaturaUsuario
                    show={showModalAssinatura}
                    handleClose={() => setShowModalAssinatura(false)}
                    handleSim={(password: string) => {
                      assinarFichaRecebimento(
                        values as FichaRecebimentoPayload,
                        paginaAnterior,
                        password,
                      );
                    }}
                    loading={carregando}
                    titulo="Assinar Ficha de Recebimento"
                    segundoTitulo="Assinatura do Responsável pelo Recebimento"
                    texto=" Você confirma o preenchimento correto de todas 
                  as informações solicitadas na ficha de recebimento?"
                    textoBotao="Sim, Assinar Ficha"
                  />
                </form>
              );
            }}
          />
        </div>
      </div>
    </Spin>
  );
};
