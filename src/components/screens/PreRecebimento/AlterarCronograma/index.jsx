import React, { useState } from "react";
import { useEffect } from "react";
import {
  analiseDilogSolicitacaoAlteracaoCronograma,
  analiseAbastecimentoSolicitacaoAlteracaoCronograma,
  cadastraSolicitacaoAlteracaoCronograma,
  dilogCienteSolicitacaoAlteracaoCronograma,
  getCronograma,
  getSolicitacaoAlteracaoCronograma,
} from "src/services/cronograma.service";
import HTTP_STATUS from "http-status-codes";
import { Form, Field, FormSpy } from "react-final-form";
import DadosCronograma from "../CronogramaEntrega/components/DadosCronograma";
import AnaliseDilogDiretoria from "./components/AnaliseDilogDiretoria";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import { InputText } from "src/components/Shareable/Input/InputText";
import "./styles.scss";
import AcoesAlterar from "./components/AcoesAlterar";
import {
  prepararPayloadAnaliseCronograma,
  prepararPayloadCronograma,
} from "./helpers";
import { formataMilhar } from "src/helpers/utilities";
import { required } from "src/helpers/fieldValidators";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import {
  CRONOGRAMA_ENTREGA,
  PRE_RECEBIMENTO,
  SOLICITACAO_ALTERACAO_CRONOGRAMA,
} from "src/configs/constants";
import { useNavigate } from "react-router-dom";
import {
  usuarioEhDilogDiretoria,
  usuarioEhEmpresaFornecedor,
  usuarioEhCronogramaOuCodae,
  usuarioEhDilogAbastecimento,
} from "../../../../helpers/utilities";
import { Radio, Spin } from "antd";
import { FluxoDeStatusPreRecebimento } from "src/components/Shareable/FluxoDeStatusPreRecebimento";
import FormEtapa from "../../../PreRecebimento/FormEtapa";
import { textAreaRequired } from "src/helpers/fieldValidators";
import { onChangeEtapas } from "src/components/PreRecebimento/FormEtapa/helper";
import TabelaFormAlteracao from "./components/TabelaFormAlteracao";
import FormRecebimento from "src/components/PreRecebimento/FormRecebimento";
import { fornecedorCienteAlteracaoCodae } from "../../../../services/cronograma.service";
import { SOLICITACAO_ALTERACAO_CRONOGRAMA_FORNECEDOR } from "../../../../configs/constants";
import { setFieldTouched } from "../../../../configs/mutators";
import { numberToStringDecimal } from "src/helpers/parsers";

