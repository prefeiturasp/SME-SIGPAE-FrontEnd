import React, { useEffect, useState } from "react";
import HTTP_STATUS from "http-status-codes";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_STYLE,
  BUTTON_TYPE,
} from "components/Shareable/Botao/constants";
import { toastError, toastSuccess } from "components/Shareable/Toast/dialogs";
import ModalSolicitacaoDownload from "components/Shareable/ModalSolicitacaoDownload";
import { ModalPadraoSimNao } from "components/Shareable/ModalPadraoSimNao";
import { CardLancamentoCEI } from "./CardLancamentoCEI";
import { ModalFinalizarMedicao } from "../ModalFinalizarMedicao";
import {
  CORES,
  removeObjetosDuplicados,
  renderBotaoEnviarCorrecao,
  verificaSeEnviarCorrecaoDisabled,
} from "../LancamentoPorPeriodo/helpers";
import {
  ehEscolaTipoCEMEI,
  getError,
  usuarioEhEscolaTerceirizadaDiretor,
} from "helpers/utilities";
import { ehEmeiDaCemei } from "./helpers";
import { relatorioMedicaoInicialPDF } from "services/relatorios";
import {
  escolaEnviaCorrecaoMedicaoInicialCODAE,
  escolaEnviaCorrecaoMedicaoInicialDRE,
  getQuantidadeAlimentacoesLancadasPeriodoGrupo,
  getSolicitacaoMedicaoInicial,
} from "services/medicaoInicial/solicitacaoMedicaoInicial.service";
import {
  getPeriodosInclusaoContinua,
  getSolicitacoesAlteracoesAlimentacaoAutorizadasEscola,
  getSolicitacoesKitLanchesAutorizadasEscola,
} from "services/medicaoInicial/periodoLancamentoMedicao.service";
import { BlocoOcorrencias } from "../BlocoOcorrencias";
import { deepCopy } from "../../../../../../helpers/utilities";
import { ModalSemOcorrenciasIMR } from "../ModalSemOcorrenciasIMR";

