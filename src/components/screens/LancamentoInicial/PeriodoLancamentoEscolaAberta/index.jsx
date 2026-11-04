import { Spin, Tabs } from "antd";
import HTTP_STATUS from "http-status-codes";
import { useEffect, useRef, useState } from "react";
import { Field, Form } from "react-final-form";
import { useLocation, useNavigate } from "react-router-dom";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import InputText from "src/components/Shareable/Input/InputText";
import InputValueMedicao from "src/components/Shareable/Input/InputValueMedicao";
import {
  toastError,
  toastSuccess,
  toastWarn,
} from "src/components/Shareable/Toast/dialogs";
import {
  getCategoriasDeMedicao,
  getValoresPeriodosLancamentos,
  setPeriodoLancamento,
  updateValoresPeriodosLancamentos,
} from "src/services/medicaoInicial/periodoLancamentoMedicao.service";
import { getEscolaAbertaPorMesAno } from "src/services/medicaoInicial/escolaAberta.service";
import ModalObservacaoDiaria from "../PeriodoLancamentoMedicaoInicial/components/ModalObservacaoDiaria";
import { ModalVoltarPeriodoLancamento } from "../PeriodoLancamentoMedicaoInicial/components/ModalVoltarPeriodoLancamento";
import "../PeriodoLancamentoMedicaoInicial/styles.scss";
import {
  NOME_GRUPO_ESCOLA_ABERTA,
  dataHabilitada,
  montarDiasDaSemana,
  montarLinhasTiposAlimentacao,
  montarPayload,
  montarSemanas,
  montarValoresIniciais,
  nomesDiasSemana,
  obterMedicaoUuid,
  obterTextoForaDoMes,
  textoBotaoObservacao,
  validarLancamentos,
  validarValor,
} from "./helper";

const obterSolicitacaoDaUrl = (location) => {
  const params = new URLSearchParams(location.search);
  const solicitacao = location.state?.solicitacaoMedicaoInicial;

  return {
    uuid: solicitacao?.uuid || params.get("uuid"),
    escolaUuid: solicitacao?.escola_uuid || params.get("escola_uuid"),
    mes: solicitacao?.mes || params.get("mes"),
    ano: solicitacao?.ano || params.get("ano"),
  };
};

const normalizarObservacao = (valor) =>
  ["<p></p>\n", "<p></p>", "", null, undefined].includes(valor) ? 0 : valor;

