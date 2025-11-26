import HTTP_STATUS from "http-status-codes";
import { useEffect, useState } from "react";
import Botao from "src/components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "src/components/Shareable/Botao/constants";
import { ModalPadraoSimNao } from "src/components/Shareable/ModalPadraoSimNao";
import ModalSolicitacaoDownload from "src/components/Shareable/ModalSolicitacaoDownload";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import {
  deepCopy,
  escolaNaoPossuiAlunosRegulares,
  getError,
  tiposAlimentacaoETEC,
  usuarioEhEscolaTerceirizadaDiretor,
} from "src/helpers/utilities";
import {
  getEscolaSemAlunosRegularesPeriodosSolicitacoesAutorizadasEscola,
  getPeriodosInclusaoContinua,
  getSolicitacoesAlteracoesAlimentacaoAutorizadasEscola,
  getSolicitacoesInclusoesEtecAutorizadasEscola,
  getSolicitacoesInclusoesEventoEspecificoAutorizadasEscola,
  getSolicitacoesKitLanchesAutorizadasEscola,
} from "src/services/medicaoInicial/periodoLancamentoMedicao.service";
import {
  escolaEnviaCorrecaoMedicaoInicialCODAE,
  escolaEnviaCorrecaoMedicaoInicialDRE,
  getEscolaSemAlunosRegularesFrequenciasDietas,
  getQuantidadeAlimentacoesLancadasPeriodoGrupo,
  getSolicitacaoMedicaoInicial,
} from "src/services/medicaoInicial/solicitacaoMedicaoInicial.service";
import { relatorioMedicaoInicialPDF } from "src/services/relatorios";
import { BlocoOcorrencias } from "../BlocoOcorrencias";
import { ModalFinalizarMedicao } from "../ModalFinalizarMedicao";
import { ModalFinalizarMedicaoSemLancamentos } from "../ModalFinalizarSemLancamentos";
import { ModalSemOcorrenciasIMR } from "../ModalSemOcorrenciasIMR";
import { CardLancamento } from "./CardLancamento";
import {
  CORES,
  removeObjetosDuplicados,
  renderBotaoEnviarCorrecao,
  verificaSeEnviarCorrecaoDisabled,
  verificaSeEnviaCorrecaoSemOcorrenciaDisabled,
} from "./helpers";

