import { Spin, Tabs } from "antd";
import {
  addDays,
  format,
  getDay,
  getWeeksInMonth,
  getYear,
  isSunday,
  isWithinInterval,
  lastDayOfMonth,
  parse,
  startOfMonth,
  subDays,
} from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import arrayMutators from "final-form-arrays";
import HTTP_STATUS from "http-status-codes";
import { Fragment, useEffect, useState } from "react";
import { Field, Form, FormSpy } from "react-final-form";
import { useLocation, useNavigate } from "react-router-dom";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import CKEditorField from "src/components/Shareable/CKEditorField";
import InputText from "src/components/Shareable/Input/InputText";
import InputValueMedicao from "src/components/Shareable/Input/InputValueMedicao";
import {
  toastError,
  toastSuccess,
  toastWarn,
} from "src/components/Shareable/Toast/dialogs";
import {
  DETALHAMENTO_DO_LANCAMENTO,
  MEDICAO_INICIAL,
} from "src/configs/constants";
import { deepCopy, ehFimDeSemanaUTC } from "src/helpers/utilities";
import { getFaixasEtarias } from "src/services/faixaEtaria.service";
import {
  getCategoriasDeMedicao,
  getDiasCalendario,
  getDiasLetivosRecreio,
  getDiasParaCorrecao,
  getFeriadosNoMes,
  getLogDietasAutorizadasCEIPeriodo,
  getLogDietasAutorizadasPeriodo,
  getLogMatriculadosPorFaixaEtariaDia,
  getMatriculadosPeriodo,
  getValoresPeriodosLancamentos,
  setPeriodoLancamento,
  updateValoresPeriodosLancamentos,
} from "src/services/medicaoInicial/periodoLancamentoMedicao.service";
import { escolaCorrigeMedicao } from "src/services/medicaoInicial/solicitacaoMedicaoInicial.service";
import { getMeusDados } from "src/services/perfil.service";
import {
  getPermissoesLancamentosEspeciaisMesAnoPorPeriodoAsync,
  getSolicitacoesInclusaoAutorizadasAsync,
} from "../PeriodoLancamentoMedicaoInicial/helper";
import {
  calcularSomaKitLanches,
  campoComSuspensaoAutorizadaESemObservacao,
  campoFrequenciaValor0ESemObservacao,
  campoLancheComLPRAutorizadaESemObservacao,
  campoLancheEmergencialComZeroOuSemObservacao,
  campoLancheEmergencialSemAutorizacaoSemObservacao,
  campoRefeicaoComRPLAutorizadaESemObservacao,
  camposKitLancheSolicitacoesAlimentacaoESemObservacao,
  exibeTooltipInclusoesAutorizadasComZero,
  exibirTooltipKitLancheSolAlimentacoes,
  exibirTooltipLancheEmergencialAutorizado,
  exibirTooltipLancheEmergencialNaoAutorizado,
  exibirTooltipLancheEmergencialZeroAutorizadoJustificado,
  exibirTooltipLPRAutorizadas,
  exibirTooltipPadraoRepeticaoDiasSobremesaDoce,
  exibirTooltipQtdKitLancheDiferenteSolAlimentacoesAutorizadas,
  exibirTooltipQtdKitLancheMenorSolAlimentacoesAutorizadas,
  exibirTooltipRepeticao,
  exibirTooltipRepeticaoDiasSobremesaDoceDiferenteZero,
  exibirTooltipRPLAutorizadas,
  exibirTooltipSuspensoesAutorizadas,
} from "../PeriodoLancamentoMedicaoInicial/validacoes";
import ModalErro from "./components/ModalErro";
import ModalObservacaoDiaria from "./components/ModalObservacaoDiaria";
import ModalSalvarCorrecoes from "./components/ModalSalvarCorrecoes";
import { ModalVoltarPeriodoLancamento } from "./components/ModalVoltarPeriodoLancamento";
import {
  categoriasParaExibir,
  desabilitarBotaoColunaObservacoes,
  desabilitarField,
  deveExistirObservacao,
  ehDiaParaCorrigir,
  ehUltimoDiaLetivoDoAno,
  formataNomeCategoriaSolAlimentacoesInfantil,
  formatarLinhasTabelaAlimentacaoCEI,
  formatarLinhasTabelaAlimentacaoEmeiDaCemei,
  formatarLinhasTabelaDietaEnteral,
  formatarLinhasTabelasDietasCEI,
  formatarLinhasTabelasDietasEmeiDaCemei,
  formatarPayloadParaCorrecao,
  formatarPayloadPeriodoLancamentoCeiCemei,
  getListaDiasSobremesaDoceAsync,
  getSolicitacoesAlteracoesAlimentacaoAutorizadasAsync,
  getSolicitacoesKitLanchesAutorizadasAsync,
  getSolicitacoesSuspensoesAutorizadasAsync,
  textoBotaoObservacao,
  valorZeroFrequenciaCEI,
} from "./helper";
import "./styles.scss";
import {
  botaoAdicionarObrigatorioTabelaAlimentacao,
  campoAlimentacoesAutorizadasDiaNaoLetivoCEINaoPreenchidoESemObservacao,
  campoComInclusaoAutorizadaValorZeroESemObservacao,
  campoDietaComInclusaoAutorizadaSemObservacao,
  exibirTooltipAlimentacoesAutorizadasDiaNaoLetivoCEI,
  exibirTooltipDietasInclusaoDiaNaoLetivoCEI,
  exibirTooltipSuspensoesAutorizadasCEI,
  frequenciaComSuspensaoAutorizadaPreenchidaESemObservacao,
  repeticaoSobremesaDoceComValorESemObservacao,
  validacoesTabelaAlimentacaoCEI,
  validacoesTabelaAlimentacaoCEIRecreioNasFerias,
  validacoesTabelaAlimentacaoEmeidaCemei,
  validacoesTabelasDietasCEI,
  validacoesTabelasDietasEmeidaCemei,
  validarFormulario,
  verificarMesAnteriorOuPosterior,
} from "./validacoes";

