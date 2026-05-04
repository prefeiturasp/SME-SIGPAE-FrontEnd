import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockDiasCalendarioEMEFMaio2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Maio2025/diasCalendario";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockVinculosTipoAlimentacaoPeriodoEscolarEMEF } from "src/mocks/services/cadastroTipoAlimentacao.service/EMEF/vinculosTipoAlimentacaoPeriodoEscolar";
import { mockEscolaSimplesEMEF } from "src/mocks/services/escola.service/EMEF/escolaSimples";
import { mockRecreioNasFeriasEMEFDezembro2025 } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/EMEF/Dezembro2025/recreioNasFerias";
import { mockSolicitacaoMedicaoRecreioNasFeriasDezembro2025EMEF } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/EMEF/Dezembro2025/solicitacaoRecreioNasFerias";
import { quantidadesAlimentacaoesLancadasPeriodoGrupoEMEFMaio2025 } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/EMEF/Maio2025/quantidadesAlimentacaoesLancadasPeriodoGrupo";
import { mockGetTiposDeContagemAlimentacao } from "src/mocks/services/solicitacaoMedicaoInicial.service/getTiposDeContagemAlimentacao";
import { LancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/LancamentoMedicaoInicialPage";
import mock from "src/services/_mock";

describe("Teste <LancamentoMedicaoInicial> - Usuário EMEF - Renderiza Medição com Recreio nas Ferias", () => {
  const escolaUuid =
    mockMeusDadosEscolaEMEFPericles.vinculo_atual.instituicao.uuid;
  const solicitacaoMedicaoInicialUuid =
    mockSolicitacaoMedicaoRecreioNasFeriasDezembro2025EMEF[0].uuid;

  beforeEach(async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock.onGet("/notificacoes/").reply(200, { results: [] });
    mock
      .onGet("/notificacoes/quantidade-nao-lidos/")
      .reply(200, { quantidade_nao_lidos: 0 });
    mock
      .onGet(`/escolas-simples/${escolaUuid}/`)
      .reply(200, mockEscolaSimplesEMEF);
    mock
      .onGet("/medicao-inicial/recreio-nas-ferias/")
      .reply(200, mockRecreioNasFeriasEMEFDezembro2025);
    mock
      .onGet("/solicitacao-medicao-inicial/solicitacoes-lancadas/")
      .reply(200, []);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockVinculosTipoAlimentacaoPeriodoEscolarEMEF);
    mock
      .onGet(
        "/medicao-inicial/permissao-lancamentos-especiais/periodos-permissoes-lancamentos-especiais-mes-ano/",
      )
      .reply(200, { results: [] });
    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/")
      .replyOnce(200, mockSolicitacaoMedicaoRecreioNasFeriasDezembro2025EMEF);
    mock.onGet("/dias-calendario/").reply(200, mockDiasCalendarioEMEFMaio2025);
    mock
      .onGet("/medicao-inicial/tipo-contagem-alimentacao/")
      .reply(200, mockGetTiposDeContagemAlimentacao);
    mock.onGet("/periodos-escolares/inclusao-continua-por-mes/").reply(200, {
      periodos: { MANHA: "5067e137-e5f3-4876-a63f-7f58cce93f33" },
    });
    mock
      .onGet("/escola-solicitacoes/kit-lanches-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/escola-solicitacoes/inclusoes-etec-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet(
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/vinculos-inclusoes-evento-especifico-autorizadas/",
      )
      .reply(200, []);
    mock
      .onGet(
        `/medicao-inicial/solicitacao-medicao-inicial/${solicitacaoMedicaoInicialUuid}/ceu-gestao-frequencias-dietas/`,
      )
      .reply(200, []);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/quantidades-alimentacoes-lancadas-periodo-grupo/",
      )
      .reply(200, quantidadesAlimentacaoesLancadasPeriodoGrupoEMEFMaio2025);

    const search = `?mes=12&ano=2025&recreio_nas_ferias=0e3cdb48-3a82-47e6-9263-300d478c6934`;
    window.history.pushState({}, "", search);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "nome_instituicao",
      `"EMEF PERICLES EUGENIO DA SILVA RAMOS"`,
    );
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosEscolaEMEFPericles,
              setMeusDados: jest.fn(),
            }}
          >
            <LancamentoMedicaoInicialPage />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("Renderiza título da página `Lançamento Medição Inicial`", () => {
    expect(screen.getAllByText("Lançamento Medição Inicial").length).toBe(2);
  });

  it("Renderiza label `Período de Lançamento`", () => {
    expect(screen.getByText("Período de Lançamento")).toBeInTheDocument();
  });

  it("Renderiza períodos Recreio nas Férias e Colaboradores", () => {
    expect(screen.getByText("Recreio nas Férias")).toBeInTheDocument();
    expect(screen.getByText("Colaboradores")).toBeInTheDocument();
  });
});