export const PeriodoLancamentoEscolaAberta = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [dados, setDados] = useState(null);
  const [valoresSalvos, setValoresSalvos] = useState([]);
  const [valoresObservacoes, setValoresObservacoes] = useState([]);
  const [semanaSelecionada, setSemanaSelecionada] = useState("1");
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [showModalObservacao, setShowModalObservacao] = useState(false);
  const [showModalVoltar, setShowModalVoltar] = useState(false);
  const [observacaoSelecionada, setObservacaoSelecionada] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const carregarDados = async () => {
      const { uuid, escolaUuid, mes, ano } = obterSolicitacaoDaUrl(location);

      if (!uuid || !escolaUuid || !mes || !ano) {
        toastError("Não foi possível carregar os dados da Escola Aberta.");
        setLoading(false);
        return;
      }

      const responseEscolaAberta = await getEscolaAbertaPorMesAno({
        escola_uuid: escolaUuid,
        mes,
        ano,
      });

      if (
        responseEscolaAberta?.status !== HTTP_STATUS.OK ||
        !responseEscolaAberta.data?.possui_cadastro
      ) {
        toastError("Não foi encontrado cadastro de Escola Aberta para o mês.");
        setLoading(false);
        return;
      }

      const responseCategorias = await getCategoriasDeMedicao();
      const categoriaAlimentacao = responseCategorias?.data?.find((categoria) =>
        categoria.nome.includes("ALIMENTAÇÃO"),
      );

      if (!categoriaAlimentacao) {
        toastError("Não foi possível carregar a categoria de alimentação.");
        setLoading(false);
        return;
      }

      const responseValores = await getValoresPeriodosLancamentos({
        uuid_solicitacao_medicao: uuid,
        nome_grupo: NOME_GRUPO_ESCOLA_ABERTA,
      });
      const valoresIniciaisSalvos =
        responseValores?.status === HTTP_STATUS.OK
          ? responseValores.data || []
          : [];

      const mesAno = new Date(Number(ano), Number(mes) - 1, 1);
      const cadastro = responseEscolaAberta.data.cadastro;
      const linhas = montarLinhasTiposAlimentacao(cadastro.tipos_alimentacao);

      setDados({
        uuid,
        mesAno,
        cadastro,
        linhas,
        categoriaId: categoriaAlimentacao.id,
        categoriaNome: categoriaAlimentacao.nome,
        valoresIniciais: montarValoresIniciais({
          cadastro,
          linhas,
          categoriaId: categoriaAlimentacao.id,
          mesAno,
          valoresSalvos: valoresIniciaisSalvos,
        }),
      });
      setValoresSalvos(valoresIniciaisSalvos);
      setValoresObservacoes(
        valoresIniciaisSalvos.filter(
          (valor) => valor.nome_campo === "observacoes",
        ),
      );
      setLoading(false);
    };

    carregarDados();
  }, [location]);

  useEffect(() => {
    if (!formRef.current) {
      return undefined;
    }

    return formRef.current.subscribe(
      ({ values, errors }) => {
        setFormValues(values);
        setFormErrors(errors);
      },
      { values: true, errors: true },
    );
  }, [dados]);

  const montarColunas = (mesAno, cadastro) =>
    montarDiasDaSemana(mesAno, Number(semanaSelecionada)).map((diaInfo) => ({
      ...diaInfo,
      foraDoMes: obterTextoForaDoMes(diaInfo, mesAno),
      habilitado: dataHabilitada(diaInfo, mesAno, cadastro),
    }));

  const salvarObservacao = async () => {
    if (!observacaoSelecionada || !dados) {
      return;
    }

    const { dia } = observacaoSelecionada;
    const chave = `observacoes__dia_${dia}__categoria_${dados.categoriaId}`;
    const valor = formRef.current?.getState().values[chave];
    const payload = {
      solicitacao_medicao_inicial: dados.uuid,
      grupo: NOME_GRUPO_ESCOLA_ABERTA,
      eh_observacao: true,
      valores_medicao: [
        {
          dia,
          valor: normalizarObservacao(valor),
          nome_campo: "observacoes",
          categoria_medicao: dados.categoriaId,
          tipo_alimentacao: "",
        },
      ],
    };

    const medicaoUuid = obterMedicaoUuid(valoresSalvos);
    const response = medicaoUuid
      ? await updateValoresPeriodosLancamentos(medicaoUuid, payload)
      : await setPeriodoLancamento(payload);

    if ([HTTP_STATUS.OK, HTTP_STATUS.CREATED].includes(response?.status)) {
      const valoresAtualizados = response.data.valores_medicao || [];
      setValoresSalvos(valoresAtualizados);
      setValoresObservacoes(
        valoresAtualizados.filter((item) => item.nome_campo === "observacoes"),
      );
      const form = formRef.current;
      form?.restart({ ...form.getState().values });
      toastSuccess("Observação salva com sucesso");
      return;
    }

    toastError("Erro ao salvar observação.");
  };

  const salvarLancamentos = async (form) => {
    if (!dados) {
      return;
    }

    const values = form.getState().values;
    const colunasHabilitadas = montarColunas(
      dados.mesAno,
      dados.cadastro,
    ).filter((coluna) => coluna.habilitado);

    const erros = validarLancamentos(
      values,
      colunasHabilitadas,
      dados.linhas,
      dados.categoriaId,
      dados.cadastro.num_participantes,
    );

    if (erros.length) {
      toastError(erros[0].erro);
      return;
    }

    const payload = montarPayload({
      solicitacaoUuid: dados.uuid,
      categoriaId: dados.categoriaId,
      values,
      colunasHabilitadas,
      linhas: dados.linhas,
      numParticipantes: dados.cadastro.num_participantes,
    });

    if (!payload.valores_medicao.length) {
      toastWarn("Não há valores para serem salvos");
      return;
    }

    setSalvando(true);

    try {
      const medicaoUuid = obterMedicaoUuid(valoresSalvos);
      const response = medicaoUuid
        ? await updateValoresPeriodosLancamentos(medicaoUuid, payload)
        : await setPeriodoLancamento(payload);

      if ([HTTP_STATUS.OK, HTTP_STATUS.CREATED].includes(response?.status)) {
        const valoresAtualizados = response.data.valores_medicao || [];
        setValoresSalvos(valoresAtualizados);
        setValoresObservacoes(
          valoresAtualizados.filter(
            (item) => item.nome_campo === "observacoes",
          ),
        );
        form.restart({ ...values });
        toastSuccess("Lançamentos salvos com sucesso");
      } else {
        toastError("Erro ao salvar lançamentos.");
      }
    } catch {
      toastError("Erro ao salvar lançamentos.");
    } finally {
      setSalvando(false);
    }
  };

  const renderizarValorForaDoMes = (nomeCampo, valor, coluna) => (
    <div className="field-values-input">
      <InputValueMedicao
        className="m-2"
        input={{
          name: `fora-do-mes-${nomeCampo}-${coluna.mes}-${coluna.dia}`,
          value: valor,
          onChange: () => {},
          onBlur: () => {},
        }}
        meta={{}}
        disabled
      />
    </div>
  );

  const onClickBotaoVoltar = () => {
    if (formRef.current?.getState().dirty) {
      setShowModalVoltar(true);
      return;
    }

    navigate(-1);
  };

  if (loading) {
    return (
      <div className="card mt-3">
        <div className="card-body">
          <Spin spinning />
        </div>
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="card mt-3">
        <div className="card-body">
          Não foi possível carregar os dados da Escola Aberta.
        </div>
      </div>
    );
  }

  const semanas = montarSemanas(dados.mesAno);
  const colunas = montarColunas(dados.mesAno, dados.cadastro);

  return (
    <Form
      initialValues={dados.valoresIniciais}
      onSubmit={() => {}}
      render={({ form, values }) => {
        formRef.current = form;

        return (
          <form onSubmit={(event) => event.preventDefault()}>
            <div className="text-end botao-voltar-lancamento-medicao">
              <Botao
                type={BUTTON_TYPE.BUTTON}
                texto="Voltar"
                style={BUTTON_STYLE.GREEN_OUTLINE}
                icon={BUTTON_ICON.ARROW_LEFT}
                onClick={onClickBotaoVoltar}
              />
            </div>
            <div className="card mt-3">
              <div className="card-body">
                <div className="row pb-2">
                  <div className="col-3 mes-lancamento">
                    <b className="pb-2 mb-2">Mês do Lançamento</b>
                    <Field
                      component={InputText}
                      dataTestId="input-mes-lancamento-escola-aberta"
                      name="mes_lancamento"
                      disabled
                    />
                  </div>
                  <div className="col-4">
                    <b className="pb-2">Período de Lançamento</b>
                    <Field
                      component={InputText}
                      dataTestId="input-periodo-lancamento-escola-aberta"
                      name="periodo_escolar"
                      disabled
                    />
                  </div>
                  <div className="col-5">
                    <div className="legenda-tooltips">
                      <div>
                        <b className="pb-2">Legenda das Informações:</b>
                      </div>
                      <div>
                        <i className="fas fa-info icone-legenda-error" />
                        <p>
                          Há erros no lançamento. Corrija para conseguir salvar.
                        </p>
                      </div>
                      <div>
                        <i className="fas fa-info icone-legenda-warning" />
                        <p>
                          Há divergências no lançamento. Adicione uma
                          observação.
                        </p>
                      </div>
                      <div>
                        <i className="fas fa-info icone-legenda-success" />
                        <p>
                          Atenção! Verifique se está correto e prossiga os
                          apontamentos.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row pb-2 pt-4 mt-legenda">
                  <div className="col semanas">
                    <b className="section-title">
                      Semanas do Período para Lançamento da Medição Inicial
                    </b>
                  </div>
                </div>
                <div className="weeks-tabs mb-2">
                  <Tabs
                    activeKey={semanaSelecionada}
                    onChange={setSemanaSelecionada}
                    type="card"
                    className={
                      semanaSelecionada === "1"
                        ? "default-color-first-semana"
                        : ""
                    }
                    items={semanas}
                  />
                </div>

                <b className="pb-2 section-title">{dados.categoriaNome}</b>
                <section className="tabela-tipos-alimentacao">
                  <article>
                    <div className="grid-table-tipos-alimentacao header-table">
                      <div />
                      {colunas.map((coluna) => (
                        <div key={`${coluna.mes}-${coluna.dia}`}>
                          {coluna.dia}
                        </div>
                      ))}
                    </div>
                    <div className="grid-table-tipos-alimentacao header-table">
                      <div />
                      {nomesDiasSemana.map((nomeDia) => (
                        <div key={nomeDia}>{nomeDia}.</div>
                      ))}
                    </div>

                    <div className="grid-table-tipos-alimentacao body-table-alimentacao">
                      <div className="nome-linha">
                        <b className="ps-2">Participantes</b>
                      </div>
                      {colunas.map((coluna) => (
                        <div
                          key={`participantes-${coluna.mes}-${coluna.dia}`}
                          className={
                            coluna.habilitado
                              ? "input-habilitado"
                              : "input-desabilitado"
                          }
                        >
                          {coluna.foraDoMes ? (
                            renderizarValorForaDoMes(
                              "participantes",
                              coluna.foraDoMes,
                              coluna,
                            )
                          ) : (
                            <div className="field-values-input">
                              <Field
                                className="m-2"
                                component={InputValueMedicao}
                                name={`participantes__dia_${coluna.dia}__categoria_${dados.categoriaId}`}
                                disabled
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {dados.linhas.map((linha) => (
                      <div
                        key={linha.name}
                        className="grid-table-tipos-alimentacao body-table-alimentacao"
                      >
                        <div className="nome-linha">
                          <b className="ps-2">{linha.nome}</b>
                        </div>
                        {colunas.map((coluna) => (
                          <div
                            key={`${linha.name}-${coluna.mes}-${coluna.dia}`}
                            className={
                              coluna.habilitado
                                ? "input-habilitado"
                                : "input-desabilitado"
                            }
                          >
                            {coluna.foraDoMes ? (
                              renderizarValorForaDoMes(
                                linha.name,
                                coluna.foraDoMes,
                                coluna,
                              )
                            ) : (
                              <div className="field-values-input">
                                <Field
                                  className="m-2"
                                  component={InputValueMedicao}
                                  name={`${linha.name}__dia_${coluna.dia}__categoria_${dados.categoriaId}`}
                                  disabled={!coluna.habilitado}
                                  apenasNumeros
                                  validate={(value) =>
                                    validarValor(
                                      linha.name,
                                      value,
                                      dados.cadastro.num_participantes,
                                    )
                                  }
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}

                    <div className="grid-table-tipos-alimentacao body-table-alimentacao">
                      <div className="nome-linha">
                        <b className="ps-2">Observações</b>
                      </div>
                      {colunas.map((coluna) => {
                        const chave = `observacoes__dia_${coluna.dia}__categoria_${dados.categoriaId}`;
                        const texto = textoBotaoObservacao(values[chave]);

                        return (
                          <div
                            key={`observacoes-${coluna.mes}-${coluna.dia}`}
                            className={
                              coluna.habilitado
                                ? "input-habilitado-observacoes"
                                : "input-desabilitado"
                            }
                          >
                            {!coluna.foraDoMes && coluna.habilitado && (
                              <Botao
                                texto={texto}
                                type={BUTTON_TYPE.BUTTON}
                                style={
                                  texto === "Visualizar"
                                    ? BUTTON_STYLE.GREEN
                                    : BUTTON_STYLE.GREEN_OUTLINE_WHITE
                                }
                                dataTestId={`botao-observacao-escola-aberta-${coluna.dia}`}
                                onClick={() => {
                                  setObservacaoSelecionada({
                                    dia: coluna.dia,
                                  });
                                  setShowModalObservacao(true);
                                }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </article>
                </section>

                <Botao
                  className="float-end"
                  texto="Salvar Lançamentos"
                  type={BUTTON_TYPE.BUTTON}
                  style={BUTTON_STYLE.GREEN}
                  disabled={salvando || Object.keys(formErrors).length > 0}
                  exibirTooltip={
                    !salvando && Object.keys(formErrors).length > 0
                  }
                  tooltipTitulo="Existem campos a serem corrigidos. Realize as correções para salvar."
                  classTooltip="icone-info-invalid"
                  onClick={() => salvarLancamentos(form)}
                />
              </div>
            </div>

            <ModalObservacaoDiaria
              closeModal={() => setShowModalObservacao(false)}
              showModal={showModalObservacao}
              form={form}
              dia={observacaoSelecionada?.dia}
              categoria={dados.categoriaId}
              mesAnoConsiderado={dados.mesAno}
              values={formValues}
              rowName="observacoes"
              valoresPeriodosLancamentos={valoresSalvos}
              onSubmit={salvarObservacao}
              dadosIniciais={dados.valoresIniciais}
              setExibirTooltip={() => {}}
              errors={formErrors}
              valoresObservacoes={valoresObservacoes}
              location={location}
              setFormValuesAtualizados={setFormValues}
              setValoresObservacoes={setValoresObservacoes}
              alunosTabSelecionada={null}
              escolaEhEMEBS={false}
            />

            <ModalVoltarPeriodoLancamento
              showModal={showModalVoltar}
              closeModal={() => setShowModalVoltar(false)}
              navigate={navigate}
            />
          </form>
        );
      }}
    />
  );
};

export default PeriodoLancamentoEscolaAberta;
