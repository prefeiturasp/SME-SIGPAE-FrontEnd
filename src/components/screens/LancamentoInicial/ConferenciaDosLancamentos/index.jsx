import React, { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Field, Form } from "react-final-form";
import HTTP_STATUS from "http-status-codes";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Spin } from "antd";
import InputText from "components/Shareable/Input/InputText";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";
import { ModalOcorrencia } from "./components/ModalOcorrencia";
import { BUTTON_ICON } from "components/Shareable/Botao/constants";
import { TabelaLancamentosPeriodo } from "./components/TabelaLancamentosPeriodo";
import {
  medicaoInicialExportarOcorrenciasPDF,
  medicaoInicialExportarOcorrenciasXLSX,
  relatorioMedicaoInicialPDF,
} from "services/relatorios";
import { getVinculosTipoAlimentacaoPorEscola } from "services/cadastroTipoAlimentacao.service";
import {
  getPeriodosGruposMedicao,
  retrieveSolicitacaoMedicaoInicial,
  dreAprovaMedicao,
  dreAprovaSolicitacaoMedicao,
  dreSolicitaCorrecaoUE,
  codaeAprovaSolicitacaoMedicao,
  codaeSolicitaCorrecaoUE,
  codaeAprovaPeriodo,
  updateSolicitacaoMedicaoInicial,
} from "services/medicaoInicial/solicitacaoMedicaoInicial.service";
import {
  getFeriadosNoMesComNome,
  getDiasCalendario,
  getSolicitacoesInclusoesEventoEspecificoAutorizadasEscola,
} from "services/medicaoInicial/periodoLancamentoMedicao.service";
import { getListaDiasSobremesaDoce } from "services/medicaoInicial/diaSobremesaDoce.service";
import {
  MEDICAO_STATUS_DE_PROGRESSO,
  OCORRENCIA_STATUS_DE_PROGRESSO,
} from "./constants";
import "./style.scss";
import ModalSolicitacaoDownload from "components/Shareable/ModalSolicitacaoDownload";
import { ModalEnviarParaCodaeECodaeAprovar } from "./components/ModalEnviarParaCodaeECodaeAprovar";
import { ModalSolicitarCorrecaoUE } from "./components/ModalSolicitarCorrecaoUE";
import { ModalHistoricoCorrecoesPeriodo } from "./components/ModalHistoricoCorrecoesPeriodo";
import ModalHistorico from "components/Shareable/ModalHistorico";
import {
  ehEscolaTipoCEI,
  usuarioEhDRE,
  usuarioEhMedicao,
  getError,
  getISOLocalDatetimeString,
} from "helpers/utilities";