export const LancamentoPorPeriodoCEI = ({
  mes,
  ano,
  periodoSelecionado,
  escolaInstituicao,
  periodosEscolaSimples,
  periodosEscolaCemeiComAlunosEmei,
  solicitacaoMedicaoInicial,
  onClickInfoBasicas,
  setObjSolicitacaoMIFinalizada,
  setSolicitacaoMedicaoInicial,
  setFinalizandoMedicao,
  naoPodeFinalizar,
  periodosPermissoesLancamentosEspeciais,
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
}) => {
  const [periodosComAlunos, setPeriodosComAlunos] = useState([]);
  const [exibirModalCentralDownloads, setExibirModalCentralDownloads] =
    useState(false);
  const [showModalFinalizarMedicao, setShowModalFinalizarMedicao] =
    useState(false);
  const [showModalSemOcorrenciasIMR, setShowModalSemOcorrenciasIMR] =
    useState(false);
  const [quantidadeAlimentacoesLancadas, setQuantidadeAlimentacoesLancadas] =
    useState(undefined);
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

  const [erroAPI, setErroAPI] = useState("");

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

  useEffect(() => {
    let periodos = escolaInstituicao.periodos_escolares
      .filter((periodo) => periodo.possui_alunos_regulares)
      .map((periodo) => periodo.nome);
    if (solicitacaoMedicaoInicial?.ue_possui_alunos_periodo_parcial) {
      periodos.splice(1, 0, "PARCIAL");
    }

    if (ehEscolaTipoCEMEI(escolaInstituicao)) {
      periodos = periodos
        .filter((periodo) => !["MANHA", "TARDE"].includes(periodo))
        .concat(periodosEscolaCemeiComAlunosEmei);
    }

    setPeriodosComAlunos(periodos);
  }, [escolaInstituicao, solicitacaoMedicaoInicial]);

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

  const getSolicitacaoMedicaoInicialAsync = async () => {
    const payload = {
      escola: escolaInstituicao.uuid,
      mes: mes,
      ano: ano,
    };

    const solicitacao = await getSolicitacaoMedicaoInicial(payload);
    setSolicitacaoMedicaoInicial(solicitacao.data[0]);
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
    if (ehEscolaTipoCEMEI(escolaInstituicao)) {
      const escola_uuid = escolaInstituicao.uuid;
      const tipo_solicitacao = "Kit Lanche Passeio de CEMEI";
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
          "Erro ao carregar Kit Lanches CEMEI Autorizadas. Tente novamente mais tarde."
        );
      }
    }
  };

  const getSolicitacoesAlteracaoLancheEmergencialAutorizadasAsync =
    async () => {
      if (ehEscolaTipoCEMEI(escolaInstituicao)) {
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
            "Erro ao carregar Alteração de Lanche Emergencial CEMEI Autorizadas. Tente novamente mais tarde."
          );
        }
      }
    };

  useEffect(() => {
    if (ehEscolaTipoCEMEI(escolaInstituicao)) {
      getPeriodosInclusaoContinuaAsync();
      getSolicitacoesKitLanchesAutorizadasAsync();
      getSolicitacoesAlteracaoLancheEmergencialAutorizadasAsync();
    }
    solicitacaoMedicaoInicial &&
      getQuantidadeAlimentacoesLancadasPeriodoGrupoAsync();
  }, [periodoSelecionado, solicitacaoMedicaoInicial]);

  const tiposAlimentacaoPeriodosEmei = (nomePeriodo) => {
    let tiposAlimentacao = [];

    if (
      ehEmeiDaCemei(
        escolaInstituicao,
        periodosEscolaCemeiComAlunosEmei,
        nomePeriodo
      )
    ) {
      const periodo = periodosEscolaSimples.find(
        (p) =>
          `Infantil ${p.periodo_escolar.nome}` === nomePeriodo &&
          p.tipo_unidade_escolar.iniciais === "EMEI"
      );
      tiposAlimentacao = periodo?.tipos_alimentacao.filter(
        (alimentacao) => alimentacao.nome !== "Lanche Emergencial"
      );
    }

    return tiposAlimentacao;
  };

  const uuidPeriodoEscolar = (nomePeriodo) => {
    let uuidPeriodo = null;
    if (
      ehEmeiDaCemei(
        escolaInstituicao,
        periodosEscolaCemeiComAlunosEmei,
        nomePeriodo
      )
    ) {
      const periodo = periodosEscolaSimples.find(
        (p) =>
          `Infantil ${p.periodo_escolar.nome}` === nomePeriodo &&
          p.tipo_unidade_escolar.iniciais === "EMEI"
      );
      uuidPeriodo = periodo?.periodo_escolar?.uuid;
    }

    return uuidPeriodo;
  };

  const tiposAlimentacaoProgramasEProjetos = () => {
    let tiposAlimentacao = [];
    Object.keys(periodosInclusaoContinua).forEach((periodo) => {
      const periodoProgramasEProjetos = periodosEscolaSimples.find(
        (p) =>
          p.periodo_escolar.nome === periodo &&
          p.tipo_unidade_escolar.iniciais === "EMEI"
      );
      if (periodoProgramasEProjetos) {
        const tipos = periodoProgramasEProjetos.tipos_alimentacao;
        tiposAlimentacao = [...tiposAlimentacao, ...tipos];
      }
    });

    return removeObjetosDuplicados(tiposAlimentacao, "nome").filter(
      (alimentacao) => alimentacao.nome !== "Lanche Emergencial"
    );
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
      {solicitacaoMedicaoInicial &&
        !erroAPI &&
        quantidadeAlimentacoesLancadas && (
          <>
            {ehIMR && (
              <BlocoOcorrencias
                comOcorrencias={comOcorrencias}
                setComOcorrencias={setComOcorrencias}
                errosAoSalvar={errosAoSalvar}
                setErrosAoSalvar={setErrosAoSalvar}
                mes={mes}
                ano={ano}
              />
            )}
            <div className="row pb-2">
              <div className="col">
                <b className="section-title">Períodos</b>
              </div>
            </div>
            {periodosComAlunos.map((nomePeriodo, index) => (
              <CardLancamentoCEI
                key={index}
                textoCabecalho={nomePeriodo}
                cor={CORES[index % CORES.length]}
                solicitacaoMedicaoInicial={solicitacaoMedicaoInicial}
                escolaInstituicao={escolaInstituicao}
                quantidadeAlimentacoesLancadas={quantidadeAlimentacoesLancadas}
                periodoSelecionado={periodoSelecionado}
                periodosEscolaCemeiComAlunosEmei={
                  periodosEscolaCemeiComAlunosEmei
                }
                tiposAlimentacao={tiposAlimentacaoPeriodosEmei(nomePeriodo)}
                uuidPeriodoEscolar={uuidPeriodoEscolar(nomePeriodo)}
                errosAoSalvar={errosAoSalvar}
                periodosPermissoesLancamentosEspeciais={
                  periodosPermissoesLancamentosEspeciais
                }
              />
            ))}
            {periodosInclusaoContinua && (
              <CardLancamentoCEI
                key={periodosComAlunos.length + 1}
                textoCabecalho={"Programas e Projetos"}
                cor={CORES[periodosComAlunos.length + 1]}
                solicitacaoMedicaoInicial={solicitacaoMedicaoInicial}
                escolaInstituicao={escolaInstituicao}
                quantidadeAlimentacoesLancadas={quantidadeAlimentacoesLancadas}
                periodoSelecionado={periodoSelecionado}
                periodosEscolaCemeiComAlunosEmei={
                  periodosEscolaCemeiComAlunosEmei
                }
                tiposAlimentacao={tiposAlimentacaoProgramasEProjetos()}
                errosAoSalvar={errosAoSalvar}
                periodosInclusaoContinua={periodosInclusaoContinua}
              />
            )}
            {((solicitacoesKitLanchesAutorizadas &&
              solicitacoesKitLanchesAutorizadas.length > 0) ||
              (solicitacoesAlteracaoLancheEmergencialAutorizadas &&
                solicitacoesAlteracaoLancheEmergencialAutorizadas.length >
                  0)) && (
              <CardLancamentoCEI
                key={
                  periodosComAlunos.length +
                  1 +
                  (periodosInclusaoContinua ? 1 : 0)
                }
                textoCabecalho={"Solicitações de Alimentação"}
                cor={
                  CORES[
                    periodosComAlunos.length +
                      1 +
                      (periodosInclusaoContinua ? 1 : 0)
                  ]
                }
                solicitacaoMedicaoInicial={solicitacaoMedicaoInicial}
                escolaInstituicao={escolaInstituicao}
                quantidadeAlimentacoesLancadas={quantidadeAlimentacoesLancadas}
                periodoSelecionado={periodoSelecionado}
                periodosEscolaCemeiComAlunosEmei={
                  periodosEscolaCemeiComAlunosEmei
                }
                tiposAlimentacao={[
                  { nome: "Kit Lanche" },
                  { nome: "Lanche Emergencial" },
                ]}
                errosAoSalvar={errosAoSalvar}
              />
            )}
            <div className="mt-4">
              {renderBotaoFinalizar() ? (
                <Botao
                  texto="Finalizar"
                  style={BUTTON_STYLE.GREEN}
                  className="float-end"
                  disabled={
                    !usuarioEhEscolaTerceirizadaDiretor() || naoPodeFinalizar
                  }
                  onClick={() => onClickFinalizarMedicao()}
                />
              ) : (
                <div className="row">
                  <div className="col-12 text-end">
                    <Botao
                      texto="Exportar PDF"
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      onClick={() => gerarPDFMedicaoInicial()}
                    />
                    {renderBotaoEnviarCorrecao(solicitacaoMedicaoInicial) && (
                      <Botao
                        texto="Enviar Correção"
                        type={BUTTON_TYPE.BUTTON}
                        style={BUTTON_STYLE.GREEN}
                        className="ms-3"
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
              setErrosAoSalvar={(value) => setErrosAoSalvar(value)}
              closeModal={() => setShowModalFinalizarMedicao(false)}
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