export const PeriodoLancamentoMedicaoInicialCEI = () => {
  const initialStateWeekColumns = [
    { position: 0, dia: "29" },
    { position: 1, dia: "30" },
    { position: 2, dia: "01" },
    { position: 3, dia: "02" },
    { position: 4, dia: "03" },
    { position: 5, dia: "04" },
    { position: 6, dia: "05" },
  ];

  const [dadosIniciais, setDadosIniciais] = useState(null);
  const [semanaSelecionada, setSemanaSelecionada] = useState(1);
  const [mesAnoConsiderado, setMesAnoConsiderado] = useState(null);
  const [mesAnoFormatadoState, setMesAnoFormatadoState] = useState(null);
  const [weekColumns, setWeekColumns] = useState(initialStateWeekColumns);
  const [faixaEtaria, setFaixasEtarias] = useState();
  const [tabelaAlimentacaoCEIRows, setTabelaAlimentacaoCEIRows] = useState([]);
  const [tabelaDietaCEIRows, setTabelaDietaCEIRows] = useState([]);
  const [tabelaDietaEnteralRows, setTabelaDietaEnteralRows] = useState([]);
  const [categoriasDeMedicao, setCategoriasDeMedicao] = useState([]);
  const [diasSobremesaDoce, setDiasSobremesaDoce] = useState(null);
  const [inclusoesAutorizadas, setInclusoesAutorizadas] = useState(null);
  const [suspensoesAutorizadas, setSuspensoesAutorizadas] = useState(null);
  const [
    alteracoesAlimentacaoAutorizadas,
    setAlteracoesAlimentacaoAutorizadas,
  ] = useState(null);
  const [kitLanchesAutorizadas, setKitLanchesAutorizadas] = useState(null);
  const [exibirTooltipAoSalvar] = useState(false);
  const [inputsInclusaoComErro] = useState([]);
  const [
    valoresMatriculadosFaixaEtariaDia,
    setValoresMatriculadosFaixaEtariaDia,
  ] = useState([]);
  const [
    valoresMatriculadosFaixaEtariaDiaInclusoes,
    setValoresMatriculadosFaixaEtariaDiaInclusoes,
  ] = useState([]);
  const [valoresMatriculadosEmeiDaCemei, setValoresMatriculadosEmeiDaCemei] =
    useState([]);
  const [logQtdDietasAutorizadasCEI, setLogQtdDietasAutorizadasCEI] = useState(
    [],
  );
  const [
    logQtdDietasAutorizadasEmeiDaCemei,
    setLogQtdDietasAutorizadasEmeiDaCemei,
  ] = useState([]);
  const [
    dadosValoresInclusoesAutorizadasState,
    setDadosValoresInclusoesAutorizadasState,
  ] = useState(null);
  const [valoresPeriodosLancamentos, setValoresPeriodosLancamentos] = useState(
    [],
  );
  const [calendarioMesConsiderado, setCalendarioMesConsiderado] =
    useState(null);
  const [feriadosNoMes, setFeriadosNoMes] = useState(null);
  const [showModalObservacaoDiaria, setShowModalObservacaoDiaria] =
    useState(false);
  const [showModalSalvarCorrecoes, setShowModalSalvarCorrecoes] =
    useState(false);
  const [
    showModalVoltarPeriodoLancamento,
    setShowModalVoltarPeriodoLancamento,
  ] = useState(false);
  const [disableBotaoSalvarLancamentos, setDisableBotaoSalvarLancamentos] =
    useState(true);
  const [exibirTooltip, setExibirTooltip] = useState(false);
  const [showDiaObservacaoDiaria, setDiaObservacaoDiaria] = useState(null);
  const [showCategoriaObservacaoDiaria, setCategoriaObservacaoDiaria] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingLancamentos, setLoadingLancamentos] = useState(true);
  const [formValuesAtualizados, setFormValuesAtualizados] = useState(null);
  const [diasDaSemanaSelecionada, setDiasDaSemanaSelecionada] = useState(null);
  const [ultimaAtualizacaoMedicao, setUltimaAtualizacaoMedicao] =
    useState(null);
  const [showModalErro, setShowModalErro] = useState(false);
  const [valoresObservacoes, setValoresObservacoes] = useState([]);
  const [periodoGrupo, setPeriodoGrupo] = useState(null);
  const [tabItems, setTabItems] = useState(null);
  const [diasParaCorrecao, setDiasParaCorrecao] = useState(null);
  const [
    permissoesLancamentosEspeciaisPorDia,
    setPermissoesLancamentosEspeciaisPorDia,
  ] = useState(null);
  const [
    alimentacoesLancamentosEspeciais,
    setAlimentacoesLancamentosEspeciais,
  ] = useState(null);
  const [dataInicioPermissoes, setDataInicioPermissoes] = useState(null);
  const [previousValue, setPreviousValue] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  let mesAnoDefault = new Date();

  const ehEmeiDaCemeiLocation =
    location && location.state && location.state.ehEmeiDaCemei;
  const ehSolicitacoesAlimentacaoLocation =
    location &&
    location.state &&
    location.state.periodo === "Solicitações de Alimentação";
  const ehProgramasEProjetosLocation =
    location &&
    location.state &&
    location.state.periodo === "Programas e Projetos";
  const uuidPeriodoEscolarLocation =
    location && location.state && location.state.uuidPeriodoEscolar;

  const ehRecreioNasFerias = () => {
    return location.state.recreioNasFerias;
  };

  const ehGrupoColaboradores = () => {
    return location.state.grupo === "Colaboradores";
  };
  let valuesInputArray = [];

  useEffect(() => {
    const mesAnoSelecionado = location.state
      ? typeof location.state.mesAnoSelecionado === "string"
        ? new Date(location.state.mesAnoSelecionado.replace("'", ""))
        : new Date(location.state.mesAnoSelecionado)
      : mesAnoDefault;
    const mesString = format(mesAnoSelecionado, "LLLL", {
      locale: ptBR,
    }).toString();
    const mesAnoFormatado =
      mesString.charAt(0).toUpperCase() +
      mesString.slice(1) +
      " / " +
      getYear(mesAnoSelecionado).toString();

    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    setSemanaSelecionada(1);
    setMesAnoConsiderado(mesAnoSelecionado);
    setMesAnoFormatadoState(mesAnoFormatado);

    const fetch = async () => {
      const response = await getMeusDados();
      const meusDados = response.data;
      const escola =
        meusDados.vinculo_atual && meusDados.vinculo_atual.instituicao;
      const periodo = location.state ? location.state.periodo : "INTEGRAL";

      const mes = format(mesAnoSelecionado, "MM");
      const ano = getYear(mesAnoSelecionado);

      const response_faixas_etarias = await getFaixasEtarias();
      if (response_faixas_etarias.status === HTTP_STATUS.OK) {
        setFaixasEtarias(response_faixas_etarias.data.results);
      }

      let response_sobremesa_doce = [];
      response_sobremesa_doce = await getListaDiasSobremesaDoceAsync(
        escola.uuid,
        mes,
        ano,
      );
      setDiasSobremesaDoce(response_sobremesa_doce);

      let response_inclusoes_autorizadas = [];
      response_inclusoes_autorizadas =
        await getSolicitacoesInclusaoAutorizadasAsync(
          escola.uuid,
          mes,
          ano,
          location && location.state && location.state.periodosInclusaoContinua
            ? Object.keys(location.state.periodosInclusaoContinua)
            : [periodo],
          location,
        );
      setInclusoesAutorizadas(response_inclusoes_autorizadas);
      if (response_inclusoes_autorizadas.length > 0 && periodo === "PARCIAL") {
        const params = {
          escola_uuid: escola.uuid,
          nome_periodo_escolar: "INTEGRAL",
          mes: mes,
          ano: ano,
          dias: response_inclusoes_autorizadas
            .map((inclusao) => inclusao.dia)
            .join(","),
        };
        const response_log_matriculados_por_faixa_etaria_dia_inclusoes =
          await getLogMatriculadosPorFaixaEtariaDia(params);
        setValoresMatriculadosFaixaEtariaDiaInclusoes(
          response_log_matriculados_por_faixa_etaria_dia_inclusoes.data,
        );
      }

      let response_alteracoes_alimentacao_autorizadas = [];
      response_alteracoes_alimentacao_autorizadas =
        await getSolicitacoesAlteracoesAlimentacaoAutorizadasAsync(
          escola.uuid,
          mes,
          ano,
          periodo,
        );
      setAlteracoesAlimentacaoAutorizadas(
        response_alteracoes_alimentacao_autorizadas,
      );

      let response_suspensoes_autorizadas = [];
      response_suspensoes_autorizadas =
        await getSolicitacoesSuspensoesAutorizadasAsync(
          escola.uuid,
          mes,
          ano,
          periodo,
        );
      setSuspensoesAutorizadas(response_suspensoes_autorizadas);

      let response_kit_lanches_autorizadas = [];
      if (ehSolicitacoesAlimentacaoLocation) {
        response_kit_lanches_autorizadas =
          await getSolicitacoesKitLanchesAutorizadasAsync(
            escola.uuid,
            mes,
            ano,
          );
        setKitLanchesAutorizadas(response_kit_lanches_autorizadas);

        response_alteracoes_alimentacao_autorizadas =
          await getSolicitacoesAlteracoesAlimentacaoAutorizadasAsync(
            escola.uuid,
            mes,
            ano,
            periodo,
            true,
          );
        setAlteracoesAlimentacaoAutorizadas(
          response_alteracoes_alimentacao_autorizadas,
        );
      }

      let response_log_matriculados_por_faixa_etaria_dia = [];
      let response_log_dietas_autorizadas_cei = [];
      let response_matriculados_emei_da_cemei = [];
      let response_log_dietas_autorizadas_emei_da_cemei = [];
      let response_permissoes_lancamentos_especiais_mes_ano_por_periodo = [];

      let response_categorias_medicao = await getCategoriasDeMedicao();

      const params_dias_calendario = {
        escola_uuid: escola.uuid,
        mes: mes,
        ano: ano,
      };
      const calendario = await obterDiasLetivosCorretos(params_dias_calendario);

      if (ehEmeiDaCemeiLocation) {
        response_permissoes_lancamentos_especiais_mes_ano_por_periodo =
          await getPermissoesLancamentosEspeciaisMesAnoPorPeriodoAsync(
            escola.uuid,
            mes,
            ano,
            periodo.split(" ")[1],
          );
        setPermissoesLancamentosEspeciaisPorDia(
          response_permissoes_lancamentos_especiais_mes_ano_por_periodo.permissoes_por_dia,
        );
        setAlimentacoesLancamentosEspeciais(
          response_permissoes_lancamentos_especiais_mes_ano_por_periodo.alimentacoes_lancamentos_especiais?.map(
            (ali) => ali.name,
          ),
        );
        setDataInicioPermissoes(
          response_permissoes_lancamentos_especiais_mes_ano_por_periodo.data_inicio_permissoes,
        );

        const params_matriculados = {
          escola_uuid: escola.uuid,
          mes: mes,
          ano: ano,
          tipo_turma: "REGULAR",
          periodo_escolar: periodo,
        };
        response_matriculados_emei_da_cemei = await obterNumerosMatriculados(
          params_matriculados,
          calendario,
          ehEmeiDaCemeiLocation,
        );
        setValoresMatriculadosEmeiDaCemei(
          response_matriculados_emei_da_cemei.data,
        );

        const params_dietas_autorizadas_emei_da_cemei = {
          escola_uuid: escola.uuid,
          periodo_escolar: uuidPeriodoEscolarLocation,
          mes: mes,
          ano: ano,
        };
        if (periodo.includes("INTEGRAL")) {
          params_dietas_autorizadas_emei_da_cemei["cei_ou_emei"] = "EMEI";
        }
        response_log_dietas_autorizadas_emei_da_cemei =
          await getLogDietasAutorizadasPeriodo(
            params_dietas_autorizadas_emei_da_cemei,
          );
        setLogQtdDietasAutorizadasEmeiDaCemei(
          response_log_dietas_autorizadas_emei_da_cemei.data,
        );
      } else if (ehProgramasEProjetosLocation) {
        const params_dietas_autorizadas = {
          escola_uuid: escola.uuid,
          mes,
          ano,
          unificado: true,
        };
        response_log_dietas_autorizadas_emei_da_cemei =
          await getLogDietasAutorizadasPeriodo(params_dietas_autorizadas);
        setLogQtdDietasAutorizadasEmeiDaCemei(
          response_log_dietas_autorizadas_emei_da_cemei.data,
        );
      } else if (ehGrupoColaboradores()) {
        response_matriculados_emei_da_cemei = await obterNumerosMatriculados(
          {},
          calendario,
          ehEmeiDaCemeiLocation,
        );
        setValoresMatriculadosEmeiDaCemei(
          response_matriculados_emei_da_cemei.data,
        );
      } else {
        const params_matriculados_por_faixa_etaria_dia = {
          escola_uuid: escola.uuid,
          nome_periodo_escolar: periodo,
          mes: mes,
          ano: ano,
        };

        response_log_matriculados_por_faixa_etaria_dia =
          await obterNumerosMatriculados(
            params_matriculados_por_faixa_etaria_dia,
            calendario,
            ehEmeiDaCemeiLocation,
          );

        setValoresMatriculadosFaixaEtariaDia(
          response_log_matriculados_por_faixa_etaria_dia.data,
        );

        const params_dietas_autorizadas_cei = {
          escola_uuid: escola.uuid,
          nome_periodo_escolar: periodo,
          mes: mes,
          ano: ano,
        };
        response_log_dietas_autorizadas_cei =
          await getLogDietasAutorizadasCEIPeriodo(
            params_dietas_autorizadas_cei,
          );
        setLogQtdDietasAutorizadasCEI(response_log_dietas_autorizadas_cei.data);
      }

      const linhasTabelaAlimentacaoCEI =
        ehEmeiDaCemeiLocation ||
        ehSolicitacoesAlimentacaoLocation ||
        ehProgramasEProjetosLocation ||
        ehGrupoColaboradores()
          ? formatarLinhasTabelaAlimentacaoEmeiDaCemei(
              location.state.tiposAlimentacao,
              ehSolicitacoesAlimentacaoLocation,
              response_permissoes_lancamentos_especiais_mes_ano_por_periodo.alimentacoes_lancamentos_especiais ||
                [],
              ehProgramasEProjetosLocation,
              ehGrupoColaboradores(),
            )
          : formatarLinhasTabelaAlimentacaoCEI(
              response_log_matriculados_por_faixa_etaria_dia,
              periodoGrupo,
              response_faixas_etarias.data.results,
              response_inclusoes_autorizadas,
              null,
              ehRecreioNasFerias(),
            );
      setTabelaAlimentacaoCEIRows(linhasTabelaAlimentacaoCEI);

      let linhasTabelasDietasCEI =
        ehEmeiDaCemeiLocation || ehProgramasEProjetosLocation
          ? formatarLinhasTabelasDietasEmeiDaCemei(
              location.state.tiposAlimentacao,
            )
          : formatarLinhasTabelasDietasCEI(
              response_log_dietas_autorizadas_cei,
              periodoGrupo,
            );
      setTabelaDietaCEIRows(linhasTabelasDietasCEI);

      let linhasTabelaDietaEnteral = [];
      if (ehEmeiDaCemeiLocation || ehProgramasEProjetosLocation) {
        linhasTabelaDietaEnteral = formatarLinhasTabelaDietaEnteral(
          location.state.tiposAlimentacao,
          linhasTabelasDietasCEI,
        );
        setTabelaDietaEnteralRows(linhasTabelaDietaEnteral);
      }

      response_categorias_medicao = categoriasParaExibir(
        ehEmeiDaCemeiLocation,
        ehProgramasEProjetosLocation,
        response_categorias_medicao,
        response_log_dietas_autorizadas_cei,
        ehSolicitacoesAlimentacaoLocation,
        response_log_dietas_autorizadas_emei_da_cemei.data,
      );
      setCategoriasDeMedicao(response_categorias_medicao);

      let params = {
        uuid_solicitacao_medicao: uuid,
        nome_grupo:
          ehEmeiDaCemeiLocation ||
          ehSolicitacoesAlimentacaoLocation ||
          ehProgramasEProjetosLocation
            ? periodo
            : location.state.grupo,
      };
      if (
        !(
          ehEmeiDaCemeiLocation ||
          ehSolicitacoesAlimentacaoLocation ||
          ehProgramasEProjetosLocation ||
          ehRecreioNasFerias()
        )
      ) {
        params = {
          ...params,
          nome_periodo_escolar: periodo,
        };
      }
      const response_valores_periodos =
        await getValoresPeriodosLancamentos(params);
      setValoresPeriodosLancamentos(response_valores_periodos.data);

      const response_dias_correcao = await getDiasParaCorrecao(params);
      if (response_dias_correcao.status === HTTP_STATUS.OK) {
        setDiasParaCorrecao(response_dias_correcao.data);
      }

      const params_feriados_no_mes = {
        mes: mes,
        ano: ano,
      };
      const response_feriados_no_mes = await getFeriadosNoMes(
        params_feriados_no_mes,
      );
      setFeriadosNoMes(response_feriados_no_mes.data.results);

      await formatarDadosValoresMedicao(
        mesAnoFormatado,
        response_valores_periodos.data,
        response_categorias_medicao,
        linhasTabelaAlimentacaoCEI,
        linhasTabelasDietasCEI,
        linhasTabelaDietaEnteral,
        mesAnoSelecionado,
        response_log_matriculados_por_faixa_etaria_dia.data,
        response_log_dietas_autorizadas_cei.data,
        response_matriculados_emei_da_cemei.data,
        response_log_dietas_autorizadas_emei_da_cemei.data,
        response_kit_lanches_autorizadas,
        response_inclusoes_autorizadas,
        valoresMatriculadosFaixaEtariaDiaInclusoes,
      );

      let items = exibirAbaDasSemanas(mesAnoSelecionado);
      setTabItems(items);

      setLoading(false);
      setLoadingLancamentos(false);
    };
    fetch();
  }, []);

  const existeSemanaNoIntervaloRecreio = (
    diasSemana,
    mesAnoReferencia,
    dataInicioRecreio,
    dataFimRecreio,
  ) => {
    if (!ehRecreioNasFerias()) return true;
    return diasSemana.some(({ dia, mes, ano }) => {
      const dataCompleta = parse(
        `${dia}/${mes}/${ano}`,
        "dd/MM/yyyy",
        new Date(),
      );

      return isWithinInterval(dataCompleta, {
        start: dataInicioRecreio,
        end: dataFimRecreio,
      });
    });
  };

  const formatarDadosValoresMedicao = async (
    mesAnoFormatado,
    valoresMedicao,
    categoriasMedicao,
    tabelaAlimentacaoCEIRows,
    tabelaDietaCEIRows,
    tabelaDietaEnteralRows,
    mesAno,
    matriculadosFaixaEtariaDia,
    logQtdDietasAutorizadasCEI,
    matriculadosEmeiDaCemei,
    logQtdDietasAutorizadasEmeiDaCemei,
    kitLanchesAutorizadas,
    solInclusoesAutorizadas,
    valoresMatriculadosFaixaEtariaDiaInclusoes,
  ) => {
    let dadosValoresMedicoes = {};
    let dadosValoresMatriculadosFaixaEtariaDia = {};
    let dadosValoresDietasAutorizadas = {};
    let dadosValoresForaDoMes = {};
    let dadosValoresMatriculadosEmeiDaCemei = {};
    let dadosValoresDietasAutorizadasEmeiDaCemei = {};
    let dadosValoresZeroDietasAutorizadasEmeiDaCemei = {};
    let dadosValoresKitLanchesAutorizadas = {};
    let dadosValoresAlunos = {};
    let periodoEscolar = "MANHA";
    let justificativaPeriodo = "";
    if (location.state) {
      justificativaPeriodo = location.state.justificativa_periodo;
      if (location.state.grupo && location.state.periodo) {
        periodoEscolar = location.state.recreioNasFerias
          ? `${location.state.grupo}`
          : `${location.state.periodo}`;
      } else if (location.state.grupo) {
        periodoEscolar = `${location.state.grupo}`;
      } else {
        periodoEscolar = `${location.state.periodo}`;
      }
    }
    setPeriodoGrupo(periodoEscolar);
    const formataPeriodoSolAlimentacoesInfantil = (periodoEscolar) => {
      if (periodoEscolar === "Solicitações de Alimentação") {
        return "Solicitações de Alimentação - Infantil";
      } else if (periodoEscolar.includes("Recreio nas Férias")) {
        return "Recreio nas Férias";
      } else {
        return periodoEscolar;
      }
    };

    if (ehRecreioNasFerias()) {
      mesAnoFormatado =
        location.state.solicitacaoMedicaoInicial.recreio_nas_ferias.titulo;
    }
    const dadosMesPeriodo = {
      mes_lancamento: mesAnoFormatado,
      periodo_escolar: formataPeriodoSolAlimentacoesInfantil(periodoEscolar),
      justificativa_periodo: justificativaPeriodo,
    };
    let dadosValoresInclusoesAutorizadas = {};

    categoriasMedicao &&
      categoriasMedicao.forEach((categoria) => {
        logQtdDietasAutorizadasCEI &&
          logQtdDietasAutorizadasCEI.forEach((log) => {
            categoria.nome.includes("TIPO B") &&
              log.classificacao.toUpperCase() === "TIPO B" &&
              (dadosValoresDietasAutorizadas[
                `dietas_autorizadas__faixa_${log.faixa_etaria.uuid}__dia_${log.dia}__categoria_${categoria.id}`
              ] = `${log.quantidade}`);
          });

        if (
          categoria.nome.includes("ENTERAL") &&
          logQtdDietasAutorizadasEmeiDaCemei
        ) {
          const logsEnteralAminoacidos =
            logQtdDietasAutorizadasEmeiDaCemei.filter(
              (logDieta) =>
                logDieta.classificacao.toUpperCase().includes("ENTERAL") ||
                logDieta.classificacao.toUpperCase().includes("AMINOÁCIDOS"),
            );

          logsEnteralAminoacidos.forEach((log) => {
            const logsFiltrados = logsEnteralAminoacidos.filter(
              (logFiltrado) => logFiltrado.dia === log.dia,
            );
            const qtdDietasTipoEnteralAminoacidos = logsFiltrados.reduce(
              function (acc, log) {
                return acc + log.quantidade;
              },
              0,
            );
            logsFiltrados.length &&
              (dadosValoresDietasAutorizadasEmeiDaCemei[
                `dietas_autorizadas__dia_${log.dia}__categoria_${categoria.id}`
              ] = `${qtdDietasTipoEnteralAminoacidos}`);
          });
        }

        logQtdDietasAutorizadasEmeiDaCemei &&
          logQtdDietasAutorizadasEmeiDaCemei.forEach((log) => {
            categoria.nome === "DIETA ESPECIAL - TIPO A" &&
              log.classificacao.toUpperCase() === "TIPO A" &&
              (dadosValoresDietasAutorizadasEmeiDaCemei[
                `dietas_autorizadas__dia_${log.dia}__categoria_${categoria.id}`
              ] = `${log.quantidade}`);
            categoria.nome.includes("TIPO B") &&
              log.classificacao.toUpperCase() === "TIPO B" &&
              (dadosValoresDietasAutorizadasEmeiDaCemei[
                `dietas_autorizadas__dia_${log.dia}__categoria_${categoria.id}`
              ] = `${log.quantidade}`);
          });

        kitLanchesAutorizadas &&
          ehSolicitacoesAlimentacaoLocation &&
          kitLanchesAutorizadas.forEach((kit) => {
            categoria.nome.includes("SOLICITAÇÕES") &&
              ((!ultimaAtualizacaoMedicao &&
                !valoresMedicao[0]?.medicao_alterado_em) ||
                valoresMedicao.filter(
                  (valor) =>
                    valor.nome_campo === "observacoes" &&
                    valor.categoria_medicao === categoria.id &&
                    valor.dia === kit.dia,
                ).length === 0) &&
              (dadosValoresKitLanchesAutorizadas[
                `kit_lanche__dia_${kit.dia}__categoria_${categoria.id}`
              ] = dadosValoresKitLanchesAutorizadas[
                `kit_lanche__dia_${kit.dia}__categoria_${categoria.id}`
              ]
                ? parseInt(
                    dadosValoresKitLanchesAutorizadas[
                      `kit_lanche__dia_${kit.dia}__categoria_${categoria.id}`
                    ],
                  ) + kit.numero_alunos
                : kit.numero_alunos).toString();
          });

        if (ehProgramasEProjetosLocation) {
          for (let i = 1; i <= 31; i++) {
            const dia = String(i).length === 1 ? "0" + String(i) : String(i);
            const incFiltradasPorDia = solInclusoesAutorizadas.filter(
              (each) => each.dia === dia,
            );
            if (
              incFiltradasPorDia.length &&
              !valoresMedicao[
                `numero_de_alunos__dia_${dia}__categoria_${categoria.id}`
              ] &&
              categoria.nome === "ALIMENTAÇÃO"
            ) {
              dadosValoresAlunos[
                `numero_de_alunos__dia_${dia}__categoria_${categoria.id}`
              ] = `${incFiltradasPorDia.reduce(
                (total, obj) => obj.numero_alunos + total,
                0,
              )}`;
            }
          }

          tabelaAlimentacaoCEIRows &&
            tabelaAlimentacaoCEIRows.forEach((alimentacao) => {
              if (
                (categoria.nome.includes("ALIMENTAÇÃO") ||
                  categoria.nome.includes("DIETA")) &&
                solInclusoesAutorizadas
              ) {
                const inclusoesFiltradas = solInclusoesAutorizadas.filter(
                  (inclusao) =>
                    inclusao.alimentacoes
                      .split(", ")
                      .includes(alimentacao.name),
                );
                for (let i = 1; i <= 31; i++) {
                  const dia =
                    String(i).length === 1 ? "0" + String(i) : String(i);
                  const incFiltradasPorDia = inclusoesFiltradas.filter(
                    (each) => each.dia === dia,
                  );
                  if (
                    incFiltradasPorDia.length &&
                    !valoresMedicao[
                      `${alimentacao.name}__dia_${dia}__categoria_${categoria.id}`
                    ]
                  ) {
                    dadosValoresInclusoesAutorizadas[
                      `${alimentacao.name}__dia_${dia}__categoria_${categoria.id}`
                    ] = `${incFiltradasPorDia.reduce(
                      (total, obj) => obj.numero_alunos + total,
                      0,
                    )}`;
                  }
                }
              }
            });
        }
        setDadosValoresInclusoesAutorizadasState(
          dadosValoresInclusoesAutorizadas,
        );

        let diasSemana = [];
        const numeroSemana = Number(semanaSelecionada);
        let datasRecreio = {};
        if (ehRecreioNasFerias()) {
          datasRecreio = datasInicoFimRecreio();
        }
        let diaDaSemanaNumerico = obterDiaNumericoDaSemana(
          mesAno,
          datasRecreio?.inicio,
        );
        let dataInicioCalendario = obterDataInicioCalendario(mesAno);
        if (numeroSemana === 1) {
          diasSemana = construirPrimeiraSemanaCalendario(
            [],
            dataInicioCalendario,
            diaDaSemanaNumerico,
          );
        }
        if (numeroSemana !== 1) {
          diasSemana = construirOutrasSemanaCalendario(
            dataInicioCalendario,
            diasSemana,
            diaDaSemanaNumerico,
            numeroSemana,
          );
        }

        tabelaAlimentacaoCEIRows &&
          tabelaDietaCEIRows &&
          [tabelaAlimentacaoCEIRows, tabelaDietaCEIRows].forEach(
            (each) =>
              each &&
              each.forEach((row) => {
                for (let { dia, mes, ano } of diasSemana) {
                  const dataCompleta = { dia, mes, ano };

                  let uuidFaixasDietas = [];
                  if (categoria.nome === "DIETA ESPECIAL - TIPO A") {
                    logQtdDietasAutorizadasCEI &&
                      logQtdDietasAutorizadasCEI.forEach(
                        (log) =>
                          !uuidFaixasDietas.find(
                            (faixa) => faixa === log.faixa_etaria.uuid,
                          ) && uuidFaixasDietas.push(log.faixa_etaria.uuid),
                      );
                    logQtdDietasAutorizadasCEI &&
                      uuidFaixasDietas.forEach((faixa) => {
                        const logsFiltrados = logQtdDietasAutorizadasCEI.filter(
                          (log) =>
                            log.classificacao
                              .toUpperCase()
                              .includes("TIPO A") &&
                            log.dia === dia &&
                            log.faixa_etaria.uuid === faixa,
                        );
                        const qtdDietasTipoA = logsFiltrados.reduce(function (
                          acc,
                          log,
                        ) {
                          return acc + log.quantidade;
                        }, 0);
                        logsFiltrados.length &&
                          (dadosValoresDietasAutorizadas[
                            `dietas_autorizadas__faixa_${faixa}__dia_${dia}__categoria_${categoria.id}`
                          ] = `${qtdDietasTipoA}`);
                      });
                  }
                  let nameInputField = null;
                  if (
                    ehEmeiDaCemeiLocation ||
                    ehSolicitacoesAlimentacaoLocation ||
                    ehProgramasEProjetosLocation ||
                    ehGrupoColaboradores()
                  ) {
                    nameInputField = `${row.name}__dia_${dia}__categoria_${categoria.id}`;
                  } else {
                    nameInputField = `${row.name}__faixa_${row.uuid}__dia_${dia}__categoria_${categoria.id}`;
                  }
                  let result = verificarMesAnteriorOuPosterior(
                    dataCompleta,
                    mesAno,
                  );

                  if (result) {
                    dadosValoresForaDoMes[nameInputField] = result;
                  }
                }
              }),
          );

        valoresMedicao &&
          valoresMedicao.forEach((valor_medicao) => {
            if (
              valor_medicao.nome_campo === "observacoes" ||
              ehEmeiDaCemeiLocation ||
              ehSolicitacoesAlimentacaoLocation ||
              ehProgramasEProjetosLocation ||
              ehGrupoColaboradores()
            ) {
              dadosValoresMedicoes[
                `${valor_medicao.nome_campo}__dia_${valor_medicao.dia}__categoria_${valor_medicao.categoria_medicao}`
              ] = valor_medicao.valor ? `${valor_medicao.valor}` : null;
            } else {
              dadosValoresMedicoes[
                `${valor_medicao.nome_campo}__faixa_${valor_medicao.faixa_etaria}__dia_${valor_medicao.dia}__categoria_${valor_medicao.categoria_medicao}`
              ] = valor_medicao.valor ? `${valor_medicao.valor}` : null;
            }
          });
      });

    const idCategoriaAlimentacao =
      categoriasMedicao.length &&
      categoriasMedicao.find((categoria) =>
        categoria.nome.includes("ALIMENTAÇÃO"),
      ).id;

    matriculadosFaixaEtariaDia &&
      idCategoriaAlimentacao &&
      matriculadosFaixaEtariaDia.forEach((objMatriculado) => {
        const dietasMesmoDia = Object.fromEntries(
          Object.entries(dadosValoresDietasAutorizadas).filter(([key]) =>
            key.includes(
              `dietas_autorizadas__faixa_${objMatriculado.faixa_etaria.uuid}__dia_${objMatriculado.dia}`,
            ),
          ),
        );
        const somaDietasMesmoDia = Object.values(dietasMesmoDia).reduce(
          (acc, value) => {
            return acc + Number(value);
          },
          0,
        );

        let quantidade = objMatriculado.quantidade;
        const inclusaoNesseDia =
          valoresMatriculadosFaixaEtariaDiaInclusoes.length > 0 &&
          valoresMatriculadosFaixaEtariaDiaInclusoes.find(
            (valorMatriculados) =>
              valorMatriculados.dia === objMatriculado.dia &&
              valorMatriculados.faixa_etaria.uuid ===
                objMatriculado.faixa_etaria.uuid,
          );
        if (inclusaoNesseDia) {
          quantidade = inclusaoNesseDia.quantidade;
        }
        const prefixo = ehRecreioNasFerias() ? "participantes" : "matriculados";
        dadosValoresMatriculadosFaixaEtariaDia[
          `${prefixo}__faixa_${objMatriculado.faixa_etaria.uuid}__dia_${objMatriculado.dia}__categoria_${idCategoriaAlimentacao}`
        ] = quantidade
          ? `${Math.max(quantidade - somaDietasMesmoDia, 0)}`
          : null;
      });

    valoresMatriculadosFaixaEtariaDiaInclusoes.forEach(
      (valorMatriculadoFaixaEtariaDiaInclusao) => {
        if (
          !dadosValoresMatriculadosFaixaEtariaDia[
            `matriculados__faixa_${valorMatriculadoFaixaEtariaDiaInclusao.faixa_etaria.uuid}__dia_${valorMatriculadoFaixaEtariaDiaInclusao.dia}__categoria_${idCategoriaAlimentacao}`
          ]
        ) {
          dadosValoresMatriculadosFaixaEtariaDia[
            `matriculados__faixa_${valorMatriculadoFaixaEtariaDiaInclusao.faixa_etaria.uuid}__dia_${valorMatriculadoFaixaEtariaDiaInclusao.dia}__categoria_${idCategoriaAlimentacao}`
          ] = valorMatriculadoFaixaEtariaDiaInclusao.quantidade;
        }
      },
    );

    const ehColaborador = ehGrupoColaboradores();
    const prefixo = ehColaborador ? "participantes" : "matriculados";
    const propriedadeQuantidade = ehColaborador
      ? "quantidade"
      : "quantidade_alunos";

    (ehEmeiDaCemeiLocation || ehGrupoColaboradores()) &&
      matriculadosEmeiDaCemei &&
      idCategoriaAlimentacao &&
      matriculadosEmeiDaCemei.forEach((objMatriculadoEmeiDaCemei) => {
        const chave = `${prefixo}__dia_${objMatriculadoEmeiDaCemei.dia}__categoria_${idCategoriaAlimentacao}`;
        dadosValoresMatriculadosEmeiDaCemei[chave] =
          objMatriculadoEmeiDaCemei[propriedadeQuantidade];
      });

    valoresMedicao &&
      valoresMedicao.length > 0 &&
      setUltimaAtualizacaoMedicao(valoresMedicao[0].medicao_alterado_em);

    ehEmeiDaCemeiLocation &&
      dadosValoresDietasAutorizadasEmeiDaCemei &&
      Object.entries(dadosValoresDietasAutorizadasEmeiDaCemei).forEach(
        (arr) => {
          if (arr[1] === "0") {
            const keySplitted = arr[0].split("__");
            const dia = keySplitted[1].match(/\d/g).join("");
            const categoria = keySplitted.pop();
            const idCategoria = categoria.match(/\d/g).join("");
            tabelaDietaEnteralRows
              .filter((row) => row.name !== "observacoes")
              .forEach((row) => {
                dadosValoresZeroDietasAutorizadasEmeiDaCemei[
                  `${row.name}__dia_${dia}__categoria_${idCategoria}`
                ] = "0";
              });
          }
        },
      );

    setDadosIniciais({
      ...dadosMesPeriodo,
      ...dadosValoresAlunos,
      ...dadosValoresKitLanchesAutorizadas,
      ...dadosValoresMedicoes,
      ...dadosValoresMatriculadosFaixaEtariaDia,
      ...dadosValoresMatriculadosEmeiDaCemei,
      ...dadosValoresDietasAutorizadas,
      ...dadosValoresDietasAutorizadasEmeiDaCemei,
      ...dadosValoresZeroDietasAutorizadasEmeiDaCemei,
      ...dadosValoresForaDoMes,
      semanaSelecionada,
    });
    setLoading(false);
  };

  useEffect(() => {
    montarCalendario();
    const formatar = async () => {
      formatarDadosValoresMedicao(
        mesAnoFormatadoState,
        valoresPeriodosLancamentos,
        categoriasDeMedicao,
        tabelaAlimentacaoCEIRows,
        tabelaDietaCEIRows,
        tabelaDietaEnteralRows,
        mesAnoConsiderado,
        valoresMatriculadosFaixaEtariaDia,
        logQtdDietasAutorizadasCEI,
        valoresMatriculadosEmeiDaCemei,
        logQtdDietasAutorizadasEmeiDaCemei,
        kitLanchesAutorizadas,
        inclusoesAutorizadas,
        valoresMatriculadosFaixaEtariaDiaInclusoes,
      );
    };
    semanaSelecionada && formatar();

    valoresPeriodosLancamentos.findIndex(
      (valor) => valor.nome_campo !== "observacoes",
    ) !== -1 && setDisableBotaoSalvarLancamentos(false);
  }, [
    mesAnoConsiderado,
    semanaSelecionada,
    categoriasDeMedicao,
    tabelaAlimentacaoCEIRows,
    valoresPeriodosLancamentos,
  ]);

  useEffect(() => {
    const tresMinutos = 180000;
    const intervalCall = setInterval(() => {
      formValuesAtualizados &&
        !disableBotaoSalvarLancamentos &&
        onSubmit(
          formValuesAtualizados,
          dadosValoresInclusoesAutorizadasState,
          true,
        );
    }, tresMinutos);
    return () => {
      clearInterval(intervalCall);
    };
  }, [
    formValuesAtualizados,
    dadosValoresInclusoesAutorizadasState,
    disableBotaoSalvarLancamentos,
  ]);

  const onSubmitObservacao = async (values, dia, categoria, form, errors) => {
    let valoresMedicao = [];
    const valuesMesmoDiaDaObservacao = Object.fromEntries(
      Object.entries(values).filter(([key]) =>
        key.includes(`__dia_${dia}__categoria_${categoria}`),
      ),
    );
    Object.entries(valuesMesmoDiaDaObservacao).forEach(([key, value]) => {
      return (
        ["Mês anterior", "Mês posterior", null].includes(value) &&
        delete valuesMesmoDiaDaObservacao[key]
      );
    });
    let qtdCamposComErro = 0;

    if (
      Object.entries(errors).filter(([key]) =>
        key.includes(`__dia_${dia}__categoria_${categoria}`),
      ).length
    ) {
      toastError(
        `Não foi possível salvar seu comentário, pois existe(m) erro(s) na coluna do dia ${dia}.`,
      );
      form.change(`observacoes__dia_${dia}__categoria_${categoria}`, "");
      return;
    }
    Object.entries(valuesMesmoDiaDaObservacao).forEach(([key, value]) => {
      const keySplitted = key.split("__");
      const uuid_faixa_etaria = keySplitted[1].replace("faixa_", "");
      let nameMatriculadoInputField = null;
      const prefixo = ehGrupoColaboradores() ? "participantes" : "matriculados";
      if (ehEmeiDaCemeiLocation || ehGrupoColaboradores()) {
        nameMatriculadoInputField = `${prefixo}__dia_${dia}__categoria_${categoria}`;
      } else {
        nameMatriculadoInputField = `matriculados__faixa_${uuid_faixa_etaria}__dia_${dia}__categoria_${categoria}`;
      }
      if (
        !(key.includes("observacoes") || key.includes("matriculados")) &&
        Number(value) >
          Number(valuesMesmoDiaDaObservacao[nameMatriculadoInputField])
      ) {
        qtdCamposComErro++;
      }
    });
    if (qtdCamposComErro) {
      const prefixo = ehRecreioNasFerias() ? "participantes" : "matriculados";
      toastError(
        `Existe(m) ${qtdCamposComErro} campo(s) com valor maior que ${prefixo}. Necessário corrigir.`,
      );
      return;
    }
    Object.entries(valuesMesmoDiaDaObservacao).forEach((v) => {
      const keySplitted = v[0].split("__");
      const categoria = keySplitted.pop();
      const idCategoria = categoria.match(/\d/g).join("");
      const dia = keySplitted[
        v[0].includes("observacoes") ||
        ehEmeiDaCemeiLocation ||
        ehSolicitacoesAlimentacaoLocation ||
        ehProgramasEProjetosLocation ||
        ehGrupoColaboradores()
          ? 1
          : 2
      ]
        .match(/\d/g)
        .join("");
      const nome_campo = keySplitted[0];
      const uuid_faixa_etaria =
        v[0].includes("observacoes") ||
        ehEmeiDaCemeiLocation ||
        ehSolicitacoesAlimentacaoLocation ||
        ehProgramasEProjetosLocation ||
        ehRecreioNasFerias()
          ? ""
          : keySplitted[1].replace("faixa_", "");

      return valoresMedicao.push({
        dia: dia,
        valor: ["<p></p>\n", ""].includes(v[1]) ? 0 : v[1],
        nome_campo: nome_campo,
        categoria_medicao: idCategoria,
        faixa_etaria: uuid_faixa_etaria,
      });
    });

    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");

    const solicitacao_medicao_inicial = uuid;
    let payload = {
      solicitacao_medicao_inicial: solicitacao_medicao_inicial,
      valores_medicao: valoresMedicao,
      eh_observacao: true,
    };
    if (
      (ehEmeiDaCemeiLocation &&
        values["periodo_escolar"] &&
        values["periodo_escolar"].includes("Infantil")) ||
      (values["periodo_escolar"] &&
        values["periodo_escolar"].includes("Solicitações")) ||
      values["periodo_escolar"] === "ETEC" ||
      values["periodo_escolar"] === "Programas e Projetos" ||
      ehRecreioNasFerias()
    ) {
      payload["grupo"] = values["periodo_escolar"];
      if (payload["grupo"] && payload["grupo"].includes("Solicitações")) {
        payload["grupo"] = "Solicitações de Alimentação";
      }
      delete values["periodo_escolar"];
    } else {
      payload["periodo_escolar"] = values["periodo_escolar"];
    }
    let valores_medicao_response = [];
    if (valoresPeriodosLancamentos.length) {
      const response = await updateValoresPeriodosLancamentos(
        valoresPeriodosLancamentos[0].medicao_uuid,
        payload,
      );
      if (response.status === HTTP_STATUS.OK) {
        toastSuccess("Observação salva com sucesso");
        valores_medicao_response = response.data.valores_medicao;
      } else {
        return toastError("Erro ao salvar observação.");
      }
    } else {
      const response = await setPeriodoLancamento(payload);
      if (response.status === HTTP_STATUS.CREATED) {
        toastSuccess("Observação salva com sucesso");
        valores_medicao_response = response.data.valores_medicao;
      } else {
        return toastError("Erro ao salvar observação.");
      }
    }
    setValoresObservacoes(
      valores_medicao_response.filter(
        (valor) => valor.nome_campo === "observacoes",
      ),
    );
    setExibirTooltip(false);
  };

  const onSubmit = async (
    values,
    dadosValoresInclusoesAutorizadasState,
    ehSalvamentoAutomatico = false,
    chamarFuncaoFormatar = true,
    ehCorrecao = false,
  ) => {
    const prefixo = ehRecreioNasFerias() ? "participantes" : "matriculados";
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    let valuesClone = deepCopy(values);
    setDadosIniciais(values);
    const idCategoriaAlimentacao = categoriasDeMedicao.find((categoria) =>
      categoria.nome.includes("ALIMENTAÇÃO"),
    ).id;
    valuesClone.solicitacao_medicao_inicial = uuid;
    Object.entries(valuesClone).forEach(([key, value]) => {
      return (
        (["Mês anterior", "Mês posterior", null].includes(value) ||
          (key.includes(prefixo) &&
            !key.includes(`categoria_${idCategoriaAlimentacao}`))) &&
        delete valuesClone[key]
      );
    });

    const dadosIniciaisFiltered = Object.entries(dadosIniciais)
      .filter(([key]) => !key.includes(prefixo))
      .filter(([key]) => !key.includes("dietas_autorizadas"))
      .filter(
        ([, value]) => !["Mês anterior", "Mês posterior", null].includes(value),
      )
      .filter(([key]) => key.includes("categoria"));

    const payload = formatarPayloadPeriodoLancamentoCeiCemei(
      valuesClone,
      tabelaAlimentacaoCEIRows,
      dadosIniciaisFiltered,
      diasDaSemanaSelecionada,
      ehEmeiDaCemeiLocation,
      ehSolicitacoesAlimentacaoLocation,
      ehProgramasEProjetosLocation,
      ehRecreioNasFerias(),
      ehGrupoColaboradores(),
    );
    if (payload.valores_medicao.length === 0)
      return (
        !ehSalvamentoAutomatico && toastWarn("Não há valores para serem salvos")
      );

    if (ehCorrecao) {
      const payloadParaCorrecao = formatarPayloadParaCorrecao(payload);
      const response = await escolaCorrigeMedicao(
        valoresPeriodosLancamentos[0].medicao_uuid,
        payloadParaCorrecao,
      );
      if (response.status === HTTP_STATUS.OK) {
        let mes = new Date(location.state.mesAnoSelecionado).getMonth() + 1;
        const ano = new Date(location.state.mesAnoSelecionado).getFullYear();
        mes = String(mes).length === 1 ? "0" + String(mes) : String(mes);
        navigate(
          `/${MEDICAO_INICIAL}/${DETALHAMENTO_DO_LANCAMENTO}?mes=${mes}&ano=${ano}`,
        );
        return toastSuccess("Correções salvas com sucesso!");
      } else {
        return toastError("Erro ao salvar correções.");
      }
    }

    let valores_medicao_response = [];
    if (valoresPeriodosLancamentos.length) {
      setLoading(true);
      const response = await updateValoresPeriodosLancamentos(
        valoresPeriodosLancamentos[0].medicao_uuid,
        payload,
      );
      if (response.status === HTTP_STATUS.OK) {
        !ehSalvamentoAutomatico &&
          toastSuccess("Lançamentos salvos com sucesso");
        valores_medicao_response = response.data.valores_medicao;
      } else {
        return (
          !ehSalvamentoAutomatico && toastError("Erro ao salvar lançamentos.")
        );
      }
    } else {
      setLoading(true);
      const response = await setPeriodoLancamento(payload);
      if (response.status === HTTP_STATUS.CREATED) {
        !ehSalvamentoAutomatico &&
          toastSuccess("Lançamentos salvos com sucesso");
        valores_medicao_response = response.data.valores_medicao;
      } else {
        return (
          !ehSalvamentoAutomatico && toastError("Erro ao salvar lançamentos.")
        );
      }
    }
    setValoresPeriodosLancamentos(valores_medicao_response);
    if (chamarFuncaoFormatar) {
      await formatarDadosValoresMedicao(
        mesAnoFormatadoState,
        valores_medicao_response,
        categoriasDeMedicao,
        tabelaAlimentacaoCEIRows,
        tabelaDietaCEIRows,
        tabelaDietaEnteralRows,
        mesAnoConsiderado,
        valoresMatriculadosFaixaEtariaDia,
        logQtdDietasAutorizadasCEI,
        valoresMatriculadosEmeiDaCemei,
        logQtdDietasAutorizadasEmeiDaCemei,
        kitLanchesAutorizadas,
        inclusoesAutorizadas,
        valoresMatriculadosFaixaEtariaDiaInclusoes,
      );
    }
    setLoading(false);
    setDisableBotaoSalvarLancamentos(true);
  };

  const onChangeSemana = async (values, key) => {
    if (exibirTooltip) {
      setShowModalErro(true);
    } else {
      setSemanaSelecionada(key);
      onSubmit(
        formValuesAtualizados,
        dadosValoresInclusoesAutorizadasState,
        true,
        false,
        false,
      );
      return (values["week"] = Number(key));
    }
  };

  const defaultValue = (column, row) => {
    let result = null;
    const prefixo = ehRecreioNasFerias() ? "participantes" : "matriculados";
    if (row.name === prefixo) {
      result = null;
    }
    result = verificarMesAnteriorOuPosterior(column, mesAnoConsiderado);
    return result;
  };

  const validacaoSemana = (dia) => {
    return (
      (Number(semanaSelecionada) === 1 && Number(dia) > 20) ||
      ([4, 5, 6].includes(Number(semanaSelecionada)) && Number(dia) < 10)
    );
  };

  const validacaoDiaLetivo = (dia) => {
    const diaCalendario = calendarioMesConsiderado.find(
      (item) => Number(item.dia) === Number(dia),
    );

    const ehDiaLetivo = diaCalendario?.dia_letivo === true;
    if (!ehDiaLetivo && !ehRecreioNasFerias()) return false;

    const dataAtual = new Date(
      mesAnoConsiderado.getFullYear(),
      mesAnoConsiderado.getMonth(),
      dia,
    );

    const temInclusaoAutorizada = inclusoesAutorizadas.some(
      (inclusao) => Number(inclusao.dia) === Number(dia),
    );

    const ehFeriado = feriadosNoMes.some(
      (feriado) => Number(feriado) === Number(dia),
    );

    const ehFinalDeSemanaOuFeriado = ehFimDeSemanaUTC(dataAtual) || ehFeriado;

    if (ehFinalDeSemanaOuFeriado) {
      return temInclusaoAutorizada;
    }

    return true;
  };

  const openModalObservacaoDiaria = (dia, categoria) => {
    setShowModalObservacaoDiaria(true);
    setDiaObservacaoDiaria(dia);
    setCategoriaObservacaoDiaria(categoria);
  };

  const onClickBotaoObservacao = (dia, categoria) => {
    openModalObservacaoDiaria(dia, categoria);
  };

  const desabilitaTooltip = (values) => {
    const erro = validarFormulario(
      values,
      location,
      categoriasDeMedicao,
      dadosValoresInclusoesAutorizadasState,
      weekColumns,
      feriadosNoMes,
    );
    if (erro) {
      setDisableBotaoSalvarLancamentos(true);
      setExibirTooltip(true);
    }
  };

  const onChangeInput = (
    value,
    previous,
    errors,
    formValuesAtualizados,
    dia,
    categoria,
    column,
    row,
    form,
  ) => {
    (ehEmeiDaCemeiLocation || ehProgramasEProjetosLocation) &&
      valorZeroFrequenciaCEI(
        value,
        row.name,
        categoria,
        dia,
        form,
        tabelaAlimentacaoCEIRows,
        tabelaDietaCEIRows,
        tabelaDietaEnteralRows,
        formValuesAtualizados,
      );
    if (
      (value || previous) &&
      value !== previous &&
      !["Mês anterior", "Mês posterior"].includes(value) &&
      !["Mês anterior", "Mês posterior"].includes(previous)
    ) {
      setExibirTooltip(false);
      setDisableBotaoSalvarLancamentos(false);
    } else if (typeof value === "string") {
      value.match(/\d+/g) !== null && valuesInputArray.push(value);
      if (value === null) {
        valuesInputArray.length = 0;
      }
      if (value.match(/\d+/g) !== null && valuesInputArray.length > 0) {
        setDisableBotaoSalvarLancamentos(false);
      } else {
        desabilitaTooltip(formValuesAtualizados);
        setDisableBotaoSalvarLancamentos(true);
      }
    }

    if (Object.keys(errors).length > 0) {
      setDisableBotaoSalvarLancamentos(true);
      setExibirTooltip(true);
    }

    const valuesFrequencia = Object.fromEntries(
      Object.entries(formValuesAtualizados).filter(([key]) =>
        key.includes("frequencia"),
      ),
    );
    let arrayDiasComFrequenciaZero = [];
    for (const key in valuesFrequencia) {
      if (Number(valuesFrequencia[key]) === 0) {
        const keySplitted = key.split("__");
        const dia = keySplitted[1].match(/\d/g).join("");
        arrayDiasComFrequenciaZero.push(dia);
      }
    }
    desabilitaTooltip(formValuesAtualizados);

    if (
      (exibirTooltipRPLAutorizadas(
        formValuesAtualizados,
        row,
        column,
        categoria,
        alteracoesAlimentacaoAutorizadas,
      ) ||
        (categoria.nome.includes("ALIMENTAÇÃO") &&
          (exibirTooltipAlimentacoesAutorizadasDiaNaoLetivoCEI(
            inclusoesAutorizadas,
            row,
            column,
            categoria,
            formValuesAtualizados,
          ) ||
            (!ehEmeiDaCemeiLocation &&
              frequenciaComSuspensaoAutorizadaPreenchidaESemObservacao(
                formValuesAtualizados,
                column,
                categoria,
                suspensoesAutorizadas,
                categoriasDeMedicao,
              )) ||
            campoAlimentacoesAutorizadasDiaNaoLetivoCEINaoPreenchidoESemObservacao(
              inclusoesAutorizadas,
              column,
              categoria,
              formValuesAtualizados,
            ) ||
            exibirTooltipLPRAutorizadas(
              formValuesAtualizados,
              row,
              column,
              categoria,
              alteracoesAlimentacaoAutorizadas,
            ) ||
            exibeTooltipInclusoesAutorizadasComZero(
              formValuesAtualizados,
              row,
              column,
              categoria,
              inclusoesAutorizadas,
              ehProgramasEProjetosLocation,
              alteracoesAlimentacaoAutorizadas,
            ) ||
            (ehEmeiDaCemeiLocation &&
              exibirTooltipSuspensoesAutorizadas(
                formValuesAtualizados,
                row,
                column,
                categoria,
                suspensoesAutorizadas,
              )) ||
            (categoria.nome.includes("SOLICITAÇÕES") &&
              (exibirTooltipQtdKitLancheDiferenteSolAlimentacoesAutorizadas(
                formValuesAtualizados,
                row,
                column,
                categoria,
                kitLanchesAutorizadas,
              ) ||
                exibirTooltipKitLancheSolAlimentacoes(
                  formValuesAtualizados,
                  row,
                  column,
                  categoria,
                  kitLanchesAutorizadas,
                ) ||
                exibirTooltipLancheEmergencialAutorizado(
                  formValuesAtualizados,
                  row,
                  column,
                  categoria,
                  alteracoesAlimentacaoAutorizadas,
                ) ||
                exibirTooltipLancheEmergencialNaoAutorizado(
                  formValuesAtualizados,
                  row,
                  column,
                  categoria,
                  alteracoesAlimentacaoAutorizadas,
                ))))) ||
        ((ehEmeiDaCemeiLocation || ehProgramasEProjetosLocation) &&
          campoFrequenciaValor0ESemObservacao(
            column.dia,
            categoria,
            formValuesAtualizados,
          ))) &&
      !formValuesAtualizados[
        `observacoes__dia_${column.dia}__categoria_${categoria.id}`
      ]
    ) {
      setDisableBotaoSalvarLancamentos(true);
      setExibirTooltip(true);
    }

    if (
      (!ehEmeiDaCemeiLocation &&
        campoDietaComInclusaoAutorizadaSemObservacao(
          formValuesAtualizados,
          column,
          categoria,
          inclusoesAutorizadas,
          logQtdDietasAutorizadasCEI,
        )) ||
      (ehProgramasEProjetosLocation &&
        repeticaoSobremesaDoceComValorESemObservacao &&
        repeticaoSobremesaDoceComValorESemObservacao(
          formValuesAtualizados,
          column.dia,
          categoria,
          diasSobremesaDoce,
          location,
        ))
    ) {
      setDisableBotaoSalvarLancamentos(true);
      setExibirTooltip(true);
    }

    if (
      deveExistirObservacao(
        categoria.id,
        formValuesAtualizados,
        calendarioMesConsiderado,
      )
    ) {
      return;
    }
  };

  const fieldValidationsTabelasCEI =
    (rowName, dia, idCategoria, nomeCategoria, uuidFaixaEtaria) =>
    (value, allValues) => {
      if (nomeCategoria === "ALIMENTAÇÃO") {
        if (ehRecreioNasFerias()) {
          return validacoesTabelaAlimentacaoCEIRecreioNasFerias(
            rowName,
            dia,
            idCategoria,
            allValues,
            uuidFaixaEtaria,
            faixaEtaria,
          );
        } else {
          return validacoesTabelaAlimentacaoCEI(
            rowName,
            dia,
            idCategoria,
            allValues,
            uuidFaixaEtaria,
          );
        }
      } else if (nomeCategoria.includes("DIETA")) {
        return validacoesTabelasDietasCEI(
          rowName,
          dia,
          idCategoria,
          allValues,
          uuidFaixaEtaria,
        );
      }
    };

  const fieldValidationsTabelasEmeidaCemei =
    (rowName, dia, idCategoria, nomeCategoria) => (value, allValues) => {
      if (nomeCategoria.includes("SOLICITAÇÕES")) {
        if (
          rowName === "kit_lanche" &&
          Number(value) > calcularSomaKitLanches(kitLanchesAutorizadas, dia)
        ) {
          return "Não é possível aumentar a quantidade de kits. Corrija o apontamento.";
        }
        return undefined;
      }
      if (nomeCategoria === "ALIMENTAÇÃO") {
        return validacoesTabelaAlimentacaoEmeidaCemei(
          rowName,
          dia,
          idCategoria,
          allValues,
          value,
          alteracoesAlimentacaoAutorizadas,
          inclusoesAutorizadas,
          validacaoDiaLetivo,
          ehProgramasEProjetosLocation,
          dadosValoresInclusoesAutorizadasState,
          ehGrupoColaboradores(),
        );
      } else if (nomeCategoria.includes("DIETA")) {
        return validacoesTabelasDietasEmeidaCemei(
          rowName,
          dia,
          idCategoria,
          nomeCategoria,
          allValues,
          value,
          categoriasDeMedicao,
          alteracoesAlimentacaoAutorizadas,
        );
      }
    };

  const classNameFieldTabelaAlimentacaoEMEI = (
    row,
    column,
    categoria,
    kitLanchesAutorizadas,
    alteracoesAlimentacaoAutorizadas,
    valoresPeriodosLancamentos,
    diasParaCorrecao,
  ) => {
    if (
      Object.keys(dadosValoresInclusoesAutorizadasState).some((key) =>
        String(key).includes(`__dia_${column.dia}__categoria_${categoria.id}`),
      ) ||
      `${row.name}__dia_${column.dia}__categoria_${categoria.id}` in
        dadosValoresInclusoesAutorizadasState
    ) {
      return "";
    }
    return `${
      !validacaoDiaLetivo(column.dia) &&
      !ehDiaParaCorrigir(
        column.dia,
        categoria.id,
        valoresPeriodosLancamentos,
        diasParaCorrecao,
      ) &&
      ((kitLanchesAutorizadas &&
        !kitLanchesAutorizadas.filter(
          (kitLanche) => kitLanche.dia === column.dia,
        ).length &&
        row.name === "kit_lanche") ||
        (alteracoesAlimentacaoAutorizadas &&
          !alteracoesAlimentacaoAutorizadas.filter(
            (lancheEmergencial) => lancheEmergencial.dia === column.dia,
          ).length &&
          row.name === "lanche_emergencial"))
        ? "nao-eh-dia-letivo"
        : ""
    }`;
  };

  const classNameFieldTabelaAlimentacao = (row, column, categoria) => {
    const resultado = inclusoesAutorizadas.some(
      (inclusao) =>
        String(inclusao.dia) === String(column.dia) &&
        inclusao.faixas_etarias.includes(row.uuid) &&
        row.name === "frequencia" &&
        categoria.nome === "ALIMENTAÇÃO",
    );
    if (resultado) return "";

    if (
      Object.keys(dadosValoresInclusoesAutorizadasState).some((key) =>
        String(key).includes(`__dia_${column.dia}__categoria_${categoria.id}`),
      )
    ) {
      return "";
    }
    if (
      `${row.name}__dia_${column.dia}__categoria_${categoria.id}` in
      dadosValoresInclusoesAutorizadasState
    ) {
      return "";
    }
    return `${(() => {
      const chave = `${row.name}__dia_${column.dia}__categoria_${categoria.id}`;
      const estaEmDados = chave in dadosValoresInclusoesAutorizadasState;
      const diaLetivo = validacaoDiaLetivo(column.dia);
      const temInclusao = inclusoesAutorizadas.some(
        (inclusao) =>
          parseInt(column.dia) === parseInt(inclusao.dia) &&
          row.name === "frequencia",
      );
      const diaCorrigir = ehDiaParaCorrigir(
        column.dia,
        categoria.id,
        diasParaCorrecao,
      );

      const resultado = estaEmDados
        ? ""
        : !diaLetivo && !temInclusao && !diaCorrigir
          ? "nao-eh-dia-letivo"
          : "";

      return resultado;
    })()}`;
  };

  const onClickBotaoVoltar = () => {
    disableBotaoSalvarLancamentos
      ? navigate(-1)
      : setShowModalVoltarPeriodoLancamento(true);
  };

  const getClassNameToNextInput = (row, column, categoria, index) => {
    if (
      row.name !== "observacoes" &&
      column &&
      index + 1 < tabelaAlimentacaoCEIRows.length - 1
    ) {
      const faixa = ehGrupoColaboradores() ? "" : `__faixa_${row.uuid}`;
      return `${tabelaAlimentacaoCEIRows[index + 1].name}${faixa}__dia_${column.dia}__categoria_${categoria.id}`;
    }
    return undefined;
  };

  const getClassNameToPrevInput = (row, column, categoria, index) => {
    if (
      row.name !== "frequencia" &&
      column &&
      tabelaAlimentacaoCEIRows[index - 1]
    ) {
      const faixa = ehGrupoColaboradores() ? "" : `__faixa_${row.uuid}`;
      return `${tabelaAlimentacaoCEIRows[index - 1].name}${faixa}__dia_${column.dia}__categoria_${categoria.id}`;
    }
    return undefined;
  };

  const exibeBotaoAdicionarObservacao = (dia) => {
    if (ehSolicitacoesAlimentacaoLocation || ehProgramasEProjetosLocation) {
      return !validacaoSemana(dia);
    }

    if (ehRecreioNasFerias()) {
      const diaEncontrado = calendarioMesConsiderado.find(
        (item) => item.dia === dia,
      );
      if (!diaEncontrado) {
        return false;
      }
    }

    const temInclusaoAutorizadaNoDia = inclusoesAutorizadas.some(
      (inclusao) => Number(inclusao.dia) === Number(dia),
    );
    return (
      !validacaoSemana(dia) &&
      (validacaoDiaLetivo(dia) || temInclusaoAutorizadaNoDia)
    );
  };

  const obterDiasLetivosCorretos = async (params_dias_calendario) => {
    let data = [];
    if (ehRecreioNasFerias()) {
      const diasLetivosRecreio = await getDiasLetivosRecreio({
        solictacao_uuid: location.state.solicitacaoMedicaoInicial.uuid,
      });
      data = diasLetivosRecreio.data;
    } else {
      const diasLetivos = await getDiasCalendario(params_dias_calendario);
      data = diasLetivos.data;
    }

    setCalendarioMesConsiderado(data);
    return data;
  };

  const obterNumerosMatriculados = async (
    params_matriculados,
    calendario,
    ehEmeiDaCemeiLocation,
  ) => {
    let response_matriculados = {};

    let numeroParticipantes = 0;
    if (ehRecreioNasFerias()) {
      const participantes =
        location.state.solicitacaoMedicaoInicial.recreio_nas_ferias
          .unidades_participantes[0];

      if (ehGrupoColaboradores()) {
        numeroParticipantes = participantes.num_colaboradores;
      } else {
        numeroParticipantes = participantes.num_inscritos;
      }

      response_matriculados = {
        data: calendario
          .filter((dia) => dia.dia_letivo === true)
          .map((dia) => ({
            dia: dia.dia,
            quantidade: numeroParticipantes,
            faixa_etaria: {
              uuid: null,
            },
          })),
      };
    } else {
      response_matriculados = ehEmeiDaCemeiLocation
        ? await getMatriculadosPeriodo(params_matriculados)
        : await getLogMatriculadosPorFaixaEtariaDia(params_matriculados);
    }
    return response_matriculados;
  };

  const exibirAbaDasSemanas = (mesAnoSelecionado) => {
    let itemsSemanas = [];
    let dataInicoRecreio = null;
    let dataFimRecreio = null;
    if (ehRecreioNasFerias()) {
      const dataRecreio =
        location.state.solicitacaoMedicaoInicial.recreio_nas_ferias;
      dataInicoRecreio = parse(
        dataRecreio.data_inicio,
        "dd/MM/yyyy",
        new Date(),
        { locale: ptBR },
      );
      dataFimRecreio = parse(dataRecreio.data_fim, "dd/MM/yyyy", new Date(), {
        locale: ptBR,
      });
    }

    const totalSemanas = isSunday(lastDayOfMonth(mesAnoSelecionado))
      ? getWeeksInMonth(mesAnoSelecionado) - 1
      : getDay(startOfMonth(mesAnoSelecionado)) === 0
        ? getWeeksInMonth(mesAnoSelecionado) + 1
        : getWeeksInMonth(mesAnoSelecionado);

    let numeroSemanaCorreto = 0;
    const primeiroDiaDoMes = startOfMonth(mesAnoSelecionado);
    let diaDaSemana = getDay(primeiroDiaDoMes);
    const offsetParaDomingo = diaDaSemana; // quantos dias para trás até o domingo
    const domingoPrimeiraSemana = subDays(primeiroDiaDoMes, offsetParaDomingo);
    Array.from({ length: totalSemanas }).forEach((_, numeroSemana) => {
      const dias = [];
      const inicioSemana = addDays(domingoPrimeiraSemana, numeroSemana * 7);
      for (let i = 0; i < 7; i++) {
        const data = addDays(inicioSemana, i);
        dias.push({
          dia: format(data, "dd"),
          mes: format(data, "MM"),
          ano: format(data, "yyyy"),
        });
      }

      const incluiSemana = existeSemanaNoIntervaloRecreio(
        dias,
        mesAnoSelecionado,
        dataInicoRecreio,
        dataFimRecreio,
      );
      if (incluiSemana) {
        itemsSemanas.push({
          key: `${numeroSemanaCorreto + 1}`,
          label: `Semana ${numeroSemanaCorreto + 1}`,
        });
        numeroSemanaCorreto += 1;
      }
    });
    return itemsSemanas;
  };

  const montarCalendario = () => {
    let diasSemana = [];
    let week = [];
    const numeroSemana = Number(semanaSelecionada);

    let datasRecreio = {};
    if (ehRecreioNasFerias()) {
      datasRecreio = datasInicoFimRecreio();
    }

    setLoading(true);

    let diaDaSemanaNumerico = obterDiaNumericoDaSemana(
      mesAnoConsiderado,
      datasRecreio?.inicio,
    );
    let dataInicioCalendario = obterDataInicioCalendario(mesAnoConsiderado);

    if (mesAnoConsiderado && numeroSemana === 1) {
      diasSemana = construirPrimeiraSemanaCalendario(
        [],
        dataInicioCalendario,
        diaDaSemanaNumerico,
      );
      setDiasDaSemanaSelecionada(diasSemana);
      week = weekColumns.map((column) => {
        return {
          ...column,
          dia: diasSemana[column["position"]].dia,
          mes: diasSemana[column["position"]].mes,
          ano: diasSemana[column["position"]].ano,
        };
      });
      setWeekColumns(week);
    }

    if (mesAnoConsiderado && numeroSemana !== 1) {
      diasSemana = construirOutrasSemanaCalendario(
        dataInicioCalendario,
        diasSemana,
        diaDaSemanaNumerico,
        numeroSemana,
      );
      const deveExibirSemana = existeSemanaNoIntervaloRecreio(
        diasSemana,
        mesAnoConsiderado,
        datasRecreio?.inicio,
        datasRecreio?.fim,
      );

      if (deveExibirSemana) {
        setDiasDaSemanaSelecionada(diasSemana);
        week = weekColumns.map((column) => {
          return {
            ...column,
            dia: diasSemana[column["position"]].dia,
            mes: diasSemana[column["position"]].mes,
            ano: diasSemana[column["position"]].ano,
          };
        });
        setWeekColumns(week);
      }
    }
  };

  const construirPrimeiraSemanaCalendario = (
    diasSemana,
    dataInicioCalendario,
    diaDaSemanaNumerico,
  ) => {
    diasSemana.unshift({
      dia: format(dataInicioCalendario, "dd"),
      mes: format(dataInicioCalendario, "MM"),
      ano: format(dataInicioCalendario, "yyyy"),
    });

    for (let i = 1; i < diaDaSemanaNumerico; i++) {
      const data = subDays(dataInicioCalendario, i);
      diasSemana.unshift({
        dia: format(data, "dd"),
        mes: format(data, "MM"),
        ano: format(data, "yyyy"),
      });
    }
    for (let i = diaDaSemanaNumerico; i < 7; i++) {
      const data = addDays(dataInicioCalendario, i + 1 - diaDaSemanaNumerico);
      diasSemana.push({
        dia: format(data, "dd"),
        mes: format(data, "MM"),
        ano: format(data, "yyyy"),
      });
    }

    return diasSemana;
  };

  const construirOutrasSemanaCalendario = (
    dataInicioCalendario,
    diasSemana,
    diaDaSemanaNumerico,
    numeroSemana,
  ) => {
    let dia = addDays(dataInicioCalendario, 7 * (numeroSemana - 1));
    diasSemana.unshift({
      dia: format(dia, "dd"),
      mes: format(dia, "MM"),
      ano: format(dia, "yyyy"),
    });

    for (let i = 1; i < diaDaSemanaNumerico; i++) {
      const data = subDays(dia, i);
      diasSemana.unshift({
        dia: format(data, "dd"),
        mes: format(data, "MM"),
        ano: format(data, "yyyy"),
      });
    }

    for (let i = diaDaSemanaNumerico; i < 7; i++) {
      const data = addDays(dia, i + 1 - diaDaSemanaNumerico);
      diasSemana.push({
        dia: format(data, "dd"),
        mes: format(data, "MM"),
        ano: format(data, "yyyy"),
      });
    }

    return diasSemana;
  };

  const obterDataInicioCalendario = (mesAnoConsiderado) => {
    return ehRecreioNasFerias()
      ? mesAnoConsiderado
      : startOfMonth(mesAnoConsiderado);
  };

  const obterDiaNumericoDaSemana = (mesAnoConsiderado, dataInicoRecreio) => {
    let diaDaSemanaNumerico = 0;
    if (ehRecreioNasFerias() && dataInicoRecreio) {
      diaDaSemanaNumerico = getDay(dataInicoRecreio);
    } else {
      diaDaSemanaNumerico = getDay(startOfMonth(mesAnoConsiderado)); // 0 representa Domingo
    }

    if (diaDaSemanaNumerico === 0) {
      diaDaSemanaNumerico = 7;
    }

    return diaDaSemanaNumerico;
  };

  const datasInicoFimRecreio = () => {
    const dataRecreio =
      location.state.solicitacaoMedicaoInicial.recreio_nas_ferias;
    const dataInicoRecreio = parse(
      dataRecreio.data_inicio,
      "dd/MM/yyyy",
      new Date(),
      { locale: ptBR },
    );
    const dataFimRecreio = parse(
      dataRecreio.data_fim,
      "dd/MM/yyyy",
      new Date(),
      {
        locale: ptBR,
      },
    );

    return { inicio: dataInicoRecreio, fim: dataFimRecreio };
  };

  return (
    <>
      <div className="text-end botao-voltar-lancamento-medicao">
        <Botao
          type={BUTTON_TYPE.BUTTON}
          texto={"Voltar"}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          icon={BUTTON_ICON.ARROW_LEFT}
          onClick={() => onClickBotaoVoltar()}
        />
      </div>
      <Spin tip="Carregando..." spinning={loading}>
        {!loading && dadosIniciais && (
          <Form
            onSubmit={onSubmit}
            mutators={{
              ...arrayMutators,
            }}
            initialValues={dadosIniciais}
            render={({ handleSubmit, form, errors }) => (
              <form onSubmit={handleSubmit}>
                <FormSpy
                  subscription={{ values: true, active: true }}
                  onChange={(changes) => {
                    setFormValuesAtualizados({
                      week: semanaSelecionada,
                      ...changes.values,
                    });
                  }}
                />
                <div className="card mt-3">
                  <div className="card-body">
                    <div className="row pb-2">
                      <div className="col-3 mes-lancamento">
                        <b className="pb-2 mb-2">Mês do Lançamento</b>
                        <Field
                          dataTestId="input-mes-lancamento"
                          component={InputText}
                          name="mes_lancamento"
                          disabled={true}
                        />
                      </div>
                      <div className="col-4">
                        <b className="pb-2">Período de Lançamento</b>
                        <Field
                          dataTestId={"input-periodo-lancamento"}
                          component={InputText}
                          name="periodo_escolar"
                          disabled={true}
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
                              Há erros no lançamento. Corrija para conseguir
                              salvar.
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
                    {location.state && location.state.justificativa_periodo && (
                      <div className="row pt-4 pb-2 mt-legenda">
                        <div className="col">
                          <b className="pb-2 mb-2">
                            Correções solicitadas pela{" "}
                            {location.state.status_periodo ===
                            "MEDICAO_CORRECAO_SOLICITADA_CODAE"
                              ? "CODAE"
                              : "DRE"}
                            :
                          </b>
                          <Field
                            component={CKEditorField}
                            name="justificativa_periodo"
                            disabled={true}
                          />
                        </div>
                      </div>
                    )}
                    <div
                      className={`row pb-2 pt-4 ${
                        !(
                          location.state && location.state.justificativa_periodo
                        ) && "mt-legenda"
                      }`}
                    >
                      <div className="col semanas">
                        <b className="section-title">
                          Semanas do Período para Lançamento da Medição Inicial
                        </b>
                      </div>
                    </div>
                    <div className="weeks-tabs mb-2">
                      <Tabs
                        activeKey={semanaSelecionada}
                        onChange={(key) => {
                          calendarioMesConsiderado &&
                            feriadosNoMes &&
                            onChangeSemana(formValuesAtualizados, key);
                        }}
                        type="card"
                        className={`${
                          semanaSelecionada === 1
                            ? "default-color-first-semana"
                            : ""
                        }`}
                        items={tabItems}
                      />
                    </div>
                    <Spin tip="Carregando..." spinning={loadingLancamentos}>
                      {categoriasDeMedicao.length > 0 &&
                        !loading &&
                        categoriasDeMedicao.map((categoria) => (
                          <div
                            key={categoria.uuid}
                            data-testid={`div-lancamentos-por-categoria-${categoria.uuid}`}
                          >
                            <b className="pb-2 section-title">
                              {formataNomeCategoriaSolAlimentacoesInfantil(
                                categoria.nome,
                              )}
                            </b>
                            <section className="tabela-tipos-alimentacao">
                              <article>
                                <div
                                  className={
                                    "grid-table-tipos-alimentacao header-table"
                                  }
                                >
                                  <div />
                                  {weekColumns.map((column) => (
                                    <div key={column.dia}>{column.dia}</div>
                                  ))}
                                </div>
                                <div
                                  className={
                                    "grid-table-tipos-alimentacao header-table"
                                  }
                                >
                                  <div />
                                  <div>Seg.</div>
                                  <div>Ter.</div>
                                  <div>Qua.</div>
                                  <div>Qui.</div>
                                  <div>Sex.</div>
                                  <div>Sáb.</div>
                                  <div>Dom.</div>
                                </div>
                                {!!semanaSelecionada &&
                                  calendarioMesConsiderado &&
                                  feriadosNoMes &&
                                  tabelaAlimentacaoCEIRows &&
                                  tabelaDietaCEIRows &&
                                  (categoria.nome.includes("DIETA")
                                    ? categoria.nome.includes("ENTERAL")
                                      ? tabelaDietaEnteralRows
                                      : tabelaDietaCEIRows
                                    : tabelaAlimentacaoCEIRows
                                  ).map((row, index) => {
                                    return (
                                      <Fragment key={index}>
                                        <div
                                          className={`grid-table-tipos-alimentacao body-table-alimentacao${
                                            alimentacoesLancamentosEspeciais?.includes(
                                              row.name,
                                            )
                                              ? " input-alimentacao-permissao-lancamento-especial"
                                              : ""
                                          }`}
                                        >
                                          <div className="linha-cei">
                                            <b
                                              className={`nome-linha-cei ps-2 ${
                                                row.name === "observacoes" &&
                                                "mt-2"
                                              } ${
                                                row.name !== "observacoes" &&
                                                (ehEmeiDaCemeiLocation ||
                                                  ehSolicitacoesAlimentacaoLocation ||
                                                  ehProgramasEProjetosLocation) &&
                                                "mt-3"
                                              }`}
                                            >
                                              {row.nome}
                                            </b>
                                            {row.name !== "observacoes" &&
                                              !(
                                                ehEmeiDaCemeiLocation ||
                                                ehSolicitacoesAlimentacaoLocation ||
                                                ehProgramasEProjetosLocation
                                              ) && (
                                                <b className="faixa-etaria ps-2">
                                                  {row.faixa_etaria}
                                                </b>
                                              )}
                                          </div>
                                          {weekColumns.map((column) => (
                                            <div
                                              data-testid={`div-botao-add-obs-${column.dia}-${categoria.id}-${row.name}`}
                                              key={column.dia}
                                              className={`${
                                                validacaoSemana(column.dia)
                                                  ? "input-desabilitado"
                                                  : row.name === "observacoes"
                                                    ? "input-habilitado-observacoes"
                                                    : "input-habilitado"
                                              }`}
                                            >
                                              {row.name === "observacoes" ? (
                                                exibeBotaoAdicionarObservacao(
                                                  column.dia,
                                                ) && (
                                                  <Botao
                                                    texto={textoBotaoObservacao(
                                                      formValuesAtualizados[
                                                        `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
                                                      ],
                                                      valoresObservacoes,
                                                      column.dia,
                                                      categoria.id,
                                                    )}
                                                    disabled={desabilitarBotaoColunaObservacoes(
                                                      location,
                                                      valoresPeriodosLancamentos,
                                                      column,
                                                      categoria,
                                                      formValuesAtualizados,
                                                      row,
                                                      valoresObservacoes,
                                                      column.dia,
                                                      diasParaCorrecao,
                                                    )}
                                                    type={BUTTON_TYPE.BUTTON}
                                                    style={
                                                      (exibirTooltipAoSalvar &&
                                                        inputsInclusaoComErro.some(
                                                          (inputComErro) =>
                                                            inputComErro.nome ===
                                                            `${row.name}__dia_${column.dia}__categoria_${categoria.id}`,
                                                        ) &&
                                                        botaoAdicionarObrigatorioTabelaAlimentacao(
                                                          column,
                                                          categoria,
                                                          inclusoesAutorizadas,
                                                          formValuesAtualizados[
                                                            `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
                                                          ],
                                                          formValuesAtualizados,
                                                        )) ||
                                                      campoAlimentacoesAutorizadasDiaNaoLetivoCEINaoPreenchidoESemObservacao(
                                                        inclusoesAutorizadas,
                                                        column,
                                                        categoria,
                                                        formValuesAtualizados,
                                                      ) ||
                                                      campoRefeicaoComRPLAutorizadaESemObservacao(
                                                        formValuesAtualizados,
                                                        column,
                                                        categoria,
                                                        alteracoesAlimentacaoAutorizadas,
                                                      ) ||
                                                      campoDietaComInclusaoAutorizadaSemObservacao(
                                                        formValuesAtualizados,
                                                        column,
                                                        categoria,
                                                        inclusoesAutorizadas,
                                                        logQtdDietasAutorizadasCEI,
                                                      ) ||
                                                      campoComInclusaoAutorizadaValorZeroESemObservacao(
                                                        formValuesAtualizados,
                                                        column,
                                                        categoria,
                                                        inclusoesAutorizadas,
                                                        ehProgramasEProjetosLocation,
                                                        alteracoesAlimentacaoAutorizadas,
                                                      ) ||
                                                      campoLancheComLPRAutorizadaESemObservacao(
                                                        formValuesAtualizados,
                                                        column,
                                                        categoria,
                                                        alteracoesAlimentacaoAutorizadas,
                                                      ) ||
                                                      (!ehEmeiDaCemeiLocation &&
                                                        frequenciaComSuspensaoAutorizadaPreenchidaESemObservacao(
                                                          formValuesAtualizados,
                                                          column,
                                                          categoria,
                                                          suspensoesAutorizadas,
                                                          categoriasDeMedicao,
                                                        )) ||
                                                      (ehEmeiDaCemeiLocation &&
                                                        campoComSuspensaoAutorizadaESemObservacao(
                                                          formValuesAtualizados,
                                                          column,
                                                          categoria,
                                                          suspensoesAutorizadas,
                                                        )) ||
                                                      (ehSolicitacoesAlimentacaoLocation &&
                                                        (campoLancheEmergencialComZeroOuSemObservacao(
                                                          formValuesAtualizados,
                                                          column,
                                                          categoria,
                                                          alteracoesAlimentacaoAutorizadas,
                                                        ) ||
                                                          campoLancheEmergencialSemAutorizacaoSemObservacao(
                                                            formValuesAtualizados,
                                                            column,
                                                            categoria,
                                                            alteracoesAlimentacaoAutorizadas,
                                                          ) ||
                                                          camposKitLancheSolicitacoesAlimentacaoESemObservacao(
                                                            formValuesAtualizados,
                                                            column,
                                                            categoria,
                                                            kitLanchesAutorizadas,
                                                          ))) ||
                                                      ((ehEmeiDaCemeiLocation ||
                                                        ehProgramasEProjetosLocation) &&
                                                        campoFrequenciaValor0ESemObservacao(
                                                          column.dia,
                                                          categoria,
                                                          formValuesAtualizados,
                                                        )) ||
                                                      (ehProgramasEProjetosLocation &&
                                                        repeticaoSobremesaDoceComValorESemObservacao(
                                                          formValuesAtualizados,
                                                          column.dia,
                                                          categoria,
                                                          diasSobremesaDoce,
                                                          location,
                                                        ))
                                                        ? textoBotaoObservacao(
                                                            formValuesAtualizados[
                                                              `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
                                                            ],
                                                            valoresObservacoes,
                                                            column.dia,
                                                            categoria.id,
                                                          ) === "Visualizar"
                                                          ? BUTTON_STYLE.RED
                                                          : BUTTON_STYLE.RED_OUTLINE
                                                        : textoBotaoObservacao(
                                                              formValuesAtualizados[
                                                                `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
                                                              ],
                                                              valoresObservacoes,
                                                              column.dia,
                                                              categoria.id,
                                                            ) === "Visualizar"
                                                          ? BUTTON_STYLE.GREEN
                                                          : BUTTON_STYLE.GREEN_OUTLINE_WHITE
                                                    }
                                                    onClick={() =>
                                                      onClickBotaoObservacao(
                                                        column.dia,
                                                        categoria.id,
                                                      )
                                                    }
                                                  />
                                                )
                                              ) : (
                                                <div className="field-values-input">
                                                  {ehEmeiDaCemeiLocation ||
                                                  ehSolicitacoesAlimentacaoLocation ||
                                                  ehProgramasEProjetosLocation ||
                                                  ehGrupoColaboradores() ? (
                                                    <>
                                                      <Field
                                                        className={`m-2 ${classNameFieldTabelaAlimentacaoEMEI(
                                                          row,
                                                          column,
                                                          categoria,
                                                        )}`}
                                                        component={
                                                          InputValueMedicao
                                                        }
                                                        classNameToNextInput={getClassNameToNextInput(
                                                          row,
                                                          column,
                                                          categoria,
                                                          index,
                                                        )}
                                                        classNameToPrevInput={getClassNameToPrevInput(
                                                          row,
                                                          column,
                                                          categoria,
                                                          index,
                                                        )}
                                                        apenasNumeros
                                                        name={`${row.name}__dia_${column.dia}__categoria_${categoria.id}`}
                                                        disabled={desabilitarField(
                                                          column.dia,
                                                          row.name,
                                                          categoria.id,
                                                          categoria.nome,
                                                          formValuesAtualizados,
                                                          mesAnoConsiderado,
                                                          mesAnoDefault,
                                                          inclusoesAutorizadas,
                                                          validacaoDiaLetivo,
                                                          validacaoSemana,
                                                          location,
                                                          valoresPeriodosLancamentos,
                                                          feriadosNoMes,
                                                          null,
                                                          diasParaCorrecao,
                                                          ehEmeiDaCemeiLocation,
                                                          ehSolicitacoesAlimentacaoLocation,
                                                          permissoesLancamentosEspeciaisPorDia,
                                                          alimentacoesLancamentosEspeciais,
                                                          ehProgramasEProjetosLocation,
                                                          dadosValoresInclusoesAutorizadasState,
                                                          kitLanchesAutorizadas,
                                                          alteracoesAlimentacaoAutorizadas,
                                                          ehUltimoDiaLetivoDoAno,
                                                          calendarioMesConsiderado,
                                                          ehRecreioNasFerias(),
                                                        )}
                                                        defaultValue={defaultValue(
                                                          column,
                                                          row,
                                                        )}
                                                        numeroDeInclusoesAutorizadas={
                                                          inclusoesAutorizadas.find(
                                                            (inclusao) =>
                                                              column.dia ===
                                                              String(
                                                                inclusao.dia,
                                                              ),
                                                          )?.numero_alunos
                                                        }
                                                        exibeTooltipSuspensoesAutorizadas={exibirTooltipSuspensoesAutorizadas(
                                                          formValuesAtualizados,
                                                          row,
                                                          column,
                                                          categoria,
                                                          suspensoesAutorizadas,
                                                        )}
                                                        exibeTooltipInclusoesAutorizadasComZero={exibeTooltipInclusoesAutorizadasComZero(
                                                          formValuesAtualizados,
                                                          row,
                                                          column,
                                                          categoria,
                                                          inclusoesAutorizadas,
                                                          ehProgramasEProjetosLocation,
                                                          alteracoesAlimentacaoAutorizadas,
                                                        )}
                                                        exibeTooltipRPLAutorizadas={exibirTooltipRPLAutorizadas(
                                                          formValuesAtualizados,
                                                          row,
                                                          column,
                                                          categoria,
                                                          alteracoesAlimentacaoAutorizadas,
                                                        )}
                                                        exibeTooltipLPRAutorizadas={exibirTooltipLPRAutorizadas(
                                                          formValuesAtualizados,
                                                          row,
                                                          column,
                                                          categoria,
                                                          alteracoesAlimentacaoAutorizadas,
                                                        )}
                                                        exibeTooltipLancheEmergencialAutorizado={exibirTooltipLancheEmergencialAutorizado(
                                                          formValuesAtualizados,
                                                          row,
                                                          column,
                                                          categoria,
                                                          alteracoesAlimentacaoAutorizadas,
                                                        )}
                                                        exibeTooltipLancheEmergencialNaoAutorizado={exibirTooltipLancheEmergencialNaoAutorizado(
                                                          formValuesAtualizados,
                                                          row,
                                                          column,
                                                          categoria,
                                                          alteracoesAlimentacaoAutorizadas,
                                                        )}
                                                        exibeTooltipLancheEmergencialZeroAutorizadoJustificado={exibirTooltipLancheEmergencialZeroAutorizadoJustificado(
                                                          formValuesAtualizados,
                                                          row,
                                                          column,
                                                          categoria,
                                                          alteracoesAlimentacaoAutorizadas,
                                                          validacaoDiaLetivo,
                                                        )}
                                                        exibeTooltipQtdKitLancheMenorSolAlimentacoesAutorizadas={exibirTooltipQtdKitLancheMenorSolAlimentacoesAutorizadas(
                                                          formValuesAtualizados,
                                                          row,
                                                          column,
                                                          categoria,
                                                          kitLanchesAutorizadas,
                                                        )}
                                                        exibeTooltipKitLancheSolAlimentacoes={exibirTooltipKitLancheSolAlimentacoes(
                                                          formValuesAtualizados,
                                                          row,
                                                          column,
                                                          categoria,
                                                          kitLanchesAutorizadas,
                                                        )}
                                                        exibeTooltipPadraoRepeticaoDiasSobremesaDoce={
                                                          ehProgramasEProjetosLocation &&
                                                          exibirTooltipPadraoRepeticaoDiasSobremesaDoce(
                                                            formValuesAtualizados,
                                                            row,
                                                            column,
                                                            categoria,
                                                            diasSobremesaDoce,
                                                            location,
                                                          )
                                                        }
                                                        exibeTooltipRepeticaoDiasSobremesaDoceDiferenteZero={
                                                          ehProgramasEProjetosLocation &&
                                                          exibirTooltipRepeticaoDiasSobremesaDoceDiferenteZero(
                                                            formValuesAtualizados,
                                                            row,
                                                            column,
                                                            categoria,
                                                            diasSobremesaDoce,
                                                            location,
                                                          )
                                                        }
                                                        exibeTooltipRepeticao={
                                                          ehProgramasEProjetosLocation ||
                                                          (ehGrupoColaboradores() &&
                                                            exibirTooltipRepeticao(
                                                              formValuesAtualizados,
                                                              row,
                                                              column,
                                                              categoria,
                                                            ))
                                                        }
                                                        validate={fieldValidationsTabelasEmeidaCemei(
                                                          row.name,
                                                          column.dia,
                                                          categoria.id,
                                                          categoria.nome,
                                                        )}
                                                        inputOnChange={(e) => {
                                                          const value =
                                                            e.target.value;

                                                          onChangeInput(
                                                            value,
                                                            previousValue,
                                                            form.getState()
                                                              .errors,
                                                            form.getState()
                                                              .values,
                                                            column.dia,
                                                            categoria,
                                                            column,
                                                            row,
                                                            form,
                                                          );

                                                          setPreviousValue(
                                                            value,
                                                          );
                                                        }}
                                                      />
                                                    </>
                                                  ) : (
                                                    <>
                                                      <Field
                                                        className={`m-2 ${classNameFieldTabelaAlimentacao(
                                                          row,
                                                          column,
                                                          categoria,
                                                        )}`}
                                                        component={
                                                          InputValueMedicao
                                                        }
                                                        classNameToNextInput={getClassNameToNextInput(
                                                          row,
                                                          column,
                                                          categoria,
                                                          index,
                                                        )}
                                                        classNameToPrevInput={getClassNameToPrevInput(
                                                          row,
                                                          column,
                                                          categoria,
                                                          index,
                                                        )}
                                                        apenasNumeros
                                                        name={`${row.name}__faixa_${row.uuid}__dia_${column.dia}__categoria_${categoria.id}`}
                                                        disabled={desabilitarField(
                                                          column.dia,
                                                          row.name,
                                                          categoria.id,
                                                          categoria.nome,
                                                          formValuesAtualizados,
                                                          mesAnoConsiderado,
                                                          mesAnoDefault,
                                                          inclusoesAutorizadas,
                                                          validacaoDiaLetivo,
                                                          validacaoSemana,
                                                          location,
                                                          valoresPeriodosLancamentos,
                                                          feriadosNoMes,
                                                          row.uuid,
                                                          diasParaCorrecao,
                                                          ehEmeiDaCemeiLocation,
                                                          ehSolicitacoesAlimentacaoLocation,
                                                          permissoesLancamentosEspeciaisPorDia,
                                                          alimentacoesLancamentosEspeciais,
                                                          ehProgramasEProjetosLocation,
                                                          dadosValoresInclusoesAutorizadasState,
                                                          kitLanchesAutorizadas,
                                                          alteracoesAlimentacaoAutorizadas,
                                                          ehUltimoDiaLetivoDoAno,
                                                          calendarioMesConsiderado,
                                                          ehRecreioNasFerias(),
                                                        )}
                                                        defaultValue={defaultValue(
                                                          column,
                                                          row,
                                                        )}
                                                        exibeTooltipDietasInclusaoDiaNaoLetivoCEI={exibirTooltipDietasInclusaoDiaNaoLetivoCEI(
                                                          inclusoesAutorizadas,
                                                          row,
                                                          column,
                                                          categoria,
                                                          formValuesAtualizados,
                                                        )}
                                                        exibeTooltipRPLAutorizadas={exibirTooltipRPLAutorizadas(
                                                          formValuesAtualizados,
                                                          row,
                                                          column,
                                                          categoria,
                                                          alteracoesAlimentacaoAutorizadas,
                                                        )}
                                                        exibeTooltipAlimentacoesAutorizadasDiaNaoLetivoCEI={exibirTooltipAlimentacoesAutorizadasDiaNaoLetivoCEI(
                                                          inclusoesAutorizadas,
                                                          row,
                                                          column,
                                                          categoria,
                                                          formValuesAtualizados,
                                                        )}
                                                        exibeTooltipSuspensoesAutorizadasCEI={exibirTooltipSuspensoesAutorizadasCEI(
                                                          formValuesAtualizados,
                                                          row,
                                                          column,
                                                          categoria,
                                                          suspensoesAutorizadas,
                                                        )}
                                                        validate={fieldValidationsTabelasCEI(
                                                          row.name,
                                                          column.dia,
                                                          categoria.id,
                                                          categoria.nome,
                                                          row.uuid,
                                                        )}
                                                        inputOnChange={(e) => {
                                                          const value =
                                                            e.target.value;

                                                          onChangeInput(
                                                            value,
                                                            previousValue,
                                                            form.getState()
                                                              .errors,
                                                            form.getState()
                                                              .values,
                                                            column.dia,
                                                            categoria,
                                                            column,
                                                            row,
                                                            form,
                                                          );

                                                          setPreviousValue(
                                                            value,
                                                          );
                                                        }}
                                                      />
                                                    </>
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </Fragment>
                                    );
                                  })}
                              </article>
                              {categoria.nome === "ALIMENTAÇÃO" &&
                                dataInicioPermissoes && (
                                  <div className="legenda-lancamentos-especiais">
                                    <div className="legenda-cor" />
                                    <div>
                                      Lançamento especial de alimentações
                                      liberado para unidade em{" "}
                                      {dataInicioPermissoes} por CODAE
                                    </div>
                                  </div>
                                )}
                            </section>
                          </div>
                        ))}
                    </Spin>
                    {ultimaAtualizacaoMedicao && (
                      <p className="ultimo-salvamento mb-0">
                        Lançamento do período {periodoGrupo} salvo em{" "}
                        {ultimaAtualizacaoMedicao}
                      </p>
                    )}
                    {[
                      "MEDICAO_CORRECAO_SOLICITADA",
                      "MEDICAO_CORRECAO_SOLICITADA_CODAE",
                      "MEDICAO_CORRIGIDA_PELA_UE",
                      "MEDICAO_CORRIGIDA_PARA_CODAE",
                    ].includes(location.state.status_periodo) &&
                    [
                      "MEDICAO_CORRECAO_SOLICITADA",
                      "MEDICAO_CORRECAO_SOLICITADA_CODAE",
                    ].includes(location.state.status_solicitacao) ? (
                      <Botao
                        className="float-end"
                        texto="Salvar Correções"
                        type={BUTTON_TYPE.BUTTON}
                        style={`${BUTTON_STYLE.GREEN}`}
                        onClick={() => setShowModalSalvarCorrecoes(true)}
                        disabled={!calendarioMesConsiderado}
                      />
                    ) : (
                      <Botao
                        className="float-end"
                        texto="Salvar Lançamentos"
                        type={BUTTON_TYPE.BUTTON}
                        style={`${BUTTON_STYLE.GREEN}`}
                        onClick={() =>
                          onSubmit(
                            formValuesAtualizados,
                            dadosValoresInclusoesAutorizadasState,
                            false,
                            true,
                            false,
                          )
                        }
                        disabled={
                          (location.state &&
                            location.state.status_periodo ===
                              "MEDICAO_APROVADA_PELA_DRE") ||
                          disableBotaoSalvarLancamentos ||
                          !calendarioMesConsiderado
                        }
                        exibirTooltip={exibirTooltip}
                        tooltipTitulo="Existem campos a serem corrigidos. Realize as correções para salvar."
                        classTooltip="icone-info-invalid"
                      />
                    )}
                  </div>
                  {mesAnoConsiderado && (
                    <ModalObservacaoDiaria
                      closeModal={() => setShowModalObservacaoDiaria(false)}
                      categoria={showCategoriaObservacaoDiaria}
                      showModal={showModalObservacaoDiaria}
                      dia={showDiaObservacaoDiaria}
                      mesAnoConsiderado={mesAnoConsiderado}
                      calendarioMesConsiderado={calendarioMesConsiderado}
                      form={form}
                      location={location}
                      values={formValuesAtualizados}
                      rowName={"observacoes"}
                      valoresPeriodosLancamentos={valoresPeriodosLancamentos}
                      onSubmit={() =>
                        onSubmitObservacao(
                          formValuesAtualizados,
                          showDiaObservacaoDiaria,
                          showCategoriaObservacaoDiaria,
                          form,
                          errors,
                        )
                      }
                      dadosIniciais={dadosIniciais}
                      setExibirTooltip={(value) => setExibirTooltip(value)}
                      errors={errors}
                      valoresObservacoes={valoresObservacoes}
                      setFormValuesAtualizados={setFormValuesAtualizados}
                      setValoresObservacoes={setValoresObservacoes}
                    />
                  )}
                  <ModalErro
                    showModalErro={showModalErro}
                    setShowModalErro={setShowModalErro}
                  />
                  <ModalSalvarCorrecoes
                    closeModal={() => setShowModalSalvarCorrecoes(false)}
                    showModal={showModalSalvarCorrecoes}
                    periodoGrupo={periodoGrupo}
                    onSubmit={() =>
                      onSubmit(
                        formValuesAtualizados,
                        dadosValoresInclusoesAutorizadasState,
                        false,
                        true,
                        true,
                      )
                    }
                  />
                </div>
              </form>
            )}
          />
        )}
      </Spin>
      <ModalVoltarPeriodoLancamento
        closeModal={() => setShowModalVoltarPeriodoLancamento(false)}
        showModal={showModalVoltarPeriodoLancamento}
        navigate={navigate}
      />
    </>
  );
};