export const ConferenciaDosLancamentos = () => {
  const location = useLocation();

  const [erroAPI, setErroAPI] = useState("");
  const [loading, setLoading] = useState(true);
  const [dadosIniciais, setDadosIniciais] = useState(null);
  const [solicitacao, setSolicitacao] = useState(null);
  const [periodosSimples, setPeriodosSimples] = useState(null);
  const [periodosGruposMedicao, setPeriodosGruposMedicao] = useState(null);
  const [mesSolicitacao, setMesSolicitacao] = useState(null);
  const [anoSolicitacao, setAnoSolicitacao] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [ocorrencia, setOcorrencia] = useState(null);
  const [ocorrenciaExpandida, setOcorrenciaExpandida] = useState(false);
  const [showModalSalvarOcorrencia, setShowModalSalvarOcorrencia] =
    useState(false);
  const [showModalAprovarOcorrencia, setShowModalAprovarOcorrencia] =
    useState(false);
  const [
    showModalEnviarParaCodaeECodaeAprovar,
    setShowModalEnviarParaCodaeECodaeAprovar,
  ] = useState(false);
  const [showModalSolicitarCorrecaoUE, setShowModalSolicitarCorrecaoUE] =
    useState(false);
  const [
    showModalHistoricoCorrecoesPeriodo,
    setShowModalHistoricoCorrecoesPeriodo,
  ] = useState(false);
  const [logCorrecaoOcorrencia, setLogCorrecaoOcorrencia] = useState(null);
  const [logCorrecaoOcorrenciaCODAE, setLogCorrecaoOcorrenciaCODAE] =
    useState(null);
  const [exibirModalCentralDownloads, setExibirModalCentralDownloads] =
    useState(false);
  const [textoOcorrencia, setTextoOcorrencia] = useState("");
  const [
    desabilitarEnviarParaCodaeECodaeAprovar,
    setDesabilitarEnviarParaCodaeECodaeAprovar,
  ] = useState(true);
  const [desabilitarSolicitarCorrecao, setDesabilitarSolicitarCorrecao] =
    useState(true);
  const [showModal, setShowModal] = useState(false);

  const [feriadosNoMes, setFeriadosNoMes] = useState();
  const [diasCalendario, setDiasCalendario] = useState();
  const [diasSobremesaDoce, setDiasSobremesaDoce] = useState();

  const visualizarModal = () => {
    setShowModal(true);
  };

  const getFeriadosNoMesAsync = async (mes, ano) => {
    const params_feriados_no_mes = {
      mes: mes,
      ano: ano,
    };
    const response = await getFeriadosNoMesComNome(params_feriados_no_mes);
    if (response.status === HTTP_STATUS.OK) {
      setFeriadosNoMes(response.data.results);
    } else {
      setErroAPI(
        "Erro ao carregar feriados do mês para esta escola. Tente novamente mais tarde."
      );
    }
  };

  const getDiasCalendarioAsync = async (mes, ano) => {
    const params_dias_calendario = {
      escola_uuid: location.state.escolaUuid,
      mes: mes,
      ano: ano,
    };
    const response = await getDiasCalendario(params_dias_calendario);
    if (response.status === HTTP_STATUS.OK) {
      setDiasCalendario(response.data);
    } else {
      setErroAPI(
        "Erro ao carregar dias do calendário escolar para esta escola. Tente novamente mais tarde."
      );
    }
  };

  const getPeriodosGruposMedicaoAsync = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    const params = { uuid_solicitacao: uuid };
    const response = await getPeriodosGruposMedicao(params);
    if (response.status === HTTP_STATUS.OK) {
      setPeriodosGruposMedicao(response.data.results);
    } else {
      setErroAPI(
        "Erro ao carregar períodos/grupos da solicitação de medição. Tente novamente mais tarde."
      );
    }
  };

  const exibirBotoesOcorrenciaDRE =
    usuarioEhDRE() &&
    solicitacao &&
    ["MEDICAO_ENVIADA_PELA_UE", "MEDICAO_CORRIGIDA_PELA_UE"].includes(
      solicitacao.status
    );

  const exibirBotoesOcorrenciaCODAE =
    usuarioEhMedicao() &&
    solicitacao &&
    ["MEDICAO_APROVADA_PELA_DRE", "MEDICAO_CORRIGIDA_PARA_CODAE"].includes(
      solicitacao.status
    );

  const desabilitarSolicitarCorrecaoOcorrenciaDRE =
    usuarioEhDRE() &&
    solicitacao &&
    solicitacao.ocorrencia &&
    ![
      "MEDICAO_ENVIADA_PELA_UE",
      "MEDICAO_CORRECAO_SOLICITADA",
      "MEDICAO_APROVADA_PELA_DRE",
      "MEDICAO_CORRIGIDA_PELA_UE",
    ].includes(solicitacao.ocorrencia.status);

  const desabilitarSolicitarCorrecaoOcorrenciaCODAE =
    usuarioEhMedicao() &&
    solicitacao &&
    solicitacao.ocorrencia &&
    ![
      "MEDICAO_APROVADA_PELA_DRE",
      "MEDICAO_CORRECAO_SOLICITADA_CODAE",
      "MEDICAO_APROVADA_PELA_CODAE",
      "MEDICAO_CORRIGIDA_PARA_CODAE",
    ].includes(solicitacao.ocorrencia.status);

  const desabilitarAprovarOcorrenciaCODAE =
    usuarioEhMedicao() &&
    solicitacao &&
    solicitacao.ocorrencia &&
    ![
      "MEDICAO_APROVADA_PELA_DRE",
      "MEDICAO_CORRECAO_SOLICITADA_CODAE",
      "MEDICAO_CORRIGIDA_PARA_CODAE",
    ].includes(solicitacao.ocorrencia.status);

  const desabilitarAprovarOcorrenciaDRE =
    usuarioEhDRE() &&
    solicitacao &&
    solicitacao.ocorrencia &&
    ![
      "MEDICAO_ENVIADA_PELA_UE",
      "MEDICAO_CORRIGIDA_PELA_UE",
      "MEDICAO_CORRECAO_SOLICITADA",
    ].includes(solicitacao.ocorrencia.status);

  const desabilitaBotaoExportarPDF = () => {
    return (
      (usuarioEhDRE() || usuarioEhMedicao()) &&
      solicitacao &&
      solicitacao.status === "MEDICAO_CORRIGIDA_PARA_CODAE" &&
      !solicitacao.dre_ciencia_correcao_data
    );
  };

  const habilitaBotaoCienteCorrecoes = () => {
    const todosPeriodosGruposAprovadosCODAE = !periodosGruposMedicao.some(
      (periodoGrupo) => periodoGrupo.status !== "MEDICAO_APROVADA_PELA_CODAE"
    );
    return (
      usuarioEhDRE() &&
      solicitacao &&
      solicitacao.status === "MEDICAO_CORRIGIDA_PARA_CODAE" &&
      !solicitacao.dre_ciencia_correcao_data &&
      todosPeriodosGruposAprovadosCODAE &&
      (!solicitacao.ocorrencia ||
        solicitacao.ocorrencia.status === "MEDICAO_APROVADA_PELA_CODAE")
    );
  };

  const atualizaSolicitacaoMedicaoInicial = async () => {
    let payload = new FormData();
    payload.append("dre_ciencia_correcao_data", getISOLocalDatetimeString());
    const response = await updateSolicitacaoMedicaoInicial(
      solicitacao.uuid,
      payload
    );
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess("Assinatura confirmada com sucesso!");
      await getSolMedInicialAsync();
    } else {
      toastError(getError(response.data));
    }
  };

  const getSolMedInicialAsync = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    const response = await retrieveSolicitacaoMedicaoInicial(uuid);
    let dados_iniciais;
    let mes;
    let mesString;
    let ano;
    let escola;
    if (response.status === HTTP_STATUS.OK) {
      mes = response.data.mes;
      ano = response.data.ano;
      const data = new Date(`${mes}/01/${ano}`);
      mesString = format(data, "LLLL", {
        locale: ptBR,
      }).toString();
      mesString = mesString.charAt(0).toUpperCase() + mesString.slice(1);
      escola = response.data.escola;
      dados_iniciais = {
        mes_lancamento: `${mesString} / ${ano}`,
        unidade_educacional: escola,
      };
      setSolicitacao(response.data);
      setHistorico(response.data.ocorrencia && response.data.ocorrencia.logs);
      setMesSolicitacao(mes);
      setAnoSolicitacao(ano);
      if (response.data.com_ocorrencias) {
        const arquivoPdfOcorrencia = response.data.ocorrencia;
        const logOcorrencia = arquivoPdfOcorrencia.logs.find((log) =>
          ["Correção solicitada", "Aprovado pela DRE"].includes(
            log.status_evento_explicacao
          )
        );
        const logOcorrenciaCODAE = arquivoPdfOcorrencia.logs.find((log) =>
          ["Correção solicitada pela CODAE", "Aprovado pela CODAE"].includes(
            log.status_evento_explicacao
          )
        );
        setOcorrencia(arquivoPdfOcorrencia);
        setLogCorrecaoOcorrencia(logOcorrencia);
        setLogCorrecaoOcorrenciaCODAE(logOcorrenciaCODAE);
        if (logOcorrencia) {
          setTextoOcorrencia(
            (usuarioEhDRE() &&
              logOcorrencia &&
              logOcorrencia.status_evento_explicacao ===
                "Correção solicitada") ||
              (usuarioEhMedicao() &&
                logOcorrenciaCODAE &&
                logOcorrenciaCODAE.status_evento_explicacao ===
                  "Correção solicitada pela CODAE")
              ? "Solicitação de correção no Formulário de Ocorrências realizada em"
              : "Formulário de Ocorrências aprovado em"
          );
        }
      }
    } else {
      setErroAPI("Erro ao carregar Medição Inicial.");
    }
    dados_iniciais && setDadosIniciais(dados_iniciais);
  };

  const getListaDiasSobremesaDoceAsync = async () => {
    const escola_uuid = location.state.escolaUuid;
    const params = {
      mes: Number(mesSolicitacao),
      ano: Number(anoSolicitacao),
      escola_uuid,
    };
    const response = await getListaDiasSobremesaDoce(params);
    if (response.status === HTTP_STATUS.OK) {
      setDiasSobremesaDoce(response.data);
    } else {
      toastError("Erro ao carregar dias de sobremesa doce");
    }
  };

  useEffect(() => {
    if (mesSolicitacao && anoSolicitacao) {
      !feriadosNoMes && getFeriadosNoMesAsync(mesSolicitacao, anoSolicitacao);
      !diasCalendario && getDiasCalendarioAsync(mesSolicitacao, anoSolicitacao);
      !ehEscolaTipoCEI({ nome: solicitacao.escola }) &&
        getListaDiasSobremesaDoceAsync();
    }
  }, [mesSolicitacao, anoSolicitacao]);

  const getVinculosTipoAlimentacaoPorEscolaAsync = async () => {
    const escolaUuid = location.state.escolaUuid;
    const response_vinculos = await getVinculosTipoAlimentacaoPorEscola(
      escolaUuid
    );
    if (response_vinculos.status === HTTP_STATUS.OK) {
      setPeriodosSimples(response_vinculos.data.results);
    } else {
      setErroAPI(
        "Erro ao carregar períodos simples. Tente novamente mais tarde."
      );
    }
    await getPeriodosComEventoEspecificoAsync(response_vinculos.data.results);
  };

  const getPeriodosComEventoEspecificoAsync = async (
    periodosSimplesVinculos
  ) => {
    const escola_uuid = location.state.escolaUuid;
    const tipo_solicitacao = "Inclusão de";
    const mes = Number(location.state.mes);
    const ano = Number(location.state.ano);
    const response =
      await getSolicitacoesInclusoesEventoEspecificoAutorizadasEscola({
        escola_uuid,
        mes,
        ano,
        tipo_solicitacao,
      });
    if (response.status === HTTP_STATUS.OK) {
      const data = response.data.map((vinculo) => {
        vinculo.periodo_escolar.eh_periodo_especifico = true;
        return vinculo;
      });
      const nomesPeriodosNormais = periodosSimplesVinculos.map(
        (vinculo) => vinculo.periodo_escolar.nome
      );
      const pEspecificos = data.filter(
        (vinculo) =>
          !nomesPeriodosNormais.includes(vinculo.periodo_escolar.nome)
      );
      let periodos = periodosSimplesVinculos.concat(pEspecificos);
      periodos = periodos.sort((obj1, obj2) =>
        obj1.periodo_escolar.posicao > obj2.periodo_escolar.posicao ? 1 : -1
      );
      setPeriodosSimples(periodos);
    } else {
      setErroAPI(
        "Erro ao carregar Inclusões Autorizadas com Evento Específico. Tente novamente mais tarde."
      );
    }
  };

  useEffect(() => {
    Promise.all([
      getPeriodosGruposMedicaoAsync(),
      getSolMedInicialAsync(),
      getVinculosTipoAlimentacaoPorEscolaAsync(),
    ]).then(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (solicitacao && periodosGruposMedicao) {
      const todosPeriodosGruposAprovadosDRE = !periodosGruposMedicao.some(
        (periodoGrupo) => periodoGrupo.status !== "MEDICAO_APROVADA_PELA_DRE"
      );
      const todosPeriodosGruposAprovadosCODAE = !periodosGruposMedicao.some(
        (periodoGrupo) => periodoGrupo.status !== "MEDICAO_APROVADA_PELA_CODAE"
      );
      if (
        ([
          "MEDICAO_APROVADA_PELA_DRE",
          "MEDICAO_CORRIGIDA_PARA_CODAE",
          "MEDICAO_APROVADA_PELA_CODAE",
        ].includes(solicitacao.status) &&
          usuarioEhDRE()) ||
        (solicitacao.status === "MEDICAO_APROVADA_PELA_CODAE" &&
          usuarioEhMedicao())
      ) {
        setDesabilitarEnviarParaCodaeECodaeAprovar(true);
      } else {
        if (solicitacao.com_ocorrencias) {
          if (
            ocorrencia &&
            ((usuarioEhDRE() &&
              ocorrencia.status === "MEDICAO_APROVADA_PELA_DRE" &&
              todosPeriodosGruposAprovadosDRE) ||
              (usuarioEhMedicao() &&
                ocorrencia.status === "MEDICAO_APROVADA_PELA_CODAE" &&
                todosPeriodosGruposAprovadosCODAE))
          ) {
            setDesabilitarEnviarParaCodaeECodaeAprovar(false);
          } else {
            setDesabilitarEnviarParaCodaeECodaeAprovar(true);
          }
        } else if (
          (todosPeriodosGruposAprovadosDRE && usuarioEhDRE()) ||
          todosPeriodosGruposAprovadosCODAE
        ) {
          setDesabilitarEnviarParaCodaeECodaeAprovar(false);
        } else {
          setDesabilitarEnviarParaCodaeECodaeAprovar(true);
        }
      }

      const statusPermitidosSolicitarCorrecaoPelaDRE = [
        "MEDICAO_CORRECAO_SOLICITADA",
        "MEDICAO_APROVADA_PELA_DRE",
      ];

      const statusPermitidosSolicitarCorrecaoPelaCODAE = [
        "MEDICAO_CORRECAO_SOLICITADA_CODAE",
        "MEDICAO_APROVADA_PELA_CODAE",
      ];

      const algumPeriodoGrupoParaCorrigirPelaDRE = periodosGruposMedicao.some(
        (periodoGrupo) => periodoGrupo.status === "MEDICAO_CORRECAO_SOLICITADA"
      );

      const algumPeriodoGrupoParaCorrigirPelaCODAE = periodosGruposMedicao.some(
        (periodoGrupo) =>
          periodoGrupo.status === "MEDICAO_CORRECAO_SOLICITADA_CODAE"
      );

      const todosPeriodosGruposAnalisadosPelaDRE = periodosGruposMedicao.every(
        (periodoGrupo) =>
          periodoGrupo.status === "MEDICAO_CORRECAO_SOLICITADA" ||
          periodoGrupo.status === "MEDICAO_APROVADA_PELA_DRE"
      );

      const todosPeriodosGruposAnalisadosPelaCODAE =
        periodosGruposMedicao.every(
          (periodoGrupo) =>
            periodoGrupo.status === "MEDICAO_CORRECAO_SOLICITADA_CODAE" ||
            periodoGrupo.status === "MEDICAO_APROVADA_PELA_CODAE"
        );

      if (
        (usuarioEhDRE() &&
          !statusPermitidosSolicitarCorrecaoPelaDRE.includes(
            solicitacao.status
          )) ||
        (usuarioEhMedicao() &&
          !statusPermitidosSolicitarCorrecaoPelaCODAE.includes(
            solicitacao.status
          ))
      ) {
        if (solicitacao.com_ocorrencias) {
          if (
            ocorrencia &&
            ((usuarioEhDRE() &&
              ((ocorrencia.status === "MEDICAO_CORRECAO_SOLICITADA" &&
                todosPeriodosGruposAnalisadosPelaDRE) ||
                (ocorrencia.status === "MEDICAO_APROVADA_PELA_DRE" &&
                  todosPeriodosGruposAnalisadosPelaDRE &&
                  algumPeriodoGrupoParaCorrigirPelaDRE))) ||
              (usuarioEhMedicao() &&
                ((ocorrencia.status === "MEDICAO_CORRECAO_SOLICITADA_CODAE" &&
                  todosPeriodosGruposAnalisadosPelaCODAE) ||
                  (ocorrencia.status === "MEDICAO_APROVADA_PELA_CODAE" &&
                    todosPeriodosGruposAnalisadosPelaCODAE &&
                    algumPeriodoGrupoParaCorrigirPelaCODAE))))
          ) {
            setDesabilitarSolicitarCorrecao(false);
          } else {
            setDesabilitarSolicitarCorrecao(true);
          }
        } else if (
          (usuarioEhDRE() &&
            todosPeriodosGruposAnalisadosPelaDRE &&
            algumPeriodoGrupoParaCorrigirPelaDRE) ||
          (usuarioEhMedicao() &&
            todosPeriodosGruposAnalisadosPelaCODAE &&
            algumPeriodoGrupoParaCorrigirPelaCODAE)
        ) {
          setDesabilitarSolicitarCorrecao(false);
        } else {
          setDesabilitarSolicitarCorrecao(true);
        }
      } else {
        setDesabilitarSolicitarCorrecao(true);
      }
    }
  }, [ocorrencia, solicitacao, periodosGruposMedicao]);

  const aprovarPeriodo = async (periodoGrupo, nomePeridoFormatado) => {
    setLoading(true);
    const response = usuarioEhDRE()
      ? await dreAprovaMedicao(periodoGrupo.uuid_medicao_periodo_grupo)
      : await codaeAprovaPeriodo(periodoGrupo.uuid_medicao_periodo_grupo);
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess(`Período ${nomePeridoFormatado} aprovado com sucesso!`);
    } else {
      setErroAPI(
        `Erro ao aprovar Período ${nomePeridoFormatado}. Tente novamente mais tarde.`
      );
    }
    Promise.all([
      getPeriodosGruposMedicaoAsync(),
      getSolMedInicialAsync(),
      getVinculosTipoAlimentacaoPorEscolaAsync(),
    ]).then(() => setLoading(false));
  };

  const aprovarSolicitacaoMedicao = async () => {
    const msgErro = "Erro ao aprovar Medição. Tente novamente mais tarde.";
    setLoading(true);
    if (usuarioEhMedicao()) {
      const response = await codaeAprovaSolicitacaoMedicao(solicitacao.uuid);
      if (response.status === HTTP_STATUS.OK) {
        toastSuccess("Medição Inicial aprovada com sucesso!");
      } else {
        setErroAPI(msgErro);
      }
    } else {
      const response = await dreAprovaSolicitacaoMedicao(solicitacao.uuid);
      if (response.status === HTTP_STATUS.OK) {
        toastSuccess(
          "Medição aprovada pela DRE e enviada para análise de CODAE"
        );
      } else {
        setErroAPI(msgErro);
      }
    }
    Promise.all([
      getPeriodosGruposMedicaoAsync(),
      getSolMedInicialAsync(),
      getVinculosTipoAlimentacaoPorEscolaAsync(),
    ]).then(() => setLoading(false));
  };

  const solicitarCorrecaoMedicao = async () => {
    const msgSuccess =
      "Solicitação de correção enviada para a unidade com sucesso";
    const msgErro =
      "Erro ao solicitar correção da Medição. Tente novamente mais tarde.";
    setLoading(true);
    const endpoint = usuarioEhMedicao()
      ? codaeSolicitaCorrecaoUE
      : dreSolicitaCorrecaoUE;
    const response = await endpoint(solicitacao.uuid);
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess(msgSuccess);
    } else {
      setErroAPI(msgErro);
    }
    Promise.all([
      getPeriodosGruposMedicaoAsync(),
      getSolMedInicialAsync(),
      getVinculosTipoAlimentacaoPorEscolaAsync(),
    ]).then(() => setLoading(false));
  };

  const handleClickDownload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuidSolicitacaoMedicao = urlParams.get("uuid");
    const response = await relatorioMedicaoInicialPDF(uuidSolicitacaoMedicao);
    if (response.status === HTTP_STATUS.OK) {
      setExibirModalCentralDownloads(true);
    } else {
      toastError("Erro ao exportar pdf. Tente novamente mais tarde.");
    }
  };

  const getHistorico = () => {
    return historico;
  };

  return (
    <div className="conferencia-dos-lancamentos">
      {solicitacao && solicitacao.ocorrencia && (
        <ModalHistorico
          visible={showModal}
          onOk={() => setShowModal(false)}
          onCancel={() => setShowModal(false)}
          logs={solicitacao.ocorrencia.logs}
          solicitacaoMedicaoInicial={solicitacao.ocorrencia}
          titulo="Histórico do Formulário de Ocorrências"
          getHistorico={getHistorico}
        />
      )}
      {erroAPI && <div>{erroAPI}</div>}
      <Spin tip="Carregando..." spinning={loading}>
        {!erroAPI && dadosIniciais && periodosGruposMedicao && (
          <Form
            onSubmit={() => {}}
            initialValues={dadosIniciais}
            render={({ handleSubmit, form, values }) => (
              <form onSubmit={handleSubmit}>
                <div className="card mt-3">
                  <div className="card-body">
                    <div className="row pb-2">
                      <div className="col-3">
                        <b className="pb-2 mb-2">Mês do Lançamento</b>
                        <Field
                          component={InputText}
                          name="mes_lancamento"
                          disabled={true}
                          placeholder="Mês do Lançamento"
                        />
                      </div>
                      <div className="col-9">
                        <b className="pb-2">Unidade Educacional</b>
                        <Field
                          component={InputText}
                          name="unidade_educacional"
                          disabled={true}
                          placeholder="Unidade Educacional"
                        />
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-12">
                        <p className="section-title-conf-lancamentos">
                          Progresso de validação de refeições informadas
                        </p>
                      </div>
                      <div className="col-12">
                        <p>
                          Status de progresso:{" "}
                          <b>
                            {
                              MEDICAO_STATUS_DE_PROGRESSO[solicitacao.status]
                                .nome
                            }
                          </b>
                        </p>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-12">
                        <p className="section-title-conf-lancamentos">
                          Ocorrências
                        </p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <div className="content-section-ocorrencias">
                          <div className="row">
                            <div className="col-6">
                              <p className="mb-0">
                                Avaliação do Serviço:{" "}
                                <b
                                  className={`${
                                    solicitacao.com_ocorrencias
                                      ? "value-avaliacao-servico-red"
                                      : "value-avaliacao-servico-green"
                                  }`}
                                >
                                  {solicitacao.com_ocorrencias
                                    ? "COM OCORRÊNCIAS"
                                    : "SEM OCORRÊNCIAS"}
                                </b>
                              </p>
                            </div>
                            {solicitacao.com_ocorrencias ? (
                              <Fragment>
                                <div className="col-6 text-end">
                                  <span className="status-ocorrencia text-center me-3">
                                    <b
                                      className={
                                        [
                                          "MEDICAO_CORRECAO_SOLICITADA",
                                          "MEDICAO_CORRECAO_SOLICITADA_CODAE",
                                        ].includes(ocorrencia.status)
                                          ? "red"
                                          : ""
                                      }
                                    >
                                      {OCORRENCIA_STATUS_DE_PROGRESSO[
                                        ocorrencia.status
                                      ] &&
                                        OCORRENCIA_STATUS_DE_PROGRESSO[
                                          ocorrencia.status
                                        ].nome}
                                    </b>
                                  </span>
                                  {ocorrencia && ocorrenciaExpandida ? (
                                    <span
                                      className="download-ocorrencias me-0"
                                      onClick={() => {
                                        medicaoInicialExportarOcorrenciasPDF(
                                          ocorrencia.ultimo_arquivo
                                        );
                                        usuarioEhMedicao() &&
                                          medicaoInicialExportarOcorrenciasXLSX(
                                            ocorrencia.ultimo_arquivo_excel
                                          );
                                      }}
                                    >
                                      <i
                                        className={`${BUTTON_ICON.DOWNLOAD} me-2`}
                                      />
                                      Download de Ocorrências
                                    </span>
                                  ) : (
                                    <label
                                      className="green visualizar-ocorrencias"
                                      onClick={() =>
                                        setOcorrenciaExpandida(true)
                                      }
                                    >
                                      <b>VISUALIZAR</b>
                                    </label>
                                  )}
                                </div>
                              </Fragment>
                            ) : (
                              <div className="col-6" />
                            )}
                          </div>
                          <div className="row">
                            {ocorrenciaExpandida && ocorrencia && (
                              <Fragment>
                                <div className="col-5 mt-3">
                                  {usuarioEhDRE() &&
                                    logCorrecaoOcorrencia &&
                                    `${textoOcorrencia} ${logCorrecaoOcorrencia.criado_em}`}
                                  {usuarioEhMedicao() &&
                                    logCorrecaoOcorrenciaCODAE &&
                                    `${textoOcorrencia} ${logCorrecaoOcorrenciaCODAE.criado_em}`}
                                </div>
                                <div className="col-7 text-end mt-3">
                                  <Botao
                                    texto="Histórico"
                                    type={BUTTON_TYPE.BUTTON}
                                    style={BUTTON_STYLE.GREEN_OUTLINE}
                                    onClick={visualizarModal}
                                  />
                                  {(exibirBotoesOcorrenciaDRE ||
                                    exibirBotoesOcorrenciaCODAE) && (
                                    <>
                                      <Botao
                                        className="mx-3"
                                        texto="Solicitar correção no formulário"
                                        type={BUTTON_TYPE.BUTTON}
                                        style={BUTTON_STYLE.GREEN_OUTLINE_WHITE}
                                        disabled={
                                          desabilitarSolicitarCorrecaoOcorrenciaDRE ||
                                          desabilitarSolicitarCorrecaoOcorrenciaCODAE
                                        }
                                        onClick={() =>
                                          setShowModalSalvarOcorrencia(true)
                                        }
                                      />
                                      <Botao
                                        texto="Aprovar formulário"
                                        type={BUTTON_TYPE.BUTTON}
                                        style={BUTTON_STYLE.GREEN}
                                        disabled={
                                          desabilitarAprovarOcorrenciaCODAE ||
                                          desabilitarAprovarOcorrenciaDRE
                                        }
                                        onClick={() =>
                                          setShowModalAprovarOcorrencia(true)
                                        }
                                      />
                                    </>
                                  )}
                                </div>
                              </Fragment>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-6">
                        <p className="section-title-conf-lancamentos">
                          Acompanhamento do lançamento
                        </p>
                      </div>
                      <div className="col-6">
                        {solicitacao.historico &&
                          solicitacao.historico !== "" && (
                            <Botao
                              className="float-end"
                              texto="Histórico de correções"
                              style={BUTTON_STYLE.GREEN_OUTLINE}
                              onClick={() =>
                                setShowModalHistoricoCorrecoesPeriodo(true)
                              }
                            />
                          )}
                      </div>
                      <div className="col-12 mt-3">
                        {periodosGruposMedicao.map((periodoGrupo, index) => {
                          return [
                            <TabelaLancamentosPeriodo
                              key={index}
                              periodoGrupo={periodoGrupo}
                              periodosSimples={periodosSimples}
                              mesSolicitacao={mesSolicitacao}
                              anoSolicitacao={anoSolicitacao}
                              form={form}
                              aprovarPeriodo={(
                                periodoGrupo,
                                nomePeridoFormatado
                              ) =>
                                aprovarPeriodo(
                                  periodoGrupo,
                                  nomePeridoFormatado
                                )
                              }
                              values={values}
                              getPeriodosGruposMedicaoAsync={() =>
                                getPeriodosGruposMedicaoAsync()
                              }
                              setOcorrenciaExpandida={() =>
                                setOcorrenciaExpandida(false)
                              }
                              solicitacao={solicitacao}
                              feriadosNoMes={feriadosNoMes}
                              diasCalendario={diasCalendario}
                              diasSobremesaDoce={diasSobremesaDoce}
                            />,
                          ];
                        })}
                      </div>
                    </div>
                    <div className="float-end">
                      <Botao
                        texto="Exportar PDF"
                        style={BUTTON_STYLE.GREEN_OUTLINE_WHITE}
                        onClick={() => handleClickDownload()}
                        disabled={desabilitaBotaoExportarPDF()}
                        tooltipExterno={
                          desabilitaBotaoExportarPDF() &&
                          "Só será possível exportar o PDF com as assinaturas, após a Ciência das Correções pela DRE."
                        }
                      />
                      {((![
                        "MEDICAO_APROVADA_PELA_DRE",
                        "MEDICAO_CORRECAO_SOLICITADA",
                        "MEDICAO_APROVADA_PELA_CODAE",
                        "MEDICAO_CORRECAO_SOLICITADA_CODAE",
                      ].includes(solicitacao.status) &&
                        usuarioEhDRE()) ||
                        ([
                          "MEDICAO_APROVADA_PELA_DRE",
                          "MEDICAO_CORRIGIDA_PARA_CODAE",
                        ].includes(solicitacao.status) &&
                          usuarioEhMedicao())) && (
                        <>
                          <Botao
                            className="ms-3"
                            texto="Solicitar Correção"
                            style={BUTTON_STYLE.GREEN_OUTLINE_WHITE}
                            onClick={() =>
                              setShowModalSolicitarCorrecaoUE(true)
                            }
                            disabled={desabilitarSolicitarCorrecao}
                          />
                          <Botao
                            className="ms-3"
                            texto={
                              usuarioEhMedicao()
                                ? "Aprovar Medição"
                                : "Enviar para CODAE"
                            }
                            style={BUTTON_STYLE.GREEN}
                            onClick={() =>
                              setShowModalEnviarParaCodaeECodaeAprovar(true)
                            }
                            disabled={
                              desabilitarEnviarParaCodaeECodaeAprovar ||
                              (usuarioEhMedicao() &&
                                desabilitaBotaoExportarPDF())
                            }
                            tooltipExterno={
                              usuarioEhMedicao() &&
                              desabilitaBotaoExportarPDF() &&
                              "Só será possível Aprovar Medição com as assinaturas, após a Ciência das Correções pela DRE."
                            }
                          />
                        </>
                      )}
                      {usuarioEhDRE() && (
                        <Botao
                          className="ms-3"
                          texto="Ciente das Correções"
                          style={BUTTON_STYLE.GREEN}
                          onClick={async () => {
                            setLoading(true);
                            await atualizaSolicitacaoMedicaoInicial();
                            setLoading(false);
                          }}
                          disabled={loading || !habilitaBotaoCienteCorrecoes()}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </form>
            )}
          />
        )}
        <ModalOcorrencia
          showModal={showModalSalvarOcorrencia}
          setShowModal={(value) => setShowModalSalvarOcorrencia(value)}
          ocorrencia={ocorrencia}
          atualizarDados={async () => {
            await getSolMedInicialAsync();
            setLoading(false);
          }}
          titulo={"Solicitar correção no formulário de ocorrências"}
          descricao={
            "Informe quais os pontos necessários de correção no Formulário de Ocorrências"
          }
          temJustificativa={true}
          ehCorrecao={true}
          tituloBotoes={["Cancelar", "Salvar"]}
        />
        <ModalOcorrencia
          showModal={showModalAprovarOcorrencia}
          setShowModal={(value) => setShowModalAprovarOcorrencia(value)}
          ocorrencia={ocorrencia}
          atualizarDados={async () => {
            await getSolMedInicialAsync();
            setLoading(false);
          }}
          titulo={"Aprovar Formulário de Ocorrências"}
          descricao={"Deseja aprovar o Formulário de Ocorrências?"}
          temJustificativa={false}
          ehCorrecao={false}
          tituloBotoes={["Não", "Sim"]}
        />
        <ModalSolicitacaoDownload
          show={exibirModalCentralDownloads}
          setShow={setExibirModalCentralDownloads}
        />
        <ModalEnviarParaCodaeECodaeAprovar
          showModal={showModalEnviarParaCodaeECodaeAprovar}
          setShowModal={(value) =>
            setShowModalEnviarParaCodaeECodaeAprovar(value)
          }
          aprovarSolicitacaoMedicao={() => {
            aprovarSolicitacaoMedicao();
          }}
        />
        <ModalSolicitarCorrecaoUE
          showModal={showModalSolicitarCorrecaoUE}
          setShowModal={(value) => setShowModalSolicitarCorrecaoUE(value)}
          endpoint={() => {
            solicitarCorrecaoMedicao();
          }}
        />
        {solicitacao && solicitacao.historico && (
          <ModalHistoricoCorrecoesPeriodo
            showModal={showModalHistoricoCorrecoesPeriodo}
            setShowModal={(value) =>
              setShowModalHistoricoCorrecoesPeriodo(value)
            }
            solicitacao={solicitacao}
            historicos={solicitacao.historico}
          />
        )}
      </Spin>
    </div>
  );
};
