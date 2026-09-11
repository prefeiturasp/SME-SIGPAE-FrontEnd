import React, { useEffect, useRef, useState } from "react";
import { Spin } from "antd";
import { Field, Form, FormSpy } from "react-final-form";
import { useNavigate } from "react-router-dom";

import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import Botao from "src/components/Shareable/Botao";
import AutoCompleteSelectField from "src/components/Shareable/AutoCompleteSelectField";
import InputText from "src/components/Shareable/Input/InputText";
import { CKEditorField } from "src/components/Shareable/CKEditorField";
import { toastSuccess } from "src/components/Shareable/Toast/dialogs";
import {
  getContratosPosRecebimento,
  getCronogramaPosRecebimento,
  getCronogramasPosRecebimento,
  getEmpresasPosRecebimento,
  getFiscaisPosRecebimento,
  cadastraTermoRecebimentoDefinitivo,
} from "src/services/posRecebimento.service";
import { required } from "src/helpers/fieldValidators";
import { exibeError } from "src/helpers/utilities";
import {
  POS_RECEBIMENTO,
  TERMO_RECEBIMENTO_DEFINITIVO,
} from "src/configs/constants";

import ModalGenerico from "src/components/Shareable/ModalGenerico";
import {
  converterValorParaDecimal,
  cronogramasParaBloco,
  gerarTextoTermo,
} from "./helpers";

import "./styles.scss";

const validaTextoTermo = (value) => {
  const texto = value ? value.replace(/<[^>]*>/g, "").trim() : "";
  return texto ? undefined : "Texto do termo é obrigatório";
};

