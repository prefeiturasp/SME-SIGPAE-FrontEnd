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
  ehEscolaTipoCEMEI,
  getError,
  recreioNasFeriasComColaboradores,
  recreioNasFeriasDaMedicao,
  recreioNasFeriasDaMedicaoCEIdaCEMEI,
  recreioNasFeriasDaMedicaoEMEIdaCEMEI,
  usuarioEhEscolaTerceirizadaDiretor,
} from "src/helpers/utilities";
import {
  getPeriodosInclusaoContinua,
  getSolicitacoesAlteracoesAlimentacaoAutorizadasEscola,
  getSolicitacoesKitLanchesAutorizadasEscola,
  getMatriculadosPeriodo,
} from "src/services/medicaoInicial/periodoLancamentoMedicao.service";
import {
  escolaEnviaCorrecaoMedicaoInicialCODAE,
  escolaEnviaCorrecaoMedicaoInicialDRE,
  getQuantidadeAlimentacoesLancadasPeriodoGrupo,
  getSolicitacaoMedicaoInicial,
} from "src/services/medicaoInicial/solicitacaoMedicaoInicial.service";
import { relatorioMedicaoInicialPDF } from "src/services/relatorios";
import { BlocoOcorrencias } from "../BlocoOcorrencias";
import {
  CORES,
  removeObjetosDuplicados,
  renderBotaoEnviarCorrecao,
  verificaSeEnviarCorrecaoDisabled,
} from "../LancamentoPorPeriodo/helpers";
import { ModalFinalizarMedicao } from "../ModalFinalizarMedicao";
import { ModalFinalizarMedicaoSemLancamentos } from "../ModalFinalizarSemLancamentos";
import { ModalSemOcorrenciasIMR } from "../ModalSemOcorrenciasIMR";
import { CardLancamentoCEI } from "./CardLancamentoCEI";
import { ehEmeiDaCemei } from "./helpers";

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
  setJustificativaSemLancamentos,
}) => {
  const [periodosComAlunos, setPeriodosComAlunos] = useState([]);
  const [exibirModalCentralDownloads, setExibirModalCentralDownloads] =
    useState(false);
  const [showModalFinalizarMedicao, setShowModalFinalizarMedicao] =
    useState(false);
  const [
    showModalFinalizarMedicaoSemLancamentos,
    setShowModalFinalizarMedicaoSemLancamentos,
  ] = useState(false);
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
      solicitacaoMedicaoInicial.uuid,
    );
    if (response.status === HTTP_STATUS.OK) {
      setExibirModalCentralDownloads(true);
    } else {
      toastError("Erro ao exportar pdf. Tente novamente mais tarde.");
    }
  };

  useEffect(() => {
    const fetchPeriodoMensal = async () => {
      const params_matriculados = {
        escola_uuid: escolaInstituicao.uuid,
        mes: mes,
        ano: ano,
        tipo_turma: "REGULAR",
      };

      const response_matriculados =
        await getMatriculadosPeriodo(params_matriculados);
      const periodoComAlunos = response_matriculados.data.reduce(
        (acc, item) => {
          const jaAdicionado = acc.find(
            (p) =>
              p.nome === item.periodo_escolar.nome &&
              p.cei_ou_emei === item.cei_ou_emei,
          );

          if (item.quantidade_alunos > 0 && !jaAdicionado) {
            acc.push({
              nome: item.periodo_escolar.nome,
              posicao: item.periodo_escolar.posicao,
              cei_ou_emei: item.cei_ou_emei,
              quantidade_alunos: item.quantidade_alunos,
            });
          }
          return acc;
        },
        [],
      );

      let periodos = [
        ...new Set(
          periodosEscolaSimples.map((periodo) => periodo.periodo_escolar.nome),
        ),
      ];
      if (
        solicitacaoMedicaoInicial?.ue_possui_alunos_periodo_parcial ||
        solicitacaoMedicaoInicial?.escola_cei_com_inclusao_parcial_autorizada
      ) {
        if (!periodos.includes("PARCIAL")) {
          const indexPeriodoParcial = periodos.includes("INTEGRAL")
            ? periodos.indexOf("INTEGRAL") + 1
            : 0;
          periodos.splice(indexPeriodoParcial, 0, "PARCIAL");
        }
      }

      if (ehEscolaTipoCEMEI(escolaInstituicao)) {
        periodos = periodos
          .filter((periodo) => !["MANHA", "TARDE"].includes(periodo))
          .concat(periodosEscolaCemeiComAlunosEmei);

        periodos = periodos.filter((periodo) => {
          if (periodo.includes("INTEGRAL")) {
            const integralComAlunos = periodoComAlunos.filter(
              (p) => p.nome === "INTEGRAL" && p.quantidade_alunos > 0,
            );

            if (periodo === "Infantil INTEGRAL") {
              return integralComAlunos.some((p) => p.cei_ou_emei === "EMEI");
            }

            if (periodo === "INTEGRAL") {
              return integralComAlunos.some((p) => p.cei_ou_emei === "CEI");
            }

            return false;
          }

          return true;
        });
      }

      setPeriodosComAlunos(periodos, periodosEscolaCemeiComAlunosEmei);
    };

    fetchPeriodoMensal();
  }, [
    escolaInstituicao,
    solicitacaoMedicaoInicial,
    quantidadeAlimentacoesLancadas,
    mes,
    ano,
  ]);

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
      escola_uuid: escolaInstituicao.uuid,
      mes: mes,
      ano: ano,
    };

    const solicitacao = await getSolicitacaoMedicaoInicial(payload);
    setSolicitacaoMedicaoInicial(solicitacao.data[0]);
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
    if (ehEscolaTipoCEMEI(escolaInstituicao)) {
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
          "Erro ao carregar Kit Lanches CEMEI Autorizadas. Tente novamente mais tarde.",
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
            response.data.results,
          );
        } else {
          setErroAPI(
            "Erro ao carregar Alteração de Lanche Emergencial CEMEI Autorizadas. Tente novamente mais tarde.",
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
        nomePeriodo,
      )
    ) {
      const periodo = periodosEscolaSimples.find(
        (p) =>
          `Infantil ${p.periodo_escolar.nome}` === nomePeriodo &&
          p.tipo_unidade_escolar.iniciais === "EMEI",
      );
      tiposAlimentacao = periodo?.tipos_alimentacao.filter(
        (alimentacao) => alimentacao.nome !== "Lanche Emergencial",
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
        nomePeriodo,
      )
    ) {
      const periodo = periodosEscolaSimples.find(
        (p) =>
          `Infantil ${p.periodo_escolar.nome}` === nomePeriodo &&
          p.tipo_unidade_escolar.iniciais === "EMEI",
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
          p.tipo_unidade_escolar.iniciais === "EMEI",
      );
      if (periodoProgramasEProjetos) {
        const tipos = periodoProgramasEProjetos.tipos_alimentacao;
        tiposAlimentacao = [...tiposAlimentacao, ...tipos];
      }
    });

    return removeObjetosDuplicados(tiposAlimentacao, "nome").filter(
      (alimentacao) => alimentacao.nome !== "Lanche Emergencial",
    );
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
            {!recreioNasFeriasDaMedicao(solicitacaoMedicaoInicial) && (
              <>
                {periodosComAlunos.map((nomePeriodo, index) => (
                  <CardLancamentoCEI
                    key={index}
                    textoCabecalho={nomePeriodo}
                    cor={CORES[index % CORES.length]}
                    solicitacaoMedicaoInicial={solicitacaoMedicaoInicial}
                    escolaInstituicao={escolaInstituicao}
                    quantidadeAlimentacoesLancadas={
                      quantidadeAlimentacoesLancadas
                    }
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
                    cor={CORES[9]}
                    solicitacaoMedicaoInicial={solicitacaoMedicaoInicial}
                    escolaInstituicao={escolaInstituicao}
                    quantidadeAlimentacoesLancadas={
                      quantidadeAlimentacoesLancadas
                    }
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
                    quantidadeAlimentacoesLancadas={
                      quantidadeAlimentacoesLancadas
                    }
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
              </>
            )}
            {recreioNasFeriasDaMedicao(solicitacaoMedicaoInicial) && (
              <>
                {(!ehEscolaTipoCEMEI(escolaInstituicao) ||
                  recreioNasFeriasDaMedicaoCEIdaCEMEI(
                    solicitacaoMedicaoInicial,
                  )) && (
                  <CardLancamentoCEI
                    textoCabecalho={`Recreio nas Férias${ehEscolaTipoCEMEI(escolaInstituicao) ? " - de 0 a 3 anos e 11 meses" : ""}`}
                    cor={CORES[10]}
                    grupo="Recreio nas Férias - de 0 a 3 anos e 11 meses"
                    tipos_alimentacao={recreioNasFeriasDaMedicao(
                      solicitacaoMedicaoInicial,
                    ).unidades_participantes[0].tipos_alimentacao.inscritos.map(
                      (tpi) => tpi.nome,
                    )}
                    periodoSelecionado={periodoSelecionado}
                    solicitacaoMedicaoInicial={solicitacaoMedicaoInicial}
                    ehGrupoSolicitacoesDeAlimentacao={true}
                    quantidadeAlimentacoesLancadas={
                      quantidadeAlimentacoesLancadas
                    }
                    errosAoSalvar={errosAoSalvar}
                  />
                )}
                {recreioNasFeriasDaMedicaoEMEIdaCEMEI(
                  solicitacaoMedicaoInicial,
                ) && (
                  <CardLancamentoCEI
                    textoCabecalho="Recreio nas Férias - 4 a 14 anos"
                    cor={CORES[12]}
                    tiposAlimentacao={recreioNasFeriasDaMedicao(
                      solicitacaoMedicaoInicial,
                    )
                      .unidades_participantes.find(
                        (up) => up.cei_ou_emei === "EMEI",
                      )
                      ?.tipos_alimentacao.inscritos.map((tpi) => ({
                        nome: tpi.nome,
                      }))}
                    periodoSelecionado={periodoSelecionado}
                    solicitacaoMedicaoInicial={solicitacaoMedicaoInicial}
                    ehGrupoSolicitacoesDeAlimentacao={true}
                    quantidadeAlimentacoesLancadas={
                      quantidadeAlimentacoesLancadas
                    }
                    errosAoSalvar={errosAoSalvar}
                  />
                )}
                {recreioNasFeriasComColaboradores(
                  solicitacaoMedicaoInicial,
                ) && (
                  <CardLancamentoCEI
                    textoCabecalho="Colaboradores"
                    cor={CORES[11]}
                    tiposAlimentacao={recreioNasFeriasDaMedicao(
                      solicitacaoMedicaoInicial,
                    ).unidades_participantes[0].tipos_alimentacao.colaboradores.map(
                      (tpi) => ({ nome: tpi.nome }),
                    )}
                    periodoSelecionado={periodoSelecionado}
                    solicitacaoMedicaoInicial={solicitacaoMedicaoInicial}
                    ehGrupoSolicitacoesDeAlimentacao={true}
                    quantidadeAlimentacoesLancadas={
                      quantidadeAlimentacoesLancadas
                    }
                    errosAoSalvar={errosAoSalvar}
                  />
                )}
              </>
            )}
            <div className="mt-4">
              {renderBotaoFinalizar() ? (
                <div className="row">
                  <div className="col-12 text-end">
                    <Botao
                      texto="Finalizar sem lançamentos"
                      style={BUTTON_STYLE.GREEN_OUTLINE}
                      disabled={
                        !usuarioEhEscolaTerceirizadaDiretor() ||
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
                        !usuarioEhEscolaTerceirizadaDiretor() ||
                        naoPodeFinalizar
                      }
                      onClick={() => onClickFinalizarMedicao()}
                    />
                  </div>
                </div>
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
                          solicitacaoMedicaoInicial,
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
            <ModalFinalizarMedicaoSemLancamentos
              mes={mes}
              ano={ano}
              showModal={showModalFinalizarMedicaoSemLancamentos}
              closeModal={() =>
                setShowModalFinalizarMedicaoSemLancamentos(false)
              }
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
