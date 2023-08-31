import React, { useState } from "react";
import { useEffect } from "react";
import {
  analiseDilogSolicitacaoAlteracaoCronograma,
  analiseDinutreSolicitacaoAlteracaoCronograma,
  cadastraSolicitacaoAlteracaoCronograma,
  dilogCienteSolicitacaoAlteracaoCronograma,
  getCronograma,
  getSolicitacaoAlteracaoCronograma,
} from "services/cronograma.service";
import HTTP_STATUS from "http-status-codes";
import { Form, Field, FormSpy } from "react-final-form";
import DadosCronograma from "../CronogramaEntrega/components/DadosCronograma";
import AnaliseDilogDiretoria from "./components/AnaliseDilogDiretoria";
import { TextArea } from "components/Shareable/TextArea/TextArea";
import "./styles.scss";
import AcoesAlterar from "./components/AcoesAlterar";
import {
  prepararPayloadAnaliseCronograma,
  prepararPayloadCronograma,
} from "./helpers";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import {
  CRONOGRAMA_ENTREGA,
  PRE_RECEBIMENTO,
  SOLICITACAO_ALTERACAO_CRONOGRAMA,
} from "configs/constants";
import { useHistory } from "react-router-dom";
import {
  usuarioEhCronograma,
  usuarioEhDilogDiretoria,
  usuarioEhDinutreDiretoria,
  usuarioEhEmpresaFornecedor,
} from "helpers/utilities";
import { Radio, Spin } from "antd";
import { FluxoDeStatusCronograma } from "components/Shareable/FluxoDeStatusCronograma";
import FormEtapa from "../../../PreRecebimento/FormEtapa";
import { textAreaRequired } from "helpers/fieldValidators";
import { onChangeEtapas } from "components/PreRecebimento/FormEtapa/helper";
import TabelaFormAlteracao from "./components/TabelaFormAlteracao";
import FormRecebimento from "components/PreRecebimento/FormRecebimento";

