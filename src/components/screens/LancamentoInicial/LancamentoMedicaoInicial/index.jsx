import { CaretDownOutlined } from "@ant-design/icons";
import { Select, Skeleton, Spin } from "antd";
import { addMonths, format, getMonth, getYear, parse } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import HTTP_STATUS from "http-status-codes";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import CKEditorField from "src/components/Shareable/CKEditorField";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import {
  DETALHAMENTO_DO_LANCAMENTO,
  LANCAMENTO_MEDICAO_INICIAL,
} from "src/configs/constants";
import { EscolaSimplesContext } from "src/context/EscolaSimplesContext";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import {
  ehEscolaTipoCEI,
  ehEscolaTipoCEMEI,
  escolaNaoPossuiAlunosRegulares,
} from "src/helpers/utilities";
import { getVinculosTipoAlimentacaoPorEscola } from "src/services/cadastroTipoAlimentacao.service";
import { getPanoramaEscola } from "src/services/dietaEspecial.service";
import { getEscolaSimples } from "src/services/escola.service";
import {
  getDiasCalendario,
  getHistoricoEscola,
  getLanchesEmergenciaisDiarios,
  getUltimoDiaComSolicitacaoAutorizadaNoMes,
} from "src/services/medicaoInicial/periodoLancamentoMedicao.service";
import { getPeriodosPermissoesLancamentosEspeciaisMesAno } from "src/services/medicaoInicial/permissaoLancamentosEspeciais.service";
import {
  getPeriodosEscolaCemeiComAlunosEmei,
  getSolicitacaoMedicaoInicial,
  getSolicitacoesLancadas,
  updateSolicitacaoMedicaoInicial,
} from "src/services/medicaoInicial/solicitacaoMedicaoInicial.service";
import { listarRecreioNasFerias } from "src/services/recreioFerias.service";
import { FluxoDeStatusMedicaoInicial } from "./components/FluxoDeStatusMedicaoInicial";
import InformacoesEscola from "./components/InformacoesEscola";
import InformacoesMedicaoInicial from "./components/InformacoesMedicaoInicial";
import { InformacoesMedicaoInicialCEI } from "./components/InformacoesMedicaoInicialCEI";
import { LancamentoPorPeriodo } from "./components/LancamentoPorPeriodo";
import { LancamentoPorPeriodoCEI } from "./components/LancamentoPorPeriodoCEI";
import Ocorrencias from "./components/Ocorrencias";
import { BUTTON_STYLE } from "src/components/Shareable/Botao/constants";
import Botao from "src/components/Shareable/Botao";
import { ModalHistoricoCorrecoesPeriodo } from "src/components/screens/LancamentoInicial/ConferenciaDosLancamentos/components/ModalHistoricoCorrecoesPeriodo/index.jsx";
import "./styles.scss";