export const LancamentoPorPeriodo = ({
  escolaInstituicao,
  periodosEscolaSimples,
  solicitacaoMedicaoInicial,
  onClickInfoBasicas,
  periodoSelecionado,
  mes,
  ano,
  objSolicitacaoMIFinalizada,
  setObjSolicitacaoMIFinalizada,
  periodosPermissoesLancamentosEspeciais,
  setSolicitacaoMedicaoInicial,
  naoPodeFinalizar,
  setFinalizandoMedicao,
  ehIMR,
  errosAoSalvar,
  setErrosAoSalvar,
  handleFinalizarMedicao,
  opcaoSelecionada,
  setOpcaoSelecionada,
  arquivo,
  setArquivo,
  comOcorrencias,
  setComOcorrencias,
  escolaSimples,
  setJustificativaSemLancamentos,
}) => {
  const [showModalFinalizarMedicao, setShowModalFinalizarMedicao] =
    useState(false);
  const [
    showModalFinalizarMedicaoSemLancamentos,
    setShowModalFinalizarMedicaoSemLancamentos,
  ] = useState(false);
  const [showModalEnviarCorrecao, setShowModalEnviarCorrecao] = useState(false);
  const [showModalSemOcorrenciasIMR, setShowModalSemOcorrenciasIMR] =
    useState(false);

  const [desabilitaSim, setDesabilitaSim] = useState(false);
  const [periodosInclusaoContinua, setPeriodosInclusaoContinua] =
    useState(undefined);
  const [
    solicitacoesKitLanchesAutorizadas,
    setSolicitacoesKitLanchesAutorizadas,
  ] = useState(undefined);
  const [
    solicitacoesAlteracaoLancheEmergencialAutorizadas,
    setSolicitacoesAlteracaoLancheEmergencialAutorizadas,
  ] = useState(undefined);
  const [
    solicitacoesInclusoesEtecAutorizadas,
    setSolicitacoesInclusoesEtecAutorizadas,
  ] = useState(undefined);
  const [
    periodosEscolaSemAlunosRegulares,
    setPeriodosEscolaSemAlunosRegulares,
  ] = useState(undefined);
  const [
    frequenciasDietasEscolaSemAlunoRegular,
    setfrequenciasDietasEscolaSemAlunoRegular,
  ] = useState(undefined);

  const [
    frequenciasDietasPeriodosEspeciais,
    setFrequenciasDietasPeriodosEspeciais,
  ] = useState(undefined);
  const [quantidadeAlimentacoesLancadas, setQuantidadeAlimentacoesLancadas] =
    useState(undefined);
  const [erroAPI, setErroAPI] = useState("");
  const [exibirModalCentralDownloads, setExibirModalCentralDownloads] =
    useState(false);

  const [periodosEspecificos, setPeriodosEspecificos] = useState([]);

  const getPeriodosInclusaoContinuaAsync = async () => {
    const response = await getPeriodosInclusaoContinua({
      mes,
      ano,
    });
    if (response.status === HTTP_STATUS.OK) {
      setPeriodosInclusaoContinua(response.data.periodos);
    } else {
      setErroAPI(
        "Erro ao carregar períodos de inclusão contínua. Tente novamente mais tarde.",
      );
    }
  };

  const getSolicitacoesKitLanchesAutorizadasAsync = async () => {
    const escola_uuid = escolaInstituicao.uuid;
    const tipo_solicitacao = "Kit Lanche";
    const response = await getSolicitacoesKitLanchesAutorizadasEscola({
      escola_uuid,
      mes,
      ano,
      tipo_solicitacao,
    });
    if (response.status === HTTP_STATUS.OK) {
      setSolicitacoesKitLanchesAutorizadas(response.data.results);
    } else {
      setErroAPI(
        "Erro ao carregar Kit Lanches Autorizadas. Tente novamente mais tarde.",
      );
    }
  };

  const getSolicitacoesAlteracaoLancheEmergencialAutorizadasAsync =
    async () => {
      const params = {};
      params["escola_uuid"] = escolaInstituicao.uuid;
      params["tipo_solicitacao"] = "Alteração";
      params["mes"] = mes;
      params["ano"] = ano;
      params["eh_lanche_emergencial"] = true;
      const response =
        await getSolicitacoesAlteracoesAlimentacaoAutorizadasEscola(params);
      if (response.status === HTTP_STATUS.OK) {
        setSolicitacoesAlteracaoLancheEmergencialAutorizadas(
          response.data.results,
        );
      } else {
        setErroAPI(
          "Erro ao carregar Alteração de Lanche Emergencial Autorizadas. Tente novamente mais tarde.",
        );
      }
    };

  const getSolicitacoesInclusoesEtecAutorizadasAsync = async () => {
    const escola_uuid = escolaInstituicao.uuid;
    const tipo_solicitacao = "Inclusão de";
    const response = await getSolicitacoesInclusoesEtecAutorizadasEscola({
      escola_uuid,
      mes,
      ano,
      tipo_solicitacao,
    });
    if (response.status === HTTP_STATUS.OK) {
      setSolicitacoesInclusoesEtecAutorizadas(response.data.results);
    } else {
      setErroAPI(
        "Erro ao carregar Inclusões ETEC Autorizadas. Tente novamente mais tarde.",
      );
    }
  };

  const getSolicitacoesInclusoesComEventoEspecificoAsync = async () => {
    setPeriodosEspecificos([]);
    const escola_uuid = escolaInstituicao.uuid;
    const tipo_solicitacao = "Inclusão de";
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
      const nomesPeriodosNormais = periodosEscolaSimples.map(
        (vinculo) => vinculo.periodo_escolar.nome,
      );
      const pEspecificos = data.filter(
        (vinculo) =>
          !nomesPeriodosNormais.includes(vinculo.periodo_escolar.nome),
      );
      let periodos = periodosEscolaSimples.concat(pEspecificos);
      setPeriodosEspecificos(periodos);
    } else {
      setErroAPI(
        "Erro ao carregar Inclusões Autorizadas com Evento Específico. Tente novamente mais tarde.",
      );
    }
  };

  const getQuantidadeAlimentacoesLancadasPeriodoGrupoAsync = async () => {
    const params = { uuid_solicitacao: solicitacaoMedicaoInicial.uuid };
    const response =
      await getQuantidadeAlimentacoesLancadasPeriodoGrupo(params);
    if (response.status === HTTP_STATUS.OK) {
      setQuantidadeAlimentacoesLancadas(response.data.results);
    } else {
      toastError(
        "Erro ao carregar quantidades de alimentações lançadas. Tente novamente mais tarde.",
      );
    }
  };

  const getperiodosEscolaSemAlunosRegularesAsync = async () => {
    const escola_uuid = escolaInstituicao.uuid;
    const response =
      await getEscolaSemAlunosRegularesPeriodosSolicitacoesAutorizadasEscola({
        escola_uuid,
        mes,
        ano,
      });
    if (response.status === HTTP_STATUS.OK) {
      setPeriodosEscolaSemAlunosRegulares(response.data);
    } else {
      setErroAPI(
        "Erro ao carregar períodos de escolas CEU GESTÃO. Tente novamente mais tarde.",
      );
    }
  };

  const getEscolaSemAlunosRegularesFrequenciasDietasAsync = async () => {
    const response = await getEscolaSemAlunosRegularesFrequenciasDietas(
      solicitacaoMedicaoInicial.uuid,
    );
    if (response.status === HTTP_STATUS.OK) {
      setfrequenciasDietasEscolaSemAlunoRegular(response.data);
    } else {
      setErroAPI(
        "Erro ao carregar frequência de dietas de escolas CEU GESTÃO. Tente novamente mais tarde.",
      );
    }
  };

  const getFrequenciasDietasAsync = async () => {
    const response = await getEscolaSemAlunosRegularesFrequenciasDietas(
      solicitacaoMedicaoInicial.uuid,
    );
    if (response.status === HTTP_STATUS.OK) {
      setFrequenciasDietasPeriodosEspeciais(response.data);
    } else {
      setErroAPI(
        "Erro ao carregar frequência de dietas de escolas. Tente novamente mais tarde.",
      );
    }
  };

  useEffect(() => {
    getPeriodosInclusaoContinuaAsync();
    getSolicitacoesKitLanchesAutorizadasAsync();
    getSolicitacoesAlteracaoLancheEmergencialAutorizadasAsync();
    getSolicitacoesInclusoesEtecAutorizadasAsync();
    getSolicitacoesInclusoesComEventoEspecificoAsync();
    solicitacaoMedicaoInicial && getFrequenciasDietasAsync();
    solicitacaoMedicaoInicial &&
      getQuantidadeAlimentacoesLancadasPeriodoGrupoAsync() &&
      escolaNaoPossuiAlunosRegulares(solicitacaoMedicaoInicial) &&
      getperiodosEscolaSemAlunosRegularesAsync() &&
      getEscolaSemAlunosRegularesFrequenciasDietasAsync();
  }, [periodoSelecionado, solicitacaoMedicaoInicial]);

  const getPathPlanilhaOcorr = () => {
    if (objSolicitacaoMIFinalizada.anexo)
      return objSolicitacaoMIFinalizada.anexo.arquivo;
    if (solicitacaoMedicaoInicial && solicitacaoMedicaoInicial.anexo)
      return solicitacaoMedicaoInicial.anexo.arquivo;
  };

  const gerarPDFMedicaoInicial = async () => {
    const response = await relatorioMedicaoInicialPDF(
      solicitacaoMedicaoInicial.uuid,
    );
    if (response.status === HTTP_STATUS.OK) {
      setExibirModalCentralDownloads(true);
    } else {
      toastError("Erro ao exportar pdf. Tente novamente mais tarde.");
    }
  };

  const renderBotaoExportarPlanilha = () => {
    if (objSolicitacaoMIFinalizada.anexo) return true;
    if (solicitacaoMedicaoInicial && solicitacaoMedicaoInicial.anexo) {
      return true;
    } else {
      return false;
    }
  };

  const getSolicitacaoMedicaoInicialAsync = async () => {
    const payload = {
      escola: escolaInstituicao.uuid,
      mes: mes,
      ano: ano,
    };

    const solicitacao = await getSolicitacaoMedicaoInicial(payload);
    setSolicitacaoMedicaoInicial(solicitacao.data[0]);
  };

  const renderBotaoExportarPDF = () => {
    if (solicitacaoMedicaoInicial?.sem_lancamentos) {
      return false;
    }
    if (solicitacaoMedicaoInicial) {
      return true;
    }
    if (objSolicitacaoMIFinalizada.status) {
      return true;
    } else {
      return false;
    }
  };

  const renderBotaoFinalizar = () => {
    if (!solicitacaoMedicaoInicial) {
      return false;
    }
    return (
      solicitacaoMedicaoInicial.status ===
      "MEDICAO_EM_ABERTO_PARA_PREENCHIMENTO_UE"
    );
  };

  const escolaEnviaCorrecaoDreCodae = async () => {
    setDesabilitaSim(true);
    const endpoint =
      solicitacaoMedicaoInicial.status === "MEDICAO_CORRECAO_SOLICITADA_CODAE"
        ? escolaEnviaCorrecaoMedicaoInicialCODAE
        : escolaEnviaCorrecaoMedicaoInicialDRE;
    const response = await endpoint(solicitacaoMedicaoInicial.uuid);
    if (response.status === HTTP_STATUS.OK) {
      toastSuccess("Correção da Medição Inicial enviada com sucesso!");
      getQuantidadeAlimentacoesLancadasPeriodoGrupoAsync();
      getSolicitacaoMedicaoInicialAsync();
      setShowModalEnviarCorrecao(false);
    } else {
      toastError(getError(response.data));
    }
    setDesabilitaSim(false);
  };

  const tiposAlimentacaoProgramasEProjetos = () => {
    let tiposAlimentacao = [];
    Object.keys(periodosInclusaoContinua).forEach((periodo) => {
      const periodoProgramasEProjetos = periodosEscolaSimples.find(
        (p) => p.periodo_escolar.nome === periodo,
      );
      if (periodoProgramasEProjetos) {
        const tipos = periodoProgramasEProjetos.tipos_alimentacao;
        tiposAlimentacao = [...tiposAlimentacao, ...tipos];
      }
    });

    return removeObjetosDuplicados(tiposAlimentacao, "nome");
  };

  const onClickFinalizarMedicaoSemLancamentos = () => {
    setShowModalFinalizarMedicaoSemLancamentos(true);
  };

  const onClickFinalizarMedicao = () => {
    if (!ehIMR) {
      setShowModalFinalizarMedicao(true);
      return;
    }
    if (!comOcorrencias) {
      if (errosAoSalvar && errosAoSalvar.length === 0) {
        const errosAoSalvar_ = deepCopy(errosAoSalvar);
        errosAoSalvar_.push({
          erro: "Faça avaliação do serviço prestado pela empresa.",
          periodo_escolar: "OCORRENCIAS",
        });
        setErrosAoSalvar(errosAoSalvar_);
      }
    } else {
      if (comOcorrencias === "false") {
        setShowModalSemOcorrenciasIMR(true);
      } else {
        handleFinalizarMedicao();
      }
    }
  };

  return (
    <div>
      {erroAPI && <div>{erroAPI}</div>}
      {!erroAPI && quantidadeAlimentacoesLancadas && (
        <>
          {ehIMR && (
            <BlocoOcorrencias
              comOcorrencias={comOcorrencias}
              setComOcorrencias={setComOcorrencias}
              errosAoSalvar={errosAoSalvar}
              setErrosAoSalvar={setErrosAoSalvar}
              mes={mes}
              ano={ano}
              escolaSimples={escolaSimples}
              solicitacaoMedicaoInicialUuid={solicitacaoMedicaoInicial.uuid}
            />
          )}
          <div className="pb-2">
            <b className="section-title">Períodos</b>
          </div>
          {!escolaNaoPossuiAlunosRegulares(solicitacaoMedicaoInicial) &&
            frequenciasDietasPeriodosEspeciais &&
            periodosEspecificos.length &&
            periodosEspecificos.map((periodo, index) => (
              <CardLancamento
                key={index}
                textoCabecalho={periodo.periodo_escolar.nome}
                cor={CORES[index]}
                tipos_alimentacao={periodo.tipos_alimentacao}
                periodoSelecionado={periodoSelecionado}
                solicitacaoMedicaoInicial={solicitacaoMedicaoInicial}
                objSolicitacaoMIFinalizada={objSolicitacaoMIFinalizada}
                quantidadeAlimentacoesLancadas={quantidadeAlimentacoesLancadas}
                ehPeriodoEspecifico={
                  periodo.periodo_escolar.eh_periodo_especifico
                }
                periodoEspecifico={
                  periodo.periodo_escolar.eh_periodo_especifico ? periodo : null
                }
                frequenciasDietasEscolaSemAlunoRegular={
                  frequenciasDietasPeriodosEspeciais
                }
                errosAoSalvar={errosAoSalvar}
                periodosPermissoesLancamentosEspeciais={
                  periodosPermissoesLancamentosEspeciais
                }
              />
            ))}
          {!escolaNaoPossuiAlunosRegulares(solicitacaoMedicaoInicial) &&
            frequenciasDietasPeriodosEspeciais &&
            !periodosEspecificos.length &&
            periodosEscolaSimples.map((periodo, index) => (
              <CardLancamento
                key={index}
                textoCabecalho={periodo.periodo_escolar.nome}
                cor={CORES[index]}
                tipos_alimentacao={periodo.tipos_alimentacao}
                periodoSelecionado={periodoSelecionado}
                solicitacaoMedicaoInicial={solicitacaoMedicaoInicial}
                objSolicitacaoMIFinalizada={objSolicitacaoMIFinalizada}
                quantidadeAlimentacoesLancadas={quantidadeAlimentacoesLancadas}
                ehPeriodoEspecifico={
                  periodo.periodo_escolar.eh_periodo_especifico
                }
                periodoEspecifico={
                  periodo.periodo_escolar.eh_periodo_especifico ? periodo : null
                }
                frequenciasDietasEscolaSemAlunoRegular={
                  frequenciasDietasPeriodosEspeciais
                }
                errosAoSalvar={errosAoSalvar}
                periodosPermissoesLancamentosEspeciais={
                  periodosPermissoesLancamentosEspeciais
                }
              />
            ))}
          {escolaNaoPossuiAlunosRegulares(solicitacaoMedicaoInicial) &&
            periodosEscolaSemAlunosRegulares &&
            frequenciasDietasEscolaSemAlunoRegular &&
            periodosEscolaSemAlunosRegulares.map((periodo, index) => (
              <CardLancamento
                key={index}
                textoCabecalho={periodo.periodo_escolar?.nome || periodo.nome}
                cor={CORES[index]}
                tipos_alimentacao={periodo.tipos_alimentacao}
                periodoSelecionado={periodoSelecionado}
                solicitacaoMedicaoInicial={solicitacaoMedicaoInicial}
                objSolicitacaoMIFinalizada={objSolicitacaoMIFinalizada}
                quantidadeAlimentacoesLancadas={quantidadeAlimentacoesLancadas}
                frequenciasDietasEscolaSemAlunoRegular={
                  frequenciasDietasEscolaSemAlunoRegular
                }
                errosAoSalvar={errosAoSalvar}
                ehPeriodoEspecifico={true}
              />
            ))}
          {solicitacoesInclusoesEtecAutorizadas &&
            solicitacoesInclusoesEtecAutorizadas.length > 0 && (
              <CardLancamento
                grupo="ETEC"
                cor={CORES[6]}
                tipos_alimentacao={tiposAlimentacaoETEC()}
                periodoSelecionado={periodoSelecionado}
                solicitacaoMedicaoInicial={solicitacaoMedicaoInicial}
                objSolicitacaoMIFinalizada={objSolicitacaoMIFinalizada}
                ehGrupoETEC={true}
                quantidadeAlimentacoesLancadas={quantidadeAlimentacoesLancadas}
                errosAoSalvar={errosAoSalvar}
              />
            )}
          {periodosInclusaoContinua &&
            (!escolaNaoPossuiAlunosRegulares(solicitacaoMedicaoInicial) ||
              frequenciasDietasEscolaSemAlunoRegular) && (
              <CardLancamento
                grupo="Programas e Projetos"
                cor={CORES[9]}
                tipos_alimentacao={tiposAlimentacaoProgramasEProjetos()}
                periodoSelecionado={periodoSelecionado}
                solicitacaoMedicaoInicial={solicitacaoMedicaoInicial}
                objSolicitacaoMIFinalizada={objSolicitacaoMIFinalizada}
                quantidadeAlimentacoesLancadas={quantidadeAlimentacoesLancadas}
                periodosInclusaoContinua={periodosInclusaoContinua}
                frequenciasDietasEscolaSemAlunoRegular={
                  frequenciasDietasEscolaSemAlunoRegular
                }
                errosAoSalvar={errosAoSalvar}
              />
            )}
          {((solicitacoesKitLanchesAutorizadas &&
            solicitacoesKitLanchesAutorizadas.length > 0) ||
            (solicitacoesAlteracaoLancheEmergencialAutorizadas &&
              solicitacoesAlteracaoLancheEmergencialAutorizadas.length >
                0)) && (
            <CardLancamento
              grupo="Solicitações de Alimentação"
              cor={CORES[5]}
              tipos_alimentacao={["Kit Lanche", "Lanche Emergencial"]}
              periodoSelecionado={periodoSelecionado}
              solicitacaoMedicaoInicial={solicitacaoMedicaoInicial}
              objSolicitacaoMIFinalizada={objSolicitacaoMIFinalizada}
              ehGrupoSolicitacoesDeAlimentacao={true}
              quantidadeAlimentacoesLancadas={quantidadeAlimentacoesLancadas}
              errosAoSalvar={errosAoSalvar}
            />
          )}
          <div className="mt-4">
            {renderBotaoFinalizar() ? (
              <div className="row">
                <div className="col-12 text-end">
                  <Botao
                    texto="Finalizar sem lançamentos"
                    style={BUTTON_STYLE.GREEN_OUTLINE}
                    disabled={
                      (!usuarioEhEscolaTerceirizadaDiretor() &&
                        !escolaNaoPossuiAlunosRegulares(
                          solicitacaoMedicaoInicial,
                        )) ||
                      comOcorrencias === "true" ||
                      naoPodeFinalizar
                    }
                    exibirTooltip={comOcorrencias === "true"}
                    tooltipTitulo="Você avaliou o serviço com ocorrências, não é possível finalizar a medição sem lançamentos."
                    classTooltip="icone-info-invalid"
                    onClick={() => onClickFinalizarMedicaoSemLancamentos()}
                  />
                  <Botao
                    texto="Finalizar"
                    style={BUTTON_STYLE.GREEN}
                    className="ms-3"
                    disabled={
                      (!usuarioEhEscolaTerceirizadaDiretor() &&
                        !escolaNaoPossuiAlunosRegulares(
                          solicitacaoMedicaoInicial,
                        )) ||
                      naoPodeFinalizar
                    }
                    onClick={() => {
                      setJustificativaSemLancamentos("");
                      onClickFinalizarMedicao();
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-12 text-end">
                  {renderBotaoExportarPlanilha() && (
                    <a href={getPathPlanilhaOcorr()}>
                      <Botao
                        texto="Exportar Planilha de Ocorrências"
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                        className="me-3"
                      />
                    </a>
                  )}
                  {renderBotaoExportarPDF() && (
                    <Botao
                      texto="Exportar PDF"
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      onClick={() => gerarPDFMedicaoInicial()}
                    />
                  )}
                  {renderBotaoEnviarCorrecao(solicitacaoMedicaoInicial) && (
                    <Botao
                      texto="Enviar Correção"
                      type={BUTTON_TYPE.BUTTON}
                      style={BUTTON_STYLE.GREEN}
                      className="ms-3"
                      onClick={() => setShowModalEnviarCorrecao(true)}
                      disabled={
                        verificaSeEnviaCorrecaoSemOcorrenciaDisabled(
                          solicitacaoMedicaoInicial,
                        ) ||
                        verificaSeEnviarCorrecaoDisabled(
                          quantidadeAlimentacoesLancadas,
                          solicitacaoMedicaoInicial,
                        )
                      }
                    />
                  )}
                </div>
              </div>
            )}
          </div>
          <ModalFinalizarMedicao
            showModal={showModalFinalizarMedicao}
            closeModal={() => {
              setShowModalFinalizarMedicao(false);
            }}
            setErrosAoSalvar={(value) => setErrosAoSalvar(value)}
            setObjSolicitacaoMIFinalizada={setObjSolicitacaoMIFinalizada}
            escolaInstituicao={escolaInstituicao}
            solicitacaoMedicaoInicial={solicitacaoMedicaoInicial}
            onClickInfoBasicas={onClickInfoBasicas}
            setFinalizandoMedicao={setFinalizandoMedicao}
            opcaoSelecionada={opcaoSelecionada}
            setOpcaoSelecionada={setOpcaoSelecionada}
            arquivo={arquivo}
            setArquivo={setArquivo}
            handleFinalizarMedicao={handleFinalizarMedicao}
          />
          <ModalFinalizarMedicaoSemLancamentos
            mes={mes}
            ano={ano}
            showModal={showModalFinalizarMedicaoSemLancamentos}
            closeModal={() => setShowModalFinalizarMedicaoSemLancamentos(false)}
            setJustificativaSemLancamentos={setJustificativaSemLancamentos}
            handleFinalizarMedicao={handleFinalizarMedicao}
          />
          <ModalSolicitacaoDownload
            show={exibirModalCentralDownloads}
            setShow={setExibirModalCentralDownloads}
          />
          <ModalPadraoSimNao
            showModal={showModalEnviarCorrecao}
            closeModal={() => setShowModalEnviarCorrecao(false)}
            tituloModal={`Enviar Correção para ${
              solicitacaoMedicaoInicial.status ===
              "MEDICAO_CORRECAO_SOLICITADA_CODAE"
                ? "CODAE"
                : "DRE"
            }`}
            descricaoModal={
              <p className="col-12 my-3 p-0">
                Deseja enviar a correção para{" "}
                {solicitacaoMedicaoInicial.status ===
                "MEDICAO_CORRECAO_SOLICITADA_CODAE"
                  ? "CODAE"
                  : "DRE"}
                ?
              </p>
            }
            funcaoSim={escolaEnviaCorrecaoDreCodae}
            desabilitaSim={desabilitaSim}
          />
          <ModalSemOcorrenciasIMR
            show={showModalSemOcorrenciasIMR}
            handleFinalizarMedicao={handleFinalizarMedicao}
            handleClose={() => setShowModalSemOcorrenciasIMR(false)}
            mes={mes}
            ano={ano}
          />
        </>
      )}
    </div>
  );
};
