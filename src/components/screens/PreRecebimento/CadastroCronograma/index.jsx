import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import HTTP_STATUS from "http-status-codes";
import "./styles.scss";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { Field, Form, FormSpy } from "react-final-form";
import InputText from "src/components/Shareable/Input/InputText";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import AutoCompleteField from "src/components/Shareable/AutoCompleteField";
import { getNomesDistribuidores } from "src/services/logistica.service";
import Select from "src/components/Shareable/Select";
import Label from "src/components/Shareable/Label";
import {
  cadastraCronograma,
  editaCronograma,
  getCronograma,
  getRascunhos,
  getUnidadesDeMedidaLogistica,
} from "src/services/cronograma.service";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { useNavigate } from "react-router-dom";
import {
  CRONOGRAMA_ENTREGA,
  PRE_RECEBIMENTO,
  CADASTRO_CRONOGRAMA,
  EDITAR,
} from "src/configs/constants";
import Rascunhos from "../RascunhosCronograma";
import "../CronogramaEntrega/styles.scss";
import {
  required,
  composeValidators,
  decimalMonetario,
} from "src/helpers/fieldValidators";
import { exibeError, formataMilharDecimal } from "src/helpers/utilities";
import { getEmpresasCronograma } from "src/services/terceirizada.service";
import { ModalAssinaturaUsuario } from "src/components/Shareable/ModalAssinaturaUsuario";
import { MSG_SENHA_INVALIDA } from "src/components/screens/helper";
import FormEtapa from "../../../PreRecebimento/FormEtapa";
import { onChangeEtapas } from "src/components/PreRecebimento/FormEtapa/helper";
import FormRecebimento from "src/components/PreRecebimento/FormRecebimento";
import {
  getListaFichasTecnicasSimplesAprovadas,
  getDadosCronogramaFichaTecnica,
} from "src/services/fichaTecnica.service";
import {
  stringNaoVaziaOuUndefined,
  numberToStringDecimal,
  numberToStringDecimalMonetario,
} from "src/helpers/parsers";
import {
  formataPayload,
  geraOptionsFichasTecnicas,
  getEmpresaFiltrado,
  getOpcoesContrato,
  validaRascunho,
} from "./helpers";
import { getListaTiposEmbalagens } from "../../../../services/qualidade.service";
import TagLeveLeite from "src/components/Shareable/PreRecebimento/TagLeveLeite";
import { ASelect } from "src/components/Shareable/MakeField";