export default () => {
  const { meusDados } = useContext(MeusDadosContext);
  const [ano, setAno] = useState(null);
  const [mes, setMes] = useState(null);
  const [cadastrosRecreioNasFerias, setCadastrosRecreioNasFerias] = useState();
  const [panoramaGeral, setPanoramaGeral] = useState();
  const [nomeTerceirizada, setNomeTerceirizada] = useState();
  const [objectoPeriodos, setObjectoPeriodos] = useState([]);
  const [periodoSelecionado, setPeriodoSelecionado] = useState(null);
  const [escolaInstituicao, setEscolaInstituicao] = useState(null);
  const [ehIMR, setEhIMR] = useState(false);
  const [loteEscolaSimples, setLoteEscolaSimples] = useState(null);
  const [periodosEscolaSimples, setPeriodosEscolaSimples] = useState(null);
  const [
    periodosEscolaCemeiComAlunosEmei,
    setPeriodosEscolaCemeiComAlunosEmei,
  ] = useState(null);
  const [
    periodosPermissoesLancamentosEspeciais,
    setPeriodosPermissoesLancamentosEspeciais,
  ] = useState(null);
  const [temLancheEmergencialDiarioAtivo, setTemLancheEmergencialDiarioAtivo] =
    useState(false);
  const [solicitacaoMedicaoInicial, setSolicitacaoMedicaoInicial] =
    useState(null);
  const [loadingSolicitacaoMedInicial, setLoadingSolicitacaoMedicaoInicial] =
    useState(true);
  const [objSolicitacaoMIFinalizada, setObjSolicitacaoMIFinalizada] = useState({
    anexo: null,
    status: null,
  });

  const [open, setOpen] = useState(false);
  const [naoPodeFinalizar, setNaoPodeFinalizar] = useState(true);
  const [finalizandoMedicao, setFinalizandoMedicao] = useState(false);
  const [justificativaSemLancamentos, setJustificativaSemLancamentos] =
    useState("");

  const [errosAoSalvar, setErrosAoSalvar] = useState([]);
  const [comOcorrencias, setComOcorrencias] = useState("");
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);
  const [arquivo, setArquivo] = useState([]);
  const [historicoEscola, setHistoricoEscola] = useState();
  const [recreiosLancados, setRecreiosLancados] = useState([]);
  const [
    showModalHistoricoCorrecoesPeriodo,
    setShowModalHistoricoCorrecoesPeriodo,
  ] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { escolaSimples, setEscolaSimples } = useContext(EscolaSimplesContext);

  const PROXIMOS_DOZE_MESES = 12;
  const DEZEMBRO = "12";

  let periodos = [];

  const getPeriodosEscolaCemeiComAlunosEmeiAsync = async (escola, mes, ano) => {
    if (ehEscolaTipoCEMEI(escola)) {
      const payload = {
        mes,
        ano,
      };

      const response = await getPeriodosEscolaCemeiComAlunosEmei(payload);
      if (response.status === HTTP_STATUS.OK) {
        setPeriodosEscolaCemeiComAlunosEmei(response.data.results);
      } else {
        toastError("Erro ao obter períodos com alunos EMEI");
      }
    }
  };

  const getPeriodosPermissoesLancamentosEspeciaisMesAnoAsync = async (
    escola_uuid,
    mes,
    ano,
  ) => {
    const payload = {
      escola_uuid,
      mes,
      ano,
    };
    const response =
      await getPeriodosPermissoesLancamentosEspeciaisMesAno(payload);
    if (response.status === HTTP_STATUS.OK) {
      setPeriodosPermissoesLancamentosEspeciais(response.data.results);
    } else {
      toastError("Erro ao obter períodos com Permissões de Lançamentos");
    }
  };

  const getLanchesEmergenciaisDiariosAsync = async (escola_uuid, mes, ano) => {
    const payload = {
      escola_uuid,
      mes,
      ano,
    };
    const response = await getLanchesEmergenciaisDiarios(payload);
    if (response?.status === HTTP_STATUS.OK) {
      setTemLancheEmergencialDiarioAtivo(response.data.length > 0);
      return;
    }
    setTemLancheEmergencialDiarioAtivo(false);
  };

  const getUltimoDiaComSolicitacaoAutorizadaNoMesAsync = async (
    escola_uuid,
    mes,
    ano,
  ) => {
    const params = {
      escola_uuid,
      mes,
      ano,
    };
    const response = await getUltimoDiaComSolicitacaoAutorizadaNoMes(params);
    if (response.status === HTTP_STATUS.OK) {
      return response.data.ultima_data;
    } else {
      toastError("Erro ao obter o último dia com solicitação autorizada.");
      return null;
    }
  };

  const getCadastrosRecreioNasFerias = async () => {
    const response = await listarRecreioNasFerias();
    if (response.status === HTTP_STATUS.OK) {
      setCadastrosRecreioNasFerias(
        response.data.results.filter(
          (recreio) => recreio.unidades_participantes.length > 0,
        ),
      );
      return response.data.results.filter(
        (recreio) => recreio.unidades_participantes.length > 0,
      );
    } else {
      toastError("Erro ao carregar cadastros de Recreio nas Férias.");
    }
  };

  const getHistoricoEscolaAsync = async (uuidEscola, mes, ano) => {
    const params = { ...mes, ...ano };
    const response = await getHistoricoEscola(uuidEscola, params);

    if (response.status === HTTP_STATUS.OK) {
      setHistoricoEscola(response.data);
      return response.data;
    } else {
      toastError("Erro ao carregar histórico da escola.");
      return null;
    }
  };

  const getPeriodoInicialSelecionado = (
    mesParam,
    anoParam,
    recreioNasFeriasParam,
    periodos,
    cadastrosRecreioPreparados,
  ) => {
    if (!periodos.length) {
      return null;
    }

    const semMesAno = !mesParam || !anoParam;
    const comRecreio = !!recreioNasFeriasParam;

    if (comRecreio) {
      const cadastro = cadastrosRecreioPreparados.find(
        (c) =>
          c.anoInicio === Number(anoParam) &&
          c.mesInicio === Number(mesParam) &&
          c.uuid === recreioNasFeriasParam,
      );
      return cadastro?.dataInicio?.toString() || periodos[0].dataBRT.toString();
    }

    if (semMesAno) {
      return periodos[0].dataBRT.toString();
    }

    const periodoMesAno = periodos.find(
      (periodo) =>
        format(periodo.dataBRT, "MM") === String(mesParam).padStart(2, "0") &&
        getYear(periodo.dataBRT).toString() === String(anoParam) &&
        !periodo.recreio_nas_ferias,
    );

    return periodoMesAno?.dataBRT.toString() || periodos[0].dataBRT.toString();
  };

  const normalizarMesEAno = (mesParam, anoParam) => {
    if (!mesParam || !anoParam) {
      return {
        mes: mesParam,
        ano: anoParam,
      };
    }

    const mesAtual = Number(format(new Date(), "MM"));
    const anoAtual = getYear(new Date());
    let mesNormalizado = Number(mesParam);
    let anoNormalizado = Number(anoParam);

    if (
      Number.isNaN(mesNormalizado) ||
      mesNormalizado < 1 ||
      mesNormalizado > 12
    ) {
      mesNormalizado = mesAtual;
    }
    if (Number.isNaN(anoNormalizado)) {
      anoNormalizado = anoAtual;
    }
    if (anoNormalizado > anoAtual) {
      anoNormalizado = anoAtual;
    }
    if (mesNormalizado > mesAtual && anoNormalizado === anoAtual) {
      mesNormalizado = mesAtual;
    }

    return {
      mes: String(mesNormalizado).padStart(2, "0"),
      ano: String(anoNormalizado),
    };
  };

  const adicionarPeriodoDaURLSeNecessario = (
    periodosDisponiveis,
    mesParam,
    anoParam,
    recreioNasFeriasParam,
    cadastrosRecreioPreparados,
  ) => {
    if (!mesParam || !anoParam) {
      return;
    }

    const periodoJaExiste = periodosDisponiveis.some((periodoDisponivel) => {
      const mesmoMesAno =
        format(periodoDisponivel.dataBRT, "MM") ===
          String(mesParam).padStart(2, "0") &&
        getYear(periodoDisponivel.dataBRT).toString() === String(anoParam);

      if (!mesmoMesAno) {
        return false;
      }

      return recreioNasFeriasParam
        ? periodoDisponivel.recreio_nas_ferias === recreioNasFeriasParam
        : !periodoDisponivel.recreio_nas_ferias;
    });

    if (periodoJaExiste) {
      return;
    }

    if (recreioNasFeriasParam) {
      const cadastroRecreio = cadastrosRecreioPreparados?.find(
        (cadastro) =>
          cadastro.uuid === recreioNasFeriasParam &&
          cadastro.anoInicio === Number(anoParam) &&
          cadastro.mesInicio === Number(mesParam),
      );

      if (cadastroRecreio) {
        periodosDisponiveis.push({
          dataBRT: cadastroRecreio.dataInicio,
          periodo: cadastroRecreio.titulo,
          recreio_nas_ferias: cadastroRecreio.uuid,
        });
        return;
      }
    }

    const dataPeriodo = new Date(Number(anoParam), Number(mesParam) - 1, 1);
    const mesString = format(dataPeriodo, "LLLL", { locale: ptBR });

    periodosDisponiveis.push({
      dataBRT: dataPeriodo,
      periodo:
        mesString.charAt(0).toUpperCase() +
        mesString.slice(1) +
        " / " +
        anoParam,
      recreio_nas_ferias: recreioNasFeriasParam || undefined,
    });
  };

  const getDadosPeriodoSelecionado = (
    periodoSelecionado,
    periodosDisponiveis,
    recreioNasFeriasParam = null,
  ) => {
    if (!periodoSelecionado) {
      return {
        mes: null,
        ano: null,
        periodoLabel: null,
        recreio_nas_ferias: recreioNasFeriasParam,
      };
    }

    const dataPeriodoSelecionado = new Date(periodoSelecionado);
    const periodoEncontrado = periodosDisponiveis.find((periodoDisponivel) => {
      if (recreioNasFeriasParam) {
        return periodoDisponivel.recreio_nas_ferias === recreioNasFeriasParam;
      }

      return (
        periodoDisponivel.dataBRT.getTime() === dataPeriodoSelecionado.getTime()
      );
    });

    const dataPeriodoReferencia = periodoEncontrado?.dataBRT
      ? new Date(periodoEncontrado.dataBRT)
      : new Date(periodoSelecionado);

    return {
      mes: format(dataPeriodoReferencia, "MM").toString(),
      ano: getYear(dataPeriodoReferencia).toString(),
      periodoLabel: periodoEncontrado?.periodo || null,
      recreio_nas_ferias:
        periodoEncontrado?.recreio_nas_ferias || recreioNasFeriasParam || null,
    };
  };

  const ehSolicitacaoLancadaDoMesAno = (solicitacao, mes, ano) => {
    return (
      Number(solicitacao.mes) === mes &&
      Number(solicitacao.ano) === ano &&
      !solicitacao.recreio_nas_ferias
    );
  };

  const ehSolicitacaoLancadaDoRecreio = (solicitacao, cadastroRecreio) => {
    const recreioLancadoUuid =
      typeof solicitacao.recreio_nas_ferias === "string"
        ? solicitacao.recreio_nas_ferias
        : solicitacao.recreio_nas_ferias?.uuid;
    const recreioLancadoTitulo =
      typeof solicitacao.recreio_nas_ferias === "string"
        ? null
        : solicitacao.recreio_nas_ferias?.titulo;

    return (
      Number(solicitacao.mes) === cadastroRecreio.mesInicio &&
      Number(solicitacao.ano) === cadastroRecreio.anoInicio &&
      !!solicitacao.recreio_nas_ferias &&
      (recreioLancadoUuid === cadastroRecreio.uuid ||
        recreioLancadoTitulo === cadastroRecreio.titulo)
    );
  };

  const ehOpcaoDeRecreioLancado = (periodo) => {
    return (
      !!periodo.recreio_nas_ferias &&
      recreiosLancados.some(
        (recreioLancado) =>
          recreioLancado.uuid === periodo.recreio_nas_ferias ||
          recreioLancado.titulo === periodo.periodo,
      )
    );
  };

  useEffect(() => {
    async function fetch() {
      const escola =
        meusDados.vinculo_atual && meusDados.vinculo_atual.instituicao;
      const respostaPanorama = await getPanoramaEscola({ escola: escola.uuid });
      const respostaEscolaSimples = await getEscolaSimples(escola.uuid);
      setEscolaSimples(respostaEscolaSimples.data);

      setNomeTerceirizada(
        respostaEscolaSimples.data.lote.terceirizada.nome_fantasia,
      );

      setPanoramaGeral(respostaPanorama.data);
      setEscolaInstituicao(escola);
      setLoteEscolaSimples(respostaEscolaSimples.data.lote.nome);
      setEhIMR(
        !!respostaEscolaSimples.data.lote.contratos_do_lote.find(
          (contrato) => !contrato.encerrado && contrato.eh_imr,
        ),
      );

      const cadastrosRecreioNasFerias_ = await getCadastrosRecreioNasFerias();

      let solicitacoesLancadas = [];

      if (location.pathname.includes(LANCAMENTO_MEDICAO_INICIAL)) {
        const payload = {
          escola: escola.uuid,
        };

        solicitacoesLancadas = await getSolicitacoesLancadas(payload);
      }

      let cadastrosRecreioPreparados = [];
      const solicitacoesLancadasResultados = solicitacoesLancadas.data || [];

      setRecreiosLancados(
        solicitacoesLancadasResultados
          .filter((solicitacao) => !!solicitacao.recreio_nas_ferias)
          .map((solicitacao) => ({
            uuid:
              typeof solicitacao.recreio_nas_ferias === "string"
                ? solicitacao.recreio_nas_ferias
                : solicitacao.recreio_nas_ferias?.uuid,
            titulo:
              typeof solicitacao.recreio_nas_ferias === "string"
                ? null
                : solicitacao.recreio_nas_ferias?.titulo,
          })),
      );

      cadastrosRecreioPreparados = (
        cadastrosRecreioNasFerias || cadastrosRecreioNasFerias_
      )?.map((cadastro) => {
        const dataInicio = parse(
          cadastro.data_inicio,
          "dd/MM/yyyy",
          new Date(),
        );
        return {
          ...cadastro,
          dataInicio,
          mesInicio: getMonth(dataInicio) + 1,
          anoInicio: getYear(dataInicio),
        };
      });

      for (let mes_ = 0; mes_ <= PROXIMOS_DOZE_MESES; mes_++) {
        const dataBRT = addMonths(new Date(), -mes_);
        const mes = getMonth(dataBRT) + 1;
        const ano = getYear(dataBRT);
        const mesString = format(dataBRT, "LLLL", { locale: ptBR });

        const periodoFormatado =
          mesString.charAt(0).toUpperCase() + mesString.slice(1) + " / " + ano;

        if (location.pathname.includes(LANCAMENTO_MEDICAO_INICIAL)) {
          const temSolicitacaoLancada = solicitacoesLancadasResultados.some(
            (solicitacao) =>
              ehSolicitacaoLancadaDoMesAno(solicitacao, mes, ano),
          );

          if (!temSolicitacaoLancada) {
            periodos.push({
              dataBRT,
              periodo: periodoFormatado,
            });
          }
        } else {
          periodos.push({
            dataBRT,
            periodo: periodoFormatado,
          });
        }

        cadastrosRecreioPreparados?.forEach((cad) => {
          const temSolicitacaoRecreioLancada =
            solicitacoesLancadasResultados.some((solicitacao) =>
              ehSolicitacaoLancadaDoRecreio(solicitacao, cad),
            );

          if (
            cad.mesInicio === mes &&
            cad.anoInicio === ano &&
            !temSolicitacaoRecreioLancada
          ) {
            periodos.push({
              dataBRT: cad.dataInicio,
              periodo: cad.titulo,
              recreio_nas_ferias: cad.uuid,
            });
          }
        });
      }

      const params = new URLSearchParams(location.search);
      const mesParamOriginal = params.get("mes");
      const anoParamOriginal = params.get("ano");
      const recreioNasFeriasParam = params.get("recreio_nas_ferias");

      if (
        location.pathname.includes(LANCAMENTO_MEDICAO_INICIAL) &&
        !mesParamOriginal &&
        !anoParamOriginal &&
        !recreioNasFeriasParam
      ) {
        setMes(null);
        setAno(null);
        setPeriodoSelecionado(null);
        setObjectoPeriodos(periodos);
        setLoadingSolicitacaoMedicaoInicial(false);
        return;
      }

      const { mes: mesParam, ano: anoParam } = normalizarMesEAno(
        mesParamOriginal,
        anoParamOriginal,
      );

      adicionarPeriodoDaURLSeNecessario(
        periodos,
        mesParam,
        anoParam,
        recreioNasFeriasParam,
        cadastrosRecreioPreparados,
      );

      const periodoInicialSelecionado = getPeriodoInicialSelecionado(
        mesParam,
        anoParam,
        recreioNasFeriasParam,
        periodos,
        cadastrosRecreioPreparados,
      );

      const dadosPeriodoInicial = getDadosPeriodoSelecionado(
        periodoInicialSelecionado,
        periodos,
        recreioNasFeriasParam,
      );

      if (!dadosPeriodoInicial.mes || !dadosPeriodoInicial.ano) {
        setObjectoPeriodos(periodos);
        setLoadingSolicitacaoMedicaoInicial(false);
        return;
      }

      setMes(dadosPeriodoInicial.mes);
      setAno(dadosPeriodoInicial.ano);

      const searchParams = `?mes=${dadosPeriodoInicial.mes}&ano=${dadosPeriodoInicial.ano}${dadosPeriodoInicial.recreio_nas_ferias ? `&recreio_nas_ferias=${dadosPeriodoInicial.recreio_nas_ferias}` : ""}`;

      if (location.search !== searchParams) {
        navigate(
          {
            pathname: location.pathname,
            search: searchParams,
          },
          { replace: true },
        );
      }

      const responseHistoricoEscola = await getHistoricoEscolaAsync(
        escola.uuid,
        { mes: dadosPeriodoInicial.mes },
        { ano: dadosPeriodoInicial.ano },
      );

      const response_vinculos = await getVinculosTipoAlimentacaoPorEscola(
        escola.uuid,
        { ano: dadosPeriodoInicial.ano },
      );
      setPeriodosEscolaSimples(response_vinculos.data.results);

      await getPeriodosEscolaCemeiComAlunosEmeiAsync(
        responseHistoricoEscola,
        dadosPeriodoInicial.mes,
        dadosPeriodoInicial.ano,
      );
      await getPeriodosPermissoesLancamentosEspeciaisMesAnoAsync(
        escola.uuid,
        dadosPeriodoInicial.mes,
        dadosPeriodoInicial.ano,
      );
      await getLanchesEmergenciaisDiariosAsync(
        escola.uuid,
        dadosPeriodoInicial.mes,
        dadosPeriodoInicial.ano,
      );

      setObjectoPeriodos(periodos);
      setPeriodoSelecionado(periodoInicialSelecionado);
      await getSolicitacaoMedInicial(
        periodoInicialSelecionado,
        escola.uuid,
        dadosPeriodoInicial.recreio_nas_ferias,
      );
      setLoadingSolicitacaoMedicaoInicial(false);
    }
    if (meusDados) fetch();
  }, [meusDados]);

  const getSolicitacaoMedInicial = async (
    periodo,
    escolaUuid,
    recreio_nas_ferias,
  ) => {
    const payload = {
      escola_uuid: escolaUuid,
      mes: format(new Date(periodo), "MM").toString(),
      ano: getYear(new Date(periodo)).toString(),
      recreio_nas_ferias,
      voltar_unico_registro: true,
    };

    const solicitacao = await getSolicitacaoMedicaoInicial(payload);
    await getDiasCalendarioAsync(payload, solicitacao.data[0]);
    await setSolicitacaoMedicaoInicial(solicitacao.data[0]);
  };

  const { Option } = Select;

  const opcoesPeriodos = objectoPeriodos
    ? objectoPeriodos
        .filter((periodo) => !ehOpcaoDeRecreioLancado(periodo))
        .map((periodo) => {
          return <Option key={periodo.dataBRT}>{periodo.periodo}</Option>;
        })
    : [];

  const getRecreioNasFerias = (payload, solicitacao) => {
    return (
      solicitacao?.recreio_nas_ferias ||
      (payload["recreio_nas_ferias"]
        ? cadastrosRecreioNasFerias?.find(
            (cadastro) => cadastro.uuid === payload["recreio_nas_ferias"],
          )
        : null)
    );
  };

  const validarFinalizacaoRecreioNasFerias = (payload, solicitacao) => {
    const recreioNasFerias = getRecreioNasFerias(payload, solicitacao);

    if (!recreioNasFerias?.data_fim) {
      return false;
    }

    const [diaFim, mesFim, anoFim] = recreioNasFerias.data_fim
      .split("/")
      .map(Number);
    const dataFimRecreioNasFerias = new Date(anoFim, mesFim - 1, diaFim);
    dataFimRecreioNasFerias.setHours(23, 59, 59, 999);

    const naoPodeFinalizarSeAindaNaoPassouDataFimRecreioNasFerias =
      new Date().getTime() <= dataFimRecreioNasFerias.getTime();

    setNaoPodeFinalizar(
      naoPodeFinalizarSeAindaNaoPassouDataFimRecreioNasFerias,
    );
    return true;
  };

  const validarFinalizacaoLancamentoComum = async (
    payload,
    solicitacao,
    diasCalendario,
  ) => {
    const ultimoDiaComSolicitacaoAutorizada_ =
      await getUltimoDiaComSolicitacaoAutorizadaNoMesAsync(
        payload["escola_uuid"],
        payload["mes"],
        payload["ano"],
      );
    const listaDiasLetivos = diasCalendario.filter(
      (dia) => dia.dia_letivo === true,
    );

    if (!listaDiasLetivos.length) {
      setNaoPodeFinalizar(false);
      return;
    }

    let diasParaDescontar = 1;
    if (payload["mes"] === DEZEMBRO && listaDiasLetivos.length > 1) {
      diasParaDescontar += 1;
    }

    const ultimoDiaLetivo =
      listaDiasLetivos[listaDiasLetivos.length - diasParaDescontar];
    let dataUltimoDia = new Date(
      `${payload["ano"]}/${payload["mes"]}/${ultimoDiaLetivo.dia}`,
    );

    if (
      ultimoDiaComSolicitacaoAutorizada_ &&
      solicitacao &&
      escolaNaoPossuiAlunosRegulares(solicitacao)
    ) {
      dataUltimoDia = new Date(
        Math.max(
          dataUltimoDia.getTime(),
          new Date(ultimoDiaComSolicitacaoAutorizada_ + "T00:00:00").getTime(),
        ),
      );
    }

    dataUltimoDia.setHours(23, 59, 59, 999);
    const dataHoje = new Date();
    const naoPodeFinalizarSeAindaNaoPassouOUltimoDia =
      dataHoje.getTime() <= dataUltimoDia.getTime();

    setNaoPodeFinalizar(naoPodeFinalizarSeAindaNaoPassouOUltimoDia);
  };

  const getDiasCalendarioAsync = async (payload, solicitacao) => {
    const response = await getDiasCalendario(payload);

    if (response.status === HTTP_STATUS.OK) {
      if (validarFinalizacaoRecreioNasFerias(payload, solicitacao)) {
        return;
      }

      await validarFinalizacaoLancamentoComum(
        payload,
        solicitacao,
        response.data,
      );
    } else {
      toastError(
        "Erro ao carregar calendário do mês. Tente novamente mais tarde.",
      );
    }
  };

  const handleChangeSelectPeriodo = async (value) => {
    setMes(null);
    setAno(null);
    setNaoPodeFinalizar(true);
    setErrosAoSalvar([]);
    setOpen(false);
    setLoadingSolicitacaoMedicaoInicial(true);
    setPeriodoSelecionado(value);
    const dataPeriodo = new Date(value);
    const recreio_nas_ferias = objectoPeriodos.find(
      (o) => o.dataBRT.getTime() === dataPeriodo.getTime(),
    )?.recreio_nas_ferias;

    try {
      await getSolicitacaoMedInicial(
        value,
        escolaInstituicao.uuid,
        recreio_nas_ferias,
      );
      const mes = format(new Date(value), "MM").toString();
      const ano = getYear(new Date(value)).toString();
      setMes(mes);
      setAno(ano);
      const historicoEscola = await getHistoricoEscolaAsync(
        escolaInstituicao.uuid,
        { mes },
        { ano },
      );
      const response_vinculos = await getVinculosTipoAlimentacaoPorEscola(
        escolaInstituicao.uuid,
        { ano },
      );
      setPeriodosEscolaSimples(response_vinculos.data.results);
      await getPeriodosEscolaCemeiComAlunosEmeiAsync(
        historicoEscola || escolaInstituicao,
        mes,
        ano,
      );
      await getPeriodosPermissoesLancamentosEspeciaisMesAnoAsync(
        escolaInstituicao.uuid,
        mes,
        ano,
      );
      await getLanchesEmergenciaisDiariosAsync(
        escolaInstituicao.uuid,
        mes,
        ano,
      );
      navigate(
        {
          pathname: location.pathname,
          search: `?mes=${format(new Date(value), "MM").toString()}&ano=${getYear(
            new Date(value),
          ).toString()}${recreio_nas_ferias ? `&recreio_nas_ferias=${recreio_nas_ferias}` : ""}`,
        },
        { replace: true },
      );
    } finally {
      setLoadingSolicitacaoMedicaoInicial(false);
    }
  };

  const onClickInfoBasicas = async () => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const mes = params.get("mes");
    const ano = params.get("ano");
    const recreio_nas_ferias = params.get("recreio_nas_ferias");

    const payload = {
      escola_uuid: escolaInstituicao.uuid,
      mes: mes.toString(),
      ano: ano.toString(),
      recreio_nas_ferias,
      voltar_unico_registro: true,
    };

    const solicitacao = await getSolicitacaoMedicaoInicial(payload);
    setSolicitacaoMedicaoInicial(solicitacao.data[0]);
  };

  const handleFinalizarMedicao = async () => {
    setFinalizandoMedicao(true);

    let data = new FormData();
    data.append("escola", String(escolaInstituicao.uuid));

    if (solicitacaoMedicaoInicial.tipo_contagem_alimentacoes) {
      data.append(
        "tipo_contagem_alimentacoes",
        String(solicitacaoMedicaoInicial.tipo_contagem_alimentacoes?.uuid),
      );
    }
    data.append(
      "responsaveis",
      JSON.stringify(solicitacaoMedicaoInicial.responsaveis),
    );
    data.append(
      "com_ocorrencias",
      ehIMR ? String(comOcorrencias) : String(!opcaoSelecionada),
    );

    if (justificativaSemLancamentos) {
      data.append("justificativa_sem_lancamentos", justificativaSemLancamentos);
      data.append("com_ocorrencias", String(false));
    }

    if (!opcaoSelecionada) {
      let payloadAnexos = [];
      arquivo.forEach((element) => {
        payloadAnexos.push({
          nome: String(element.nome),
          base64: String(element.base64),
        });
      });
      data.append("anexos", JSON.stringify(payloadAnexos));
    }
    data.append("finaliza_medicao", true);
    const response = await updateSolicitacaoMedicaoInicial(
      solicitacaoMedicaoInicial.uuid,
      data,
    );
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess("Medição Inicial finalizada com sucesso!");
      setObjSolicitacaoMIFinalizada(response.data);
      setFinalizandoMedicao(false);
      setErrosAoSalvar([]);
    } else {
      setErrosAoSalvar(response.data);
      setFinalizandoMedicao(false);
      if (justificativaSemLancamentos) {
        toastError("Não foi possível enviar a medição sem lançamentos!");
      } else {
        toastError("Não foi possível finalizar as alterações!");
      }
    }
    onClickInfoBasicas();
  };

  return (
    <div className="card mt-3">
      <div className="card-body">
        <div className="pb-2">
          <b>Período de Lançamento</b>
        </div>
        <div className="row periodo-info-ue collapse-adjustments">
          <div className="col-4 periodo-lancamento">
            <div className="ps-0">
              {objectoPeriodos.length > 0 ? (
                <Select
                  suffixIcon={
                    <CaretDownOutlined
                      onClick={() =>
                        !loadingSolicitacaoMedInicial && setOpen(!open)
                      }
                    />
                  }
                  disabled={
                    loadingSolicitacaoMedInicial ||
                    (location.state &&
                      location.state.status === "Aprovado pela DRE") ||
                    location.pathname.includes(DETALHAMENTO_DO_LANCAMENTO)
                  }
                  open={open}
                  data-testid="select-periodo-lancamento"
                  onClick={() =>
                    !loadingSolicitacaoMedInicial && setOpen(!open)
                  }
                  onBlur={() => setOpen(false)}
                  name="periodo_lancamento"
                  placeholder="Selecione..."
                  value={periodoSelecionado}
                  onChange={(value) => handleChangeSelectPeriodo(value)}
                >
                  {opcoesPeriodos}
                </Select>
              ) : (
                <Skeleton paragraph={false} active />
              )}
            </div>
          </div>
          <InformacoesEscola
            escolaInstituicao={escolaInstituicao}
            loteEscolaSimples={loteEscolaSimples}
            historicoEscola={historicoEscola}
          />
        </div>
        {loadingSolicitacaoMedInicial ? (
          <Skeleton paragraph={false} active />
        ) : ehEscolaTipoCEI(historicoEscola || escolaInstituicao) ||
          ehEscolaTipoCEMEI(historicoEscola || escolaInstituicao) ? (
          <InformacoesMedicaoInicialCEI
            periodoSelecionado={periodoSelecionado}
            escolaInstituicao={escolaInstituicao}
            nomeTerceirizada={nomeTerceirizada}
            solicitacaoMedicaoInicial={solicitacaoMedicaoInicial}
            onClickInfoBasicas={onClickInfoBasicas}
            objectoPeriodos={objectoPeriodos}
          />
        ) : (
          <InformacoesMedicaoInicial
            periodoSelecionado={periodoSelecionado}
            escolaInstituicao={escolaInstituicao}
            nomeTerceirizada={nomeTerceirizada}
            solicitacaoMedicaoInicial={solicitacaoMedicaoInicial}
            onClickInfoBasicas={onClickInfoBasicas}
            objectoPeriodos={objectoPeriodos}
          />
        )}
        <hr className="linha-form mt-4 mb-4" />
        <FluxoDeStatusMedicaoInicial
          solicitacaoMedicaoInicial={solicitacaoMedicaoInicial}
        />
        {solicitacaoMedicaoInicial?.justificativa_codae_correcao_sem_lancamentos && (
          <>
            <hr />
            <div className="row">
              <div className="col-12">
                <label className="codae-pede-correcao-sem-lancamentos">
                  Solicitação de Correção da CODAE
                </label>
                <CKEditorField
                  input={{
                    onChange: () => {},
                    value:
                      solicitacaoMedicaoInicial.justificativa_codae_correcao_sem_lancamentos,
                    onBlur: () => {},
                  }}
                  toolbar={false}
                  disabled
                />
              </div>
            </div>
          </>
        )}
        <hr className="linha-form mt-4 mb-4" />
        {solicitacaoMedicaoInicial &&
          solicitacaoMedicaoInicial.status !==
            "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE" && (
            <>
              <Ocorrencias
                solicitacaoMedicaoInicial={solicitacaoMedicaoInicial}
                onClickInfoBasicas={onClickInfoBasicas}
                setObjSolicitacaoMIFinalizada={(value) =>
                  setObjSolicitacaoMIFinalizada(value)
                }
                setFinalizandoMedicao={setFinalizandoMedicao}
              />
              <hr className="linha-form mt-4 mb-4" />
            </>
          )}
        <Spin
          spinning={finalizandoMedicao}
          tip="Finalizando medição inicial. Pode demorar um pouco. Aguarde..."
        >
          <div className="col-12 mt-4">
            {solicitacaoMedicaoInicial &&
              solicitacaoMedicaoInicial.historico &&
              solicitacaoMedicaoInicial.historico !== "" &&
              solicitacaoMedicaoInicial.status !==
                "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE" && (
                <>
                  <Botao
                    className="float-end"
                    texto="Histórico de correções"
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    onClick={() => setShowModalHistoricoCorrecoesPeriodo(true)}
                  />
                  <ModalHistoricoCorrecoesPeriodo
                    showModal={showModalHistoricoCorrecoesPeriodo}
                    setShowModal={(value) =>
                      setShowModalHistoricoCorrecoesPeriodo(value)
                    }
                    solicitacao={solicitacaoMedicaoInicial}
                    historicos={solicitacaoMedicaoInicial.historico}
                  />
                </>
              )}
          </div>
          {mes &&
            ano &&
            periodosEscolaSimples &&
            !loadingSolicitacaoMedInicial &&
            (ehEscolaTipoCEI(historicoEscola || escolaInstituicao) ||
            ehEscolaTipoCEMEI(historicoEscola) ? (
              <LancamentoPorPeriodoCEI
                panoramaGeral={panoramaGeral}
                mes={mes}
                ano={ano}
                ehIMR={ehIMR}
                periodoSelecionado={periodoSelecionado}
                escolaInstituicao={escolaInstituicao}
                periodosEscolaSimples={periodosEscolaSimples}
                periodosEscolaCemeiComAlunosEmei={
                  periodosEscolaCemeiComAlunosEmei
                }
                solicitacaoMedicaoInicial={solicitacaoMedicaoInicial}
                onClickInfoBasicas={onClickInfoBasicas}
                setLoadingSolicitacaoMedicaoInicial={(value) =>
                  setLoadingSolicitacaoMedicaoInicial(value)
                }
                objSolicitacaoMIFinalizada={objSolicitacaoMIFinalizada}
                setObjSolicitacaoMIFinalizada={(value) =>
                  setObjSolicitacaoMIFinalizada(value)
                }
                setSolicitacaoMedicaoInicial={setSolicitacaoMedicaoInicial}
                naoPodeFinalizar={naoPodeFinalizar}
                setFinalizandoMedicao={setFinalizandoMedicao}
                periodosPermissoesLancamentosEspeciais={
                  periodosPermissoesLancamentosEspeciais
                }
                temLancheEmergencialDiarioAtivo={
                  temLancheEmergencialDiarioAtivo
                }
                errosAoSalvar={errosAoSalvar}
                setErrosAoSalvar={setErrosAoSalvar}
                handleFinalizarMedicao={handleFinalizarMedicao}
                opcaoSelecionada={opcaoSelecionada}
                setOpcaoSelecionada={setOpcaoSelecionada}
                arquivo={arquivo}
                setArquivo={setArquivo}
                comOcorrencias={comOcorrencias}
                setComOcorrencias={setComOcorrencias}
                setJustificativaSemLancamentos={setJustificativaSemLancamentos}
              />
            ) : (
              <LancamentoPorPeriodo
                panoramaGeral={panoramaGeral}
                mes={mes}
                ano={ano}
                ehIMR={ehIMR}
                periodoSelecionado={periodoSelecionado}
                escolaInstituicao={escolaInstituicao}
                periodosEscolaSimples={periodosEscolaSimples}
                solicitacaoMedicaoInicial={solicitacaoMedicaoInicial}
                onClickInfoBasicas={onClickInfoBasicas}
                setLoadingSolicitacaoMedicaoInicial={(value) =>
                  setLoadingSolicitacaoMedicaoInicial(value)
                }
                objSolicitacaoMIFinalizada={objSolicitacaoMIFinalizada}
                setObjSolicitacaoMIFinalizada={(value) =>
                  setObjSolicitacaoMIFinalizada(value)
                }
                periodosPermissoesLancamentosEspeciais={
                  periodosPermissoesLancamentosEspeciais
                }
                temLancheEmergencialDiarioAtivo={
                  temLancheEmergencialDiarioAtivo
                }
                setSolicitacaoMedicaoInicial={setSolicitacaoMedicaoInicial}
                naoPodeFinalizar={naoPodeFinalizar}
                setFinalizandoMedicao={setFinalizandoMedicao}
                errosAoSalvar={errosAoSalvar}
                setErrosAoSalvar={setErrosAoSalvar}
                handleFinalizarMedicao={handleFinalizarMedicao}
                opcaoSelecionada={opcaoSelecionada}
                setOpcaoSelecionada={setOpcaoSelecionada}
                arquivo={arquivo}
                setArquivo={setArquivo}
                comOcorrencias={comOcorrencias}
                setComOcorrencias={setComOcorrencias}
                escolaSimples={escolaSimples}
                setJustificativaSemLancamentos={setJustificativaSemLancamentos}
              />
            ))}
        </Spin>
      </div>
    </div>
  );
};