export default ({ analiseSolicitacao }) => {
  const urlParams = new URLSearchParams(window.location.search);
  const uuid = urlParams.get("uuid");
  const [restante, setRestante] = useState(undefined);
  const [duplicados, setDuplicados] = useState([]);
  const [etapas, setEtapas] = useState([{}]);
  const [initialValues, setInitialValues] = useState({});
  const [cronograma, setCronograma] = useState(null);
  const [aprovacaoAbastecimento, setAprovacaoAbastecimento] = useState(null);
  const [aprovacaoDilog, setAprovacaoDilog] = useState(null);
  const [solicitacaoAlteracaoCronograma, setSolicitacaoAlteracaoCronograma] =
    useState(null);
  const [recebimentos, setRecebimentos] = useState([{}]);
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const solicitacaoCodae =
    solicitacaoAlteracaoCronograma &&
    ["Alteração Enviada ao Fornecedor", "Fornecedor Ciente"].includes(
      solicitacaoAlteracaoCronograma.status,
    );

  const onChangeCampos = (e) => {
    setAprovacaoAbastecimento(e.target.value);
  };

  const exibirJustificativaAbastecimento = () =>
    aprovacaoAbastecimento === false ||
    usuarioEhCronogramaOuCodae() ||
    ((usuarioEhDilogDiretoria() || usuarioEhDilogAbastecimento()) &&
      ["Aprovado Abastecimento", "Reprovado Abastecimento"].includes(
        solicitacaoAlteracaoCronograma.status,
      ));

  const getDetalhes = async () => {
    setCarregando(true);
    if (analiseSolicitacao) {
      const responseSolicitacaoCronograma =
        await getSolicitacaoAlteracaoCronograma(uuid);
      const responseCronograma = responseSolicitacaoCronograma.data.cronograma;
      if (usuarioEhEmpresaFornecedor()) {
        responseSolicitacaoCronograma.data.logs = montarFluxoStatusFornecedor(
          responseSolicitacaoCronograma.data.logs,
        );
      }
      setSolicitacaoAlteracaoCronograma(responseSolicitacaoCronograma.data);
      geraInitialValuesSolicitacao(responseSolicitacaoCronograma.data);
      setCronograma(responseCronograma);
      setEtapas(responseSolicitacaoCronograma.data.etapas_novas);
      setRestante(responseCronograma.qtd_total_programada);
      setDuplicados([]);
      setCarregando(false);
    } else {
      if (uuid) {
        const responseCronograma = await getCronograma(uuid);
        if (responseCronograma.status === HTTP_STATUS.OK) {
          setCronograma(responseCronograma.data);
          setEtapas(responseCronograma.data.etapas);
          geraInitialValuesEtapa(responseCronograma.data);
          setRestante(responseCronograma.data.qtd_total_programada);
          setCarregando(false);
        }
      }
    }
  };

  const geraInitialValuesSolicitacao = (solicitacao) => {
    let values;
    values = {
      justificativa: solicitacao.justificativa,
      justificativa_cronograma: buscaLogJustificativaCronograma(
        solicitacao.logs,
        "cronograma",
      ),
      justificativa_abastecimento: buscaLogJustificativaCronograma(
        solicitacao.logs,
        "abastecimento",
      ),
      justificativa_dilog: buscaLogJustificativaCronograma(
        solicitacao.logs,
        "dilog",
      ),
      quantidade_total: formataMilhar(
        solicitacao.cronograma.qtd_total_programada,
      ),
    };
    solicitacao.etapas_novas.forEach((etapa, index) => {
      values[`total_embalagens_${index}`] = numberToStringDecimal(
        etapa.total_embalagens,
      );
      values[`etapa_${index}`] = etapa.etapa;
      values[`parte_${index}`] = etapa.parte;
      values[`quantidade_${index}`] = formataMilhar(etapa.quantidade);
      values[`data_programada_${index}`] = etapa.data_programada;
    });
    setInitialValues(values);
  };

  const geraInitialValuesEtapa = (cronograma) => {
    let values = {};
    cronograma.etapas.forEach((etapa, index) => {
      values[`empenho_${index}`] = etapa.numero_empenho;
      values[`etapa_${index}`] = etapa.etapa;
      values[`parte_${index}`] = etapa.parte;
      values[`data_programada_${index}`] = etapa.data_programada;
      values[`quantidade_${index}`] = formataMilhar(etapa.quantidade);
      values[`total_embalagens_${index}`] = numberToStringDecimal(
        etapa.total_embalagens,
      );
      values[`qtd_total_empenho_${index}`] = numberToStringDecimal(
        etapa.qtd_total_empenho,
      );
    });
    values.quantidade_total = formataMilhar(cronograma.qtd_total_programada);
    values.unidade_medida = cronograma.unidade_medida;
    values.peso_liquido_embalagem_secundaria =
      cronograma.ficha_tecnica?.peso_liquido_embalagem_secundaria?.toString();
    setInitialValues(values);
  };

  const analisadoPeloAbastecimento = () => {
    return solicitacaoAlteracaoCronograma?.logs.some((l) =>
      ["Aprovado Abastecimento", "Reprovado Abastecimento"].includes(
        l.status_evento_explicacao,
      ),
    );
  };

  const reprovadoPeloAbastecimento = () => {
    return solicitacaoAlteracaoCronograma?.logs.some(
      (l) => l.status_evento_explicacao === "Reprovado Abastecimento",
    );
  };

  const analisadoPelaDilog = () => {
    return solicitacaoAlteracaoCronograma?.logs.some((l) =>
      ["Aprovado DILOG", "Reprovado DILOG"].includes(
        l.status_evento_explicacao,
      ),
    );
  };

  const analiseCronograma = () =>
    solicitacaoAlteracaoCronograma.status === "Em análise" &&
    usuarioEhCronogramaOuCodae();
  const cadastraAlteracao = async (values) => {
    const payload = prepararPayloadCronograma(
      cronograma,
      values,
      etapas,
      recebimentos,
    );
    await cadastraSolicitacaoAlteracaoCronograma(payload)
      .then(() => {
        let msg = usuarioEhEmpresaFornecedor()
          ? "Solicitação de alteração salva com sucesso!"
          : "Alteração enviada com sucesso!";
        toastSuccess(msg);
        navigate(`/${PRE_RECEBIMENTO}/${CRONOGRAMA_ENTREGA}`);
      })
      .catch(() => {
        toastError("Ocorreu um erro ao salvar o Cronograma");
      });
  };

  const analiseDilog = async (values, aprovado) => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    const payload = {
      aprovado: aprovado,
    };
    if (!aprovado) {
      payload.justificativa_dilog = values["justificativa_dilog"];
    }
    await analiseDilogSolicitacaoAlteracaoCronograma(uuid, payload)
      .then(() => {
        toastSuccess("Análise da alteração enviada com sucesso!");
        navigate(`/${PRE_RECEBIMENTO}/${SOLICITACAO_ALTERACAO_CRONOGRAMA}`);
      })
      .catch(() => {
        toastError("Ocorreu um erro ao salvar o Cronograma");
      });
  };

  const analiseAbastecimento = async (values, aprovado) => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    const payload = {
      aprovado: aprovado,
    };
    if (!aprovado) {
      payload.justificativa_abastecimento =
        values["justificativa_abastecimento"];
    }
    await analiseAbastecimentoSolicitacaoAlteracaoCronograma(uuid, payload)
      .then(() => {
        toastSuccess("Análise da alteração enviada com sucesso!");
        navigate(`/${PRE_RECEBIMENTO}/${SOLICITACAO_ALTERACAO_CRONOGRAMA}`);
      })
      .catch(() => {
        toastError("Ocorreu um erro ao salvar o Cronograma");
      });
  };

  const disabledAbastecimento = (values) => {
    return (
      aprovacaoAbastecimento !== true && !values.justificativa_abastecimento
    );
  };

  const disabledDilog = (values) => {
    return aprovacaoDilog !== true && !values.justificativa_dilog;
  };

  const cienciaFornecedor = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");

    await fornecedorCienteAlteracaoCodae(uuid)
      .then(() => {
        toastSuccess("Ciência da alteração gravada com sucesso!");
        navigate(
          `/${PRE_RECEBIMENTO}/${SOLICITACAO_ALTERACAO_CRONOGRAMA_FORNECEDOR}`,
        );
      })
      .catch(() => {
        toastError("Ocorreu um erro ao salvar a Ciência");
      });
  };

  const defineSubmit = (values) => {
    if (usuarioEhDilogAbastecimento()) {
      analiseAbastecimento(values, aprovacaoAbastecimento);
    } else if (usuarioEhDilogDiretoria() && analisadoPeloAbastecimento()) {
      analiseDilog(values, aprovacaoDilog);
    } else if (
      usuarioEhEmpresaFornecedor() &&
      solicitacaoAlteracaoCronograma &&
      solicitacaoAlteracaoCronograma.status ===
        "Alteração Enviada ao Fornecedor"
    ) {
      cienciaFornecedor();
    } else {
      cadastraAlteracao(values);
    }
  };

  const handleSubmitCronograma = async (values, justificativa) => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    const payload = prepararPayloadAnaliseCronograma(
      justificativa,
      values,
      etapas,
      recebimentos,
    );
    await dilogCienteSolicitacaoAlteracaoCronograma(uuid, payload)
      .then(() => {
        toastSuccess("Análise da alteração enviada com sucesso!");
        navigate(`/${PRE_RECEBIMENTO}/${SOLICITACAO_ALTERACAO_CRONOGRAMA}`);
      })
      .catch(() => {
        toastError("Ocorreu um erro ao salvar o Cronograma");
      });
  };

  const buscaLogJustificativaCronograma = (logs, autorJustificativa) => {
    const dict_logs = {
      cronograma: ["Cronograma Ciente"],
      abastecimento: ["Aprovado Abastecimento", "Reprovado Abastecimento"],
      dilog: ["Aprovado DILOG", "Reprovado DILOG"],
    };
    let log_correto = logs.find((log) => {
      return dict_logs[autorJustificativa].includes(
        log.status_evento_explicacao,
      );
    });
    return log_correto ? log_correto.justificativa : "";
  };

  const montarFluxoStatusFornecedor = (logs) => {
    const logsFiltrados = logs.filter(
      (log) =>
        !["Aprovado Abastecimento", "Reprovado Abastecimento"].includes(
          log.status_evento_explicacao,
        ),
    );
    logsFiltrados[0].status_evento_explicacao = "Em Análise";
    const logsNomesAtualizados = logsFiltrados.map((log) => {
      if (log.status_evento_explicacao === "Aprovado DILOG") {
        log.status_evento_explicacao = "Aprovado CODAE";
      } else if (log.status_evento_explicacao === "Reprovado DILOG") {
        log.status_evento_explicacao = "Reprovado CODAE";
      }
      return log;
    });

    return logsNomesAtualizados;
  };

  useEffect(() => {
    getDetalhes();
  }, [uuid]);

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3">
        <div className="card-body alterar-cronograma">
          {solicitacaoAlteracaoCronograma && (
            <>
              <div className="row pb-3">
                <p className="head-green mt-3 ms-3 mb-5">
                  Status do Cronograma
                </p>
                <FluxoDeStatusPreRecebimento
                  listaDeStatus={solicitacaoAlteracaoCronograma.logs}
                />
              </div>
              <hr className="hr-detalhar" />
            </>
          )}
          {cronograma && (
            <>
              {!solicitacaoAlteracaoCronograma ? (
                <DadosCronograma
                  cronograma={cronograma}
                  esconderInformacoesAdicionais={true}
                />
              ) : (
                <DadosCronograma
                  cronograma={cronograma}
                  solicitacaoAlteracaoCronograma={
                    solicitacaoAlteracaoCronograma
                  }
                  esconderInformacoesAdicionais={false}
                />
              )}
              <Form
                onSubmit={defineSubmit}
                initialValues={initialValues}
                mutators={{ setFieldTouched }}
                validate={() => {}}
                render={({ form, handleSubmit, values, errors }) => (
                  <form onSubmit={handleSubmit}>
                    <FormSpy
                      subscription={{ values: true, active: true, valid: true }}
                      onChange={(changes) =>
                        onChangeEtapas(
                          changes,
                          etapas,
                          setRestante,
                          setDuplicados,
                        )
                      }
                    />
                    {analiseSolicitacao && (
                      <>
                        <p className="titulo-laranja">
                          {solicitacaoCodae
                            ? "Alteração da CODAE"
                            : "Solicitação de Alteração do Fornecedor"}
                        </p>
                        <TabelaFormAlteracao
                          solicitacao={solicitacaoAlteracaoCronograma}
                          somenteLeitura={!analiseCronograma()}
                        />
                      </>
                    )}
                    {!analiseSolicitacao && (
                      <>
                        <hr />
                        <div className="head-green">
                          Informe as Alterações Necessárias
                        </div>
                        {(usuarioEhCronogramaOuCodae() ||
                          usuarioEhDilogDiretoria()) && (
                          <div className="row">
                            <div className="col-4">
                              <Field
                                component={InputText}
                                label="Quantidade Total Programada"
                                name="quantidade_total"
                                className="input-busca-produto"
                                disabled={false}
                                agrupadorMilharComDecimal
                                required
                                validate={required}
                                placeholder="Informe a Quantidade Total"
                              />
                            </div>
                          </div>
                        )}
                        <FormEtapa
                          form={form}
                          etapas={etapas}
                          setEtapas={setEtapas}
                          values={values}
                          errors={errors}
                          duplicados={duplicados}
                          restante={restante}
                          unidadeMedida={values.unidade_medida}
                          ehAlteracao={true}
                        />
                      </>
                    )}
                    <div className="mt-4">
                      <label className="label fw-normal">
                        <span>* </span>Justificativa
                      </label>
                      <Field
                        component={TextArea}
                        name="justificativa"
                        placeholder={
                          usuarioEhCronogramaOuCodae() ||
                          usuarioEhDilogDiretoria()
                            ? "Escreva o motivo da alteração"
                            : "Escreva o motivo da solicitação de alteração"
                        }
                        className="input-busca-produto"
                        disabled={solicitacaoAlteracaoCronograma !== null}
                        validate={textAreaRequired}
                      />
                    </div>
                    {((usuarioEhCronogramaOuCodae() &&
                      solicitacaoAlteracaoCronograma) ||
                      (usuarioEhDilogAbastecimento() &&
                        solicitacaoAlteracaoCronograma.status !==
                          "Em análise" &&
                        values.justificativa_cronograma) ||
                      (usuarioEhDilogDiretoria() &&
                        analisadoPeloAbastecimento())) && (
                      <>
                        <hr />
                        <p className="head-green">Análise Cronograma</p>
                        <div className="mt-4">
                          <Field
                            component={TextArea}
                            name="justificativa_cronograma"
                            className="input-busca-produto"
                            disabled={true}
                          />
                        </div>
                        <hr />

                        {usuarioEhDilogAbastecimento() &&
                          solicitacaoAlteracaoCronograma.status ===
                            "Cronograma ciente" && (
                            <>
                              <p className="head-green">
                                Análise Abastecimento
                              </p>
                              <Radio.Group
                                size="large"
                                onChange={onChangeCampos}
                                value={aprovacaoAbastecimento}
                              >
                                <Radio
                                  className="radio-entrega-sim"
                                  value={true}
                                >
                                  Analise Aprovada
                                </Radio>
                                <Radio
                                  className="radio-entrega-nao"
                                  value={false}
                                >
                                  Analise Reprovada
                                </Radio>
                              </Radio.Group>
                            </>
                          )}
                        {exibirJustificativaAbastecimento() && (
                          <div className="mt-4">
                            {analisadoPeloAbastecimento() && (
                              <p className="head-green">
                                {reprovadoPeloAbastecimento()
                                  ? "Reprovado Abastecimento"
                                  : "Aprovado Abastecimento"}
                              </p>
                            )}
                            {(aprovacaoAbastecimento === false ||
                              reprovadoPeloAbastecimento()) && (
                              <>
                                <label className="label fw-normal">
                                  <span>* </span>Justificativa
                                </label>
                                <Field
                                  component={TextArea}
                                  disabled={analisadoPeloAbastecimento()}
                                  name="justificativa_abastecimento"
                                  placeholder="Escreva as alterações necessárias"
                                  className="input-busca-produto"
                                />
                              </>
                            )}
                          </div>
                        )}
                      </>
                    )}
                    {((!analiseSolicitacao &&
                      (usuarioEhCronogramaOuCodae() ||
                        usuarioEhDilogDiretoria())) ||
                      (analiseSolicitacao && analiseCronograma())) && (
                      <div className="accordion mt-1" id="accordionCronograma">
                        <FormRecebimento
                          values={values}
                          form={form}
                          etapas={
                            analiseSolicitacao
                              ? solicitacaoAlteracaoCronograma.etapas_novas
                              : etapas
                          }
                          recebimentos={recebimentos}
                          setRecebimentos={setRecebimentos}
                        />
                      </div>
                    )}
                    {((usuarioEhDilogDiretoria() &&
                      analisadoPeloAbastecimento()) ||
                      (usuarioEhCronogramaOuCodae() &&
                        analisadoPelaDilog())) && (
                      <AnaliseDilogDiretoria
                        solicitacao={solicitacaoAlteracaoCronograma}
                        aprovacaoDilog={aprovacaoDilog}
                        setAprovacaoDilog={setAprovacaoDilog}
                      />
                    )}
                    <div className="mt-4 mb-4">
                      <AcoesAlterar
                        cronograma={cronograma}
                        solicitacaoAlteracaoCronograma={
                          solicitacaoAlteracaoCronograma
                        }
                        handleSubmit={handleSubmit}
                        handleSubmitCronograma={(justificativa) =>
                          handleSubmitCronograma(values, justificativa)
                        }
                        podeSubmeter={
                          Object.keys(errors).length === 0 && restante === 0
                        }
                        disabledAbastecimento={disabledAbastecimento(values)}
                        disabledDilog={disabledDilog(values)}
                      />
                    </div>
                  </form>
                )}
              />
            </>
          )}
        </div>
      </div>
    </Spin>
  );
};