export default () => {
  const [carregando, setCarregando] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [collapse, setCollapse] = useState([]);

  const [fichasTecnicas, setFichasTecnicas] = useState([{}]);
  const [unidadesMedidaOptions, setUnidadesMedidaOptions] = useState([{}]);
  const [tiposEmbalagemOptions, setTiposEmbalagemOptions] = useState([{}]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState(undefined);
  const [contratoSelecionado, setContratoSelecionado] = useState(undefined);
  const [unidadeSelecionada, setUnidadeSelecionada] = useState({});
  const [fichaTecnicaSelecionada, setFichaTecnicaSelecionada] = useState();

  const [etapas, setEtapas] = useState([{}]);
  const [recebimentos, setRecebimentos] = useState([{}]);
  const [armazens, setArmazens] = useState([{}]);
  const [fornecedores, setFornecedores] = useState([{}]);
  const navigate = useNavigate();
  const [listaRascunhos, setListaRascunhos] = useState(null);
  const [duplicados, setDuplicados] = useState([]);
  const [restante, setRestante] = useState(undefined);
  const [edicao, setEdicao] = useState(false);
  const [cronograma, setCronograma] = useState({});

  const [initialValues, setInitialValues] = useState();

  const toggleCollapse = (index) => {
    setCollapse({
      [index]: !collapse[index],
    });
  };

  const salvarCronograma = async (values, rascunho) => {
    setCarregando(true);

    let payload = formataPayload(
      values,
      rascunho,
      empresaSelecionada,
      fichaTecnicaSelecionada,
      etapas,
      recebimentos,
    );

    if (!rascunho) {
      payload["password"] = values["password"];
    }

    try {
      let response = edicao
        ? await editaCronograma(payload, cronograma.uuid)
        : await cadastraCronograma(payload);
      if (response.status === 201 || response.status === 200) {
        if (rascunho) {
          toastSuccess("Rascunho salvo com sucesso!");
          navigate(
            `/${PRE_RECEBIMENTO}/${CADASTRO_CRONOGRAMA}/${EDITAR}/?uuid=${response.data.uuid}`,
          );
        } else {
          toastSuccess(
            "Cadastro de Cronograma salvo e enviado para aprovação!",
          );
          setShowModal(false);
          navigate(`/${PRE_RECEBIMENTO}/${CRONOGRAMA_ENTREGA}`);
        }
      } else {
        toastError("Ocorreu um erro ao salvar o Cronograma");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toastError(MSG_SENHA_INVALIDA);
      } else {
        exibeError(error, "Ocorreu um erro ao salvar o Cronograma");
      }
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");

    if (uuid) {
      setEdicao(true);
    }

    carregaPagina(uuid);
  }, []);

  const carregaPagina = async (uuid) => {
    try {
      setCarregando(true);
      await Promise.all([
        buscaArmazens(),
        buscaFornecedores(),
        buscaFichasTecnicas(),
        buscaUnidadesMedida(),
        buscaRascunhos(),
        buscaTiposEmbalagens(),
      ]);

      if (uuid) {
        const responseCronograma = await getCronograma(uuid);
        setInitialValues(geraInitialValues(responseCronograma.data));
      }
    } catch (error) {
      exibeError(error, "Ocorreu um erro ao carregar o Cronograma");
    } finally {
      setCarregando(false);
    }
  };

  const buscaArmazens = async () => {
    const response = await getNomesDistribuidores();
    setArmazens(
      response.data.results.map((armazem) => ({
        nome: armazem.nome_fantasia,
        uuid: armazem.uuid,
      })),
    );
  };

  const buscaFornecedores = async () => {
    const response = await getEmpresasCronograma();
    setFornecedores(
      response.data.results.map((fornecedor) => ({
        uuid: fornecedor.uuid,
        key: fornecedor.uuid,
        value: fornecedor.nome_fantasia,
        contratos: fornecedor.contratos,
      })),
    );
  };

  const buscaFichasTecnicas = async () => {
    const response = await getListaFichasTecnicasSimplesAprovadas();
    setFichasTecnicas(response.data.results);
  };

  const buscaUnidadesMedida = async () => {
    const response = await getUnidadesDeMedidaLogistica();
    setUnidadesMedidaOptions(response.data.results);
  };

  const buscaTiposEmbalagens = async () => {
    const response = await getListaTiposEmbalagens();
    setTiposEmbalagemOptions(response.data.results);
  };

  const buscaRascunhos = async () => {
    try {
      const response = await getRascunhos();
      if (response.status === HTTP_STATUS.OK) {
        setListaRascunhos(response.data.results);
      }
    } catch {
      toastError("Ocorreu um erro ao tentar carregar a lista de rascunhos.");
    }
  };

  const geraInitialValues = (cronograma) => {
    const programacoesDeRecebimento =
      cronograma.programacoes_de_recebimento.reverse();
    setEtapas(cronograma.etapas);
    setRecebimentos(programacoesDeRecebimento);
    setEmpresaSelecionada(cronograma.empresa);
    setContratoSelecionado(cronograma.contrato);
    setFichaTecnicaSelecionada(cronograma.ficha_tecnica);

    const cronogramaValues = {};
    cronogramaValues["empresa"] = cronograma.empresa?.nome_fantasia;
    cronogramaValues["contrato"] = cronograma.contrato?.uuid;
    cronogramaValues["numero_processo"] = cronograma.contrato?.processo;
    cronogramaValues["numero_pregao_chamada_publica"] =
      cronograma.contrato?.numero_pregao ||
      cronograma.contrato?.numero_chamada_publica;
    cronogramaValues["ata"] = cronograma.contrato?.ata;
    cronogramaValues["quantidade_total"] = formataMilharDecimal(
      cronograma.qtd_total_programada,
    );
    cronogramaValues["unidade_medida"] = cronograma.unidade_medida?.uuid;
    cronogramaValues["produto"] = cronograma.produto?.uuid;
    cronogramaValues["armazem"] = cronograma.armazem?.uuid;
    cronogramaValues["ficha_tecnica"] =
      `${cronograma.ficha_tecnica?.numero} - ${cronograma.ficha_tecnica?.produto.nome}`;
    cronogramaValues["marca"] = cronograma.ficha_tecnica?.marca.nome;
    cronogramaValues["peso_liquido_embalagem_primaria"] = numberToStringDecimal(
      cronograma.ficha_tecnica?.peso_liquido_embalagem_primaria,
    );
    cronogramaValues["unidade_medida_primaria"] =
      cronograma.ficha_tecnica?.unidade_medida_primaria?.uuid;
    cronogramaValues["peso_liquido_embalagem_secundaria"] =
      numberToStringDecimal(
        cronograma.ficha_tecnica?.peso_liquido_embalagem_secundaria,
      );
    cronogramaValues["unidade_medida_secundaria"] =
      cronograma.ficha_tecnica?.unidade_medida_secundaria?.uuid;
    cronogramaValues["volume_embalagem_primaria"] = numberToStringDecimal(
      cronograma.ficha_tecnica?.volume_embalagem_primaria,
    );
    cronogramaValues["unidade_medida_volume_primaria"] =
      cronograma.ficha_tecnica?.unidade_medida_volume_primaria?.uuid;
    cronogramaValues["tipo_embalagem_secundaria"] =
      cronograma.tipo_embalagem_secundaria?.uuid;
    cronogramaValues["custo_unitario_produto"] = numberToStringDecimalMonetario(
      cronograma.custo_unitario_produto,
    );
    cronogramaValues["numero"] = cronograma.numero;
    cronogramaValues["uuid"] = cronograma.uuid;
    cronogramaValues["observacoes"] = cronograma.observacoes;

    const etapaValues = {};
    cronograma.etapas.forEach((etapa, i) => {
      etapaValues[`empenho_${i}`] = stringNaoVaziaOuUndefined(
        etapa.numero_empenho,
      );
      etapaValues[`qtd_total_empenho_${i}`] = formataMilharDecimal(
        etapa.qtd_total_empenho,
      );
      etapaValues[`etapa_${i}`] = stringNaoVaziaOuUndefined(etapa.etapa);
      etapaValues[`parte_${i}`] = stringNaoVaziaOuUndefined(etapa.parte);
      etapaValues[`data_programada_${i}`] = stringNaoVaziaOuUndefined(
        etapa.data_programada,
      );
      etapaValues[`quantidade_${i}`] = formataMilharDecimal(etapa.quantidade);
      etapaValues[`total_embalagens_${i}`] = stringNaoVaziaOuUndefined(
        etapa.total_embalagens,
      );
    });

    const recebimentoValues = {};
    programacoesDeRecebimento.forEach((recebimento, i) => {
      recebimentoValues[`data_recebimento_${i}`] = stringNaoVaziaOuUndefined(
        recebimento.data_programada,
      );
      recebimentoValues[`tipo_recebimento_${i}`] = stringNaoVaziaOuUndefined(
        recebimento.tipo_carga,
      );
    });

    setCronograma(cronogramaValues);

    return {
      ...cronogramaValues,
      ...etapaValues,
      ...recebimentoValues,
    };
  };

  const onChangeFormSpy = async (changes, form) => {
    if (changes.values.empresa) selecionaEmpresa(changes.values.empresa);
    if (changes.values.contrato) selecionaContrato(changes.values);
    if (changes.values.unidade_medida)
      selecionaUnidade(changes.values.unidade_medida);
    if (changes.values.ficha_tecnica)
      await selecionaFichaTecnica(changes.values, form);

    onChangeEtapas(changes, etapas, setRestante, setDuplicados);
  };

  const selecionaEmpresa = (nomeEmpresa) => {
    if (!empresaSelecionada || empresaSelecionada.uuid !== nomeEmpresa) {
      let fornecedor = fornecedores.find((f) => f.value === nomeEmpresa);
      setEmpresaSelecionada(fornecedor);
    }
  };

  const selecionaContrato = (values) => {
    let uuidContrato = values.contrato;
    if (!contratoSelecionado || contratoSelecionado.uuid !== uuidContrato) {
      let contrato = empresaSelecionada.contratos.find(
        (c) => c.uuid === uuidContrato,
      );

      values.numero_processo = contrato.processo;
      values.numero_pregao_chamada_publica =
        contrato.numero_pregao || contrato.numero_chamada_publica;
      values.ata = contrato.ata;

      setContratoSelecionado(contrato);
    }
  };

  const selecionaUnidade = (uuidUnidade) => {
    if (!unidadeSelecionada || unidadeSelecionada.uuid !== uuidUnidade) {
      let unidade = unidadesMedidaOptions.find((u) => u.uuid === uuidUnidade);
      setUnidadeSelecionada(unidade);
    }
  };

  const selecionaFichaTecnica = async (values, form) => {
    const numeroFicha = values.ficha_tecnica?.split("-")[0].trim();
    if (
      !fichaTecnicaSelecionada ||
      fichaTecnicaSelecionada.numero !== numeroFicha
    ) {
      let uuidFicha = fichasTecnicas.find(
        (f) => f.numero === numeroFicha,
      )?.uuid;

      if (uuidFicha) {
        setCarregando(true);

        const response = await getDadosCronogramaFichaTecnica(uuidFicha);
        const fichaTecnica = response.data;

        form.change("marca", fichaTecnica.marca?.nome);
        form.change(
          "peso_liquido_embalagem_primaria",
          numberToStringDecimal(fichaTecnica.peso_liquido_embalagem_primaria),
        );
        form.change(
          "unidade_medida_primaria",
          fichaTecnica.unidade_medida_primaria?.uuid,
        );
        form.change(
          "peso_liquido_embalagem_secundaria",
          numberToStringDecimal(fichaTecnica.peso_liquido_embalagem_secundaria),
        );
        form.change(
          "unidade_medida_secundaria",
          fichaTecnica.unidade_medida_secundaria?.uuid,
        );
        form.change(
          "volume_embalagem_primaria",
          numberToStringDecimal(fichaTecnica.volume_embalagem_primaria),
        );
        form.change(
          "unidade_medida_volume_primaria",
          fichaTecnica.unidade_medida_volume_primaria?.uuid,
        );

        setFichaTecnicaSelecionada(fichaTecnica);
        setCarregando(false);
      }
    }
  };

  return (
    <>
      {!edicao && <Rascunhos listaRascunhos={listaRascunhos} />}
      <Spin tip="Carregando..." spinning={carregando}>
        <div className="card mt-3 card-cadastro-cronograma">
          <div className="card-body cadastro-cronograma">
            <Form
              onSubmit={() => setShowModal(true)}
              initialValues={initialValues}
              render={({ form, handleSubmit, values, errors }) => (
                <form onSubmit={handleSubmit}>
                  <FormSpy
                    subscription={{ values: true, active: true, valid: true }}
                    onChange={(changes) => onChangeFormSpy(changes, form)}
                  />
                  <div className="row">
                    {edicao && (
                      <div className="col text-end">
                        <p>
                          <b>Nº do Cronograma: </b>

                          <span className="head-green">
                            {cronograma.numero}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="row">
                    <div className="col-8">
                      <Field
                        dataTestId="input-empresa"
                        className="input-cronograma"
                        component={AutoCompleteField}
                        options={getEmpresaFiltrado(
                          fornecedores,
                          values.empresa,
                        )}
                        label="Pesquisar Empresa"
                        name="empresa"
                        required
                        validate={required}
                        placeholder={"Selecione uma Empresa Cadastrada"}
                      />
                    </div>
                    <div className="col-4">
                      <label className="col-form-label">
                        <span className="required-asterisk">* </span>
                        Nº do Contrato
                      </label>
                      <Field
                        className="input-cronograma"
                        component={ASelect}
                        naoDesabilitarPrimeiraOpcao
                        name="contrato"
                        required
                        validate={required}
                        disabled={!values.empresa}
                        dataTestId="select-contrato"
                      >
                        <Option value="" key={0}>
                          <label>Selecione um Contrato</label>
                        </Option>
                        {getOpcoesContrato(empresaSelecionada)?.map((e) => (
                          <Option value={e.uuid} key={e.uuid}>
                            <div className="d-flex justify-content-between align-items-center">
                              {e.nome}
                              {e.programa === "LEVE_LEITE" && <TagLeveLeite />}
                            </div>
                          </Option>
                        ))}
                      </Field>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <Field
                        className="input-cronograma"
                        component={InputText}
                        label="Nº do Pregão Eletrônico/Chamada Pública"
                        name="numero_pregao_chamada_publica"
                        validate={required}
                        disabled={true}
                      />
                    </div>
                    <div className="col-4">
                      <Field
                        className="input-cronograma"
                        component={InputText}
                        label="Nº ATA"
                        name="ata"
                        disabled={true}
                      />
                    </div>
                    <div className="col-4">
                      <Field
                        className="input-cronograma"
                        component={InputText}
                        label="Nº do Processo SEI - Contratos"
                        name="numero_processo"
                        validate={required}
                        disabled={true}
                      />
                    </div>
                  </div>

                  {values.empresa && values.contrato && (
                    <div className="accordion mt-1" id="accordionCronograma">
                      <div className="card mt-3">
                        <div
                          className={`card-header card-tipo`}
                          id={`heading_1`}
                        >
                          <div className="row card-header-content">
                            <span className="col-11 nome-alimento">
                              Dados do Produto
                            </span>
                            <div className="col-1 align-self-center">
                              <button
                                onClick={() => toggleCollapse(1)}
                                className="btn btn-link btn-block text-end px-0"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#collapse_1`}
                                aria-expanded="true"
                                aria-controls={`collapse_1`}
                              >
                                <span className="span-icone-toogle">
                                  <i
                                    className={
                                      collapse[1]
                                        ? "fas fa-chevron-up"
                                        : "fas fa-chevron-down"
                                    }
                                  />
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>

                        <div
                          id={`collapse_1`}
                          className="collapse"
                          aria-labelledby="headingOne"
                          data-bs-parent="#accordionCronograma"
                        >
                          <div className="card-body">
                            <div className="row">
                              <div className="col-6">
                                <label className="col-form-label">
                                  <span className="required-asterisk">* </span>
                                  Ficha Técnica e Produto
                                </label>
                                <Field
                                  className="input-cronograma"
                                  component={ASelect}
                                  naoDesabilitarPrimeiraOpcao
                                  name="ficha_tecnica"
                                  required
                                  validate={required}
                                  disabled={!values.empresa}
                                  dataTestId="select-div"
                                  showSearch
                                >
                                  <Option value="" key={0}>
                                    <label>
                                      Selecione uma Ficha Técnica de Produto
                                    </label>
                                  </Option>
                                  {geraOptionsFichasTecnicas(
                                    fichasTecnicas,
                                    empresaSelecionada,
                                  )?.map((e) => (
                                    <Option value={e.nome} key={e.uuid}>
                                      <div className="d-flex justify-content-between align-items-center">
                                        {e.nome}
                                        {e.programa === "LEVE_LEITE" && (
                                          <TagLeveLeite />
                                        )}
                                      </div>
                                    </Option>
                                  ))}
                                </Field>
                              </div>
                              <div className="col-6">
                                <Field
                                  className="input-cronograma"
                                  component={InputText}
                                  label="Marca"
                                  name="marca"
                                  required
                                  disabled
                                />
                              </div>

                              <div className="row mt-3">
                                <div className="row">
                                  <div className="col-6">
                                    <Label
                                      content="Embalagem Primária"
                                      required
                                    />
                                  </div>

                                  <div className="col-6">
                                    <Label
                                      content="Embalagem Secundária"
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="row">
                                  <div className="col-3">
                                    <Field
                                      className="input-cronograma"
                                      component={InputText}
                                      name={`peso_liquido_embalagem_primaria`}
                                      required
                                      disabled
                                    />
                                  </div>

                                  <div className="col-3">
                                    <Field
                                      className="input-cronograma"
                                      component={Select}
                                      options={unidadesMedidaOptions}
                                      name={`unidade_medida_primaria`}
                                      required
                                      disabled
                                    />
                                  </div>

                                  <div className="col-3">
                                    <Field
                                      className="input-cronograma"
                                      component={InputText}
                                      name={`peso_liquido_embalagem_secundaria`}
                                      required
                                      disabled
                                    />
                                  </div>

                                  <div className="col-3">
                                    <Field
                                      className="input-cronograma"
                                      component={Select}
                                      options={unidadesMedidaOptions}
                                      name={`unidade_medida_secundaria`}
                                      required
                                      disabled
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="col-6">
                                <Field
                                  className="input-cronograma"
                                  component={Select}
                                  naoDesabilitarPrimeiraOpcao
                                  options={[
                                    { nome: "Selecione o Armazém", uuid: "" },
                                    ...armazens,
                                  ]}
                                  label="Armazém"
                                  name="armazem"
                                  required
                                  validate={required}
                                />
                              </div>

                              <div className="col-3">
                                <Field
                                  className="input-cronograma"
                                  component={InputText}
                                  label="Quantidade Total Programada"
                                  name="quantidade_total"
                                  disabled={false}
                                  agrupadorMilharComDecimal
                                  required
                                  placeholder="Informe a Quantidade Total"
                                  validate={required}
                                />
                              </div>
                              <div className="col-3">
                                <Field
                                  className="input-cronograma"
                                  component={Select}
                                  naoDesabilitarPrimeiraOpcao
                                  options={[
                                    { nome: "Selecione a Unidade", uuid: "" },
                                    ...unidadesMedidaOptions,
                                  ]}
                                  label="Unidade de Medida"
                                  name="unidade_medida"
                                  required
                                  validate={required}
                                />
                              </div>
                            </div>

                            <div className="row mt-3">
                              <div className="col-4">
                                <Field
                                  className="input-cronograma"
                                  component={Select}
                                  naoDesabilitarPrimeiraOpcao
                                  options={[
                                    {
                                      nome: "Selecione a Embalagem",
                                      uuid: "",
                                    },
                                    ...tiposEmbalagemOptions,
                                  ]}
                                  label="Tipo de Embalagem Secundária"
                                  name={`tipo_embalagem_secundaria`}
                                  validate={required}
                                  required
                                />
                              </div>
                              <div className="col-4">
                                <Field
                                  className="input-cronograma"
                                  component={InputText}
                                  name={`custo_unitario_produto`}
                                  label="Custo Unitário do Produto"
                                  placeholder="Informe o Custo Unitário"
                                  required
                                  proibeLetras
                                  prefix="R$"
                                  validate={composeValidators(
                                    required,
                                    decimalMonetario,
                                  )}
                                />
                              </div>
                              {values.volume_embalagem_primaria && (
                                <div className="col-8">
                                  <div className="row">
                                    <div className="col">
                                      <Label
                                        content="Volume da Embalagem Primária"
                                        required
                                      />
                                    </div>
                                  </div>

                                  <div className="row">
                                    <div className="col">
                                      <Field
                                        className="input-cronograma"
                                        component={InputText}
                                        name={`volume_embalagem_primaria`}
                                        required
                                        disabled
                                      />
                                    </div>

                                    <div className="col">
                                      <Field
                                        className="input-cronograma"
                                        component={Select}
                                        options={unidadesMedidaOptions}
                                        name={`unidade_medida_volume_primaria`}
                                        required
                                        disabled
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="subtitulo">
                              Cronograma das Entregas
                            </div>

                            <hr className="linha-verde" />

                            <FormEtapa
                              form={form}
                              etapas={etapas}
                              setEtapas={setEtapas}
                              values={values}
                              errors={errors}
                              duplicados={duplicados}
                              restante={restante}
                              unidadeMedida={unidadeSelecionada}
                            />
                          </div>
                        </div>
                      </div>

                      <FormRecebimento
                        values={values}
                        form={form}
                        etapas={etapas}
                        recebimentos={recebimentos}
                        setRecebimentos={setRecebimentos}
                      />
                    </div>
                  )}

                  <div className="row mt-2">
                    <div className="col-12">
                      <Field
                        component={TextArea}
                        label="Observações"
                        name="observacoes"
                      />
                    </div>
                  </div>

                  <hr />

                  <div className="mt-4 mb-4">
                    <Botao
                      texto="Assinar e Enviar Cronograma"
                      type={BUTTON_TYPE.SUBMIT}
                      style={BUTTON_STYLE.GREEN}
                      className="float-end ms-3"
                      disabled={restante !== 0}
                    />
                    <Botao
                      texto="Salvar Rascunho"
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      className="float-end ms-3"
                      onClick={() => salvarCronograma(values, true)}
                      disabled={validaRascunho(values)}
                    />
                  </div>
                  <ModalAssinaturaUsuario
                    titulo="Assinar Cronograma"
                    texto="Você confirma a assinatura digital deste cronograma de entrega"
                    show={showModal}
                    loading={carregando}
                    handleClose={() => {
                      setShowModal(false);
                      setCarregando(false);
                    }}
                    handleSim={(password) => {
                      values["password"] = password;
                      salvarCronograma(values, false);
                    }}
                  />
                </form>
              )}
            />
          </div>
        </div>
      </Spin>
    </>
  );
};