export default () => {
  const navigate = useNavigate();
  const proximoIdBloco = useRef(1);
  const [carregando, setCarregando] = useState(true);
  const [empresas, setEmpresas] = useState([]);
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
  const [contratos, setContratos] = useState([]);
  const [cronogramasDisponiveis, setCronogramasDisponiveis] = useState([]);
  const [fiscais, setFiscais] = useState([]);
  const [blocos, setBlocos] = useState([]);
  const [showModalConfirmarEnvio, setShowModalConfirmarEnvio] = useState(false);
  const [showModalCancelar, setShowModalCancelar] = useState(false);

  const formRef = useRef(null);
  const valuesRef = useRef({});
  const textoAutoGeradoRef = useRef("");

  const criarBloco = () => ({
    id: `bloco-${proximoIdBloco.current++}`,
    cronograma: "",
    produto: "",
    processoSei: "",
    unidadeMedida: "",
    unidadeMedidaAbreviacao: "",
  });

  useEffect(() => {
    setBlocos([criarBloco()]);
  }, []);

  const voltarPagina = () =>
    navigate(`/${POS_RECEBIMENTO}/${TERMO_RECEBIMENTO_DEFINITIVO}`);

  const buscarEmpresas = async () => {
    const response = await getEmpresasPosRecebimento();
    setEmpresas(response?.data?.results || []);
  };

  const buscarFiscais = async () => {
    const response = await getFiscaisPosRecebimento();
    setFiscais(response?.data?.results || []);
  };

  useEffect(() => {
    setCarregando(true);
    Promise.all([buscarEmpresas(), buscarFiscais()])
      .catch(() => {})
      .finally(() => setCarregando(false));
  }, []);

  const atualizarTextoTermo = (produtos) => {
    const form = formRef.current;
    const values = valuesRef.current;
    const novoTexto = gerarTextoTermo(produtos);
    const textoAtual = values.texto_termo || "";
    // Só regenera o texto padrão se o usuário ainda não editou manualmente.
    if (textoAtual === "" || textoAtual === textoAutoGeradoRef.current) {
      form?.change("texto_termo", novoTexto);
      textoAutoGeradoRef.current = novoTexto;
    }
  };

  const selecionaEmpresa = async (nomeFantasia) => {
    const form = formRef.current;
    setContratos([]);
    setCronogramasDisponiveis([]);
    setBlocos([criarBloco()]);
    form?.change("contrato", "");
    form?.change("processo_sei", "");
    const empresa = empresas.find((e) => e.nome_fantasia === nomeFantasia);
    setEmpresaSelecionada(empresa || null);
    if (!empresa) return;
    setCarregando(true);
    try {
      const response = await getContratosPosRecebimento(empresa.uuid);
      setContratos(response?.data?.results || []);
    } finally {
      setCarregando(false);
    }
  };

  const selecionaContrato = async (numeroContrato) => {
    const form = formRef.current;
    setBlocos([criarBloco()]);
    setCronogramasDisponiveis([]);
    const contrato = contratos.find((c) => c.numero === numeroContrato);
    form?.change("processo_sei", contrato?.processo || "");
    if (!contrato) return;
    setCarregando(true);
    try {
      const response = await getCronogramasPosRecebimento(
        contrato.uuid,
        empresaSelecionada?.uuid,
      );
      setCronogramasDisponiveis(response?.data?.results || []);
    } finally {
      setCarregando(false);
    }
  };

  const selecionaCronogramaBloco = async (blocoId, numeroCronograma) => {
    const form = formRef.current;
    form?.change(`produto_${blocoId}`, "");

    if (!numeroCronograma) {
      setBlocos((prev) =>
        prev.map((bloco) =>
          bloco.id === blocoId
            ? {
                ...bloco,
                cronograma: "",
                produto: "",
                processoSei: "",
                unidadeMedida: "",
                unidadeMedidaAbreviacao: "",
              }
            : bloco,
        ),
      );
      return;
    }

    const cronogramaSelecionado = cronogramasDisponiveis.find(
      (cronograma) => cronograma.numero === numeroCronograma,
    );
    if (!cronogramaSelecionado) return;

    setCarregando(true);
    try {
      const response = await getCronogramaPosRecebimento(
        cronogramaSelecionado.uuid,
      );
      const detalhe = response?.data;
      if (!detalhe) return;

      const novosBlocos = blocos.map((bloco) =>
        bloco.id === blocoId
          ? {
              ...bloco,
              cronograma: numeroCronograma,
              produto: detalhe.produto,
              processoSei: detalhe.processo_sei,
              unidadeMedida: detalhe.unidade_medida,
              unidadeMedidaAbreviacao: detalhe.unidade_medida_abreviacao,
            }
          : bloco,
      );
      setBlocos(novosBlocos);
      form?.change(`produto_${blocoId}`, detalhe.produto);
      atualizarTextoTermo(
        novosBlocos
          .filter((bloco) => bloco.produto)
          .map((bloco) => bloco.produto),
      );
    } finally {
      setCarregando(false);
    }
  };

  const adicionarCronograma = () =>
    setBlocos((prev) => [...prev, criarBloco()]);

  const removerBloco = (blocoId) => {
    const form = formRef.current;
    const novosBlocos = blocos.filter((bloco) => bloco.id !== blocoId);
    const resultado = novosBlocos.length > 0 ? novosBlocos : [criarBloco()];
    form?.change(`cronograma_${blocoId}`, "");
    form?.change(`produto_${blocoId}`, "");
    form?.change(`quantidade_total_recebida_${blocoId}`, "");
    setBlocos(resultado);
    atualizarTextoTermo(
      resultado.filter((bloco) => bloco.produto).map((bloco) => bloco.produto),
    );
  };

  const cronogramasSelecionados = blocos
    .map((bloco) => bloco.cronograma)
    .filter((cronograma) => !!cronograma);

  const opcoesCronogramaParaBloco = (blocoId) =>
    cronogramasParaBloco(
      cronogramasDisponiveis,
      cronogramasSelecionados,
      blocos.find((bloco) => bloco.id === blocoId)?.cronograma,
    );

  const uuidDoCronograma = (numero) =>
    cronogramasDisponiveis.find((cronograma) => cronograma.numero === numero)
      ?.uuid;

  const onSubmit = () => {
    setShowModalConfirmarEnvio(true);
  };

  const salvarTermo = async (values) => {
    try {
      setCarregando(true);
      const cronogramas = blocos
        .filter((bloco) => bloco.cronograma)
        .map((bloco) => ({
          cronograma: uuidDoCronograma(bloco.cronograma),
          quantidade_total_recebida: converterValorParaDecimal(
            values[`quantidade_total_recebida_${bloco.id}`],
          ),
        }));
      const payload = {
        empresa: empresas.find((e) => e.nome_fantasia === values.empresa)?.uuid,
        contrato: contratos.find((c) => c.numero === values.contrato)?.uuid,
        valor_contrato: converterValorParaDecimal(values.valor_contrato),
        cronogramas,
        fiscal_1: fiscais.find((f) => f.nome === values.fiscal_1)?.uuid,
        fiscal_2: fiscais.find((f) => f.nome === values.fiscal_2)?.uuid,
        fiscal_3: fiscais.find((f) => f.nome === values.fiscal_3)?.uuid,
        texto_termo: values.texto_termo,
      };
      const response = await cadastraTermoRecebimentoDefinitivo(payload);
      if (response.status === 201) {
        toastSuccess("Termo de Recebimento Definitivo enviado com sucesso!");
        setShowModalConfirmarEnvio(false);
        voltarPagina();
      } else {
        exibeError(
          response,
          "Ocorreu um erro ao salvar o Termo de Recebimento Definitivo",
        );
        setShowModalConfirmarEnvio(false);
      }
    } catch {
      // O serviço já exibe o toast de erro; aqui apenas limpa o estado.
      setShowModalConfirmarEnvio(false);
    } finally {
      setCarregando(false);
    }
  };

  const desabilitarSalvar = (errors, values) => {
    const textoTermo = values.texto_termo
      ? values.texto_termo.replace(/<[^>]*>/g, "").trim()
      : "";
    const blocosComCronograma = blocos.filter((bloco) => bloco.cronograma);
    const blocosCompletos = blocosComCronograma.filter(
      (bloco) => values[`quantidade_total_recebida_${bloco.id}`],
    );
    return (
      Object.keys(errors).length > 0 ||
      blocosComCronograma.length === 0 ||
      blocosCompletos.length !== blocosComCronograma.length ||
      !values.valor_contrato ||
      !values.empresa ||
      !values.contrato ||
      !values.fiscal_1 ||
      !values.fiscal_2 ||
      !values.fiscal_3 ||
      !textoTermo
    );
  };

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-cadastro-termo-recebimento-definitivo">
        <div className="card-body">
          <Form
            onSubmit={onSubmit}
            initialValues={{ texto_termo: "" }}
            validate={() => ({})}
            render={({ handleSubmit, values, errors }) => {
              const renderSelectCronograma = (bloco, index, colClass) => (
                <div className={colClass}>
                  <Field
                    component={AutoCompleteSelectField}
                    dataTestId={`cronograma-${index}`}
                    label="Nº do Cronograma"
                    name={`cronograma_${bloco.id}`}
                    placeholder="Selecione um Cronograma"
                    options={opcoesCronogramaParaBloco(bloco.id).map(
                      (cronograma) => ({ value: cronograma.numero }),
                    )}
                    disabled={carregando || !values.contrato}
                    required
                    validate={required}
                    onChange={(value) =>
                      selecionaCronogramaBloco(bloco.id, value)
                    }
                  />
                </div>
              );

              const renderProduto = (bloco, index, colClass) => (
                <div className={colClass}>
                  <Field
                    component={InputText}
                    label="Produto"
                    name={`produto_${bloco.id}`}
                    dataTestId={`produto-${index}`}
                    placeholder="Produto do Cronograma"
                    disabled
                  />
                </div>
              );

              const renderProcessoSei = () => (
                <div className="col-6">
                  <Field
                    component={InputText}
                    label="Nº do Processo SEI"
                    name="processo_sei"
                    dataTestId="processo-sei"
                    placeholder="Nº do Processo SEI"
                    disabled
                  />
                </div>
              );

              const renderValorContrato = () => (
                <div className="col-6">
                  <Field
                    component={InputText}
                    label="Valor do Contrato"
                    name="valor_contrato"
                    dataTestId="valor-contrato"
                    placeholder="0,00"
                    prefix="R$"
                    agrupadorMilharComDecimal
                    validate={required}
                    required
                  />
                </div>
              );

              const renderQuantidade = (bloco, index) => (
                <div className="col-4">
                  <Field
                    component={InputText}
                    label="Quantidade Total Recebida"
                    name={`quantidade_total_recebida_${bloco.id}`}
                    dataTestId={`quantidade-total-recebida-${index}`}
                    placeholder="0.000,00"
                    suffix={
                      bloco.unidadeMedidaAbreviacao || bloco.unidadeMedida
                    }
                    agrupadorMilharComDecimal
                    validate={required}
                    required
                  />
                </div>
              );

              return (
                <form onSubmit={handleSubmit}>
                  <FormSpy subscription={{ values: true }}>
                    {({ form: spyForm, values: spyValues }) => {
                      formRef.current = spyForm;
                      valuesRef.current = spyValues;
                      return null;
                    }}
                  </FormSpy>

                  <ModalGenerico
                    show={showModalConfirmarEnvio}
                    titulo="Salvar e Enviar Termo"
                    texto="Confirma o envio do Termo de Recebimento Definitivo? Após o envio não será possível alterar os dados informados."
                    handleClose={() => setShowModalConfirmarEnvio(false)}
                    loading={carregando}
                    handleSim={() => salvarTermo(values)}
                  />
                  <ModalGenerico
                    show={showModalCancelar}
                    titulo="Cancelar Preenchimento"
                    texto="Deseja realmente cancelar o cadastro do Termo de Recebimento Definitivo? As informações preenchidas serão descartadas."
                    handleClose={() => setShowModalCancelar(false)}
                    handleSim={() => voltarPagina()}
                  />

                  <div className="row">
                    <div className="col-6">
                      <Field
                        component={AutoCompleteSelectField}
                        dataTestId="empresa"
                        label="Empresa"
                        name="empresa"
                        placeholder="Selecione uma Empresa Cadastrada"
                        options={empresas.map((empresa) => ({
                          value: empresa.nome_fantasia,
                        }))}
                        required
                        validate={required}
                        onChange={(value) => selecionaEmpresa(value)}
                      />
                    </div>
                    <div className="col-6">
                      <Field
                        component={AutoCompleteSelectField}
                        dataTestId="contrato"
                        label="Nº do Contrato"
                        name="contrato"
                        placeholder="Selecione um Contrato"
                        options={contratos.map((contrato) => ({
                          value: contrato.numero,
                        }))}
                        disabled={carregando || !values.empresa}
                        required
                        validate={required}
                        onChange={(value) => selecionaContrato(value)}
                      />
                    </div>
                  </div>

                  <div className="row mt-3">
                    {renderProcessoSei()}
                    {renderValorContrato()}
                  </div>

                  {blocos.map((bloco, index) => (
                    <React.Fragment key={bloco.id}>
                      {index !== 0 && (
                        <>
                          <hr />
                          <div className="row">
                            <div className="w-100">
                              <Botao
                                dataTestId={`remover-cronograma-${index}`}
                                texto=""
                                type={BUTTON_TYPE.BUTTON}
                                style={BUTTON_STYLE.GREEN_OUTLINE}
                                icon="fas fa-trash"
                                className="float-end ms-3"
                                onClick={() => removerBloco(bloco.id)}
                                tooltipExterno="Remover Cronograma"
                              />
                            </div>
                          </div>
                        </>
                      )}
                      <div className="row mt-3">
                        {renderSelectCronograma(bloco, index, "col-4")}
                        {renderProduto(bloco, index, "col-4")}
                        {renderQuantidade(bloco, index)}
                      </div>
                    </React.Fragment>
                  ))}

                  <div className="text-center mt-3">
                    <Botao
                      texto="+ Cronograma"
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      dataTestId="adicionar-cronograma"
                      disabled={
                        cronogramasDisponiveis.length === 0 ||
                        cronogramasSelecionados.length >=
                          cronogramasDisponiveis.length
                      }
                      onClick={adicionarCronograma}
                    />
                  </div>

                  <hr />

                  <div className="row">
                    {[1, 2, 3].map((numero) => (
                      <div className="col-4" key={numero}>
                        <Field
                          component={AutoCompleteSelectField}
                          dataTestId={`fiscal-${numero}`}
                          label="Fiscal do Contrato"
                          name={`fiscal_${numero}`}
                          placeholder="Selecione um Fiscal"
                          options={fiscais.map((fiscal) => ({
                            value: fiscal.nome,
                          }))}
                          required
                          validate={required}
                        />
                      </div>
                    ))}
                  </div>

                  <Field
                    name="texto_termo"
                    component={CKEditorField}
                    validate={validaTextoTermo}
                    label="Texto do Termo"
                    dataTestId="texto-termo"
                    required
                  />

                  <hr />

                  <div className="mt-4 mb-4">
                    <Botao
                      texto="Salvar e Enviar"
                      type={BUTTON_TYPE.SUBMIT}
                      style={BUTTON_STYLE.GREEN}
                      className="float-end ms-3"
                      dataTestId="salvar-enviar"
                      disabled={desabilitarSalvar(errors, values)}
                    />
                    <Botao
                      texto="Cancelar"
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      className="float-end ms-3"
                      dataTestId="cancelar"
                      onClick={() => setShowModalCancelar(true)}
                    />
                  </div>
                </form>
              );
            }}
          />
        </div>
      </div>
    </Spin>
  );
};
