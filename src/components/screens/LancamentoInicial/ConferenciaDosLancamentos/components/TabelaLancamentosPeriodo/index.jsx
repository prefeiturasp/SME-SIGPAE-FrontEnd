import React, { useEffect, useState, Fragment } from "react";
import { OnChange } from "react-final-form-listeners";
import { Field } from "react-final-form";
import { Modal } from "react-bootstrap";
import { Tabs } from "antd";
import {
  addDays,
  format,
  getDay,
  getWeeksInMonth,
  isSunday,
  lastDayOfMonth,
  startOfMonth,
  subDays,
} from "date-fns";
import HTTP_STATUS from "http-status-codes";
import Botao from "components/Shareable/Botao";
import InputValueMedicao from "components/Shareable/Input/InputValueMedicao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";
import {
  defaultValue,
  formatarLinhasTabelaAlimentacao,
  formatarLinhasTabelaDietaEnteral,
  formatarLinhasTabelasDietas,
  formatarLinhasTabelaSolicitacoesAlimentacao,
  formatarLinhasTabelaEtecAlimentacao,
  getSolicitacoesInclusaoAutorizadasAsync,
  getSolicitacoesAlteracoesAlimentacaoAutorizadasAsync,
  getSolicitacoesSuspensoesAutorizadasAsync,
  validacaoSemana,
} from "components/screens/LancamentoInicial/PeriodoLancamentoMedicaoInicial/helper";
import {
  formatarLinhasTabelaAlimentacaoCEI,
  formatarLinhasTabelasDietasCEI,
} from "components/screens/LancamentoInicial/PeriodoLancamentoMedicaoInicialCEI/helper";
import { removeObjetosDuplicados } from "components/screens/LancamentoInicial/LancamentoMedicaoInicial/components/LancamentoPorPeriodo/helpers";
import InputText from "components/Shareable/Input/InputText";
import CKEditorField from "components/Shareable/CKEditorField";
import {
  toastError,
  toastSuccess,
  toastWarn,
} from "components/Shareable/Toast/dialogs";
import {
  diasSemana,
  initialStateWeekColumns,
  PERIODO_STATUS_DE_PROGRESSO,
} from "../../constants";
import {
  ehEscolaTipoCEI,
  deepCopy,
  usuarioEhDRE,
  usuarioEhMedicao,
  ehFimDeSemana,
} from "helpers/utilities";
import { ModalAprovarPeriodo } from "../ModalAprovarPeriodo";
import { ModalCancelarCorrecao } from "../ModalCancelarCorrecao";
import { ModalSalvarCorrecao } from "../ModalSalvarCorrecao";
import { formatarNomePeriodo } from "../../helper";
import {
  getCategoriasDeMedicao,
  getPeriodosInclusaoContinua,
  getValoresPeriodosLancamentos,
} from "services/medicaoInicial/periodoLancamentoMedicao.service";
import {
  drePedeCorrecaMedicao,
  codaePedeCorrecaPeriodo,
} from "services/medicaoInicial/solicitacaoMedicaoInicial.service";
import { LegendaDiasNaoLetivos } from "../LegendaDiasNaoLetivos";
import {
  exibirTooltipAlteracaoAlimentacaoAutorizadaDreCodae,
  exibirTooltipInclusaoAlimentacaoAutorizadaDreCodae,
  exibirTooltipSuspensaoAutorizadaFrequenciaDreCodae,
  exibirTooltipSuspensaoAutorizadaAlimentacaoDreCodae,
  exibirTooltipRepeticaoDiasSobremesaDoceDreCodae,
} from "../../../PeriodoLancamentoMedicaoInicial/validacoes";

