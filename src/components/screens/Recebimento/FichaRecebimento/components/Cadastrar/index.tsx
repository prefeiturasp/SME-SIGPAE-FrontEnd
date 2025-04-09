import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { Field, Form } from "react-final-form";
import { FormApi } from "final-form";
import moment from "moment";

import {
  FICHA_RECEBIMENTO,
  RECEBIMENTO,
  QUESTOES_POR_PRODUTO,
} from "configs/constants";
import {
  getListaCronogramasPraFichaRecebimento,
  getCronogramaPraCadastroRecebimento,
} from "services/cronograma.service";
import { cadastraRascunhoFichaRecebimento } from "services/fichaRecebimento.service";
import AutoCompleteSelectField from "components/Shareable/AutoCompleteSelectField";
import Select from "components/Shareable/Select";
import MultiSelect from "components/Shareable/FinalForm/MultiSelect";
import InputText from "components/Shareable/Input/InputText";
import { TextArea } from "components/Shareable/TextArea/TextArea";
import { InputComData } from "components/Shareable/DatePicker";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "components/Shareable/Botao/constants";
import Botao from "components/Shareable/Botao";
import StepsSigpae from "components/Shareable/StepsSigpae";
import Collapse, { CollapseControl } from "components/Shareable/Collapse";
import ModalGenerico from "components/Shareable/ModalGenerico";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import RadioButtonField from "components/Shareable/RadioButtonField";
import Label from "components/Shareable/Label";
import InputFileField from "components/Shareable/InputFileField";
import { getListaFiltradaAutoCompleteSelect } from "helpers/autoCompleteSelect";
import { required } from "helpers/fieldValidators";
import { exibeError } from "helpers/utilities";
import { deletaValues } from "helpers/formHelper";
import { stringToBoolean } from "helpers/parsers";
import {
  Arquivo,
  ArquivoForm,
  CronogramaSimples,
} from "interfaces/pre_recebimento.interface";

import {
  CronogramaFicha,
  DocumentoFicha,
  FichaRecebimentoPayload,
  QuestoesPayload,
  VeiculoPayload,
} from "../../interfaces";