export default ({ analiseSolicitacao }) => {
  const urlParams = new URLSearchParams(window.location.search);
  const uuid = urlParams.get("uuid");
  const [restante, setRestante] = useState(undefined);
  const [duplicados, setDuplicados] = useState([]);
  const [etapas, setEtapas] = useState([{}]);
  const [initialValues, setInitialValues] = useState({});
  const [cronograma, setCronograma] = useState(null);
  const [aprovacaoDinutre, setAprovacaoDinutre] = useState(null);
  const [aprovacaoDilog, setAprovacaoDilog] = useState(null);
  const [solicitacaoAlteracaoCronograma, setSolicitacaoAlteracaoCronograma] =
    useState(null);
  const [recebimentos, setRecebimentos] = useState([{}]);
  const [carregando, setCarregando] = useState(false);
  const history = useHistory();

  const onChangeCampos = (e) => {
    setAprovacaoDinutre(e.target.value);
  };

  const exibirJustificativaDinutre = () =>
    aprovacaoDinutre === false ||
    ((usuarioEhDilogDiretoria() || usuarioEhDinutreDiretoria()) &&
      ["Aprovado DINUTRE", "Reprovado DINUTRE"].includes(
        solicitacaoAlteracaoCronograma.status
      ));

  const getDetalhes = async () => {
    setCarregando(true);
    if (analiseSolicitacao) {
      const responseSolicitacaoCronograma =
        await getSolicitacaoAlteracaoCronograma(uuid);
      const responseCronograma = responseSolicitacaoCronograma.data.cronograma;
      if (usuarioEhEmpresaFornecedor()) {
        responseSolicitacaoCronograma.data.logs = montarFluxoStatusFornecedor(
          responseSolicitacaoCronograma.data.logs
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
        "cronograma"
      ),
      justificativa_dinutre: buscaLogJustificativaCronograma(
        solicitacao.logs,
        "dinutre"
      ),
    };
    solicitacao.etapas_novas.forEach((etapa, index) => {
      values[`total_embalagens_${index}`] = etapa.total_embalagens;
      values[`etapa_${index}`] = etapa.etapa;
      values[`parte_${index}`] = etapa.parte;
      values[`quantidade_${index}`] = etapa.quantidade;
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
      values[`quantidade_${index}`] = etapa.quantidade;
      values[`total_embalagens_${index}`] = etapa.total_embalagens;
    });
    values.quantidade_total = cronograma.qtd_total_programada;
    values.unidade_medida = cronograma.unidade_medida;
    setInitialValues(values);
  };

  const analisadoPelaDinutre = () => {
    return ["Aprovado DINUTRE", "Reprovado DINUTRE"].includes(
      solicitacaoAlteracaoCronograma.status
    );
  };

  const analiseCronograma = () =>
    solicitacaoAlteracaoCronograma.status === "Em análise" &&
    usuarioEhCronograma();

  const cadastraAlteracao = async (values) => {
    const payload = prepararPayloadCronograma(cronograma, values, etapas);
    await cadastraSolicitacaoAlteracaoCronograma(payload)
      .then(() => {
        toastSuccess("Solicitação de alteração salva com sucesso!");
        history.push(`/${PRE_RECEBIMENTO}/${CRONOGRAMA_ENTREGA}`);
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
        history.push(`/${PRE_RECEBIMENTO}/${SOLICITACAO_ALTERACAO_CRONOGRAMA}`);
      })
      .catch(() => {
        toastError("Ocorreu um erro ao salvar o Cronograma");
      });
  };

  const analiseDinutre = async (values, aprovado) => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    const payload = {
      aprovado: aprovado,
    };
    if (!aprovado) {
      payload.justificativa_dinutre = values["justificativa_dinutre"];
    }
    await analiseDinutreSolicitacaoAlteracaoCronograma(uuid, payload)
      .then(() => {
        toastSuccess("Análise da alteração enviada com sucesso!");
        history.push(`/${PRE_RECEBIMENTO}/${SOLICITACAO_ALTERACAO_CRONOGRAMA}`);
      })
      .catch(() => {
        toastError("Ocorreu um erro ao salvar o Cronograma");
      });
  };

  const disabledDinutre = (values) => {
    return aprovacaoDinutre !== true && !values.justificativa_dinutre;
  };

  const disabledDilog = (values) => {
    return aprovacaoDilog !== true && !values.justificativa_dilog;
  };

  const defineSubmit = (values) => {
    if (usuarioEhDinutreDiretoria()) {
      analiseDinutre(values, aprovacaoDinutre);
    } else if (usuarioEhDilogDiretoria()) {
      analiseDilog(values, aprovacaoDilog);
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
      recebimentos
    );
    await dilogCienteSolicitacaoAlteracaoCronograma(uuid, payload)
      .then(() => {
        toastSuccess("Análise da alteração enviada com sucesso!");
        history.push(`/${PRE_RECEBIMENTO}/${SOLICITACAO_ALTERACAO_CRONOGRAMA}`);
      })
      .catch(() => {
        toastError("Ocorreu um erro ao salvar o Cronograma");
      });
  };

  const buscaLogJustificativaCronograma = (logs, autorJustificativa) => {
    console.log("a");
    const dict_logs = {
      cronograma: ["Cronograma Ciente"],
      dinutre: ["Aprovado DINUTRE", "Reprovado DINUTRE"],
    };
    let log_correto = logs.find((log) => {
      return dict_logs[autorJustificativa].includes(
        log.status_evento_explicacao
      );
    });
    return log_correto ? log_correto.justificativa : "";
  };

  const montarFluxoStatusFornecedor = (logs) => {
    const logsFiltrados = logs.filter(
      (log) =>
        !["Aprovado DINUTRE", "Reprovado DINUTRE"].includes(
          log.status_evento_explicacao
        )
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
    // eslint-disable-next-line
  }, [uuid]);

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3">
        <div className="card-body alterar-cronograma">
          {solicitacaoAlteracaoCronograma && (
            <>
              <div className="row pb-3">
                <p className="head-green mt-3 ml-3 mb-5">
                  Status do Cronograma
                </p>
                <FluxoDeStatusCronograma
                  listaDeStatus={solicitacaoAlteracaoCronograma.logs}
                  solicitacao={true}
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
                          setDuplicados
                        )
                      }
                    />
                    {analiseSolicitacao && (
                      <>
                        <p className="titulo-laranja">
                          Solicitação de Alteração do Fornecedor
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
                        <FormEtapa
                          etapas={etapas}
                          setEtapas={setEtapas}
                          values={values}
                          duplicados={duplicados}
                          restante={restante}
                          unidadeMedida={values.unidade_medida}
                          fornecedor={true}
                        />
                      </>
                    )}
                    <div className="mt-4">
                      <label className="label font-weight-normal">
                        <span>* </span>Justificativa
                      </label>
                      <Field
                        component={TextArea}
                        name="justificativa"
                        placeholder="Escreva o motivo da solicitação de alteração"
                        className="input-busca-produto"
                        disabled={solicitacaoAlteracaoCronograma !== null}
                        validate={textAreaRequired}
                      />
                    </div>
                    {((usuarioEhDinutreDiretoria() &&
                      solicitacaoAlteracaoCronograma.status !== "Em análise") ||
                      (usuarioEhDilogDiretoria() &&
                        analisadoPelaDinutre())) && (
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
                        <p className="head-green">Análise DINUTRE</p>
                        {usuarioEhDinutreDiretoria() &&
                          solicitacaoAlteracaoCronograma.status ===
                            "Cronograma ciente" && (
                            <Radio.Group
                              size="large"
                              onChange={onChangeCampos}
                              value={aprovacaoDinutre}
                            >
                              <Radio className="radio-entrega-sim" value={true}>
                                Analise Aprovada
                              </Radio>
                              <Radio
                                className="radio-entrega-nao"
                                value={false}
                              >
                                Analise Reprovada
                              </Radio>
                            </Radio.Group>
                          )}
                        {exibirJustificativaDinutre() && (
                          <div className="mt-4">
                            {analisadoPelaDinutre() && (
                              <p>{solicitacaoAlteracaoCronograma.status}</p>
                            )}
                            {(aprovacaoDinutre === false ||
                              solicitacaoAlteracaoCronograma.status ===
                                "Reprovado DINUTRE") && (
                              <>
                                <label className="label font-weight-normal">
                                  <span>* </span>Justificativa
                                </label>
                                <Field
                                  component={TextArea}
                                  disabled={analisadoPelaDinutre()}
                                  name="justificativa_dinutre"
                                  placeholder="Escreva as alterações necessárias"
                                  className="input-busca-produto"
                                />
                              </>
                            )}
                          </div>
                        )}
                      </>
                    )}
                    {analiseSolicitacao && analiseCronograma() && (
                      <div className="accordion mt-1" id="accordionCronograma">
                        <FormRecebimento
                          values={values}
                          form={form}
                          etapas={solicitacaoAlteracaoCronograma.etapas_novas}
                          recebimentos={recebimentos}
                          setRecebimentos={setRecebimentos}
                        />
                      </div>
                    )}
                    {usuarioEhDilogDiretoria() && analisadoPelaDinutre() && (
                      <AnaliseDilogDiretoria
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
                        podeSubmeter={Object.keys(errors).length === 0}
                        disabledDinutre={disabledDinutre(values)}
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