export const TabelaLancamentosPeriodo = ({ ...props }) => {
  const {
    key,
    periodoGrupo,
    periodosSimples,
    mesSolicitacao,
    anoSolicitacao,
    form,
    aprovarPeriodo,
    values,
    getPeriodosGruposMedicaoAsync,
    setOcorrenciaExpandida,
    solicitacao,
    feriadosNoMes,
    diasCalendario,
    diasSobremesaDoce,
  } = props;

  const [weekColumns, setWeekColumns] = useState(initialStateWeekColumns);
  const [showTabelaLancamentosPeriodo, setShowTabelaLancamentosPeriodo] =
    useState(false);
  const [semanaSelecionada, setSemanaSelecionada] = useState(1);
  const [data, setData] = useState(null);
  const [tabItems, setTabItems] = useState(null);
  const [categoriasDeMedicao, setCategoriasDeMedicao] = useState(null);
  const [periodoEscolar, setPeriodoEscolar] = useState(null);
  const [tabelaAlimentacaoRows, setTabelaAlimentacaoRows] = useState(null);
  const [tabelaDietaRows, setTabelaDietaRows] = useState(null);
  const [tabelaDietaEnteralRows, setTabelaDietaEnteralRows] = useState(null);
  const [
    tabelaSolicitacoesAlimentacaoRows,
    setTabelaSolicitacoesAlimentacaoRows,
  ] = useState(null);
  const [tabelaEtecAlimentacaoRows, setTabelaEtecAlimentacaoRows] =
    useState(null);
  const [valoresLancamentos, setValoresLancamentos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modoCorrecao, setModoCorrecao] = useState(false);
  const [valoresParaCorrecao, setValoresParaCorrecao] = useState({});
  const [diasParaCorrecao, setDiasParaCorrecao] = useState([]);

  const [showModalObservacaoDiaria, setShowModalObservacaoDiaria] =
    useState(false);
  const [showModalAprovarPeriodo, setShowModalAprovarPeriodo] = useState(false);
  const [showModalCancelarSolicitacao, setShowModalCancelarSolicitacao] =
    useState(false);
  const [showModalSalvarSolicitacao, setShowModalSalvarSolicitacao] =
    useState(false);
  const [inclusoesAutorizadas, setInclusoesAutorizadas] = useState(null);
  const [
    alteracoesAlimentacaoAutorizadas,
    setAlteracoesAlimentacaoAutorizadas,
  ] = useState(null);
  const [suspensoesAutorizadas, setSuspensoesAutorizadas] = useState(null);
  const [erroAPI, setErroAPI] = useState("");

  const exibirBotoesDRE =
    usuarioEhDRE() &&
    solicitacao &&
    ["MEDICAO_ENVIADA_PELA_UE", "MEDICAO_CORRIGIDA_PELA_UE"].includes(
      solicitacao.status
    );

  const exibirBotoesCODAE =
    usuarioEhMedicao() &&
    solicitacao &&
    ["MEDICAO_APROVADA_PELA_DRE", "MEDICAO_CORRIGIDA_PARA_CODAE"].includes(
      solicitacao.status
    );

  const statusPermitidosAprovacaoDRE =
    usuarioEhDRE() &&
    periodoGrupo &&
    ![
      "MEDICAO_ENVIADA_PELA_UE",
      "MEDICAO_CORRECAO_SOLICITADA",
      "MEDICAO_CORRIGIDA_PELA_UE",
    ].includes(periodoGrupo.status);

  const statusPermitidosAprovacaoCODAE =
    usuarioEhMedicao() &&
    periodoGrupo &&
    ![
      "MEDICAO_APROVADA_PELA_DRE",
      "MEDICAO_CORRECAO_SOLICITADA_CODAE",
      "MEDICAO_CORRIGIDA_PARA_CODAE",
    ].includes(periodoGrupo.status);

  const statusPermitidosCorrecaoDRE =
    usuarioEhDRE() &&
    periodoGrupo &&
    ![
      "MEDICAO_ENVIADA_PELA_UE",
      "MEDICAO_CORRECAO_SOLICITADA",
      "MEDICAO_CORRIGIDA_PELA_UE",
      "MEDICAO_APROVADA_PELA_DRE",
    ].includes(periodoGrupo.status);

  const statusPermitidosCorrecaoCODAE =
    usuarioEhMedicao() &&
    periodoGrupo &&
    ![
      "MEDICAO_APROVADA_PELA_DRE",
      "MEDICAO_CORRECAO_SOLICITADA_CODAE",
      "MEDICAO_CORRIGIDA_PARA_CODAE",
      "MEDICAO_APROVADA_PELA_CODAE",
    ].includes(periodoGrupo.status);

  const logPeriodoAprovado = periodoGrupo.logs.find(
    (log) => log.status_evento_explicacao === "Aprovado pela DRE"
  );

  const logPeriodoAprovadoCODAE = periodoGrupo.logs.find(
    (log) => log.status_evento_explicacao === "Aprovado pela CODAE"
  );

  const logPeriodoReprovado = periodoGrupo.logs.find(
    (log) => log.status_evento_explicacao === "Correção solicitada"
  );

  const logPeriodoReprovadoCODAE = periodoGrupo.logs.find(
    (log) => log.status_evento_explicacao === "Correção solicitada pela CODAE"
  );

  const diaEhFeriado = (dia) => {
    return feriadosNoMes.find(
      (diaFeriado) => String(diaFeriado.dia) === String(dia)
    );
  };

  const diaEhFeriadoByIndex = (index) => {
    return feriadosNoMes.find(
      (diaFeriado) => String(diaFeriado.dia) === String(weekColumns[index].dia)
    );
  };

  const diaEhNaoLetivoEDeSemana = (dia) => {
    const dateObj = new Date(
      `${anoSolicitacao}-${mesSolicitacao}-${(parseInt(dia) + 1)
        .toString()
        .padStart(2, "0")}`
    );
    return (
      diasCalendario.find(
        (diaCalendario) =>
          String(diaCalendario.dia) === String(dia) && !diaCalendario.dia_letivo
      ) && !ehFimDeSemana(dateObj)
    );
  };

  const diaEhNaoLetivoEDeSemanaByIndex = (index) => {
    const dateObj = new Date(
      `${anoSolicitacao}-${mesSolicitacao}-${(
        parseInt(weekColumns[index].dia) + 1
      )
        .toString()
        .padStart(2, "0")}`
    );
    return (
      diasCalendario.find(
        (diaCalendario) =>
          String(diaCalendario.dia) === String(weekColumns[index].dia) &&
          !diaCalendario.dia_letivo
      ) && !ehFimDeSemana(dateObj)
    );
  };

  const ehDiaNaoLetivoOuFeriado = (column, categoria) => {
    return (
      !["Mês anterior", "Mês posterior"].includes(
        values[
          `frequencia__dia_${column.dia}__categoria_${
            categoria.id
          }__uuid_medicao_periodo_grupo_${periodoGrupo.uuid_medicao_periodo_grupo.slice(
            0,
            5
          )}`
        ]
      ) &&
      !["Mês anterior", "Mês posterior"].includes(
        values[
          `lanche_emergencial__dia_${column.dia}__categoria_${
            categoria.id
          }__uuid_medicao_periodo_grupo_${periodoGrupo.uuid_medicao_periodo_grupo.slice(
            0,
            5
          )}`
        ]
      ) &&
      (diaEhFeriado(column.dia) || diaEhNaoLetivoEDeSemana(column.dia))
    );
  };

  const ehDiaNaoLetivoOuFeriadoByIndex = (index, categoria) => {
    return (
      !["Mês anterior", "Mês posterior"].includes(
        values[
          `frequencia__dia_${weekColumns[index].dia}__categoria_${
            categoria.id
          }__uuid_medicao_periodo_grupo_${periodoGrupo.uuid_medicao_periodo_grupo.slice(
            0,
            5
          )}`
        ]
      ) &&
      !["Mês anterior", "Mês posterior"].includes(
        values[
          `lanche_emergencial__dia_${weekColumns[index].dia}__categoria_${
            categoria.id
          }__uuid_medicao_periodo_grupo_${periodoGrupo.uuid_medicao_periodo_grupo.slice(
            0,
            5
          )}`
        ]
      ) &&
      (diaEhFeriadoByIndex(index) || diaEhNaoLetivoEDeSemanaByIndex(index))
    );
  };

  useEffect(() => {
    if (showTabelaLancamentosPeriodo) {
      const formatarTabelasAsync = async () => {
        try {
          setLoading(true);
          const params_get_valores_periodos = {
            uuid_medicao_periodo_grupo: periodoGrupo.uuid_medicao_periodo_grupo,
          };
          const response_valores_periodos = await getValoresPeriodosLancamentos(
            params_get_valores_periodos
          );
          setValoresLancamentos(response_valores_periodos.data);
          let categoriasMedicao;
          const getCategoriasDeMedicaoAsync = async () => {
            if (!categoriasDeMedicao) {
              let response_categorias_medicao = await getCategoriasDeMedicao();
              if (periodoGrupo.nome_periodo_grupo.includes("Solicitações")) {
                categoriasMedicao = response_categorias_medicao.data.filter(
                  (cat) => cat.nome.includes("SOLICITAÇÕES")
                );
                setCategoriasDeMedicao(categoriasMedicao);
              } else if (periodoGrupo.nome_periodo_grupo === "ETEC") {
                categoriasMedicao = response_categorias_medicao.data.filter(
                  (cat) => cat.nome === "ALIMENTAÇÃO"
                );
                setCategoriasDeMedicao(categoriasMedicao);
              } else {
                categoriasMedicao = response_categorias_medicao.data.filter(
                  (cat) => !cat.nome.includes("SOLICITAÇÕES")
                );
                setCategoriasDeMedicao(categoriasMedicao);
              }

              if (ehEscolaTipoCEI({ nome: solicitacao.escola })) {
                categoriasMedicao = response_categorias_medicao.data.filter(
                  (cat) =>
                    !cat.nome.includes("SOLICITAÇÕES") &&
                    !cat.nome.includes("ENTERAL")
                );
                setCategoriasDeMedicao(categoriasMedicao);
              }
            }
          };
          await getCategoriasDeMedicaoAsync();

          let items = [];
          Array.apply(null, {
            length: isSunday(lastDayOfMonth(data))
              ? getWeeksInMonth(data) - 1
              : getDay(startOfMonth(data)) === 0
              ? getWeeksInMonth(data) + 1
              : getWeeksInMonth(data),
          }).map((e, i) =>
            items.push({
              key: `${i + 1}`,
              label: `Semana ${i + 1}`,
            })
          );
          setTabItems(items);

          const formatarLinhasTabelasCEI = async () => {
            const idCategoriaAlimentacao =
              (categoriasMedicao || categoriasDeMedicao).length &&
              (categoriasMedicao || categoriasDeMedicao).find((categoria) =>
                categoria.nome.includes("ALIMENTAÇÃO")
              ).id;

            const linhasTabelaAlimentacaoCEI =
              formatarLinhasTabelaAlimentacaoCEI(
                [],
                periodoGrupo.nome_periodo_grupo,
                response_valores_periodos.data.filter(
                  (valor) => valor.categoria_medicao === idCategoriaAlimentacao
                )
              );
            setTabelaAlimentacaoRows(linhasTabelaAlimentacaoCEI);

            let linhasTabelasDietasCEI = formatarLinhasTabelasDietasCEI(
              [],
              periodoGrupo,
              response_valores_periodos.data.filter(
                (valor) => valor.categoria_medicao !== idCategoriaAlimentacao
              )
            );
            setTabelaDietaRows(linhasTabelasDietasCEI);

            let categoriasParaDeletar = [];
            (categoriasMedicao || categoriasDeMedicao).forEach(
              (categoria) =>
                !response_valores_periodos.data.find(
                  (valor) => valor.categoria_medicao === categoria.id
                ) && categoriasParaDeletar.push(categoria.id)
            );
            categoriasMedicao = categoriasMedicao.filter((categoria) => {
              return !categoriasParaDeletar.includes(categoria.id);
            });
            setCategoriasDeMedicao(categoriasMedicao);
          };

          if (ehEscolaTipoCEI({ nome: solicitacao.escola })) {
            await formatarLinhasTabelasCEI();
          } else {
            if (periodoGrupo.nome_periodo_grupo === "ETEC") {
              const linhasTabelaEtecAlimentacao =
                formatarLinhasTabelaEtecAlimentacao();
              setTabelaEtecAlimentacaoRows(linhasTabelaEtecAlimentacao);
            } else if (
              !periodoGrupo.nome_periodo_grupo.includes("Solicitações")
            ) {
              if (periodoGrupo.nome_periodo_grupo === "Programas e Projetos") {
                let periodos;
                let tiposAlimentacao = [];
                const getPeriodosInclusaoContinuaAsync = async () => {
                  const response = await getPeriodosInclusaoContinua({
                    mes: mesSolicitacao,
                    ano: anoSolicitacao,
                    escola: solicitacao.escola_uuid,
                  });
                  if (response.status === HTTP_STATUS.OK) {
                    periodos = response.data.periodos;
                  } else {
                    toastError(
                      "Erro ao carregar períodos de inclusão contínua. Tente novamente mais tarde."
                    );
                    periodos = periodosSimples[0];
                  }
                  Object.keys(periodos).forEach((periodo) => {
                    const tipos = periodosSimples.find(
                      (p) => p.periodo_escolar.nome === periodo
                    ).tipos_alimentacao;
                    tiposAlimentacao = [...tiposAlimentacao, ...tipos];
                  });
                  const tipos_alimentacao = removeObjetosDuplicados(
                    tiposAlimentacao,
                    "nome"
                  );
                  const tiposAlimentacaoFormatadas =
                    formatarLinhasTabelaAlimentacao(
                      tipos_alimentacao,
                      periodoGrupo,
                      solicitacao
                    );
                  setTabelaAlimentacaoRows(tiposAlimentacaoFormatadas);
                  const linhasTabelasDietas =
                    formatarLinhasTabelasDietas(tipos_alimentacao);
                  setTabelaDietaRows(linhasTabelasDietas);
                  const cloneLinhasTabelasDietas =
                    deepCopy(linhasTabelasDietas);
                  const linhasTabelaDietaEnteral =
                    formatarLinhasTabelaDietaEnteral(
                      tipos_alimentacao,
                      cloneLinhasTabelasDietas
                    );
                  setTabelaDietaEnteralRows(linhasTabelaDietaEnteral);
                };
                getPeriodosInclusaoContinuaAsync();
              } else {
                const periodo = periodosSimples.find(
                  (periodo) => periodo.periodo_escolar.nome === periodoEscolar
                );
                const tipos_alimentacao = periodo.tipos_alimentacao;
                const tiposAlimentacaoFormatadas =
                  formatarLinhasTabelaAlimentacao(
                    tipos_alimentacao,
                    periodoGrupo,
                    solicitacao,
                    periodo.periodo_escolar.eh_periodo_especifico
                  );
                setTabelaAlimentacaoRows(tiposAlimentacaoFormatadas);
                const linhasTabelasDietas =
                  formatarLinhasTabelasDietas(tipos_alimentacao);
                setTabelaDietaRows(linhasTabelasDietas);
                const cloneLinhasTabelasDietas = deepCopy(linhasTabelasDietas);
                const linhasTabelaDietaEnteral =
                  formatarLinhasTabelaDietaEnteral(
                    tipos_alimentacao,
                    cloneLinhasTabelasDietas
                  );
                setTabelaDietaEnteralRows(linhasTabelaDietaEnteral);
              }
            } else {
              const linhasTabelaSolicitacoesAlimentacao =
                formatarLinhasTabelaSolicitacoesAlimentacao();
              setTabelaSolicitacoesAlimentacaoRows(
                linhasTabelaSolicitacoesAlimentacao
              );
            }
          }

          if (
            !ehEscolaTipoCEI({ nome: solicitacao.escola }) &&
            periodosSimples.find(
              (periodo) =>
                periodo.periodo_escolar.nome === periodoGrupo.nome_periodo_grupo
            )
          ) {
            const response_inclusoes_autorizadas =
              await getSolicitacoesInclusaoAutorizadasAsync(
                solicitacao.escola_uuid,
                mesSolicitacao,
                anoSolicitacao,
                [periodoGrupo.nome_periodo_grupo]
              );
            setInclusoesAutorizadas(response_inclusoes_autorizadas);

            const response_alteracoes_alimentacao_autorizadas =
              await getSolicitacoesAlteracoesAlimentacaoAutorizadasAsync(
                solicitacao.escola_uuid,
                mesSolicitacao,
                anoSolicitacao,
                periodoGrupo.nome_periodo_grupo
              );
            setAlteracoesAlimentacaoAutorizadas(
              response_alteracoes_alimentacao_autorizadas
            );

            const response_suspensoes_autorizadas =
              await getSolicitacoesSuspensoesAutorizadasAsync(
                solicitacao.escola_uuid,
                mesSolicitacao,
                anoSolicitacao,
                periodoGrupo.nome_periodo_grupo
              );
            setSuspensoesAutorizadas(response_suspensoes_autorizadas);
          }

          setLoading(false);
          setErroAPI("");
        } catch (error) {
          setLoading(false);
          setErroAPI(
            `Erro ao carregar período ${periodoGrupo.nome_periodo_grupo}. Tente novamente mais tarde. "${error}"`
          );
        }
      };
      formatarTabelasAsync();
    }

    setData(new Date(`${mesSolicitacao}/01/${anoSolicitacao}`));
  }, [showTabelaLancamentosPeriodo]);

  useEffect(() => {
    let diasSemana = [];
    let diaDaSemanaNumerico = getDay(startOfMonth(data)); // 0 representa Domingo
    let week = [];

    if (diaDaSemanaNumerico === 0) {
      diaDaSemanaNumerico = 7;
    }
    if (data && Number(semanaSelecionada) === 1) {
      diasSemana.unshift(format(startOfMonth(data), "dd"));
      for (let i = 1; i < diaDaSemanaNumerico; i++) {
        diasSemana.unshift(format(subDays(startOfMonth(data), i), "dd"));
      }
      for (let i = diaDaSemanaNumerico; i < 7; i++) {
        diasSemana.push(
          format(addDays(startOfMonth(data), i + 1 - diaDaSemanaNumerico), "dd")
        );
      }
      week = weekColumns.map((column) => {
        return { ...column, dia: diasSemana[column["position"]] };
      });
      setWeekColumns(week);
    }
    if (data && Number(semanaSelecionada) !== 1) {
      let dia = addDays(
        startOfMonth(data),
        7 * (Number(semanaSelecionada) - 1)
      );
      diasSemana.unshift(format(dia, "dd"));
      for (let i = 1; i < diaDaSemanaNumerico; i++) {
        diasSemana.unshift(format(subDays(dia, i), "dd"));
      }
      for (let i = diaDaSemanaNumerico; i < 7; i++) {
        diasSemana.push(
          format(addDays(dia, i + 1 - diaDaSemanaNumerico), "dd")
        );
      }
      week = weekColumns.map((column) => {
        return { ...column, dia: diasSemana[column["position"]] };
      });
      setWeekColumns(week);
    }
  }, [data, semanaSelecionada]);

  const onClickVisualizarFechar = async (periodoGrupo) => {
    setShowTabelaLancamentosPeriodo(!showTabelaLancamentosPeriodo);
    setPeriodoEscolar(periodoGrupo.periodo_escolar);
    if (!showTabelaLancamentosPeriodo) {
      setLoading(true);
      setOcorrenciaExpandida();
    } else {
      setErroAPI("");
    }
  };

  const escolherTabela = (categoria) => {
    if (
      categoria.nome.includes("DIETA") &&
      categoria.nome.includes("ENTERAL")
    ) {
      return tabelaDietaEnteralRows;
    } else if (categoria.nome.includes("DIETA")) {
      return tabelaDietaRows;
    } else if (categoria.nome.includes("SOLICITAÇÕES")) {
      return tabelaSolicitacoesAlimentacaoRows;
    } else if (
      periodoGrupo.nome_periodo_grupo === "ETEC" &&
      categoria.nome === "ALIMENTAÇÃO"
    ) {
      return tabelaEtecAlimentacaoRows;
    } else {
      return tabelaAlimentacaoRows;
    }
  };

  const onClickBotaoObservacao = (dia, categoriaId) => {
    const observacao = valoresLancamentos.find(
      (valor) =>
        valor.nome_campo === "observacoes" &&
        Number(valor.dia) === Number(dia) &&
        Number(valor.categoria_medicao) === Number(categoriaId)
    );
    let valorObservacao = null;
    if (observacao) {
      valorObservacao = observacao.valor;
    }
    setShowModalObservacaoDiaria(true);
    form.change(
      "data_lancamento",
      `${dia}/${mesSolicitacao}/${anoSolicitacao}`
    );
    form.change("observacao_modal", valorObservacao);
  };

  const onChangeSemana = (key) => {
    setSemanaSelecionada(key);
  };

  const ehInputParaCorrecao = (inputNameMedicao) => {
    return (
      Object.keys(values).filter(
        (key) =>
          key.includes(`ckbox_dias_semana__${inputNameMedicao}`) &&
          values[`ckbox_dias_semana__${inputNameMedicao}`]
      ).length > 0
    );
  };

  const resetValuesCorrecao = (uuidMedicaoPeriodoGrupo) => {
    setShowTabelaLancamentosPeriodo(false);
    setModoCorrecao(false);
    form.change(
      `descricao_correcao__periodo_grupo_${uuidMedicaoPeriodoGrupo.slice(
        0,
        5
      )}`,
      ""
    );
    Object.keys(values).forEach((key) => {
      if (
        key.includes("ckbox_dias_semana") &&
        key.includes(
          `uuid_medicao_periodo_grupo_${uuidMedicaoPeriodoGrupo.slice(0, 5)}`
        )
      ) {
        form.change(key, false);
      }
    });
  };

  const algumCheckboxMarcado = () => {
    const listaChaves = Object.keys(values).filter((key) =>
      key.includes(`ckbox_dias_semana__`)
    );
    const resultado = listaChaves.some((chave) => values[chave] === true);
    return resultado;
  };

  const salvarCorrecao = async (uuidMedicaoPeriodoGrupo) => {
    let uuidsValoresMedicaoParaCorrecao = [];
    if (!ehEscolaTipoCEI({ nome: solicitacao.escola })) {
      Object.keys(valoresParaCorrecao).forEach((key) => {
        const keySplitted = key.split("__");
        const nome_campo = keySplitted[0];
        const dia = keySplitted[1].match(/\d/g).join("");
        const idCategoria = keySplitted[2].match(/\d/g).join("");
        const lancamento = valoresLancamentos.find(
          (valor) =>
            valor.nome_campo === nome_campo &&
            Number(valor.dia) === Number(dia) &&
            Number(valor.categoria_medicao) === Number(idCategoria)
        );

        const uuidValorMedicao = lancamento.uuid;
        uuidsValoresMedicaoParaCorrecao.push(uuidValorMedicao);
      });
    } else if (ehEscolaTipoCEI({ nome: solicitacao.escola })) {
      Object.keys(valoresParaCorrecao).forEach((key) => {
        const keySplitted = key.split("__");
        const nome_campo = keySplitted[0];
        const dia = keySplitted[2].match(/\d/g).join("");
        const idCategoria = keySplitted[3].match(/\d/g).join("");
        const lancamento = valoresLancamentos.find(
          (valor) =>
            valor.nome_campo === nome_campo &&
            Number(valor.dia) === Number(dia) &&
            Number(valor.categoria_medicao) === Number(idCategoria)
        );

        const uuidValorMedicao = lancamento.uuid;
        uuidsValoresMedicaoParaCorrecao.push(uuidValorMedicao);
      });
    }

    const descricao_correcao =
      values[
        `descricao_correcao__periodo_grupo_${uuidMedicaoPeriodoGrupo.slice(
          0,
          5
        )}`
      ];
    const payload = {
      uuids_valores_medicao_para_correcao: uuidsValoresMedicaoParaCorrecao,
      dias_para_corrigir: diasParaCorrecao,
      justificativa: descricao_correcao,
    };
    const response = usuarioEhDRE()
      ? await drePedeCorrecaMedicao(uuidMedicaoPeriodoGrupo, payload)
      : await codaePedeCorrecaPeriodo(uuidMedicaoPeriodoGrupo, payload);
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess("Solicitação de correção salva com sucesso");
    } else {
      toastError("Houve um erro ao salvar solicitação de correção");
    }

    setValoresParaCorrecao({});
    getPeriodosGruposMedicaoAsync();
    setModoCorrecao(false);
    resetValuesCorrecao(uuidMedicaoPeriodoGrupo);
  };

  const cancelarCorrecao = (uuidMedicaoPeriodoGrupo) => {
    resetValuesCorrecao(uuidMedicaoPeriodoGrupo);
    toastWarn("Solicitação de correção cancelada");
  };

  const onChangeCheckBox = (column, categoria, periodoGrupo, isChecked) => {
    setDiasParaCorrecao((prevState) => {
      if (isChecked) {
        return [
          ...prevState,
          {
            dia: column.dia,
            categoria_medicao_uuid: categoria.uuid,
          },
        ];
      } else {
        return prevState.filter(
          (diaCorrecao) =>
            diaCorrecao.dia !== column.dia ||
            diaCorrecao.categoria_medicao_uuid !== categoria.uuid
        );
      }
    });

    const chaveBase = `dia_${column.dia}__categoria_${
      categoria.id
    }__uuid_medicao_periodo_grupo_${periodoGrupo.uuid_medicao_periodo_grupo.slice(
      0,
      5
    )}`;
    const keys = Object.keys(values).filter((key) => key.includes(chaveBase));

    if (isChecked) {
      const novosValores = keys.reduce((obj, key) => {
        if (!key.includes("ckbox_dias_semana") && values[key]) {
          obj[key] = values[key];
        }
        return obj;
      }, {});
      setValoresParaCorrecao({ ...valoresParaCorrecao, ...novosValores });
    } else {
      const valoresAtualizados = { ...valoresParaCorrecao };
      keys.forEach((key) => {
        delete valoresAtualizados[key];
      });
      setValoresParaCorrecao(valoresAtualizados);
    }
  };

  const getClassNameToNextInput = (row, column, categoria, index) => {
    if (
      row.name !== "observacoes" &&
      column &&
      index + 1 < escolherTabela(categoria).length - 1
    ) {
      return `${escolherTabela(categoria)[index + 1].name}__dia_${
        column.dia
      }__categoria_${categoria.id}`;
    } else {
      return undefined;
    }
  };

  const getClassNameToPrevInput = (row, column, categoria, index) => {
    if (
      row.name !== "frequencia" &&
      column &&
      escolherTabela(categoria)[index - 1]
    ) {
      return `${escolherTabela(categoria)[index - 1].name}__dia_${
        column.dia
      }__categoria_${categoria.id}`;
    }
    return undefined;
  };

  const getNameFieldInputValueMedicao = (row, column, categoria) => {
    if (ehEscolaTipoCEI({ nome: solicitacao.escola })) {
      return `${row.name}__faixa_${row.uuid}__dia_${column.dia}__categoria_${
        categoria.id
      }__uuid_medicao_periodo_grupo_${periodoGrupo.uuid_medicao_periodo_grupo.slice(
        0,
        5
      )}`;
    } else {
      return `${row.name}__dia_${column.dia}__categoria_${
        categoria.id
      }__uuid_medicao_periodo_grupo_${periodoGrupo.uuid_medicao_periodo_grupo.slice(
        0,
        5
      )}`;
    }
  };

  return (
    <div key={key}>
      <div className="content-section-acompanhamento-lancamento mb-3">
        <p className="mb-0">
          <b>{periodoGrupo.nome_periodo_grupo}</b>
        </p>
        <div className="content-section-acompanhamento-lancamento-right">
          <div
            className={`acompanhamento-status-lancamento mr-3 ${
              [
                "MEDICAO_CORRECAO_SOLICITADA",
                "MEDICAO_CORRECAO_SOLICITADA_CODAE",
              ].includes(periodoGrupo.status)
                ? "red"
                : ""
            }`}
          >
            {PERIODO_STATUS_DE_PROGRESSO[periodoGrupo.status] &&
              PERIODO_STATUS_DE_PROGRESSO[periodoGrupo.status].nome}
          </div>
          <p
            className="visualizar-lancamento mb-0"
            onClick={() => onClickVisualizarFechar(periodoGrupo)}
          >
            <b>{showTabelaLancamentosPeriodo ? "FECHAR" : "VISUALIZAR"}</b>
          </p>
        </div>
      </div>
      {loading && (
        <div className="carregando-conteudo">
          <div className="text-logo-sigpae-loader text-center">
            <img src="/assets/image/sigpae-loader.gif" alt="sigpae-loader" />
            <div>Carregando...</div>
          </div>
        </div>
      )}
      {!!erroAPI && showTabelaLancamentosPeriodo && (
        <div className="text-center mb-3">{erroAPI}</div>
      )}
      {!loading &&
        showTabelaLancamentosPeriodo &&
        ((tabelaAlimentacaoRows && tabelaDietaRows && tabelaDietaEnteralRows) ||
          tabelaSolicitacoesAlimentacaoRows ||
          tabelaEtecAlimentacaoRows ||
          (ehEscolaTipoCEI({ nome: solicitacao.escola }) &&
            tabelaAlimentacaoRows)) &&
        valoresLancamentos && (
          <>
            <p className="section-title-conf-lancamentos">Lançamentos da UE</p>
            <div className="weeks-tabs mb-2">
              <Tabs
                activeKey={semanaSelecionada}
                onChange={(key) => onChangeSemana(key)}
                type="card"
                className={`${
                  semanaSelecionada === 1 ? "default-color-first-semana" : ""
                }`}
                items={tabItems}
              />
              {categoriasDeMedicao &&
                categoriasDeMedicao.length > 0 &&
                categoriasDeMedicao.map((categoria, idx) => [
                  <div key={categoria.id}>
                    <b className="pb-2 section-title">{categoria.nome}</b>
                    <section className="tabela-tipos-alimentacao">
                      <article>
                        <div
                          className={
                            "grid-table-tipos-alimentacao header-table"
                          }
                        >
                          <div />
                          {weekColumns.map((column) => {
                            return modoCorrecao &&
                              !validacaoSemana(
                                column.dia,
                                semanaSelecionada
                              ) ? (
                              <div
                                className="dias-semana-tabela"
                                key={column.dia}
                              >
                                <Field
                                  className="input-dias-semana-tabela"
                                  component={"input"}
                                  type="checkbox"
                                  name={`ckbox_dias_semana__dia_${
                                    column.dia
                                  }__categoria_${
                                    categoria.id
                                  }__uuid_medicao_periodo_grupo_${periodoGrupo.uuid_medicao_periodo_grupo.slice(
                                    0,
                                    5
                                  )}`}
                                />
                                <div
                                  key={column.dia}
                                  className={`label-dias-semana-tabela ${
                                    ehDiaNaoLetivoOuFeriado(column, categoria)
                                      ? "dia-nao-letivo-header"
                                      : ""
                                  }`}
                                >
                                  {column.dia}
                                  {ehDiaNaoLetivoOuFeriado(column, categoria)
                                    ? " *"
                                    : ""}
                                </div>
                                <OnChange
                                  name={`ckbox_dias_semana__dia_${
                                    column.dia
                                  }__categoria_${
                                    categoria.id
                                  }__uuid_medicao_periodo_grupo_${periodoGrupo.uuid_medicao_periodo_grupo.slice(
                                    0,
                                    5
                                  )}`}
                                >
                                  {(value) =>
                                    onChangeCheckBox(
                                      column,
                                      categoria,
                                      periodoGrupo,
                                      value
                                    )
                                  }
                                </OnChange>
                              </div>
                            ) : (
                              <div
                                className={`${
                                  ehDiaNaoLetivoOuFeriado(column, categoria)
                                    ? "dia-nao-letivo-header"
                                    : ""
                                }`}
                                key={column.dia}
                              >
                                {column.dia}
                                {ehDiaNaoLetivoOuFeriado(column, categoria)
                                  ? " *"
                                  : ""}
                              </div>
                            );
                          })}
                        </div>
                        <div
                          className={
                            "grid-table-tipos-alimentacao header-table"
                          }
                        >
                          <div />
                          {diasSemana.map((dia, index) => (
                            <div
                              className={`${
                                ehDiaNaoLetivoOuFeriadoByIndex(index, categoria)
                                  ? "dia-nao-letivo-header"
                                  : ""
                              }`}
                              key={index}
                            >
                              {dia}
                            </div>
                          ))}
                        </div>
                        {escolherTabela(categoria).map((row, index) => {
                          return (
                            <Fragment key={index}>
                              <div
                                className={`grid-table-tipos-alimentacao body-table-alimentacao`}
                              >
                                {ehEscolaTipoCEI({
                                  nome: solicitacao.escola,
                                }) ? (
                                  <div className="linha-cei">
                                    <b
                                      className={`nome-linha-cei pl-2 ${
                                        row.name === "observacoes" && "mt-2"
                                      }`}
                                    >
                                      {row.nome}
                                    </b>
                                    {row.name !== "observacoes" && (
                                      <b className="faixa-etaria pl-2">
                                        {row.faixa_etaria}
                                      </b>
                                    )}
                                  </div>
                                ) : (
                                  <div className="nome-linha">
                                    <b className="pl-2">{row.nome}</b>
                                  </div>
                                )}
                                {weekColumns.map((column) => (
                                  <div
                                    key={column.dia}
                                    className={`${
                                      validacaoSemana(
                                        column.dia,
                                        semanaSelecionada
                                      )
                                        ? "input-desabilitado"
                                        : row.name === "observacoes"
                                        ? "input-habilitado-observacoes"
                                        : "input-habilitado"
                                    }`}
                                  >
                                    {row.name === "observacoes" ? (
                                      !validacaoSemana(
                                        column.dia,
                                        semanaSelecionada
                                      ) && (
                                        <Botao
                                          texto={"Visualizar"}
                                          type={BUTTON_TYPE.BUTTON}
                                          style={
                                            BUTTON_STYLE.GREEN_OUTLINE_WHITE
                                          }
                                          onClick={() =>
                                            onClickBotaoObservacao(
                                              column.dia,
                                              categoria.id
                                            )
                                          }
                                          disabled={
                                            !valoresLancamentos.find(
                                              (valor) =>
                                                valor.nome_campo ===
                                                  "observacoes" &&
                                                Number(valor.dia) ===
                                                  Number(column.dia) &&
                                                Number(
                                                  valor.categoria_medicao
                                                ) === Number(categoria.id)
                                            )
                                          }
                                        />
                                      )
                                    ) : (
                                      <div
                                        className={`field-values-input${
                                          ehInputParaCorrecao(
                                            `dia_${column.dia}__categoria_${
                                              categoria.id
                                            }__uuid_medicao_periodo_grupo_${periodoGrupo.uuid_medicao_periodo_grupo.slice(
                                              0,
                                              5
                                            )}`
                                          ) &&
                                          modoCorrecao &&
                                          ![
                                            "Mês anterior",
                                            "Mês posterior",
                                          ].includes(
                                            values[
                                              `${row.name}__dia_${
                                                column.dia
                                              }__categoria_${
                                                categoria.id
                                              }__uuid_medicao_periodo_grupo_${periodoGrupo.uuid_medicao_periodo_grupo.slice(
                                                0,
                                                5
                                              )}`
                                            ]
                                          )
                                            ? " input-para-correcao"
                                            : ""
                                        }${
                                          ehDiaNaoLetivoOuFeriado(
                                            column,
                                            categoria
                                          )
                                            ? " dia-nao-letivo"
                                            : ""
                                        }`}
                                      >
                                        <Field
                                          className={`m-2`}
                                          component={InputValueMedicao}
                                          classNameToNextInput={getClassNameToNextInput(
                                            row,
                                            column,
                                            categoria,
                                            index
                                          )}
                                          classNameToPrevInput={getClassNameToPrevInput(
                                            row,
                                            column,
                                            categoria,
                                            index
                                          )}
                                          apenasNumeros
                                          name={getNameFieldInputValueMedicao(
                                            row,
                                            column,
                                            categoria
                                          )}
                                          disabled={true}
                                          defaultValue={defaultValue(
                                            column,
                                            row,
                                            semanaSelecionada,
                                            valoresLancamentos,
                                            categoria,
                                            form,
                                            periodoGrupo,
                                            solicitacao
                                          )}
                                          exibeTooltipPadraoRepeticaoDiasSobremesaDoce={
                                            !ehEscolaTipoCEI({
                                              nome: solicitacao.escola,
                                            }) &&
                                            exibirTooltipRepeticaoDiasSobremesaDoceDreCodae(
                                              semanaSelecionada,
                                              mesSolicitacao,
                                              anoSolicitacao,
                                              diasSobremesaDoce,
                                              column,
                                              row,
                                              categoria
                                            )
                                          }
                                          exibeTooltipInclusaoAlimentacaoAutorizadaDreCodae={
                                            !ehEscolaTipoCEI({
                                              nome: solicitacao.escola,
                                            }) &&
                                            periodosSimples.find(
                                              (periodo) =>
                                                periodo.periodo_escolar.nome ===
                                                periodoGrupo.nome_periodo_grupo
                                            ) &&
                                            exibirTooltipInclusaoAlimentacaoAutorizadaDreCodae(
                                              semanaSelecionada,
                                              inclusoesAutorizadas,
                                              column,
                                              row,
                                              categoria
                                            )
                                          }
                                          exibeTooltipAlteracaoAlimentacaoAutorizadaDreCodae={
                                            !ehEscolaTipoCEI({
                                              nome: solicitacao.escola,
                                            }) &&
                                            periodosSimples.find(
                                              (periodo) =>
                                                periodo.periodo_escolar.nome ===
                                                periodoGrupo.nome_periodo_grupo
                                            ) &&
                                            exibirTooltipAlteracaoAlimentacaoAutorizadaDreCodae(
                                              semanaSelecionada,
                                              alteracoesAlimentacaoAutorizadas,
                                              column,
                                              row,
                                              categoria
                                            )
                                          }
                                          exibeTooltipSuspensaoAutorizadaFrequenciaDreCodae={
                                            !ehEscolaTipoCEI({
                                              nome: solicitacao.escola,
                                            }) &&
                                            periodosSimples.find(
                                              (periodo) =>
                                                periodo.periodo_escolar.nome ===
                                                periodoGrupo.nome_periodo_grupo
                                            ) &&
                                            exibirTooltipSuspensaoAutorizadaFrequenciaDreCodae(
                                              semanaSelecionada,
                                              suspensoesAutorizadas,
                                              column,
                                              row,
                                              categoria,
                                              periodosSimples.find(
                                                (periodo) =>
                                                  periodo.periodo_escolar
                                                    .nome ===
                                                  periodoGrupo.nome_periodo_grupo
                                              )
                                            )
                                          }
                                          exibeTooltipSuspensaoAutorizadaAlimentacaoDreCodae={
                                            !ehEscolaTipoCEI({
                                              nome: solicitacao.escola,
                                            }) &&
                                            periodosSimples.find(
                                              (periodo) =>
                                                periodo.periodo_escolar.nome ===
                                                periodoGrupo.nome_periodo_grupo
                                            ) &&
                                            exibirTooltipSuspensaoAutorizadaAlimentacaoDreCodae(
                                              semanaSelecionada,
                                              suspensoesAutorizadas,
                                              column,
                                              row,
                                              categoria,
                                              periodosSimples.find(
                                                (periodo) =>
                                                  periodo.periodo_escolar
                                                    .nome ===
                                                  periodoGrupo.nome_periodo_grupo
                                              )
                                            )
                                          }
                                        />
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </Fragment>
                          );
                        })}
                      </article>
                    </section>
                  </div>,
                  idx === 0 && categoriasDeMedicao.length > 1 && (
                    <LegendaDiasNaoLetivos
                      diasCalendario={diasCalendario}
                      feriadosNoMes={feriadosNoMes}
                      anoSolicitacao={anoSolicitacao}
                      mesSolicitacao={mesSolicitacao}
                      weekColumns={weekColumns}
                      values={values}
                      categoria={categoria}
                      periodoGrupo={periodoGrupo}
                    />
                  ),
                ])}
              <LegendaDiasNaoLetivos
                diasCalendario={diasCalendario}
                feriadosNoMes={feriadosNoMes}
                anoSolicitacao={anoSolicitacao}
                mesSolicitacao={mesSolicitacao}
                weekColumns={weekColumns}
                values={values}
                categoria={categoriasDeMedicao[0]}
                periodoGrupo={periodoGrupo}
              />
              {usuarioEhDRE() && logPeriodoAprovado && (
                <div className="row">
                  <div className="col-12">
                    <p className="periodo-aprovado text-rigth">{`Período ${formatarNomePeriodo(
                      periodoGrupo.nome_periodo_grupo
                    )}  aprovado em ${logPeriodoAprovado.criado_em}`}</p>
                  </div>
                </div>
              )}

              {usuarioEhMedicao() && logPeriodoAprovadoCODAE && (
                <div className="row">
                  <div className="col-12">
                    <p className="periodo-aprovado text-rigth">{`Período ${formatarNomePeriodo(
                      periodoGrupo.nome_periodo_grupo
                    )}  aprovado em ${logPeriodoAprovadoCODAE.criado_em}`}</p>
                  </div>
                </div>
              )}
              {usuarioEhMedicao() && logPeriodoReprovadoCODAE && (
                <div className="row">
                  <div className="col-12">
                    <p className="periodo-aprovado text-rigth">{`Período ${formatarNomePeriodo(
                      periodoGrupo.nome_periodo_grupo
                    )}  devolvido para ajustes pela CODAE em ${
                      logPeriodoReprovadoCODAE.criado_em
                    }`}</p>
                  </div>
                </div>
              )}
              {usuarioEhDRE() && logPeriodoReprovado && (
                <div className="row">
                  <div className="col-12">
                    <p className="periodo-aprovado text-rigth">{`Período ${formatarNomePeriodo(
                      periodoGrupo.nome_periodo_grupo
                    )}  devolvido para ajustes pela DRE em ${
                      logPeriodoReprovado.criado_em
                    }`}</p>
                  </div>
                </div>
              )}
              {modoCorrecao && (
                <>
                  <div className="red">
                    Selecione
                    <b>
                      {" "}
                      nas tabelas acima os dias em que a unidade deve realizar
                      as correções{" "}
                    </b>
                    e informe no campo abaixo todas as correções a serem
                    realizadas.
                  </div>
                  <div className="mt-3">
                    <p className="mb-0">
                      Descrição da Correção <span className="red">*</span>
                    </p>
                    <Field
                      component={CKEditorField}
                      name={`descricao_correcao__periodo_grupo_${periodoGrupo.uuid_medicao_periodo_grupo.slice(
                        0,
                        5
                      )}`}
                      placeholder="Informe quais os pontos necessários de correção da Medição Inicial"
                      required
                    />
                  </div>
                </>
              )}
              <div className="periodo-final-tabela-lancamento mb-4">
                <div
                  className={`col-${
                    modoCorrecao
                      ? 7
                      : [
                          "MEDICAO_APROVADA_PELA_CODAE",
                          "MEDICAO_CORRECAO_SOLICITADA_CODAE",
                        ].includes(solicitacao.status)
                      ? 12
                      : 8
                  } pl-0 pr-4`}
                >
                  <p className="section-title-conf-lancamentos periodo mb-0">
                    {periodoGrupo.nome_periodo_grupo}
                  </p>
                </div>
                {modoCorrecao ? (
                  <div className="col-5 px-0">
                    <Botao
                      texto="Salvar Solicitação de Correção para UE"
                      style={BUTTON_STYLE.GREEN}
                      className="float-right"
                      disabled={
                        !values[
                          `descricao_correcao__periodo_grupo_${periodoGrupo.uuid_medicao_periodo_grupo.slice(
                            0,
                            5
                          )}`
                        ] || !algumCheckboxMarcado()
                      }
                      onClick={() => setShowModalSalvarSolicitacao(true)}
                    />
                    <Botao
                      texto="Cancelar"
                      style={BUTTON_STYLE.GREEN_OUTLINE_WHITE}
                      className="mr-3 float-right"
                      onClick={() => setShowModalCancelarSolicitacao(true)}
                    />
                  </div>
                ) : (
                  (exibirBotoesDRE || exibirBotoesCODAE) && (
                    <div className="botoes col-4 px-0">
                      <Botao
                        texto="Solicitar Correção"
                        style={BUTTON_STYLE.GREEN_OUTLINE_WHITE}
                        className="col-6 mr-3"
                        onClick={() => setModoCorrecao(true)}
                        disabled={
                          statusPermitidosCorrecaoDRE ||
                          statusPermitidosCorrecaoCODAE
                        }
                      />
                      <Botao
                        texto="Aprovar Período"
                        style={BUTTON_STYLE.GREEN}
                        className="col-5"
                        onClick={() => setShowModalAprovarPeriodo(true)}
                        disabled={
                          statusPermitidosAprovacaoDRE ||
                          statusPermitidosAprovacaoCODAE
                        }
                      />
                    </div>
                  )
                )}
              </div>
              <hr />
            </div>
            <ModalAprovarPeriodo
              showModal={showModalAprovarPeriodo}
              setShowModal={(value) => setShowModalAprovarPeriodo(value)}
              periodoGrupo={periodoGrupo}
              aprovarPeriodo={(nomePeridoFormatado) => {
                setShowTabelaLancamentosPeriodo(!showTabelaLancamentosPeriodo);
                aprovarPeriodo(periodoGrupo, nomePeridoFormatado);
              }}
            />
            <ModalCancelarCorrecao
              showModal={showModalCancelarSolicitacao}
              setShowModal={(value) => setShowModalCancelarSolicitacao(value)}
              cancelarCorrecao={() =>
                cancelarCorrecao(periodoGrupo.uuid_medicao_periodo_grupo)
              }
            />
            <ModalSalvarCorrecao
              showModal={showModalSalvarSolicitacao}
              setShowModal={(value) => setShowModalSalvarSolicitacao(value)}
              periodoGrupo={periodoGrupo}
              salvarCorrecao={() =>
                salvarCorrecao(periodoGrupo.uuid_medicao_periodo_grupo)
              }
            />
            <Modal
              dialogClassName="modal-50w"
              show={showModalObservacaoDiaria}
              onHide={() => setShowModalObservacaoDiaria(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Observação Diária</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="col-4 mt-0">
                  <label className="font-weight-bold">Data do Lançamento</label>
                  <Field
                    className="data_lancamento_modal"
                    component={InputText}
                    name="data_lancamento"
                    disabled
                  />
                </div>
                <div className="col-12 mt-3">
                  <label className="font-weight-bold">Observação</label>
                  <Field
                    component={CKEditorField}
                    name="observacao_modal"
                    disabled
                  />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <div className="col-12">
                  <Botao
                    className="float-right"
                    texto="Voltar"
                    type={BUTTON_TYPE.BUTTON}
                    onClick={() => setShowModalObservacaoDiaria(false)}
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                  />
                </div>
              </Modal.Footer>
            </Modal>
          </>
        )}
    </div>
  );
};