import "./styles.scss";
import { detalharQuestoesPorCronograma } from "services/recebimento/questoesConferencia.service";
import { QuestaoConferenciaSimples } from "interfaces/recebimento.interface";

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
  const [carregando, setCarregando] = useState<boolean>(true);
  const [cronogramas, setCronogramas] = useState<Array<CronogramaSimples>>([]);
  const [collapse1, setCollapse1] = useState<CollapseControl>({ 0: true });
  const [collapse2, setCollapse2] = useState<CollapseControl>({ 0: true });
  const [collapse3, setCollapse3] = useState<CollapseControl>({ 0: true });
  const [cronograma, setCronograma] = useState<CronogramaFicha>(
    {} as CronogramaFicha
  );
  const [showModal, setShowModal] = useState(false);
  const [showModalAtribuir, setShowModalAtribuir] = useState(false);
  const [stepAtual, setStepAtual] = useState(0);
  const [veiculos, setVeiculos] = useState([{}]);
  const [arquivos, setArquivos] = useState<Arquivo[]>([]);
  const [questoesPrimarias, setQuestoesPrimarias] = useState<
    QuestaoConferenciaSimples[]
  >([]);
  const [questoesSecundarias, setQuestoesSecundarias] = useState<
    QuestaoConferenciaSimples[]
  >([]);

  const onSubmit = (): void => {};

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

  const formataPayloadQuestoes = (
    values: Record<string, any>,
    listaQuestoes: QuestaoConferenciaSimples[],
    tipoQuestao: string
  ): QuestoesPayload[] => {
    return listaQuestoes
      .map((questao) => {
        let resposta = stringToBoolean(values[questao.uuid]);
        return resposta !== undefined
          ? {
              questao_conferencia: questao.uuid,
              resposta,
              tipo_questao: tipoQuestao,
            }
          : null;
      })
      .filter((x) => x !== null);
  };

  const formataPayload = (
    values: Record<string, any>
  ): FichaRecebimentoPayload => {
    let payloadQuestoes: QuestoesPayload[] = [
      ...formataPayloadQuestoes(values, questoesPrimarias, "PRIMARIA"),
      ...formataPayloadQuestoes(values, questoesSecundarias, "SECUNDARIA"),
    ];

    let payload: FichaRecebimentoPayload = {
      etapa: values.etapa,
      data_entrega: values.data_entrega
        ? moment(values.data_entrega, "DD/MM/YYYY").format("YYYY-MM-DD")
        : undefined,
      documentos_recebimento: values.documentos_recebimento?.map(
        (x: DocumentoFicha) => x.uuid
      ),
      lote_fabricante_de_acordo: stringToBoolean(
        values.lote_fabricante_de_acordo as string
      ),
      lote_fabricante_divergencia: values.lote_fabricante_divergencia,
      data_fabricacao_de_acordo: stringToBoolean(
        values.data_fabricacao_de_acordo as string
      ),
      data_fabricacao_divergencia: values.data_fabricacao_divergencia,
      data_validade_de_acordo: stringToBoolean(
        values.data_validade_de_acordo as string
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
                temperatura_produto: values[`temperatura_produto_${index}`],
                placa: values[`placa_${index}`],
                lacre: values[`lacre_${index}`],
                numero_sif_sisbi_sisp: values[`numero_sif_sisbi_sisp_${index}`],
                numero_nota_fiscal: values[`numero_nota_fiscal_${index}`],
                quantidade_nota_fiscal:
                  values[`quantidade_nota_fiscal_${index}`],
                embalagens_nota_fiscal:
                  values[`embalagens_nota_fiscal_${index}`],
                quantidade_recebida: values[`quantidade_recebida_${index}`],
                embalagens_recebidas: values[`embalagens_recebidas_${index}`],
                estado_higienico_adequado: stringToBoolean(
                  values[`estado_higienico_adequado_${index}`]
                ),
                termografo: stringToBoolean(values[`termografo_${index}`]),
              } as VeiculoPayload)
          )
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

  const salvarRascunho = async (
    values: FichaRecebimentoPayload,
    redirecionarPara: () => void
  ): Promise<void> => {
    setCarregando(true);

    let payload: FichaRecebimentoPayload = formataPayload(values);

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

  const optionsCronograma = (values: Record<string, any>) =>
    getListaFiltradaAutoCompleteSelect(
      cronogramas.map(({ numero }) => numero),
      values.cronograma,
      true
    );

  const atualizarCamposCronograma = async (value: string, form: FormApi) => {
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
        setCronograma({} as CronogramaFicha);
        form.reset({});
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
    const arquivosAtualizados = files.map((arquivo: ArquivoForm) => {
      return {
        nome: arquivo.nome,
        arquivo: arquivo.base64,
      };
    });

    setArquivos(arquivosAtualizados);
  };

  const removeFiles = (index: number): void => {
    let newFiles = [...arquivos];
    newFiles.splice(index, 1);
    setArquivos(newFiles);
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-cadastro-ficha-recebimento">
        <div className="card-body cadastro-ficha-recebimento">
          <Form
            onSubmit={onSubmit}
            initialValues={{}}
            render={({ handleSubmit, values, form, errors }) => (
              <form onSubmit={handleSubmit}>
                <ModalGenerico
                  show={showModal}
                  handleClose={() => setShowModal(false)}
                  loading={carregando}
                  handleSim={() =>
                    salvarRascunho(
                      values as FichaRecebimentoPayload,
                      paginaAnterior
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
                      paginaQuestoesPorProduto
                    )
                  }
                  titulo="Salvar Rascunho e Atribuir Questões"
                  texto="Deseja salvar o rascunho e ir para a página de Atribuição
                  de Questões por Produto?"
                  textoBotaoSim="Salvar e Ir para Página"
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
                            className="input-busca-produto"
                            placeholder="Digite um cronograma "
                            required
                            validate={required}
                            onChange={(value: string) => {
                              atualizarCamposCronograma(value, form);
                            }}
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
                                <th className="borda-crono">Data Programada</th>
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
                            required
                            validate={required}
                            onChangeEffect={(
                              e: ChangeEvent<HTMLInputElement>
                            ) => {
                              atualizarCamposEtapa(e.target.value, form);
                            }}
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
                            placeholder="Selecionar a Data"
                            required
                            validate={required}
                            writable={false}
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
                            placeholder="Selecione os Laudos"
                            required
                            validate={required}
                          />
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
                                      </tr>
                                    );
                                  }
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
                                validate={required}
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
                                validate={required}
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
                                validate={required}
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
                            validate={required}
                          />
                        </div>
                        <div className="col-6">
                          <Field
                            component={InputText}
                            label="Nº de Paletes"
                            name={`numero_paletes`}
                            placeholder="Digite o número de paletes"
                            required
                            validate={required}
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
                            validate={required}
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
                            validate={required}
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
                            validate={required}
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
                            validate={required}
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
                                    onClick={() => deletaVeiculo(index, values)}
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
                                    validate={required}
                                  />
                                </div>
                                <div className="col-3">
                                  <Field
                                    component={InputText}
                                    label="T °C (Produto)"
                                    name={`temperatura_produto_${index}`}
                                    placeholder="T °C do produto"
                                    required
                                    validate={required}
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
                                    validate={required}
                                  />
                                </div>
                                <div className="col-3">
                                  <Field
                                    component={InputText}
                                    label="Nº SIF, SISBI ou SISP"
                                    name={`numero_sif_sisbi_sisp_${index}`}
                                    placeholder="Digite o número"
                                    required
                                    validate={required}
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
                                validate={required}
                              />
                            </div>
                            <div className="col-3">
                              <Field
                                component={InputText}
                                label="Quantidade Nota Fiscal"
                                name={`quantidade_nota_fiscal_${index}`}
                                placeholder="Digite a qtde da nota"
                                required
                                validate={required}
                              />
                            </div>
                            <div className="col-3">
                              <Field
                                component={InputText}
                                label="Embalagens Nota Fiscal"
                                name={`embalagens_nota_fiscal_${index}`}
                                placeholder="Digite a qtde de embalagens"
                                required
                                validate={required}
                              />
                            </div>
                            <div className="col-3">
                              <Field
                                component={InputText}
                                label="Quantidade Recebida"
                                name={`quantidade_recebida_${index}`}
                                placeholder="Digite a qtde recebida"
                                required
                                validate={required}
                              />
                            </div>
                            <div className="col-3">
                              <Field
                                component={InputText}
                                label="Embalagens Recebidas"
                                name={`embalagens_recebidas_${index}`}
                                placeholder="Digite qtde recebida"
                                required
                                validate={required}
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
                            <table className="table tabela-conferencia-embalagens">
                              <thead>
                                <tr>
                                  <th className="">
                                    Conferência Embalagem Primária
                                  </th>
                                  <th className="">
                                    Conferência Embalagem Secundária
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                {Array.from({
                                  length: Math.max(
                                    questoesPrimarias.length,
                                    questoesSecundarias.length
                                  ),
                                }).map((_, index) => {
                                  const primaria = questoesPrimarias[index];
                                  const secundaria = questoesSecundarias[index];

                                  return (
                                    <tr key={index} className="">
                                      <td className="">
                                        {primaria && (
                                          <RadioButtonField
                                            name={primaria.uuid}
                                            label={primaria.questao}
                                            options={[
                                              { value: "1", label: "SIM" },
                                              { value: "0", label: "NÃO" },
                                            ]}
                                            modoTabela={true}
                                          />
                                        )}
                                      </td>

                                      <td className="">
                                        {secundaria && (
                                          <RadioButtonField
                                            name={secundaria.uuid}
                                            label={secundaria.questao}
                                            options={[
                                              { value: "1", label: "SIM" },
                                              { value: "0", label: "NÃO" },
                                            ]}
                                            modoTabela={true}
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
                                <strong>Questões por Produto</strong> e atribua
                                questões.
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

                    <section id="observacoes">
                      <div className="row">
                        <div className="col">
                          <Field
                            component={TextArea}
                            label="Descreva as observações necessárias"
                            name={`observacao`}
                            placeholder="Descreva as observações necessárias"
                          />
                        </div>
                      </div>

                      <div className="row">
                        <InputFileField
                          name="arquivo"
                          setFiles={setFiles}
                          removeFile={removeFiles}
                          toastSuccess="Documento incluído com sucesso!"
                          textoBotao="Anexar Documento"
                          helpText="Envie arquivos nos formatos: PDF, PNG, JPG ou JPEG  com até 10MB."
                        />
                      </div>
                    </section>
                  </Collapse>
                )}

                <hr />

                <div className="mt-4 mb-4">
                  {stepAtual < ITENS_STEPS.length - 1 && (
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

                  <Botao
                    texto="Salvar Rascunho"
                    type={BUTTON_TYPE.BUTTON}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    className="float-end ms-3"
                    disabled={!values.cronograma || !values.etapa}
                    onClick={(): void => {
                      setShowModal(true);
                    }}
                  />

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
              </form>
            )}
          />
        </div>
      </div>
    </Spin>
  );
};
