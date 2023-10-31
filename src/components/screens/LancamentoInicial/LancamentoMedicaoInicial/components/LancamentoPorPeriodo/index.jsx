import React, { useEffect, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import { ModalFinalizarMedicao } from "../ModalFinalizarMedicao";
import CardLancamento from "./CardLancamento";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import ModalSolicitacaoDownload from "components/Shareable/ModalSolicitacaoDownload";
import { ModalPadraoSimNao } from "components/Shareable/ModalPadraoSimNao";
import {
  getPeriodosInclusaoContinua,
  getSolicitacoesKitLanchesAutorizadasEscola,
  getSolicitacoesAlteracoesAlimentacaoAutorizadasEscola,
  getSolicitacoesInclusoesEtecAutorizadasEscola,
  getSolicitacoesInclusoesEventoEspecificoAutorizadasEscola,
  getCEUGESTAOPeriodosSolicitacoesAutorizadasEscola,
} from "services/medicaoInicial/periodoLancamentoMedicao.service";
import { relatorioMedicaoInicialPDF } from "services/relatorios";
import {
  escolaEnviaCorrecaoMedicaoInicialCODAE,
  escolaEnviaCorrecaoMedicaoInicialDRE,
  getCEUGESTAOFrequenciasDietas,
  getQuantidadeAlimentacoesLancadasPeriodoGrupo,
  getSolicitacaoMedicaoInicial,
} from "services/medicaoInicial/solicitacaoMedicaoInicial.service";
import {
  CORES,
  removeObjetosDuplicados,
  renderBotaoEnviarCorrecao,
  verificaSeEnviarCorrecaoDisabled,
} from "./helpers";
import {
  ehEscolaTipoCEUGESTAO,
  getError,
  usuarioEhEscolaTerceirizadaDiretor,
} from "helpers/utilities";
import { tiposAlimentacaoETEC } from "helpers/utilities";

export default ({
  escolaInstituicao,
  periodosEscolaSimples,
  solicitacaoMedicaoInicial,
  onClickInfoBasicas,
  periodoSelecionado,
  mes,
  ano,
  objSolicitacaoMIFinalizada,
  setObjSolicitacaoMIFinalizada,
  setSolicitacaoMedicaoInicial,
  naoPodeFinalizar,
  setFinalizandoMedicao,
}) => {
  const [showModalFinalizarMedicao, setShowModalFinalizarMedicao] =
    useState(false);
  const [showModalEnviarCorrecao, setShowModalEnviarCorrecao] = useState(false);
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
  const [periodosCEUGESTAO, setPeriodosCEUGESTAO] = useState(undefined);
  const [frequenciasDietasCEUGESTAO, setFrequenciasDietasCEUGESTAO] =
    useState(undefined);

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
  const [errosAoSalvar, setErrosAoSalvar] = useState([]);

  const getPeriodosInclusaoContinuaAsync = async () => {
    const response = await getPeriodosInclusaoContinua({
      mes,
      ano,
    });
    if (response.status === HTTP_STATUS.OK) {
      setPeriodosInclusaoContinua(response.data.periodos);
    } else {
      setErroAPI(
        "Erro ao carregar períodos de inclusão contínua. Tente novamente mais tarde."
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
        "Erro ao carregar Kit Lanches Autorizadas. Tente novamente mais tarde."
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
          response.data.results
        );
      } else {
        setErroAPI(
          "Erro ao carregar Alteração de Lanche Emergencial Autorizadas. Tente novamente mais tarde."
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
        "Erro ao carregar Inclusões ETEC Autorizadas. Tente novamente mais tarde."
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
        (vinculo) => vinculo.periodo_escolar.nome
      );
      const pEspecificos = data.filter(
        (vinculo) =>
          !nomesPeriodosNormais.includes(vinculo.periodo_escolar.nome)
      );
      let periodos = periodosEscolaSimples.concat(pEspecificos);
      periodos = periodos.sort((obj1, obj2) =>
        obj1.periodo_escolar.posicao > obj2.periodo_escolar.posicao ? 1 : -1
      );
      setPeriodosEspecificos(periodos);
    } else {
      setErroAPI(
        "Erro ao carregar Inclusões Autorizadas com Evento Específico. Tente novamente mais tarde."
      );
    }
  };

  const getQuantidadeAlimentacoesLancadasPeriodoGrupoAsync = async () => {
    const params = { uuid_solicitacao: solicitacaoMedicaoInicial.uuid };
    const response = await getQuantidadeAlimentacoesLancadasPeriodoGrupo(
      params
    );
    if (response.status === HTTP_STATUS.OK) {
      setQuantidadeAlimentacoesLancadas(response.data.results);
    } else {
      toastError(
        "Erro ao carregar quantidades de alimentações lançadas. Tente novamente mais tarde."
      );
    }
  };

  const getPeriodosCEUGESTAOAsync = async () => {
    const escola_uuid = escolaInstituicao.uuid;
    const response = await getCEUGESTAOPeriodosSolicitacoesAutorizadasEscola({
      escola_uuid,
      mes,
      ano,
    });
    if (response.status === HTTP_STATUS.OK) {
      setPeriodosCEUGESTAO(response.data);
    } else {
      setErroAPI(
        "Erro ao carregar períodos de escolas CEU GESTÃO. Tente novamente mais tarde."
      );
    }
  };

  const getCEUGESTAOFrequenciasDietasAsync = async () => {
    const response = await getCEUGESTAOFrequenciasDietas(
      solicitacaoMedicaoInicial.uuid
    );
    if (response.status === HTTP_STATUS.OK) {
      setFrequenciasDietasCEUGESTAO(response.data);
    } else {
      setErroAPI(
        "Erro ao carregar frequência de dietas de escolas CEU GESTÃO. Tente novamente mais tarde."
      );
    }
  };

  const getFrequenciasDietasAsync = async () => {
    const response = await getCEUGESTAOFrequenciasDietas(
      solicitacaoMedicaoInicial.uuid
    );
    if (response.status === HTTP_STATUS.OK) {
      setFrequenciasDietasPeriodosEspeciais(response.data);
    } else {
      setErroAPI(
        "Erro ao carregar frequência de dietas de escolas CEU GESTÃO. Tente novamente mais tarde."
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
      ehEscolaTipoCEUGESTAO(solicitacaoMedicaoInicial.escola) &&
      getPeriodosCEUGESTAOAsync() &&
      getCEUGESTAOFrequenciasDietasAsync();
  }, [periodoSelecionado, solicitacaoMedicaoInicial]);

  const getPathPlanilhaOcorr = () => {
    if (objSolicitacaoMIFinalizada.anexo)
      return objSolicitacaoMIFinalizada.anexo.arquivo;
    if (solicitacaoMedicaoInicial && solicitacaoMedicaoInicial.anexo)
      return solicitacaoMedicaoInicial.anexo.arquivo;
  };

  const gerarPDFMedicaoInicial = async () => {
    const response = await relatorioMedicaoInicialPDF(
      solicitacaoMedicaoInicial.uuid
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
        (p) => p.periodo_escolar.nome === periodo
      );
      if (periodoProgramasEProjetos) {
        const tipos = periodoProgramasEProjetos.tipos_alimentacao;
        tiposAlimentacao = [...tiposAlimentacao, ...tipos];
      }
    });

    return removeObjetosDuplicados(tiposAlimentacao, "nome");
  };

  return (
    <div>
      {erroAPI && <div>{erroAPI}</div>}
      {!erroAPI && quantidadeAlimentacoesLancadas && (
        <>
          <div className="pb-2">
            <b className="section-title">Períodos</b>
          </div>
          {!ehEscolaTipoCEUGESTAO(solicitacaoMedicaoInicial.escola) &&
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
                frequenciasDietasCEUGESTAO={frequenciasDietasPeriodosEspeciais}
                errosAoSalvar={errosAoSalvar}
              />
            ))}

          {!ehEscolaTipoCEUGESTAO(solicitacaoMedicaoInicial.escola) &&
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
                frequenciasDietasCEUGESTAO={frequenciasDietasPeriodosEspeciais}
                errosAoSalvar={errosAoSalvar}
              />
            ))}
          {ehEscolaTipoCEUGESTAO(solicitacaoMedicaoInicial.escola) &&
            periodosCEUGESTAO &&
            frequenciasDietasCEUGESTAO &&
            periodosCEUGESTAO.map((periodo, index) => (
              <CardLancamento
                key={index}
                textoCabecalho={periodo.nome}
                cor={CORES[index]}
                tipos_alimentacao={periodo.tipos_alimentacao}
                periodoSelecionado={periodoSelecionado}
                solicitacaoMedicaoInicial={solicitacaoMedicaoInicial}
                objSolicitacaoMIFinalizada={objSolicitacaoMIFinalizada}
                quantidadeAlimentacoesLancadas={quantidadeAlimentacoesLancadas}
                frequenciasDietasCEUGESTAO={frequenciasDietasCEUGESTAO}
              />
            ))}
          {periodosInclusaoContinua &&
            (!ehEscolaTipoCEUGESTAO(solicitacaoMedicaoInicial.escola) ||
              frequenciasDietasCEUGESTAO) && (
              <CardLancamento
                grupo="Programas e Projetos"
                cor={CORES[4]}
                tipos_alimentacao={tiposAlimentacaoProgramasEProjetos()}
                periodoSelecionado={periodoSelecionado}
                solicitacaoMedicaoInicial={solicitacaoMedicaoInicial}
                objSolicitacaoMIFinalizada={objSolicitacaoMIFinalizada}
                quantidadeAlimentacoesLancadas={quantidadeAlimentacoesLancadas}
                periodosInclusaoContinua={periodosInclusaoContinua}
                frequenciasDietasCEUGESTAO={frequenciasDietasCEUGESTAO}
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
              />
            )}
          <div className="mt-4">
            {renderBotaoFinalizar() ? (
              <Botao
                texto="Finalizar"
                style={BUTTON_STYLE.GREEN}
                className="float-right"
                disabled={
                  !usuarioEhEscolaTerceirizadaDiretor() || naoPodeFinalizar
                }
                onClick={() => setShowModalFinalizarMedicao(true)}
              />
            ) : (
              <div className="row">
                <div className="col-12 text-right">
                  {renderBotaoExportarPlanilha() && (
                    <a href={getPathPlanilhaOcorr()}>
                      <Botao
                        texto="Exportar Planilha de Ocorrências"
                        style={BUTTON_STYLE.GREEN_OUTLINE}
                        className="mr-3"
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
                      className="ml-3"
                      onClick={() => setShowModalEnviarCorrecao(true)}
                      disabled={verificaSeEnviarCorrecaoDisabled(
                        quantidadeAlimentacoesLancadas,
                        solicitacaoMedicaoInicial
                      )}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
          <ModalFinalizarMedicao
            showModal={showModalFinalizarMedicao}
            closeModal={() => setShowModalFinalizarMedicao(false)}
            setErrosAoSalvar={(value) => setErrosAoSalvar(value)}
            setObjSolicitacaoMIFinalizada={setObjSolicitacaoMIFinalizada}
            escolaInstituicao={escolaInstituicao}
            solicitacaoMedicaoInicial={solicitacaoMedicaoInicial}
            onClickInfoBasicas={onClickInfoBasicas}
            setFinalizandoMedicao={setFinalizandoMedicao}
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
        </>
      )}
    </div>
  );
};