describe("Teste <LancamentoMedicaoInicial> - Usuário EMEF - Sem query string", () => {
  const escolaUuid =
    mockMeusDadosEscolaEMEFPericles.vinculo_atual.instituicao.uuid;

  beforeEach(() => {
    mock.reset();

    if (!global.localStorage) {
      Object.defineProperty(global, "localStorage", {
        value: localStorageMock,
      });
    }

    localStorage.clear();
    localStorage.setItem(
      "nome_instituicao",
      `"EMEF PERICLES EUGENIO DA SILVA RAMOS"`,
    );
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);
  });

  it("Mantém a URL sem mês e ano e não seleciona período automaticamente", async () => {
    const dataAtual = new Date();
    const mesAtual = String(dataAtual.getMonth() + 1).padStart(2, "0");
    const anoAtual = String(dataAtual.getFullYear());
    const recreioUuid = "recreio-default-uuid";
    const recreioTitulo = `Recreio ${mesAtual}/${anoAtual}`;
    const dataInicioRecreio = `02/${mesAtual}/${anoAtual}`;
    const dataFimRecreio = `20/${mesAtual}/${anoAtual}`;

    const mockRecreioDefault = {
      ...mockRecreioNasFeriasEMEFDezembro2025,
      results: [
        {
          ...mockRecreioNasFeriasEMEFDezembro2025.results[0],
          uuid: recreioUuid,
          titulo: recreioTitulo,
          data_inicio: dataInicioRecreio,
          data_fim: dataFimRecreio,
        },
      ],
    };

    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock.onGet("/notificacoes/").reply(200, { results: [] });
    mock
      .onGet("/notificacoes/quantidade-nao-lidos/")
      .reply(200, { quantidade_nao_lidos: 0 });
    mock
      .onGet(`/escolas-simples/${escolaUuid}/`)
      .reply(200, mockEscolaSimplesEMEF);
    mock
      .onGet("/medicao-inicial/recreio-nas-ferias/")
      .reply(200, mockRecreioDefault);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/solicitacoes-lancadas/",
      )
      .reply(200, [
        {
          uuid: "solicitacao-mes-atual-lancada",
          mes: mesAtual,
          ano: anoAtual,
          recreio_nas_ferias: null,
        },
      ]);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockVinculosTipoAlimentacaoPeriodoEscolarEMEF);
    mock.onGet(`/historico-escola/${escolaUuid}/`).reply(200, {
      nome: mockEscolaSimplesEMEF.nome,
      tipo_unidade: mockEscolaSimplesEMEF.tipo_unidade,
    });
    mock
      .onGet(
        "/medicao-inicial/permissao-lancamentos-especiais/periodos-permissoes-lancamentos-especiais-mes-ano/",
      )
      .reply(200, { results: [] });
    mock.onGet("/dias-calendario/").reply(200, mockDiasCalendarioEMEFMaio2025);
    mock
      .onGet("/medicao-inicial/tipo-contagem-alimentacao/")
      .reply(200, mockGetTiposDeContagemAlimentacao);
    mock.onGet("/periodos-escolares/inclusao-continua-por-mes/").reply(200, {
      periodos: { MANHA: "5067e137-e5f3-4876-a63f-7f58cce93f33" },
    });
    mock
      .onGet("/escola-solicitacoes/kit-lanches-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/escola-solicitacoes/inclusoes-etec-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet(
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/vinculos-inclusoes-evento-especifico-autorizadas/",
      )
      .reply(200, []);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/quantidades-alimentacoes-lancadas-periodo-grupo/",
      )
      .reply(200, quantidadesAlimentacaoesLancadasPeriodoGrupoEMEFMaio2025);

    window.history.pushState(
      {},
      "",
      "/lancamento-inicial/lancamento-medicao-inicial",
    );

    await act(async () => {
      render(
        <BrowserRouter>
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosEscolaEMEFPericles,
              setMeusDados: jest.fn(),
            }}
          >
            <LancamentoMedicaoInicialPage />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </BrowserRouter>,
      );
    });

    await waitFor(() => {
      expect(window.location.search).toBe("");
    });

    expect(screen.getByText("Selecione...")).toBeInTheDocument();
    expect(
      mock.history.get.filter(
        (request) =>
          request.url === "/medicao-inicial/solicitacao-medicao-inicial/",
      ),
    ).toHaveLength(0);
  });
});

