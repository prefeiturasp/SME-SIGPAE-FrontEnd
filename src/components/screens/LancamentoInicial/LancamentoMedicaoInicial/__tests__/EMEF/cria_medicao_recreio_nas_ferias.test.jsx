import "@testing-library/jest-dom";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { LANCAMENTO_MEDICAO_INICIAL } from "src/configs/constants";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockDiasCalendarioEMEFMaio2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Maio2025/diasCalendario";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockVinculosTipoAlimentacaoPeriodoEscolarEMEF } from "src/mocks/services/cadastroTipoAlimentacao.service/EMEF/vinculosTipoAlimentacaoPeriodoEscolar";
import { mockEscolaSimplesEMEF } from "src/mocks/services/escola.service/EMEF/escolaSimples";
import { mockRecreioNasFeriasEMEFDezembro2025 } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/EMEF/Dezembro2025/recreioNasFerias";
import { mockSolicitacaoComRecreioNasFeriasCriadaDezembro2025EMEF } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/EMEF/Dezembro2025/solicitacaoRecreioNasFeriasCriada";
import { mockSolicitacaoMedicaoRecreioNasFeriasDezembro2025EMEF } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/EMEF/Dezembro2025/solicitacaoRecreioNasFerias";
import { quantidadesAlimentacaoesLancadasPeriodoGrupoEMEFMaio2025 } from "src/mocks/services/medicaoInicial/solicitacaoMedicaoinicial.service/EMEF/Maio2025/quantidadesAlimentacaoesLancadasPeriodoGrupo";
import { mockSolicitacaoMedicaoInicialEMEFMaio2025 } from "src/mocks/services/solicitacaoMedicaoInicial.service/EMEF/solicitacaoMedicaoInicialMaio2025";
import { mockGetTiposDeContagemAlimentacao } from "src/mocks/services/solicitacaoMedicaoInicial.service/getTiposDeContagemAlimentacao";
import { LancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/LancamentoMedicaoInicialPage";
import mock from "src/services/_mock";

describe("Teste <LancamentoMedicaoInicial> - Usuário EMEF - Cria Medição com Recreio nas Ferias", () => {
  const escolaUuid =
    mockMeusDadosEscolaEMEFPericles.vinculo_atual.instituicao.uuid;

  const renderPage = async ({
    recreioNasFerias = mockRecreioNasFeriasEMEFDezembro2025,
    solicitacoesLancadas = [],
    solicitacaoMedicaoInicial = mockSolicitacaoMedicaoInicialEMEFMaio2025,
    search = "?mes=12&ano=2025",
  } = {}) => {
    cleanup();
    mock.reset();

    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock.onGet("/notificacoes/").reply(200, {
      next: null,
      previous: null,
      count: 0,
      page_size: 4,
      results: [],
    });
    mock
      .onGet("/notificacoes/quantidade-nao-lidos/")
      .reply(200, { quantidade_nao_lidos: 0 });
    mock
      .onGet(`/escolas-simples/${escolaUuid}/`)
      .reply(200, mockEscolaSimplesEMEF);
    mock
      .onGet("/medicao-inicial/recreio-nas-ferias/")
      .reply(200, recreioNasFerias);
    mock
      .onGet("/solicitacao-medicao-inicial/solicitacoes-lancadas/")
      .reply(200, solicitacoesLancadas);
    mock
      .onGet(
        "medicao-inicial/solicitacao-medicao-inicial/solicitacoes-lancadas/",
      )
      .reply(200, solicitacoesLancadas);
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
      .replyOnce(200, solicitacaoMedicaoInicial);
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

    if (solicitacaoMedicaoInicial[0]?.uuid) {
      mock
        .onGet(
          `/medicao-inicial/solicitacao-medicao-inicial/${solicitacaoMedicaoInicial[0].uuid}/ceu-gestao-frequencias-dietas/`,
        )
        .reply(200, []);
    }

    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/quantidades-alimentacoes-lancadas-periodo-grupo/",
      )
      .reply(200, quantidadesAlimentacaoesLancadasPeriodoGrupoEMEFMaio2025);

    const route = `/${LANCAMENTO_MEDICAO_INICIAL}${search}`;
    window.history.pushState({}, "", route);

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
          initialEntries={[route]}
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
  };

  beforeEach(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-12-15T10:00:00Z"));

    await renderPage();
  });

  afterEach(() => {
    cleanup();
    jest.useRealTimers();
  });

  it("Renderiza título da página `Lançamento Medição Inicial`", () => {
    expect(screen.getAllByText("Lançamento Medição Inicial").length).toBe(2);
  });

  it("Renderiza label `Período de Lançamento`", () => {
    expect(screen.getByText("Período de Lançamento")).toBeInTheDocument();
  });

  it("Renderiza períodos escolares de EMEF", () => {
    expect(screen.getByText("Manhã")).toBeInTheDocument();
    expect(screen.getByText("Tarde")).toBeInTheDocument();
    expect(screen.getByText("Programas e Projetos")).toBeInTheDocument();
  });

  it("Seleciona renderiza opção, seleciona `Recreio nas Férias - Dez 25` e cria a medição", async () => {
    await act(async () => {
      const select = screen.getByTestId("select-periodo-lancamento");
      fireEvent.click(select);

      mock
        .onGet("/medicao-inicial/solicitacao-medicao-inicial/")
        .replyOnce(200, []);

      fireEvent.mouseDown(
        screen
          .getByTestId("select-periodo-lancamento")
          .querySelector(".ant-select-selection-search-input"),
      );
    });

    await waitFor(() => screen.getByText("Recreio nas Férias - Dez 25"));
    await act(async () => {
      fireEvent.click(screen.getByText("Recreio nas Férias - Dez 25"));
    });

    const botaoSalvar = screen.getByText("Salvar").closest("button");
    expect(botaoSalvar).toBeDisabled();

    const botaoEditar = screen.getByText("Editar").closest("button");
    fireEvent.click(botaoEditar);

    await waitFor(() => {
      expect(botaoSalvar).toBeEnabled();
    });

    const multiselectContagemRefeicoes = screen.getByTestId(
      "multiselect-contagem-refeicoes",
    );
    const selectControl = within(multiselectContagemRefeicoes).getByRole(
      "combobox",
    );
    fireEvent.mouseDown(selectControl);

    const optionFichasColoridas = screen.getByText("Fichas Coloridas");
    fireEvent.click(optionFichasColoridas);

    const inputResponsavelNome = screen.getByTestId("input-responsavel-nome-0");
    fireEvent.change(inputResponsavelNome, {
      target: { value: "Fulano da Silva" },
    });

    const inputResponsavelRf = screen.getByTestId("input-responsavel-rf-0");
    fireEvent.change(inputResponsavelRf, {
      target: { value: "1234567" },
    });

    mock
      .onPost("/medicao-inicial/solicitacao-medicao-inicial/")
      .reply(201, mockSolicitacaoComRecreioNasFeriasCriadaDezembro2025EMEF);
    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/")
      .replyOnce(200, mockSolicitacaoMedicaoRecreioNasFeriasDezembro2025EMEF);

    fireEvent.click(botaoSalvar);

    await waitFor(() => {
      expect(
        screen.getByText("Medição Inicial criada com sucesso!"),
      ).toBeInTheDocument();
    });
  });

  it("Mantém mês/ano e oculta recreio já lançado no dropdown", async () => {
    await renderPage({
      solicitacoesLancadas: [
        {
          uuid: mockSolicitacaoMedicaoRecreioNasFeriasDezembro2025EMEF[0].uuid,
          mes: mockSolicitacaoMedicaoRecreioNasFeriasDezembro2025EMEF[0].mes,
          ano: mockSolicitacaoMedicaoRecreioNasFeriasDezembro2025EMEF[0].ano,
          escola:
            mockSolicitacaoMedicaoRecreioNasFeriasDezembro2025EMEF[0].escola,
          escola_uuid:
            mockSolicitacaoMedicaoRecreioNasFeriasDezembro2025EMEF[0]
              .escola_uuid,
          escola_cei_com_inclusao_parcial_autorizada:
            mockSolicitacaoMedicaoRecreioNasFeriasDezembro2025EMEF[0]
              .escola_cei_com_inclusao_parcial_autorizada,
          recreio_nas_ferias:
            mockSolicitacaoMedicaoRecreioNasFeriasDezembro2025EMEF[0]
              .recreio_nas_ferias,
        },
      ],
      solicitacaoMedicaoInicial: [],
    });

    await waitFor(() => {
      expect(
        mock.history.get.some((request) =>
          request.url.includes("solicitacoes-lancadas"),
        ),
      ).toBe(true);
    });

    await act(async () => {
      const select = screen.getByTestId("select-periodo-lancamento");
      fireEvent.click(select);
      fireEvent.mouseDown(
        select.querySelector(".ant-select-selection-search-input"),
      );
    });

    await waitFor(() => {
      expect(screen.getAllByText("Dezembro / 2025").length).toBeGreaterThan(0);
    });

    expect(
      screen.queryByText("Recreio nas Férias - Dez 25"),
    ).not.toBeInTheDocument();
  });
});
