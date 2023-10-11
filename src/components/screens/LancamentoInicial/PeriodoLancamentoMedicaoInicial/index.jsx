import React, { Fragment, useEffect, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import { useHistory, useLocation } from "react-router-dom";
import { Field, Form, FormSpy } from "react-final-form";
import { OnChange } from "react-final-form-listeners";
import arrayMutators from "final-form-arrays";
import {
  addDays,
  format,
  getDay,
  getWeeksInMonth,
  getYear,
  isSunday,
  lastDayOfMonth,
  startOfMonth,
  subDays,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { Spin, Tabs } from "antd";

import InputText from "components/Shareable/Input/InputText";
import InputValueMedicao from "components/Shareable/Input/InputValueMedicao";
import Botao from "components/Shareable/Botao";
import {
  toastError,
  toastSuccess,
  toastWarn,
} from "components/Shareable/Toast/dialogs";
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";
import ModalObservacaoDiaria from "./components/ModalObservacaoDiaria";
import ModalErro from "./components/ModalErro";
import ModalSalvarCorrecoes from "./components/ModalSalvarCorrecoes";
import { ModalVoltarPeriodoLancamento } from "./components/ModalVoltarPeriodoLancamento";
import CKEditorField from "components/Shareable/CKEditorField";
import {
  deepCopy,
  deepEqual,
  ehEscolaTipoCEUGESTAO,
  tiposAlimentacaoETEC,
} from "helpers/utilities";
import {
  botaoAddObrigatorioDiaNaoLetivoComInclusaoAutorizada,
  botaoAdicionarObrigatorio,
  botaoAdicionarObrigatorioTabelaAlimentacao,
  campoFrequenciaValor0ESemObservacao,
  exibirTooltipLPRAutorizadas,
  exibirTooltipRPLAutorizadas,
  exibirTooltipErroQtdMaiorQueAutorizado,
  exibirTooltipSuspensoesAutorizadas,
  exibirTooltipQtdKitLancheDiferenteSolAlimentacoesAutorizadas,
  exibirTooltipKitLancheSolAlimentacoes,
  exibirTooltipLancheEmergencialNaoAutorizado,
  exibirTooltipLancheEmergencialAutorizado,
  exibirTooltipLancheEmergencialZeroAutorizado,
  exibirTooltipLancheEmergencialZeroAutorizadoJustificado,
  exibirTooltipFrequenciaZeroTabelaEtec,
  exibirTooltipLancheEmergTabelaEtec,
  exibirTooltipRepeticao,
  exibirTooltipPadraoRepeticaoDiasSobremesaDoce,
  exibirTooltipRepeticaoDiasSobremesaDoceDiferenteZero,
  validacoesTabelaAlimentacao,
  validacoesTabelasDietas,
  validarFormulario,
  campoComSuspensaoAutorizadaESemObservacao,
  campoLancheComLPRAutorizadaESemObservacao,
  campoRefeicaoComRPLAutorizadaESemObservacao,
  validacoesTabelaEtecAlimentacao,
} from "./validacoes";
import {
  desabilitarBotaoColunaObservacoes,
  desabilitarField,
  deveExistirObservacao,
  ehDiaParaCorrigir,
  formatarPayloadParaCorrecao,
  formatarPayloadPeriodoLancamento,
  getSolicitacoesAlteracoesAlimentacaoAutorizadasAsync,
  getSolicitacoesInclusaoAutorizadasAsync,
  getSolicitacoesInclusoesEtecAutorizadasAsync,
  getSolicitacoesKitLanchesAutorizadasAsync,
  getSolicitacoesSuspensoesAutorizadasAsync,
  textoBotaoObservacao,
  valorZeroFrequencia,
} from "./helper";
import {
  getCategoriasDeMedicao,
  getDiasCalendario,
  getMatriculadosPeriodo,
  getLogDietasAutorizadasPeriodo,
  getValoresPeriodosLancamentos,
  setPeriodoLancamento,
  updateValoresPeriodosLancamentos,
  getFeriadosNoMes,
  getDiasParaCorrecao,
} from "services/medicaoInicial/periodoLancamentoMedicao.service";
import * as perfilService from "services/perfil.service";
import { getVinculosTipoAlimentacaoPorEscola } from "services/cadastroTipoAlimentacao.service";
import { getListaDiasSobremesaDoce } from "services/medicaoInicial/diaSobremesaDoce.service";
import { escolaCorrigeMedicao } from "services/medicaoInicial/solicitacaoMedicaoInicial.service";
import { DETALHAMENTO_DO_LANCAMENTO, MEDICAO_INICIAL } from "configs/constants";
import "./styles.scss";

export default () => {
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
  const [tabelaAlimentacaoRows, setTabelaAlimentacaoRows] = useState([]);
  const [
    tabelaAlimentacaoProgramasProjetosOuCEUGESTAORows,
    setTabelaAlimentacaoProgramasProjetosOuCEUGESTAORows,
  ] = useState([]);
  const [tabelaDietaRows, setTabelaDietaRows] = useState([]);
  const [tabelaDietaEnteralRows, setTabelaDietaEnteralRows] = useState([]);
  const [
    tabelaSolicitacoesAlimentacaoRows,
    setTabelaSolicitacoesAlimentacaoRows,
  ] = useState([]);
  const [tabelaEtecsAlimentacaoRows, setTabelaEtecAlimentacaoRows] = useState(
    []
  );
  const [categoriasDeMedicao, setCategoriasDeMedicao] = useState([]);
  const [inclusoesAutorizadas, setInclusoesAutorizadas] = useState(null);
  const [inclusoesEtecAutorizadas, setInclusoesEtecAutorizadas] =
    useState(null);
  const [suspensoesAutorizadas, setSuspensoesAutorizadas] = useState(null);
  const [
    alteracoesAlimentacaoAutorizadas,
    setAlteracoesAlimentacaoAutorizadas,
  ] = useState(null);
  const [kitLanchesAutorizadas, setKitLanchesAutorizadas] = useState(null);
  const [
    dadosValoresInclusoesAutorizadasState,
    setDadosValoresInclusoesAutorizadasState,
  ] = useState(null);
  const [
    dadosValoresInclusoesEtecAutorizadasState,
    setDadosValoresInclusoesEtecAutorizadasState,
  ] = useState(null);
  const [valoresPeriodosLancamentos, setValoresPeriodosLancamentos] = useState(
    []
  );
  const [valoresMatriculados, setValoresMatriculados] = useState([]);
  const [logQtdDietasAutorizadas, setLogQtdDietasAutorizadas] = useState([]);
  const [calendarioMesConsiderado, setCalendarioMesConsiderado] =
    useState(null);
  const [feriadosNoMes, setFeriadosNoMes] = useState(null);
  const [diasSobremesaDoce, setDiasSobremesaDoce] = useState(null);
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
  const [formValuesAtualizados, setFormValuesAtualizados] = useState(null);
  const [diasDaSemanaSelecionada, setDiasDaSemanaSelecionada] = useState(null);
  const [ultimaAtualizacaoMedicao, setUltimaAtualizacaoMedicao] =
    useState(null);
  const [showModalErro, setShowModalErro] = useState(false);
  const [valoresObservacoes, setValoresObservacoes] = useState([]);
  const [periodoGrupo, setPeriodoGrupo] = useState(null);
  const [diasParaCorrecao, setDiasParaCorrecao] = useState();

  const history = useHistory();
  const location = useLocation();
  let mesAnoDefault = new Date();

  const { TabPane } = Tabs;

  const urlParams = new URLSearchParams(window.location.search);
  const ehGrupoSolicitacoesDeAlimentacaoUrlParam =
    urlParams.get("ehGrupoSolicitacoesDeAlimentacao") === "true" ? true : false;
  const ehGrupoETECUrlParam =
    urlParams.get("ehGrupoETEC") === "true" ? true : false;
  const grupoLocation = location && location.state && location.state.grupo;

  const getListaDiasSobremesaDoceAsync = async (escola_uuid) => {
    const params = {
      mes: new Date(location.state.mesAnoSelecionado).getMonth() + 1,
      ano: new Date(location.state.mesAnoSelecionado).getFullYear(),
      escola_uuid,
    };
    const response = await getListaDiasSobremesaDoce(params);
    if (response.status === HTTP_STATUS.OK) {
      setDiasSobremesaDoce(response.data);
    } else {
      toastError("Erro ao carregar dias de sobremesa doce");
    }
  };

  const getTiposAlimentacaoCEUGESTAO = (inclusoesAutorizadas) => {
    if (
      !ehEscolaTipoCEUGESTAO(location.state.solicitacaoMedicaoInicial.escola) &&
      !(urlParams.get("ehPeriodoEspecifico") === "true")
    )
      return [];
    const tiposAlimentacao = [];
    inclusoesAutorizadas.forEach((inclusao) => {
      inclusao.alimentacoes.split(", ").forEach((alimentacao) => {
        if (!tiposAlimentacao.includes(alimentacao)) {
          tiposAlimentacao.push(alimentacao);
        }
      });
    });
    return tiposAlimentacao;
  };

  const trataTabelaAlimentacaoCEUGESTAO = (
    tiposAlimentacaoProgramasProjetosOuCEUGESTAO,
    tiposAlimentacaoCEUGESTAO
  ) => {
    if (
      !ehEscolaTipoCEUGESTAO(location.state.solicitacaoMedicaoInicial.escola) &&
      !(urlParams.get("ehPeriodoEspecifico") === "true")
    )
      return tiposAlimentacaoProgramasProjetosOuCEUGESTAO;
    if (!tiposAlimentacaoCEUGESTAO.includes("refeicao")) {
      const indexRefeicao1Oferta =
        tiposAlimentacaoProgramasProjetosOuCEUGESTAO.findIndex(
          (ali) => ali.nome === "Refeição 1ª Oferta"
        );
      tiposAlimentacaoProgramasProjetosOuCEUGESTAO.splice(
        indexRefeicao1Oferta,
        1
      );
      const indexRefeicaoRepeticao =
        tiposAlimentacaoProgramasProjetosOuCEUGESTAO.findIndex(
          (ali) => ali.nome === "Repetição Refeição"
        );
      tiposAlimentacaoProgramasProjetosOuCEUGESTAO.splice(
        indexRefeicaoRepeticao,
        1
      );
    }

    if (!tiposAlimentacaoCEUGESTAO.includes("sobremesa")) {
      const indexRefeicao1Oferta =
        tiposAlimentacaoProgramasProjetosOuCEUGESTAO.findIndex(
          (ali) => ali.nome === "Sobremesa 1º Oferta"
        );
      tiposAlimentacaoProgramasProjetosOuCEUGESTAO.splice(
        indexRefeicao1Oferta,
        1
      );
      const indexRefeicaoRepeticao =
        tiposAlimentacaoProgramasProjetosOuCEUGESTAO.findIndex(
          (ali) => ali.nome === "Repetição Sobremesa"
        );
      tiposAlimentacaoProgramasProjetosOuCEUGESTAO.splice(
        indexRefeicaoRepeticao,
        1
      );
    }

    if (!tiposAlimentacaoCEUGESTAO.includes("lanche")) {
      const indexLanche =
        tiposAlimentacaoProgramasProjetosOuCEUGESTAO.findIndex(
          (ali) => ali.nome === "Lanche"
        );
      tiposAlimentacaoProgramasProjetosOuCEUGESTAO.splice(indexLanche, 1);
    }

    if (!tiposAlimentacaoCEUGESTAO.includes("lanche_4h")) {
      const indexLanche4h =
        tiposAlimentacaoProgramasProjetosOuCEUGESTAO.findIndex(
          (ali) => ali.nome === "Lanche 4h"
        );
      tiposAlimentacaoProgramasProjetosOuCEUGESTAO.splice(indexLanche4h, 1);
    }
    if (
      !tiposAlimentacaoProgramasProjetosOuCEUGESTAO.find(
        (t) => t.name === "observacoes"
      )
    ) {
      tiposAlimentacaoProgramasProjetosOuCEUGESTAO.push({
        nome: "Observações",
        name: "observacoes",
        uuid: null,
      });
    }
    return tiposAlimentacaoProgramasProjetosOuCEUGESTAO;
  };

  const trataCategoriasMedicaoCEUGESTAO = (
    response_categorias_medicao,
    tiposAlimentacaoCEUGESTAO
  ) => {
    if (
      !ehEscolaTipoCEUGESTAO(location.state.solicitacaoMedicaoInicial.escola) &&
      !(urlParams.get("ehPeriodoEspecifico") === "true")
    )
      return response_categorias_medicao;
    if (!tiposAlimentacaoCEUGESTAO.includes("refeicao")) {
      response_categorias_medicao = response_categorias_medicao.filter(
        (categoria) => !categoria.nome.includes("ENTERAL")
      );
    }
    if (
      !tiposAlimentacaoCEUGESTAO.includes("lanche") &&
      !tiposAlimentacaoCEUGESTAO.includes("lanche_4h")
    ) {
      response_categorias_medicao = response_categorias_medicao.filter(
        (categoria) =>
          !categoria.nome.includes("DIETA ESPECIAL") ||
          categoria.nome.includes("ENTERAL")
      );
    }

    return response_categorias_medicao;
  };

  useEffect(() => {
    const mesAnoSelecionado = location.state
      ? typeof location.state.mesAnoSelecionado === String
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
      const meusDados = await perfilService.meusDados();
      const escola =
        meusDados.vinculo_atual && meusDados.vinculo_atual.instituicao;
      const response_vinculos = await getVinculosTipoAlimentacaoPorEscola(
        escola.uuid
      );

      getListaDiasSobremesaDoceAsync(escola.uuid);

      const periodos_escolares = response_vinculos.data.results;

      let periodo = periodos_escolares[0];
      const ehPeriodoEspecifico =
        urlParams.get("ehPeriodoEspecifico") === "true" ? true : false;
      if (ehPeriodoEspecifico) {
        periodo = location.state
          ? location.state.periodoEspecifico
          : periodos_escolares[0];
      } else {
        periodo =
          periodos_escolares.find(
            (periodo) =>
              periodo.periodo_escolar.nome ===
              (location.state ? location.state.periodo : "MANHA")
          ) || periodos_escolares[0];
      }

      const mes = format(mesAnoSelecionado, "MM");
      const ano = getYear(mesAnoSelecionado);

      let response_inclusoes_autorizadas = [];
      response_inclusoes_autorizadas =
        await getSolicitacoesInclusaoAutorizadasAsync(
          escola.uuid,
          mes,
          ano,
          location && location.state && location.state.periodosInclusaoContinua
            ? Object.keys(location.state.periodosInclusaoContinua)
            : [periodo.periodo_escolar.nome],
          location
        );
      setInclusoesAutorizadas(response_inclusoes_autorizadas);

      const tipos_alimentacao = periodo.tipos_alimentacao;
      const tiposAlimentacaoCEUGESTAO = getTiposAlimentacaoCEUGESTAO(
        response_inclusoes_autorizadas
      );
      const cloneTiposAlimentacao = deepCopy(tipos_alimentacao);
      const tiposAlimentacaoFormatadas = cloneTiposAlimentacao
        .filter((alimentacao) => alimentacao.nome !== "Lanche Emergencial")
        .map((alimentacao) => {
          return {
            ...alimentacao,
            name: alimentacao.nome
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .replaceAll(/ /g, "_"),
          };
        });
      const indexRefeicao = tiposAlimentacaoFormatadas.findIndex(
        (ali) => ali.nome === "Refeição"
      );
      if (indexRefeicao !== -1) {
        tiposAlimentacaoFormatadas[indexRefeicao].nome = "Refeição 1ª Oferta";
        tiposAlimentacaoFormatadas.splice(indexRefeicao + 1, 0, {
          nome: "Repetição Refeição",
          name: "repeticao_refeicao",
          uuid: null,
        });
      }

      const indexSobremesa = tiposAlimentacaoFormatadas.findIndex(
        (ali) => ali.nome === "Sobremesa"
      );
      if (indexSobremesa !== -1) {
        tiposAlimentacaoFormatadas[indexSobremesa].nome = "Sobremesa 1º Oferta";
        tiposAlimentacaoFormatadas.splice(indexSobremesa + 1, 0, {
          nome: "Repetição Sobremesa",
          name: "repeticao_sobremesa",
          uuid: null,
        });
      }

      const tiposAlimentacaoProgramasProjetosOuCEUGESTAO = deepCopy(
        tiposAlimentacaoFormatadas
      );

      tiposAlimentacaoFormatadas.unshift(
        {
          nome: "Matriculados",
          name: "matriculados",
          uuid: null,
        },
        {
          nome: "Frequência",
          name: "frequencia",
          uuid: null,
        }
      );

      tiposAlimentacaoFormatadas.push({
        nome: "Observações",
        name: "observacoes",
        uuid: null,
      });

      setTabelaAlimentacaoRows(tiposAlimentacaoFormatadas);

      tiposAlimentacaoProgramasProjetosOuCEUGESTAO.unshift(
        {
          nome: "Número de Alunos",
          name: "numero_de_alunos",
          uuid: null,
        },
        {
          nome: "Frequência",
          name: "frequencia",
          uuid: null,
        }
      );

      tiposAlimentacaoProgramasProjetosOuCEUGESTAO.push({
        nome: "Observações",
        name: "observacoes",
        uuid: null,
      });

      setTabelaAlimentacaoProgramasProjetosOuCEUGESTAORows(
        trataTabelaAlimentacaoCEUGESTAO(
          tiposAlimentacaoProgramasProjetosOuCEUGESTAO,
          tiposAlimentacaoCEUGESTAO
        )
      );

      const rowsDietas = [];
      rowsDietas.push(
        {
          nome: "Dietas Autorizadas",
          name: "dietas_autorizadas",
          uuid: null,
        },
        {
          nome: "Frequência",
          name: "frequencia",
          uuid: null,
        }
      );

      if (
        ehEscolaTipoCEUGESTAO(
          location.state.solicitacaoMedicaoInicial.escola
        ) ||
        urlParams.get("ehPeriodoEspecifico") === "true"
      ) {
        if (tiposAlimentacaoCEUGESTAO.includes("lanche_4h")) {
          rowsDietas.push({
            nome: "Lanche 4h",
            name: "lanche_4h",
            uuid: tiposAlimentacaoProgramasProjetosOuCEUGESTAO.find((tp) =>
              tp.nome.includes("4h")
            ).uuid,
          });
        }
      } else {
        const indexLanche4h = cloneTiposAlimentacao.findIndex((ali) =>
          ali.nome.includes("4h")
        );
        if (indexLanche4h !== -1) {
          rowsDietas.push({
            nome: cloneTiposAlimentacao[indexLanche4h].nome,
            name: cloneTiposAlimentacao[indexLanche4h].nome
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .replaceAll(/ /g, "_"),
            uuid: cloneTiposAlimentacao[indexLanche4h].uuid,
          });
        }
      }

      const indexLanche = cloneTiposAlimentacao.findIndex(
        (ali) => ali.nome === "Lanche"
      );
      if (
        (indexLanche !== -1 &&
          !ehEscolaTipoCEUGESTAO(
            location.state.solicitacaoMedicaoInicial.escola
          )) ||
        (indexLanche !== -1 &&
          !(urlParams.get("ehPeriodoEspecifico") === "true"))
      ) {
        rowsDietas.push({
          nome: "Lanche",
          name: "Lanche"
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replaceAll(/ /g, "_"),
          uuid: cloneTiposAlimentacao[indexLanche].uuid,
        });
      }

      if (
        ehEscolaTipoCEUGESTAO(
          location.state.solicitacaoMedicaoInicial.escola
        ) ||
        urlParams.get("ehPeriodoEspecifico") === "true"
      ) {
        if (tiposAlimentacaoCEUGESTAO.includes("lanche")) {
          rowsDietas.push({
            nome: "Lanche",
            name: "Lanche"
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .replaceAll(/ /g, "_"),
            uuid: tiposAlimentacaoProgramasProjetosOuCEUGESTAO[indexLanche]
              .uuid,
          });
        }
      }

      rowsDietas.push({
        nome: "Observações",
        name: "observacoes",
        uuid: null,
      });

      setTabelaDietaRows(rowsDietas);

      const cloneRowsDietas = deepCopy(rowsDietas);
      const indexRefeicaoDieta = cloneTiposAlimentacao.findIndex(
        (ali) => ali.nome === "Refeição"
      );
      if (
        (indexRefeicaoDieta !== -1 &&
          (!ehEscolaTipoCEUGESTAO(
            location.state.solicitacaoMedicaoInicial.escola
          ) ||
            tiposAlimentacaoCEUGESTAO.includes("refeicao"))) ||
        (indexRefeicaoDieta !== -1 &&
          (!(urlParams.get("ehPeriodoEspecifico") === "true") ||
            tiposAlimentacaoCEUGESTAO.includes("refeicao")))
      ) {
        cloneRowsDietas.splice(cloneRowsDietas.length - 1, 0, {
          nome: "Refeição",
          name: "refeicao",
          uuid: cloneTiposAlimentacao[indexRefeicaoDieta].uuid,
        });
      }

      setTabelaDietaEnteralRows(cloneRowsDietas);

      const rowsSolicitacoesAlimentacao = [];
      rowsSolicitacoesAlimentacao.push(
        {
          nome: "Lanche Emergencial",
          name: "lanche_emergencial",
          uuid: null,
        },
        {
          nome: "Kit Lanche",
          name: "kit_lanche",
          uuid: null,
        },
        {
          nome: "Observações",
          name: "observacoes",
          uuid: null,
        }
      );

      setTabelaSolicitacoesAlimentacaoRows(rowsSolicitacoesAlimentacao);

      const tiposAlimentacaoEtec = tiposAlimentacaoETEC();
      const cloneTiposAlimentacaoEtec = deepCopy(tiposAlimentacaoEtec);
      const tiposAlimentacaoEtecFormatadas = cloneTiposAlimentacaoEtec
        .filter((alimentacao) => alimentacao !== "Lanche Emergencial")
        .map((alimentacao) => {
          return {
            nome: alimentacao,
            name: alimentacao
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .replaceAll(/ /g, "_"),
            uuid: null,
          };
        });

      const indexRefeicaoEtec = tiposAlimentacaoEtecFormatadas.findIndex(
        (ali) => ali.nome === "Refeição"
      );
      if (indexRefeicaoEtec !== -1) {
        tiposAlimentacaoEtecFormatadas[indexRefeicaoEtec].nome =
          "Refeição 1ª Oferta";
        tiposAlimentacaoEtecFormatadas.splice(indexRefeicaoEtec + 1, 0, {
          nome: "Repetição Refeição",
          name: "repeticao_refeicao",
          uuid: null,
        });
      }

      const indexSobremesaEtec = tiposAlimentacaoEtecFormatadas.findIndex(
        (ali) => ali.nome === "Sobremesa"
      );
      if (indexSobremesaEtec !== -1) {
        tiposAlimentacaoEtecFormatadas[indexSobremesaEtec].nome =
          "Sobremesa 1º Oferta";
        tiposAlimentacaoEtecFormatadas.splice(indexSobremesaEtec + 1, 0, {
          nome: "Repetição Sobremesa",
          name: "repeticao_sobremesa",
          uuid: null,
        });
      }

      const indexLancheEmergencialEtec =
        tiposAlimentacaoEtecFormatadas.findIndex(
          (ali) => ali.nome === "Lanche Emergencial"
        );
      if (indexLancheEmergencialEtec !== -1) {
        tiposAlimentacaoEtecFormatadas[indexLancheEmergencialEtec].nome =
          "Lanche Emergencial";
      }

      tiposAlimentacaoEtecFormatadas.unshift(
        {
          nome: "Número de Alunos",
          name: "numero_de_alunos",
          uuid: null,
        },
        {
          nome: "Frequência",
          name: "frequencia",
          uuid: null,
        }
      );

      tiposAlimentacaoEtecFormatadas.push({
        nome: "Observações",
        name: "observacoes",
        uuid: null,
      });

      setTabelaEtecAlimentacaoRows(tiposAlimentacaoEtecFormatadas);

      let response_log_dietas_autorizadas = [];

      let response_categorias_medicao = await getCategoriasDeMedicao();

      const params_dietas_autorizadas = {
        escola_uuid: escola.uuid,
        mes: mes,
        ano: ano,
      };
      if (
        location.state.grupo !== "Programas e Projetos" &&
        !ehEscolaTipoCEUGESTAO(
          location.state.solicitacaoMedicaoInicial.escola
        ) &&
        !(urlParams.get("ehPeriodoEspecifico") === "true")
      ) {
        params_dietas_autorizadas["periodo_escolar"] =
          periodo.periodo_escolar.uuid;
      } else {
        params_dietas_autorizadas["unificado"] = true;
      }
      if (!ehGrupoSolicitacoesDeAlimentacaoUrlParam) {
        response_log_dietas_autorizadas = await getLogDietasAutorizadasPeriodo(
          params_dietas_autorizadas
        );
      }

      if (ehGrupoSolicitacoesDeAlimentacaoUrlParam) {
        response_categorias_medicao = response_categorias_medicao.data.filter(
          (categoria) => {
            return categoria.nome.includes("SOLICITAÇÕES");
          }
        );
        setCategoriasDeMedicao(response_categorias_medicao);
      } else if (ehGrupoETECUrlParam) {
        response_categorias_medicao = response_categorias_medicao.data.filter(
          (categoria) => {
            return categoria.nome === "ALIMENTAÇÃO";
          }
        );
        setCategoriasDeMedicao(response_categorias_medicao);
      } else {
        response_categorias_medicao = response_categorias_medicao.data.filter(
          (categoria) => {
            return !categoria.nome.includes("SOLICITAÇÕES");
          }
        );
        if (response_log_dietas_autorizadas.data.length) {
          let categoriasDietasParaDeletar = [];
          for (const categoria of response_categorias_medicao) {
            if (
              categoria.nome === "DIETA ESPECIAL - TIPO A" &&
              (!response_log_dietas_autorizadas.data.filter(
                (dieta) => dieta.classificacao.toUpperCase() === "TIPO A"
              ).length ||
                !response_log_dietas_autorizadas.data.filter(
                  (dieta) =>
                    dieta.classificacao.toUpperCase() === "TIPO A" &&
                    Number(dieta.quantidade) !== 0
                ).length)
            ) {
              categoriasDietasParaDeletar.push("DIETA ESPECIAL - TIPO A");
            } else if (
              categoria.nome.includes("ENTERAL") &&
              (!response_log_dietas_autorizadas.data.filter((dieta) =>
                dieta.classificacao.toUpperCase().includes("ENTERAL")
              ).length ||
                !response_log_dietas_autorizadas.data.filter(
                  (dieta) =>
                    dieta.classificacao.toUpperCase().includes("ENTERAL") &&
                    Number(dieta.quantidade) !== 0
                ).length) &&
              categoria.nome.includes("AMINOÁCIDOS") &&
              (!response_log_dietas_autorizadas.data.filter((dieta) =>
                dieta.classificacao.toUpperCase().includes("AMINOÁCIDOS")
              ).length ||
                !response_log_dietas_autorizadas.data.filter(
                  (dieta) =>
                    dieta.classificacao.toUpperCase().includes("AMINOÁCIDOS") &&
                    Number(dieta.quantidade) !== 0
                ).length)
            ) {
              categoriasDietasParaDeletar.push(
                "DIETA ESPECIAL - TIPO A - ENTERAL / RESTRIÇÃO DE AMINOÁCIDOS"
              );
            } else if (
              categoria.nome.includes("TIPO B") &&
              (!response_log_dietas_autorizadas.data.filter((dieta) =>
                dieta.classificacao.toUpperCase().includes("TIPO B")
              ).length ||
                !response_log_dietas_autorizadas.data.filter(
                  (dieta) =>
                    dieta.classificacao.toUpperCase().includes("TIPO B") &&
                    Number(dieta.quantidade) !== 0
                ).length)
            ) {
              categoriasDietasParaDeletar.push("DIETA ESPECIAL - TIPO B");
            }
          }
          response_categorias_medicao = response_categorias_medicao.filter(
            (categoria) => {
              return !categoriasDietasParaDeletar.includes(categoria.nome);
            }
          );
        } else {
          response_categorias_medicao = response_categorias_medicao.filter(
            (categoria) => {
              return !categoria.nome.includes("DIETA");
            }
          );
        }
        setLogQtdDietasAutorizadas(response_log_dietas_autorizadas.data);
        setCategoriasDeMedicao(
          trataCategoriasMedicaoCEUGESTAO(
            response_categorias_medicao,
            tiposAlimentacaoCEUGESTAO
          )
        );
      }

      let params = {
        uuid_solicitacao_medicao: uuid,
        nome_grupo: location.state.grupo,
      };
      if (
        !ehGrupoSolicitacoesDeAlimentacaoUrlParam &&
        !ehGrupoETECUrlParam &&
        location.state.grupo !== "Programas e Projetos"
      ) {
        params = {
          ...params,
          nome_periodo_escolar: periodo.periodo_escolar.nome,
        };
      }
      const response_valores_periodos = await getValoresPeriodosLancamentos(
        params
      );
      setValoresPeriodosLancamentos(response_valores_periodos.data);

      const response_dias_correcao = await getDiasParaCorrecao(params);
      if (response_dias_correcao.status === HTTP_STATUS.OK) {
        console.log(response_dias_correcao.data);
        setDiasParaCorrecao(response_dias_correcao.data);
      }
      let response_matriculados = [];
      let response_inclusoes_etec_autorizadas = [];
      let response_kit_lanches_autorizadas = [];
      let response_suspensoes_autorizadas = [];
      let response_alteracoes_alimentacao_autorizadas = [];

      if (!ehGrupoSolicitacoesDeAlimentacaoUrlParam && !ehGrupoETECUrlParam) {
        const params_matriculados = {
          escola_uuid: escola.uuid,
          mes: mes,
          ano: ano,
          tipo_turma: "REGULAR",
          periodo_escolar: periodo.periodo_escolar.uuid,
        };
        response_matriculados = await getMatriculadosPeriodo(
          params_matriculados
        );
        setValoresMatriculados(response_matriculados.data);

        response_suspensoes_autorizadas =
          await getSolicitacoesSuspensoesAutorizadasAsync(
            escola.uuid,
            mes,
            ano,
            periodo.periodo_escolar.nome
          );
        setSuspensoesAutorizadas(response_suspensoes_autorizadas);

        response_alteracoes_alimentacao_autorizadas =
          await getSolicitacoesAlteracoesAlimentacaoAutorizadasAsync(
            escola.uuid,
            mes,
            ano,
            periodo.periodo_escolar.nome
          );
        setAlteracoesAlimentacaoAutorizadas(
          response_alteracoes_alimentacao_autorizadas
        );
      }

      if (ehGrupoSolicitacoesDeAlimentacaoUrlParam) {
        response_kit_lanches_autorizadas =
          await getSolicitacoesKitLanchesAutorizadasAsync(
            escola.uuid,
            mes,
            ano
          );
        setKitLanchesAutorizadas(response_kit_lanches_autorizadas);

        response_alteracoes_alimentacao_autorizadas =
          await getSolicitacoesAlteracoesAlimentacaoAutorizadasAsync(
            escola.uuid,
            mes,
            ano,
            periodo.periodo_escolar.nome,
            true
          );
        setAlteracoesAlimentacaoAutorizadas(
          response_alteracoes_alimentacao_autorizadas
        );
      }

      if (ehGrupoETECUrlParam) {
        response_inclusoes_etec_autorizadas =
          await getSolicitacoesInclusoesEtecAutorizadasAsync(
            escola.uuid,
            mes,
            ano
          );
        setInclusoesEtecAutorizadas(response_inclusoes_etec_autorizadas);
      }

      const params_dias_calendario = {
        escola_uuid: escola.uuid,
        mes: mes,
        ano: ano,
      };
      const response_dias_calendario = await getDiasCalendario(
        params_dias_calendario
      );
      setCalendarioMesConsiderado(response_dias_calendario.data);

      const params_feriados_no_mes = {
        mes: mes,
        ano: ano,
      };
      const response_feriados_no_mes = await getFeriadosNoMes(
        params_feriados_no_mes
      );
      setFeriadosNoMes(response_feriados_no_mes.data.results);

      await formatarDadosValoresMedicao(
        mesAnoFormatado,
        response_valores_periodos.data,
        response_categorias_medicao,
        tiposAlimentacaoFormatadas,
        response_matriculados.data,
        rowsDietas,
        response_log_dietas_autorizadas.data,
        response_inclusoes_autorizadas,
        mesAnoSelecionado,
        rowsSolicitacoesAlimentacao,
        response_kit_lanches_autorizadas,
        response_alteracoes_alimentacao_autorizadas,
        response_inclusoes_etec_autorizadas,
        tiposAlimentacaoEtecFormatadas
      );
      setLoading(false);
    };
    fetch();
  }, []);

  const formatarDadosValoresMedicao = async (
    mesAnoFormatado,
    valoresMedicao,
    categoriasMedicao,
    tiposAlimentacaoFormatadas,
    matriculados,
    rowsDietas,
    logQtdDietasAutorizadas,
    solInclusoesAutorizadas,
    mesAno,
    rowsSolicitacoesAlimentacao,
    kitLanchesAutorizadas,
    alteracoesAlimentacaoAutorizadas,
    inclusoesEtecAutorizadas,
    tiposAlimentacaoEtecFormatadas
  ) => {
    let dadosValoresMedicoes = {};
    let dadosValoresMatriculados = {};
    let dadosValoresAlunos = {};
    let dadosValoresDietasAutorizadas = {};
    let dadosValoresKitLanchesAutorizadas = {};
    let dadosValoresAlteracoesAlimentacaoAutorizadas = {};
    let dadosValoresEtecAlimentacaoAutorizadas = {};
    let dadosValoresForaDoMes = {};
    let periodoEscolar = "MANHA";
    let justificativaPeriodo = "";
    if (location.state) {
      justificativaPeriodo = location.state.justificativa_periodo;
      if (location.state.grupo && location.state.periodo) {
        periodoEscolar = `${location.state.grupo} - ${location.state.periodo}`;
      } else if (location.state.grupo) {
        periodoEscolar = `${location.state.grupo}`;
      } else {
        periodoEscolar = `${location.state.periodo}`;
      }
    }
    setPeriodoGrupo(periodoEscolar);
    const dadosMesPeriodo = {
      mes_lancamento: mesAnoFormatado,
      periodo_escolar: periodoEscolar,
      justificativa_periodo: justificativaPeriodo,
    };
    let dadosValoresInclusoesAutorizadas = {};

    categoriasMedicao &&
      categoriasMedicao.forEach((categoria) => {
        matriculados &&
          !ehGrupoSolicitacoesDeAlimentacaoUrlParam &&
          !ehGrupoETECUrlParam &&
          grupoLocation !== "Programas e Projetos" &&
          matriculados.forEach((obj) => {
            dadosValoresMatriculados[
              `matriculados__dia_${obj.dia}__categoria_${categoria.id}`
            ] = obj.quantidade_alunos ? `${obj.quantidade_alunos}` : null;
          });

        categoria.nome.includes("ENTERAL") &&
          logQtdDietasAutorizadas &&
          logQtdDietasAutorizadas
            .filter((logDieta) =>
              logDieta.classificacao.toUpperCase().includes("ENTERAL")
            )
            .forEach(
              (logFiltrado) =>
                (dadosValoresDietasAutorizadas[
                  `dietas_autorizadas__dia_${logFiltrado.dia}__categoria_${categoria.id}`
                ] = `${
                  logFiltrado.quantidade +
                  (logQtdDietasAutorizadas.find(
                    (log) =>
                      logFiltrado.dia === log.dia &&
                      log.classificacao.toUpperCase().includes("AMINOÁCIDOS")
                  )?.quantidade || 0)
                }`)
            );

        logQtdDietasAutorizadas &&
          !ehGrupoSolicitacoesDeAlimentacaoUrlParam &&
          !ehGrupoETECUrlParam &&
          logQtdDietasAutorizadas.forEach((log) => {
            categoria.nome === "DIETA ESPECIAL - TIPO A" &&
              log.classificacao.toUpperCase() === "TIPO A" &&
              (dadosValoresDietasAutorizadas[
                `dietas_autorizadas__dia_${log.dia}__categoria_${categoria.id}`
              ] = `${log.quantidade}`);
            categoria.nome.includes("TIPO B") &&
              log.classificacao.toUpperCase().includes("TIPO B") &&
              (dadosValoresDietasAutorizadas[
                `dietas_autorizadas__dia_${log.dia}__categoria_${categoria.id}`
              ] = `${log.quantidade}`);
          });

        kitLanchesAutorizadas &&
          ehGrupoSolicitacoesDeAlimentacaoUrlParam &&
          kitLanchesAutorizadas.forEach((kit) => {
            categoria.nome.includes("SOLICITAÇÕES") &&
              (dadosValoresKitLanchesAutorizadas[
                `kit_lanche__dia_${kit.dia}__categoria_${categoria.id}`
              ] = dadosValoresKitLanchesAutorizadas[
                `kit_lanche__dia_${kit.dia}__categoria_${categoria.id}`
              ]
                ? parseInt(
                    dadosValoresKitLanchesAutorizadas[
                      `kit_lanche__dia_${kit.dia}__categoria_${categoria.id}`
                    ]
                  ) + kit.numero_alunos
                : kit.numero_alunos).toString();
          });

        inclusoesEtecAutorizadas &&
          ehGrupoETECUrlParam &&
          inclusoesEtecAutorizadas.forEach((inclusao) => {
            categoria.nome === "ALIMENTAÇÃO" &&
              (dadosValoresEtecAlimentacaoAutorizadas[
                `numero_de_alunos__dia_${inclusao.dia}__categoria_${categoria.id}`
              ] = `${inclusao.numero_alunos}`);
          });

        setDadosValoresInclusoesEtecAutorizadasState(
          dadosValoresEtecAlimentacaoAutorizadas
        );

        if (
          (grupoLocation === "Programas e Projetos" ||
            ehEscolaTipoCEUGESTAO(
              location.state.solicitacaoMedicaoInicial.escola
            ) ||
            urlParams.get("ehPeriodoEspecifico") === "true") &&
          solInclusoesAutorizadas
        ) {
          for (let i = 1; i <= 31; i++) {
            const dia = String(i).length === 1 ? "0" + String(i) : String(i);
            const incFiltradasPorDia = solInclusoesAutorizadas.filter(
              (each) => each.dia === dia
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
                0
              )}`;
            }
          }
        }

        tiposAlimentacaoFormatadas &&
          tiposAlimentacaoFormatadas.forEach((alimentacao) => {
            if (
              categoria.nome.includes("ALIMENTAÇÃO") &&
              solInclusoesAutorizadas
            ) {
              const inclusoesFiltradas = solInclusoesAutorizadas.filter(
                (inclusao) => inclusao.alimentacoes.includes(alimentacao.name)
              );
              for (let i = 1; i <= 31; i++) {
                const dia =
                  String(i).length === 1 ? "0" + String(i) : String(i);
                const incFiltradasPorDia = inclusoesFiltradas.filter(
                  (each) => each.dia === dia
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
                    0
                  )}`;
                }
              }
            }
          });

        setDadosValoresInclusoesAutorizadasState(
          dadosValoresInclusoesAutorizadas
        );

        let diasSemana = [];
        let diaDaSemanaNumerico = getDay(startOfMonth(mesAno)); // 0 representa Domingo

        if (diaDaSemanaNumerico === 0) {
          diaDaSemanaNumerico = 7;
        }
        if (Number(semanaSelecionada) === 1) {
          diasSemana.unshift(format(startOfMonth(mesAno), "dd"));
          for (let i = 1; i < diaDaSemanaNumerico; i++) {
            diasSemana.unshift(format(subDays(startOfMonth(mesAno), i), "dd"));
          }
          for (let i = diaDaSemanaNumerico; i < 7; i++) {
            diasSemana.push(
              format(
                addDays(startOfMonth(mesAno), i + 1 - diaDaSemanaNumerico),
                "dd"
              )
            );
          }
        }
        if (Number(semanaSelecionada) !== 1) {
          let dia = addDays(
            startOfMonth(mesAno),
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
        }

        tiposAlimentacaoFormatadas &&
          (rowsDietas ||
            rowsSolicitacoesAlimentacao ||
            tiposAlimentacaoEtecFormatadas) &&
          [
            tiposAlimentacaoFormatadas,
            rowsDietas,
            rowsSolicitacoesAlimentacao,
            tiposAlimentacaoEtecFormatadas,
          ].forEach(
            (each) =>
              each &&
              each.forEach((tipo) => {
                for (let i = 1; i <= 31; i++) {
                  const dia =
                    String(i).length === 1 ? "0" + String(i) : String(i);
                  let result = null;
                  if (
                    Number(semanaSelecionada) === 1 &&
                    Number(dia) > 20 &&
                    diasSemana.includes(dia)
                  ) {
                    result = "Mês anterior";
                    dadosValoresForaDoMes[
                      `${tipo.name}__dia_${dia}__categoria_${categoria.id}`
                    ] = result;
                  }
                  if (
                    [4, 5, 6].includes(Number(semanaSelecionada)) &&
                    Number(dia) < 10 &&
                    diasSemana.includes(dia)
                  ) {
                    result = "Mês posterior";
                    dadosValoresForaDoMes[
                      `${tipo.name}__dia_${dia}__categoria_${categoria.id}`
                    ] = result;
                  }
                }
              })
          );

        valoresMedicao &&
          valoresMedicao.forEach((valor_medicao) => {
            dadosValoresMedicoes[
              `${valor_medicao.nome_campo}__dia_${valor_medicao.dia}__categoria_${valor_medicao.categoria_medicao}`
            ] = valor_medicao.valor ? `${valor_medicao.valor}` : null;
          });
      });

    valoresMedicao &&
      valoresMedicao.length > 0 &&
      setUltimaAtualizacaoMedicao(valoresMedicao[0].medicao_alterado_em);

    setDadosIniciais({
      ...dadosMesPeriodo,
      ...dadosValoresAlunos,
      ...dadosValoresKitLanchesAutorizadas,
      ...dadosValoresAlteracoesAlimentacaoAutorizadas,
      ...dadosValoresEtecAlimentacaoAutorizadas,
      ...dadosValoresMedicoes,
      ...dadosValoresMatriculados,
      ...dadosValoresDietasAutorizadas,
      ...dadosValoresForaDoMes,
      semanaSelecionada,
    });
    setLoading(false);
  };

  useEffect(() => {
    let diasSemana = [];
    let diaDaSemanaNumerico = getDay(startOfMonth(mesAnoConsiderado)); // 0 representa Domingo
    let week = [];
    setLoading(true);

    if (diaDaSemanaNumerico === 0) {
      diaDaSemanaNumerico = 7;
    }
    if (mesAnoConsiderado && Number(semanaSelecionada) === 1) {
      diasSemana.unshift(format(startOfMonth(mesAnoConsiderado), "dd"));
      for (let i = 1; i < diaDaSemanaNumerico; i++) {
        diasSemana.unshift(
          format(subDays(startOfMonth(mesAnoConsiderado), i), "dd")
        );
      }
      for (let i = diaDaSemanaNumerico; i < 7; i++) {
        diasSemana.push(
          format(
            addDays(
              startOfMonth(mesAnoConsiderado),
              i + 1 - diaDaSemanaNumerico
            ),
            "dd"
          )
        );
      }
      setDiasDaSemanaSelecionada(diasSemana.filter((dia) => Number(dia) < 20));
      week = weekColumns.map((column) => {
        return { ...column, dia: diasSemana[column["position"]] };
      });
      setWeekColumns(week);
    }
    if (mesAnoConsiderado && Number(semanaSelecionada) !== 1) {
      let dia = addDays(
        startOfMonth(mesAnoConsiderado),
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
      if ([4, 5, 6].includes(Number(semanaSelecionada))) {
        setDiasDaSemanaSelecionada(
          diasSemana.filter((dia) => Number(dia) > 10)
        );
      } else {
        setDiasDaSemanaSelecionada(diasSemana);
      }
      week = weekColumns.map((column) => {
        return { ...column, dia: diasSemana[column["position"]] };
      });
      setWeekColumns(week);
    }

    const formatar = async () => {
      formatarDadosValoresMedicao(
        mesAnoFormatadoState,
        valoresPeriodosLancamentos,
        categoriasDeMedicao,
        tabelaAlimentacaoRows,
        valoresMatriculados,
        tabelaDietaRows,
        logQtdDietasAutorizadas,
        inclusoesAutorizadas,
        mesAnoConsiderado,
        tabelaSolicitacoesAlimentacaoRows,
        kitLanchesAutorizadas,
        alteracoesAlimentacaoAutorizadas,
        inclusoesEtecAutorizadas,
        tabelaEtecsAlimentacaoRows
      );
    };
    semanaSelecionada && formatar();
    valoresPeriodosLancamentos.findIndex(
      (valor) => valor.nome_campo !== "observacoes"
    ) !== -1 && setDisableBotaoSalvarLancamentos(false);
  }, [
    mesAnoConsiderado,
    semanaSelecionada,
    categoriasDeMedicao,
    tabelaAlimentacaoRows,
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
          true
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

  const onSubmitObservacao = async (values, dia, categoria, errors) => {
    let valoresMedicao = [];
    const valuesMesmoDiaDaObservacao = Object.fromEntries(
      Object.entries(values).filter(([key]) =>
        key.includes(`__dia_${dia}__categoria_${categoria}`)
      )
    );
    Object.entries(valuesMesmoDiaDaObservacao).forEach(([key, value]) => {
      return (
        (["Mês anterior", "Mês posterior", null].includes(value) ||
          key.includes("matriculados") ||
          key.includes("dietas_autorizadas") ||
          key.includes("numero_de_alunos") ||
          (!validacaoDiaLetivo(dia) &&
            (key.includes("repeticao") || key.includes("emergencial")))) &&
        delete valuesMesmoDiaDaObservacao[key]
      );
    });
    let qtdCamposComErro = 0;

    if (
      Object.entries(errors).filter(([key]) =>
        key.includes(`__dia_${dia}__categoria_${categoria}`)
      ).length
    ) {
      toastError(`Existe(m) erro(s) na coluna do dia ${dia}.`);
      return;
    }
    Object.entries(valuesMesmoDiaDaObservacao).forEach(([key, value]) => {
      if (
        !ehGrupoETECUrlParam &&
        !(
          key.includes("observacoes") ||
          key.includes("frequencia") ||
          key.includes("repeticao")
        ) &&
        Number(value) >
          Number(
            valuesMesmoDiaDaObservacao[
              `frequencia__dia_${dia}__categoria_${categoria}`
            ]
          )
      ) {
        qtdCamposComErro++;
      }
    });
    if (qtdCamposComErro) {
      toastError(
        `Existe(m) ${qtdCamposComErro} campo(s) com valor maior que a frequência. Necessário corrigir.`
      );
      return;
    }
    Object.entries(valuesMesmoDiaDaObservacao).map((v) => {
      const keySplitted = v[0].split("__");
      const categoria = keySplitted.pop();
      const idCategoria = categoria.match(/\d/g).join("");
      const dia = keySplitted[1].match(/\d/g).join("");
      const nome_campo = keySplitted[0];
      let tipoAlimentacao = tabelaAlimentacaoRows.find(
        (alimentacao) => alimentacao.name === nome_campo
      );
      if (!tipoAlimentacao) {
        tipoAlimentacao = tabelaDietaEnteralRows.find(
          (row) => row.name === nome_campo
        );
      }

      return valoresMedicao.push({
        dia: dia,
        valor: ["<p></p>\n", ""].includes(v[1]) ? 0 : v[1],
        nome_campo: nome_campo,
        categoria_medicao: idCategoria,
        tipo_alimentacao:
          !ehGrupoSolicitacoesDeAlimentacaoUrlParam &&
          !ehGrupoETECUrlParam &&
          grupoLocation !== "Programas e Projetos"
            ? tipoAlimentacao.uuid
            : "",
      });
    });

    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");

    const solicitacao_medicao_inicial = uuid;
    const payload = {
      solicitacao_medicao_inicial: solicitacao_medicao_inicial,
      valores_medicao: valoresMedicao,
      eh_observacao: true,
    };
    if (
      (values["periodo_escolar"] &&
        values["periodo_escolar"].includes("Solicitações")) ||
      values["periodo_escolar"] === "ETEC" ||
      values["periodo_escolar"] === "Programas e Projetos"
    ) {
      payload["grupo"] = values["periodo_escolar"];
      delete values["periodo_escolar"];
    } else {
      payload["periodo_escolar"] = values["periodo_escolar"];
    }
    let valores_medicao_response = [];
    if (valoresPeriodosLancamentos.length) {
      const response = await updateValoresPeriodosLancamentos(
        valoresPeriodosLancamentos[0].medicao_uuid,
        payload
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
        (valor) => valor.nome_campo === "observacoes"
      )
    );
    setExibirTooltip(false);
  };

  const onSubmit = async (
    values,
    dadosValoresInclusoesAutorizadasState,
    ehSalvamentoAutomático = false,
    chamarFuncaoFormatar = true,
    ehCorrecao = false
  ) => {
    const erro = validarFormulario(
      values,
      diasSobremesaDoce,
      location,
      categoriasDeMedicao,
      dadosValoresInclusoesAutorizadasState,
      weekColumns,
      feriadosNoMes
    );
    if (erro) {
      !ehSalvamentoAutomático && toastError(erro);
      return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    let valuesClone = deepCopy(values);
    setDadosIniciais(values);
    const idCategoriaAlimentacao = categoriasDeMedicao.find((categoria) =>
      categoria.nome.includes("ALIMENTAÇÃO")
    ).id;
    valuesClone.solicitacao_medicao_inicial = uuid;
    Object.entries(valuesClone).forEach(([key, value]) => {
      return (
        (["Mês anterior", "Mês posterior", null].includes(value) ||
          (key.includes("matriculados") &&
            !key.includes(`categoria_${idCategoriaAlimentacao}`))) &&
        delete valuesClone[key]
      );
    });

    const dadosIniciaisFiltered = Object.entries(dadosIniciais)
      .filter(([key]) => !key.includes("matriculados"))
      .filter(([key]) => !key.includes("dietas_autorizadas"))
      .filter(
        ([, value]) => !["Mês anterior", "Mês posterior", null].includes(value)
      )
      .filter(([key]) => key.includes("categoria"));

    const payload = formatarPayloadPeriodoLancamento(
      valuesClone,
      tabelaAlimentacaoRows,
      tabelaDietaEnteralRows,
      dadosIniciaisFiltered,
      diasDaSemanaSelecionada,
      ehGrupoSolicitacoesDeAlimentacaoUrlParam,
      ehGrupoETECUrlParam,
      grupoLocation,
      tabelaAlimentacaoProgramasProjetosOuCEUGESTAORows
    );
    if (payload.valores_medicao.length === 0)
      return (
        !ehSalvamentoAutomático && toastWarn("Não há valores para serem salvos")
      );

    if (ehCorrecao) {
      const payloadParaCorrecao = formatarPayloadParaCorrecao(payload);
      const response = await escolaCorrigeMedicao(
        valoresPeriodosLancamentos[0].medicao_uuid,
        payloadParaCorrecao
      );
      if (response.status === HTTP_STATUS.OK) {
        let mes = new Date(location.state.mesAnoSelecionado).getMonth() + 1;
        const ano = new Date(location.state.mesAnoSelecionado).getFullYear();
        mes = String(mes).length === 1 ? "0" + String(mes) : String(mes);
        history.push(
          `/${MEDICAO_INICIAL}/${DETALHAMENTO_DO_LANCAMENTO}?mes=${mes}&ano=${ano}`
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
        payload
      );
      if (response.status === HTTP_STATUS.OK) {
        !ehSalvamentoAutomático &&
          toastSuccess("Lançamentos salvos com sucesso");
        valores_medicao_response = response.data.valores_medicao;
      } else {
        return (
          !ehSalvamentoAutomático && toastError("Erro ao salvar lançamentos.")
        );
      }
    } else {
      setLoading(true);
      const response = await setPeriodoLancamento(payload);
      if (response.status === HTTP_STATUS.CREATED) {
        !ehSalvamentoAutomático &&
          toastSuccess("Lançamentos salvos com sucesso");
        valores_medicao_response = response.data.valores_medicao;
      } else {
        return (
          !ehSalvamentoAutomático && toastError("Erro ao salvar lançamentos.")
        );
      }
    }
    setValoresPeriodosLancamentos(valores_medicao_response);
    if (chamarFuncaoFormatar) {
      await formatarDadosValoresMedicao(
        mesAnoFormatadoState,
        valores_medicao_response,
        categoriasDeMedicao,
        tabelaAlimentacaoRows,
        valoresMatriculados,
        tabelaDietaRows,
        logQtdDietasAutorizadas,
        inclusoesAutorizadas,
        mesAnoConsiderado,
        tabelaSolicitacoesAlimentacaoRows,
        kitLanchesAutorizadas,
        alteracoesAlimentacaoAutorizadas,
        inclusoesEtecAutorizadas,
        tabelaEtecsAlimentacaoRows
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
        false
      );
      return (values["week"] = Number(key));
    }
  };

  const defaultValue = (column, row) => {
    let result = null;
    if (row.name === "matriculados") {
      result = null;
    }
    if (Number(semanaSelecionada) === 1 && Number(column.dia) > 20) {
      result = "Mês anterior";
    }
    if (
      [4, 5, 6].includes(Number(semanaSelecionada)) &&
      Number(column.dia) < 10
    ) {
      result = "Mês posterior";
    }

    return result;
  };

  const validacaoSemana = (dia) => {
    // valida se é mês anterior ou mês posterior e desabilita
    return (
      (Number(semanaSelecionada) === 1 && Number(dia) > 20) ||
      ([4, 5, 6].includes(Number(semanaSelecionada)) && Number(dia) < 10)
    );
  };

  const validacaoDiaLetivo = (dia) => {
    const objDia = calendarioMesConsiderado.find(
      (objDia) => Number(objDia.dia) === Number(dia)
    );
    const ehDiaLetivo = objDia && objDia.dia_letivo;
    return ehDiaLetivo;
  };

  const openModalObservacaoDiaria = (dia, categoria) => {
    setShowModalObservacaoDiaria(true);
    setDiaObservacaoDiaria(dia);
    setCategoriaObservacaoDiaria(categoria);
  };

  const onClickBotaoObservacao = (dia, categoria) => {
    openModalObservacaoDiaria(dia, categoria);
  };

  let valuesInputArray = [];

  const desabilitaTooltip = (values) => {
    const erro = validarFormulario(
      values,
      diasSobremesaDoce,
      location,
      categoriasDeMedicao,
      dadosValoresInclusoesAutorizadasState,
      weekColumns,
      feriadosNoMes
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
    values,
    dia,
    categoria,
    rowName,
    form,
    column,
    row
  ) => {
    const ehZeroFrequencia =
      !ehGrupoETECUrlParam &&
      valorZeroFrequencia(
        value,
        rowName,
        categoria,
        dia,
        form,
        tabelaAlimentacaoRows,
        tabelaDietaRows,
        tabelaDietaEnteralRows
      );
    if (deepEqual(values, dadosIniciais)) {
      setDisableBotaoSalvarLancamentos(true);
      desabilitaTooltip(values);
    } else if (
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
        desabilitaTooltip(values);
        setDisableBotaoSalvarLancamentos(true);
      }
    }

    if (
      categoria.nome.includes("ALIMENTAÇÃO") &&
      botaoAddObrigatorioDiaNaoLetivoComInclusaoAutorizada(
        values,
        dia,
        categoria,
        dadosValoresInclusoesAutorizadasState,
        validacaoDiaLetivo
      )
    ) {
      setDisableBotaoSalvarLancamentos(true);
    }
    if (Object.keys(errors).length > 0) {
      setDisableBotaoSalvarLancamentos(true);
      setExibirTooltip(true);
    }

    const valuesFrequencia = Object.fromEntries(
      Object.entries(values).filter(([key]) => key.includes("frequencia"))
    );
    let arrayDiasComFrequenciaZero = [];
    for (const key in valuesFrequencia) {
      if (Number(valuesFrequencia[key]) === 0) {
        const keySplitted = key.split("__");
        const dia = keySplitted[1].match(/\d/g).join("");
        arrayDiasComFrequenciaZero.push(dia);
      }
    }
    desabilitaTooltip(values);

    if (
      (ehZeroFrequencia &&
        !values[`observacoes__dia_${dia}__categoria_${categoria.id}`]) ||
      campoFrequenciaValor0ESemObservacao(dia, categoria, values) ||
      campoComSuspensaoAutorizadaESemObservacao(
        formValuesAtualizados,
        column,
        categoria,
        suspensoesAutorizadas,
        row
      ) ||
      campoRefeicaoComRPLAutorizadaESemObservacao(
        formValuesAtualizados,
        column,
        categoria,
        alteracoesAlimentacaoAutorizadas
      ) ||
      campoLancheComLPRAutorizadaESemObservacao(
        formValuesAtualizados,
        column,
        categoria,
        alteracoesAlimentacaoAutorizadas
      ) ||
      (categoria.nome.includes("ALIMENTAÇÃO") &&
        (exibirTooltipSuspensoesAutorizadas(
          values,
          row,
          column,
          categoria,
          suspensoesAutorizadas
        ) ||
          exibirTooltipRPLAutorizadas(
            formValuesAtualizados,
            row,
            column,
            categoria,
            alteracoesAlimentacaoAutorizadas
          ) ||
          exibirTooltipLPRAutorizadas(
            formValuesAtualizados,
            row,
            column,
            categoria,
            alteracoesAlimentacaoAutorizadas
          ))) ||
      (categoria.nome.includes("SOLICITAÇÕES") &&
        (exibirTooltipQtdKitLancheDiferenteSolAlimentacoesAutorizadas(
          formValuesAtualizados,
          row,
          column,
          categoria,
          kitLanchesAutorizadas
        ) ||
          exibirTooltipKitLancheSolAlimentacoes(
            formValuesAtualizados,
            row,
            column,
            categoria,
            kitLanchesAutorizadas
          ) ||
          exibirTooltipLancheEmergencialZeroAutorizado(
            formValuesAtualizados,
            row,
            column,
            categoria,
            alteracoesAlimentacaoAutorizadas,
            validacaoDiaLetivo
          ) ||
          exibirTooltipLancheEmergencialNaoAutorizado(
            formValuesAtualizados,
            row,
            column,
            categoria,
            alteracoesAlimentacaoAutorizadas
          )) &&
        !formValuesAtualizados[
          `observacoes__dia_${dia}__categoria_${categoria.id}`
        ]) ||
      (ehGrupoETECUrlParam &&
        categoria.nome === "ALIMENTAÇÃO" &&
        exibirTooltipLancheEmergTabelaEtec(
          formValuesAtualizados,
          row,
          column,
          categoria,
          ehGrupoETECUrlParam,
          inclusoesEtecAutorizadas
        ))
    ) {
      setDisableBotaoSalvarLancamentos(true);
      setExibirTooltip(true);
    }

    if (deveExistirObservacao(categoria.id, values, calendarioMesConsiderado)) {
      return;
    }
  };

  const fieldValidationsTabelaAlimentacao =
    (rowName, dia, idCategoria, nomeCategoria) => (value, allValues) => {
      if (nomeCategoria.includes("SOLICITAÇÕES")) {
        return undefined;
      } else if (ehGrupoETECUrlParam && nomeCategoria === "ALIMENTAÇÃO") {
        return validacoesTabelaEtecAlimentacao(
          rowName,
          dia,
          idCategoria,
          value,
          allValues,
          validacaoDiaLetivo,
          validacaoSemana
        );
      } else {
        return validacoesTabelaAlimentacao(
          rowName,
          dia,
          idCategoria,
          value,
          allValues,
          dadosValoresInclusoesAutorizadasState,
          suspensoesAutorizadas,
          alteracoesAlimentacaoAutorizadas,
          validacaoDiaLetivo,
          location,
          feriadosNoMes
        );
      }
    };

  const fieldValidationsTabelasDietas =
    (rowName, dia, categoria) => (value, allValues) => {
      return validacoesTabelasDietas(
        categoriasDeMedicao,
        rowName,
        dia,
        categoria,
        value,
        allValues,
        location,
        valoresPeriodosLancamentos[0]?.medicao_uuid
      );
    };

  const classNameFieldTabelaAlimentacao = (
    row,
    column,
    categoria,
    kitLanchesAutorizadas,
    alteracoesAlimentacaoAutorizadas,
    valoresPeriodosLancamentos,
    diasParaCorrecao
  ) => {
    if (
      (Object.keys(dadosValoresInclusoesAutorizadasState).some((key) =>
        String(key).includes(`__dia_${column.dia}__categoria_${categoria.id}`)
      ) ||
        `${row.name}__dia_${column.dia}__categoria_${categoria.id}` in
          dadosValoresInclusoesAutorizadasState) &&
      !ehGrupoSolicitacoesDeAlimentacaoUrlParam
    ) {
      return "";
    }
    return `${
      !validacaoDiaLetivo(column.dia) &&
      !ehDiaParaCorrigir(
        column.dia,
        categoria.id,
        valoresPeriodosLancamentos,
        diasParaCorrecao
      ) &&
      ((kitLanchesAutorizadas &&
        !kitLanchesAutorizadas.filter(
          (kitLanche) => kitLanche.dia === column.dia
        ).length &&
        row.name === "kit_lanche") ||
        (alteracoesAlimentacaoAutorizadas &&
          !alteracoesAlimentacaoAutorizadas.filter(
            (lancheEmergencial) => lancheEmergencial.dia === column.dia
          ).length &&
          row.name === "lanche_emergencial"))
        ? "nao-eh-dia-letivo"
        : ""
    }`;
  };

  const linhasTabelaAlimentacao = (categoria) => {
    if (categoria.nome.includes("SOLICITAÇÕES")) {
      return tabelaSolicitacoesAlimentacaoRows;
    } else if (ehGrupoETECUrlParam) {
      return tabelaEtecsAlimentacaoRows;
    } else if (
      grupoLocation === "Programas e Projetos" ||
      ehEscolaTipoCEUGESTAO(location.state.solicitacaoMedicaoInicial.escola) ||
      urlParams.get("ehPeriodoEspecifico") === "true"
    ) {
      return tabelaAlimentacaoProgramasProjetosOuCEUGESTAORows;
    } else {
      return tabelaAlimentacaoRows;
    }
  };

  const onClickBotaoVoltar = () => {
    disableBotaoSalvarLancamentos
      ? history.goBack()
      : setShowModalVoltarPeriodoLancamento(true);
  };

  const getClassNameToNextInput = (row, column, categoria, index) => {
    if (
      row.name !== "observacoes" &&
      column &&
      index + 1 < linhasTabelaAlimentacao(categoria).length - 1
    ) {
      return `${linhasTabelaAlimentacao(categoria)[index + 1].name}__dia_${
        column.dia
      }__categoria_${categoria.id}`;
    }
    return undefined;
  };

  const getClassNameToPrevInput = (row, column, categoria, index) => {
    if (
      row.name !== "frequencia" &&
      column &&
      linhasTabelaAlimentacao(categoria)[index - 1]
    ) {
      return `${linhasTabelaAlimentacao(categoria)[index - 1].name}__dia_${
        column.dia
      }__categoria_${categoria.id}`;
    }
    return undefined;
  };

  return (
    <>
      <div className="text-right botao-voltar-lancamento-medicao">
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
                  onChange={(changes) =>
                    setFormValuesAtualizados({
                      week: semanaSelecionada,
                      ...changes.values,
                    })
                  }
                />
                <div className="card mt-3">
                  <div className="card-body">
                    <div className="row pb-2">
                      <div className="col-3">
                        <b className="pb-2 mb-2">Mês do Lançamento</b>
                        <Field
                          component={InputText}
                          name="mes_lancamento"
                          disabled={true}
                        />
                      </div>
                      <div className="col-4">
                        <b className="pb-2">Período de Lançamento</b>
                        <Field
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
                            disabled
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
                      <div className="col">
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
                      >
                        {Array.apply(null, {
                          length: isSunday(lastDayOfMonth(mesAnoConsiderado))
                            ? getWeeksInMonth(mesAnoConsiderado) - 1
                            : getDay(startOfMonth(mesAnoConsiderado)) === 0
                            ? getWeeksInMonth(mesAnoConsiderado) + 1
                            : getWeeksInMonth(mesAnoConsiderado),
                        }).map((e, i) => (
                          <TabPane tab={`Semana ${i + 1}`} key={`${i + 1}`} />
                        ))}
                      </Tabs>
                    </div>
                    {categoriasDeMedicao.length > 0 &&
                      !loading &&
                      categoriasDeMedicao.map((categoria) => (
                        <div key={categoria.uuid}>
                          <b className="pb-2 section-title">{categoria.nome}</b>
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
                              {semanaSelecionada &&
                                calendarioMesConsiderado &&
                                feriadosNoMes &&
                                (tabelaDietaRows || tabelaDietaEnteralRows) &&
                                (categoria.nome.includes("DIETA")
                                  ? (categoria.nome.includes("ENTERAL")
                                      ? tabelaDietaEnteralRows
                                      : tabelaDietaRows
                                    ).map((row, index) => {
                                      return (
                                        <Fragment key={index}>
                                          <div
                                            className={`grid-table-tipos-alimentacao body-table-alimentacao`}
                                          >
                                            <div className="nome-linha">
                                              <b className="pl-2">{row.nome}</b>
                                            </div>
                                            {weekColumns.map((column) => (
                                              <div
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
                                                  !validacaoSemana(
                                                    column.dia
                                                  ) && (
                                                    <Botao
                                                      texto={textoBotaoObservacao(
                                                        formValuesAtualizados[
                                                          `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
                                                        ],
                                                        valoresObservacoes,
                                                        column.dia,
                                                        categoria.id
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
                                                        diasParaCorrecao
                                                      )}
                                                      type={BUTTON_TYPE.BUTTON}
                                                      style={
                                                        botaoAdicionarObrigatorio(
                                                          formValuesAtualizados,
                                                          column.dia,
                                                          categoria,
                                                          diasSobremesaDoce,
                                                          location,
                                                          row,
                                                          column,
                                                          dadosValoresInclusoesAutorizadasState
                                                        )
                                                          ? textoBotaoObservacao(
                                                              formValuesAtualizados[
                                                                `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
                                                              ],
                                                              valoresObservacoes,
                                                              column.dia,
                                                              categoria.id
                                                            ) === "Visualizar"
                                                            ? BUTTON_STYLE.RED
                                                            : BUTTON_STYLE.RED_OUTLINE
                                                          : textoBotaoObservacao(
                                                              formValuesAtualizados[
                                                                `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
                                                              ],
                                                              valoresObservacoes,
                                                              column.dia,
                                                              categoria.id
                                                            ) === "Visualizar"
                                                          ? BUTTON_STYLE.GREEN
                                                          : BUTTON_STYLE.GREEN_OUTLINE_WHITE
                                                      }
                                                      onClick={() =>
                                                        onClickBotaoObservacao(
                                                          column.dia,
                                                          categoria.id
                                                        )
                                                      }
                                                    />
                                                  )
                                                ) : (
                                                  <div className="field-values-input">
                                                    <Field
                                                      className={`m-2 ${
                                                        !validacaoDiaLetivo(
                                                          column.dia
                                                        )
                                                          ? "nao-eh-dia-letivo"
                                                          : ""
                                                      }`}
                                                      component={
                                                        InputValueMedicao
                                                      }
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
                                                      name={`${row.name}__dia_${column.dia}__categoria_${categoria.id}`}
                                                      disabled={desabilitarField(
                                                        column.dia,
                                                        row.name,
                                                        categoria.id,
                                                        categoria.nome,
                                                        formValuesAtualizados,
                                                        mesAnoConsiderado,
                                                        mesAnoDefault,
                                                        dadosValoresInclusoesAutorizadasState,
                                                        validacaoDiaLetivo,
                                                        validacaoSemana,
                                                        location,
                                                        ehGrupoETECUrlParam,
                                                        dadosValoresInclusoesEtecAutorizadasState,
                                                        inclusoesEtecAutorizadas,
                                                        grupoLocation,
                                                        valoresPeriodosLancamentos,
                                                        feriadosNoMes,
                                                        inclusoesAutorizadas,
                                                        categoriasDeMedicao,
                                                        kitLanchesAutorizadas,
                                                        alteracoesAlimentacaoAutorizadas,
                                                        diasParaCorrecao
                                                      )}
                                                      dia={column.dia}
                                                      defaultValue={defaultValue(
                                                        column,
                                                        row
                                                      )}
                                                      validate={fieldValidationsTabelasDietas(
                                                        row.name,
                                                        column.dia,
                                                        categoria.id
                                                      )}
                                                    />
                                                    <OnChange
                                                      name={`${row.name}__dia_${column.dia}__categoria_${categoria.id}`}
                                                    >
                                                      {(value, previous) => {
                                                        onChangeInput(
                                                          value,
                                                          previous,
                                                          errors,
                                                          formValuesAtualizados,
                                                          column.dia,
                                                          categoria,
                                                          row.name,
                                                          form,
                                                          column,
                                                          row
                                                        );
                                                      }}
                                                    </OnChange>
                                                  </div>
                                                )}
                                              </div>
                                            ))}
                                          </div>
                                        </Fragment>
                                      );
                                    })
                                  : linhasTabelaAlimentacao(categoria).map(
                                      (row, index) => {
                                        return (
                                          <Fragment key={index}>
                                            <div
                                              className={`grid-table-tipos-alimentacao body-table-alimentacao`}
                                            >
                                              <div className="nome-linha">
                                                <b className="pl-2">
                                                  {row.nome}
                                                </b>
                                              </div>
                                              {weekColumns.map((column) => (
                                                <div
                                                  key={column.dia}
                                                  className={`${
                                                    validacaoSemana(column.dia)
                                                      ? "input-desabilitado"
                                                      : row.name ===
                                                        "observacoes"
                                                      ? "input-habilitado-observacoes"
                                                      : "input-habilitado"
                                                  }`}
                                                >
                                                  {row.name ===
                                                  "observacoes" ? (
                                                    !validacaoSemana(
                                                      column.dia
                                                    ) && (
                                                      <Botao
                                                        texto={textoBotaoObservacao(
                                                          formValuesAtualizados[
                                                            `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
                                                          ],
                                                          valoresObservacoes,
                                                          column.dia,
                                                          categoria.id
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
                                                          diasParaCorrecao
                                                        )}
                                                        type={
                                                          BUTTON_TYPE.BUTTON
                                                        }
                                                        style={
                                                          botaoAdicionarObrigatorioTabelaAlimentacao(
                                                            formValuesAtualizados,
                                                            column.dia,
                                                            categoria,
                                                            diasSobremesaDoce,
                                                            location,
                                                            row,
                                                            dadosValoresInclusoesAutorizadasState,
                                                            validacaoDiaLetivo,
                                                            column,
                                                            suspensoesAutorizadas,
                                                            alteracoesAlimentacaoAutorizadas,
                                                            kitLanchesAutorizadas,
                                                            inclusoesEtecAutorizadas,
                                                            ehGrupoETECUrlParam,
                                                            feriadosNoMes
                                                          )
                                                            ? textoBotaoObservacao(
                                                                formValuesAtualizados[
                                                                  `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
                                                                ],
                                                                valoresObservacoes,
                                                                column.dia,
                                                                categoria.id
                                                              ) === "Visualizar"
                                                              ? BUTTON_STYLE.RED
                                                              : BUTTON_STYLE.RED_OUTLINE
                                                            : textoBotaoObservacao(
                                                                formValuesAtualizados[
                                                                  `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
                                                                ],
                                                                valoresObservacoes,
                                                                column.dia,
                                                                categoria.id
                                                              ) === "Visualizar"
                                                            ? BUTTON_STYLE.GREEN
                                                            : BUTTON_STYLE.GREEN_OUTLINE_WHITE
                                                        }
                                                        onClick={() =>
                                                          onClickBotaoObservacao(
                                                            column.dia,
                                                            categoria.id
                                                          )
                                                        }
                                                      />
                                                    )
                                                  ) : (
                                                    <div className="field-values-input">
                                                      <Field
                                                        className={`m-2 ${classNameFieldTabelaAlimentacao(
                                                          row,
                                                          column,
                                                          categoria,
                                                          kitLanchesAutorizadas,
                                                          alteracoesAlimentacaoAutorizadas,
                                                          valoresPeriodosLancamentos,
                                                          diasParaCorrecao
                                                        )}`}
                                                        component={
                                                          InputValueMedicao
                                                        }
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
                                                        name={`${row.name}__dia_${column.dia}__categoria_${categoria.id}`}
                                                        disabled={desabilitarField(
                                                          column.dia,
                                                          row.name,
                                                          categoria.id,
                                                          categoria.nome,
                                                          formValuesAtualizados,
                                                          mesAnoConsiderado,
                                                          mesAnoDefault,
                                                          dadosValoresInclusoesAutorizadasState,
                                                          validacaoDiaLetivo,
                                                          validacaoSemana,
                                                          location,
                                                          ehGrupoETECUrlParam,
                                                          dadosValoresInclusoesEtecAutorizadasState,
                                                          inclusoesEtecAutorizadas,
                                                          grupoLocation,
                                                          valoresPeriodosLancamentos,
                                                          feriadosNoMes,
                                                          inclusoesAutorizadas,
                                                          categoriasDeMedicao,
                                                          kitLanchesAutorizadas,
                                                          alteracoesAlimentacaoAutorizadas,
                                                          diasParaCorrecao
                                                        )}
                                                        exibeTooltipPadraoRepeticaoDiasSobremesaDoce={exibirTooltipPadraoRepeticaoDiasSobremesaDoce(
                                                          formValuesAtualizados,
                                                          row,
                                                          column,
                                                          categoria,
                                                          diasSobremesaDoce,
                                                          location
                                                        )}
                                                        exibeTooltipRepeticaoDiasSobremesaDoceDiferenteZero={exibirTooltipRepeticaoDiasSobremesaDoceDiferenteZero(
                                                          formValuesAtualizados,
                                                          row,
                                                          column,
                                                          categoria,
                                                          diasSobremesaDoce,
                                                          location
                                                        )}
                                                        exibeTooltipRepeticao={exibirTooltipRepeticao(
                                                          formValuesAtualizados,
                                                          row,
                                                          column,
                                                          categoria
                                                        )}
                                                        exibeTooltipAlimentacoesAutorizadasDiaNaoLetivo={
                                                          `${row.name}__dia_${column.dia}__categoria_${categoria.id}` in
                                                            dadosValoresInclusoesAutorizadasState &&
                                                          !validacaoDiaLetivo(
                                                            column.dia
                                                          ) &&
                                                          !formValuesAtualizados[
                                                            `observacoes__dia_${column.dia}__categoria_${categoria.id}`
                                                          ]
                                                        }
                                                        exibeTooltipErroQtdMaiorQueAutorizado={exibirTooltipErroQtdMaiorQueAutorizado(
                                                          formValuesAtualizados,
                                                          row,
                                                          column,
                                                          categoria,
                                                          dadosValoresInclusoesAutorizadasState
                                                        )}
                                                        exibeTooltipSuspensoesAutorizadas={exibirTooltipSuspensoesAutorizadas(
                                                          formValuesAtualizados,
                                                          row,
                                                          column,
                                                          categoria,
                                                          suspensoesAutorizadas
                                                        )}
                                                        exibeTooltipRPLAutorizadas={exibirTooltipRPLAutorizadas(
                                                          formValuesAtualizados,
                                                          row,
                                                          column,
                                                          categoria,
                                                          alteracoesAlimentacaoAutorizadas
                                                        )}
                                                        exibeTooltipLPRAutorizadas={exibirTooltipLPRAutorizadas(
                                                          formValuesAtualizados,
                                                          row,
                                                          column,
                                                          categoria,
                                                          alteracoesAlimentacaoAutorizadas
                                                        )}
                                                        exibeTooltipQtdKitLancheDiferenteSolAlimentacoesAutorizadas={exibirTooltipQtdKitLancheDiferenteSolAlimentacoesAutorizadas(
                                                          formValuesAtualizados,
                                                          row,
                                                          column,
                                                          categoria,
                                                          kitLanchesAutorizadas
                                                        )}
                                                        exibeTooltipKitLancheSolAlimentacoes={exibirTooltipKitLancheSolAlimentacoes(
                                                          formValuesAtualizados,
                                                          row,
                                                          column,
                                                          categoria,
                                                          kitLanchesAutorizadas
                                                        )}
                                                        exibeTooltipLancheEmergencialNaoAutorizado={exibirTooltipLancheEmergencialNaoAutorizado(
                                                          formValuesAtualizados,
                                                          row,
                                                          column,
                                                          categoria,
                                                          alteracoesAlimentacaoAutorizadas
                                                        )}
                                                        exibeTooltipLancheEmergencialAutorizado={exibirTooltipLancheEmergencialAutorizado(
                                                          formValuesAtualizados,
                                                          row,
                                                          column,
                                                          categoria,
                                                          alteracoesAlimentacaoAutorizadas,
                                                          validacaoDiaLetivo
                                                        )}
                                                        exibeTooltipLancheEmergencialZeroAutorizado={exibirTooltipLancheEmergencialZeroAutorizado(
                                                          formValuesAtualizados,
                                                          row,
                                                          column,
                                                          categoria,
                                                          alteracoesAlimentacaoAutorizadas,
                                                          validacaoDiaLetivo
                                                        )}
                                                        exibeTooltipLancheEmergencialZeroAutorizadoJustificado={exibirTooltipLancheEmergencialZeroAutorizadoJustificado(
                                                          formValuesAtualizados,
                                                          row,
                                                          column,
                                                          categoria,
                                                          alteracoesAlimentacaoAutorizadas,
                                                          validacaoDiaLetivo
                                                        )}
                                                        exibeTooltipFrequenciaZeroTabelaEtec={exibirTooltipFrequenciaZeroTabelaEtec(
                                                          formValuesAtualizados,
                                                          row,
                                                          column,
                                                          categoria,
                                                          ehGrupoETECUrlParam
                                                        )}
                                                        exibeTooltipLancheEmergTabelaEtec={exibirTooltipLancheEmergTabelaEtec(
                                                          formValuesAtualizados,
                                                          row,
                                                          column,
                                                          categoria,
                                                          ehGrupoETECUrlParam,
                                                          inclusoesEtecAutorizadas
                                                        )}
                                                        ehGrupoETECUrlParam={
                                                          ehGrupoETECUrlParam
                                                        }
                                                        ehProgramasEProjetos={
                                                          location.state
                                                            .grupo ===
                                                          "Programas e Projetos"
                                                        }
                                                        numeroDeInclusoesAutorizadas={
                                                          dadosValoresInclusoesAutorizadasState[
                                                            `${row.name}__dia_${column.dia}__categoria_${categoria.id}`
                                                          ]
                                                        }
                                                        defaultValue={defaultValue(
                                                          column,
                                                          row
                                                        )}
                                                        validate={fieldValidationsTabelaAlimentacao(
                                                          row.name,
                                                          column.dia,
                                                          categoria.id,
                                                          categoria.nome
                                                        )}
                                                      />
                                                      <OnChange
                                                        name={`${row.name}__dia_${column.dia}__categoria_${categoria.id}`}
                                                      >
                                                        {(value, previous) => {
                                                          onChangeInput(
                                                            value,
                                                            previous,
                                                            errors,
                                                            formValuesAtualizados,
                                                            column.dia,
                                                            categoria,
                                                            row.name,
                                                            form,
                                                            column,
                                                            row
                                                          );
                                                        }}
                                                      </OnChange>
                                                    </div>
                                                  )}
                                                </div>
                                              ))}
                                            </div>
                                          </Fragment>
                                        );
                                      }
                                    ))}
                            </article>
                          </section>
                        </div>
                      ))}
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
                        className="float-right"
                        texto="Salvar Correções"
                        type={BUTTON_TYPE.BUTTON}
                        style={`${BUTTON_STYLE.GREEN}`}
                        onClick={() => setShowModalSalvarCorrecoes(true)}
                        disabled={!calendarioMesConsiderado}
                      />
                    ) : (
                      <Botao
                        className="float-right"
                        texto="Salvar Lançamentos"
                        type={BUTTON_TYPE.BUTTON}
                        style={`${BUTTON_STYLE.GREEN}`}
                        onClick={() =>
                          onSubmit(
                            formValuesAtualizados,
                            dadosValoresInclusoesAutorizadasState,
                            false,
                            true,
                            false
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
                          errors
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
                        true
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
        history={history}
      />
    </>
  );
};