describe("Teste <LancamentoMedicaoInicial> - Usuário EMEF - Envia correção no recreio nas férias", () => {
  const escolaUuid =
    mockMeusDadosEscolaEMEFPericles.vinculo_atual.instituicao.uuid;
  const recreioUuid =
    mockSolicitacaoMedicaoRecreioNasFeriasDezembro2025EMEF[0].recreio_nas_ferias
      .uuid;
  let ultimaQuerySolicitacao;
  let chamadasSolicitacao;
  const solicitacaoCorrigidaRecreio = [
    {
      ...mockSolicitacaoMedicaoRecreioNasFeriasDezembro2025EMEF[0],
      status: "MEDICAO_CORRIGIDA_PELA_UE",
    },
  ];
  const solicitacaoCorrecaoSolicitadaRecreio = [
    {
      ...mockSolicitacaoMedicaoRecreioNasFeriasDezembro2025EMEF[0],
      status: "MEDICAO_CORRECAO_SOLICITADA",
    },
  ];
  const solicitacaoCorrigidaComum = [
    {
      ...mockSolicitacaoMedicaoRecreioNasFeriasDezembro2025EMEF[0],
      status: "MEDICAO_CORRIGIDA_PELA_UE",
      recreio_nas_ferias: null,
    },
  ];
  const quantidadesRecreio = {
    results: [
      {
        nome_periodo_grupo: "Recreio nas Férias",
        status: "MEDICAO_CORRIGIDA_PELA_UE",
        justificativa: null,
        valores: [
          { nome_campo: "lanche", valor: 45 },
          { nome_campo: "refeicao", valor: 72 },
        ],
        valor_total: 117,
      },
      {
        nome_periodo_grupo: "Colaboradores",
        status: "MEDICAO_CORRIGIDA_PELA_UE",
        justificativa: null,
        valores: [
          { nome_campo: "lanche", valor: 26 },
          { nome_campo: "refeicao", valor: 52 },
        ],
        valor_total: 78,
      },
    ],
  };

  beforeEach(async () => {
    mock.reset();
    chamadasSolicitacao = 0;

    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock.onGet("/notificacoes/").reply(200, { results: [] });
    mock
      .onGet("/notificacoes/quantidade-nao-lidos/")
      .reply(200, { quantidade_nao_lidos: 0 });
    mock
      .onGet(`/escolas-simples/${escolaUuid}/`)
      .reply(200, mockEscolaSimplesEMEF);
    mock
      .onGet("/medicao-inicial/recreio-nas-ferias/")
      .reply(200, mockRecreioNasFeriasEMEFDezembro2025);
    mock
      .onGet("/solicitacao-medicao-inicial/solicitacoes-lancadas/")
      .reply(200, []);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockVinculosTipoAlimentacaoPeriodoEscolarEMEF);
    mock
      .onGet(
        "/medicao-inicial/permissao-lancamentos-especiais/periodos-permissoes-lancamentos-especiais-mes-ano/",
      )
      .reply(200, { results: [] });
    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/")
      .reply((config) => {
        chamadasSolicitacao += 1;

        if (chamadasSolicitacao === 1) {
          return [200, solicitacaoCorrecaoSolicitadaRecreio];
        }

        ultimaQuerySolicitacao = config.params;
        const { recreio_nas_ferias } = config.params || {};

        if (recreio_nas_ferias === recreioUuid) {
          return [200, solicitacaoCorrigidaRecreio];
        }

        return [200, solicitacaoCorrigidaComum];
      });
    mock.onGet("/dias-calendario/").reply(200, mockDiasCalendarioEMEFMaio2025);
    mock
      .onGet("/medicao-inicial/tipo-contagem-alimentacao/")
      .reply(200, mockGetTiposDeContagemAlimentacao);
    mock.onGet("/periodos-escolares/inclusao-continua-por-mes/").reply(200, {
      periodos: { MANHA: "5067e137-e5f3-4876-a63f-7f58cce93f33" },
    });
    mock
      .onGet("/escola-solicitacoes/kit-lanches-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/escola-solicitacoes/inclusoes-etec-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet(
        "/vinculos-tipo-alimentacao-u-e-periodo-escolar/vinculos-inclusoes-evento-especifico-autorizadas/",
      )
      .reply(200, []);
    mock
      .onGet(
        `/medicao-inicial/solicitacao-medicao-inicial/${solicitacaoCorrigidaRecreio[0].uuid}/ceu-gestao-frequencias-dietas/`,
      )
      .reply(200, []);
    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/quantidades-alimentacoes-lancadas-periodo-grupo/",
      )
      .reply(200, quantidadesRecreio);
    mock
      .onPatch(
        `/medicao-inicial/solicitacao-medicao-inicial/${solicitacaoCorrigidaRecreio[0].uuid}/escola-corrige-medicao-para-dre/`,
      )
      .reply(200, {});

    const search = `?mes=12&ano=2025&recreio_nas_ferias=${recreioUuid}`;
    window.history.pushState({}, "", search);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "nome_instituicao",
      `"EMEF PERICLES EUGENIO DA SILVA RAMOS"`,
    );
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.ESCOLA);
    localStorage.setItem("perfil", PERFIL.DIRETOR_UE);
    localStorage.setItem("modulo_gestao", MODULO_GESTAO.TERCEIRIZADA);

    await act(async () => {
      render(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosEscolaEMEFPericles,
              setMeusDados: jest.fn(),
            }}
          >
            <LancamentoMedicaoInicialPage />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("mantém os períodos de recreio ao enviar correção", async () => {
    await waitFor(() => {
      expect(screen.getByText("Recreio nas Férias")).toBeInTheDocument();
      expect(screen.getByText("Colaboradores")).toBeInTheDocument();
      expect(screen.getByText("Enviar Correção")).toBeEnabled();
    });

    fireEvent.click(screen.getByText("Enviar Correção"));
    fireEvent.click(screen.getByText("Sim"));

    await waitFor(() => {
      expect(
        screen.getByText("Correção da Medição Inicial enviada com sucesso!"),
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(ultimaQuerySolicitacao?.recreio_nas_ferias).toBe(recreioUuid);
      expect(screen.getByText("Recreio nas Férias")).toBeInTheDocument();
      expect(screen.getByText("Colaboradores")).toBeInTheDocument();
      expect(screen.queryByText("Manhã")).not.toBeInTheDocument();
    });
  });
});
