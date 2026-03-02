import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockGetTipoAlimentacao } from "src/mocks/cadastroTipoAlimentacao.service/mockGetTipoAlimentacao";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockCategoriasMedicao } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/categoriasMedicao";
import { mockDiasCalendarioEMEFOutubro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Outubro2025/diasCalendario";
import { mockStateProgramasProjetosEMEFOutubro2025 } from "src/mocks/medicaoInicial/PeriodoLancamentoMedicaoInicial/EMEF/Outubro2025/stateProgramasProjetos";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockVinculosTipoAlimentacaoPeriodoEscolarEMEF } from "src/mocks/services/cadastroTipoAlimentacao.service/EMEF/vinculosTipoAlimentacaoPeriodoEscolar";
import { mockInclusoesAutorizadasEMEFOutubro2025 } from "src/mocks/services/medicaoInicial/periodoLancamentoMedicao.service/EMEF/Outubro2025/ProgramasProjetos/inclusoesAutorizadas";
import { mockLogQuantidadeDietasAutorizadasEMEFOutubro2025 } from "src/mocks/services/medicaoInicial/periodoLancamentoMedicao.service/EMEF/Outubro2025/ProgramasProjetos/logQuantidadeDietasAutorizadas";
import { mockValoresMedicaoProgramasProjetosoEMEFOutubro2025 } from "src/mocks/services/medicaoInicial/periodoLancamentoMedicao.service/EMEF/Outubro2025/ProgramasProjetos/valoresMedicao";
import { PeriodoLancamentoMedicaoInicialPage } from "src/pages/LancamentoMedicaoInicial/PeriodoLancamentoMedicaoInicialPage";
import mock from "src/services/_mock";

describe("Teste <PeriodoLancamentoMedicaoInicial> - Programas e Projetos - Usuário EMEF", () => {
  const escolaUuid =
    mockMeusDadosEscolaEMEFPericles.vinculo_atual.instituicao.uuid;

  beforeEach(async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock
      .onGet(
        `/vinculos-tipo-alimentacao-u-e-periodo-escolar/escola/${escolaUuid}/`,
      )
      .reply(200, mockVinculosTipoAlimentacaoPeriodoEscolarEMEF);
    mock
      .onGet("/medicao-inicial/dias-sobremesa-doce/lista-dias/")
      .reply(200, []);
    mock.onGet("/tipos-alimentacao/").reply(200, mockGetTipoAlimentacao);
    mock
      .onGet("/escola-solicitacoes/inclusoes-autorizadas/")
      .reply(200, mockInclusoesAutorizadasEMEFOutubro2025);
    mock
      .onGet("/medicao-inicial/categorias-medicao/")
      .reply(200, mockCategoriasMedicao);
    mock
      .onGet("/log-quantidade-dietas-autorizadas/")
      .reply(200, mockLogQuantidadeDietasAutorizadasEMEFOutubro2025);
    mock
      .onGet("/medicao-inicial/valores-medicao/")
      .reply(200, mockValoresMedicaoProgramasProjetosoEMEFOutubro2025);
    mock.onGet("/medicao-inicial/dias-para-corrigir/").reply(200, []);
    mock
      .onGet("/dias-calendario/")
      .reply(200, mockDiasCalendarioEMEFOutubro2025);
    mock.onGet("/matriculados-no-mes/").reply(200, []);
    mock
      .onGet("/escola-solicitacoes/suspensoes-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/escola-solicitacoes/alteracoes-alimentacao-autorizadas/")
      .reply(200, { results: [] });
    mock
      .onGet("/medicao-inicial/medicao/feriados-no-mes/")
      .reply(200, { results: ["12"] });

    mock
      .onGet(
        "/medicao-inicial/solicitacao-medicao-inicial/dias-frequencia-zerada/",
      )
      .reply(200, {
        alimentacoes: [],
        dietas: {
          "DIETA ESPECIAL - TIPO A": [],
          "DIETA ESPECIAL - TIPO A - ENTERAL / RESTRIÇÃO DE AMINOÁCIDOS": [],
          "DIETA ESPECIAL - TIPO B": [],
        },
      });

    const search = `?uuid=b386231a-2a77-488b-b6d5-b016987e55c2&ehGrupoSolicitacoesDeAlimentacao=false&ehGrupoETEC=false&ehPeriodoEspecifico=false`;
    Object.defineProperty(window, "location", {
      value: {
        search: search,
      },
    });

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
          initialEntries={[
            {
              pathname: "/",
              state: mockStateProgramasProjetosEMEFOutubro2025,
            },
          ]}
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
            <PeriodoLancamentoMedicaoInicialPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("renderiza label `Mês do Lançamento`", async () => {
    expect(screen.getByText("Mês do Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `Outubro / 2025` no input `Mês do Lançamento`", () => {
    const inputElement = screen.getByTestId("input-mes-lancamento");
    expect(inputElement).toHaveAttribute("value", "Outubro / 2025");
  });

  it("renderiza label `Período de Lançamento`", () => {
    expect(screen.getByText("Período de Lançamento")).toBeInTheDocument();
  });

  it("renderiza valor `Programas e Projetos` no input `Período de Lançamento`", () => {
    const inputElement = screen.getByTestId("input-periodo-lancamento");
    expect(inputElement).toHaveAttribute("value", "Programas e Projetos");
  });

  const setInput = (id, valor) => {
    const input = screen.getByTestId(id);
    expect(input).toBeInTheDocument();
    fireEvent.change(input, {
      target: { value: valor },
    });
    return input;
  };

  it("ao preencher lanche, valida quantidade de alunos por tipo de alimentação", async () => {
    setInput("frequencia__dia_01__categoria_1", "120");
    expect(screen.getByTestId("frequencia__dia_01__categoria_1")).toHaveValue(
      "120",
    );

    let inputLancheDia01 = setInput("lanche__dia_01__categoria_1", "100");
    expect(inputLancheDia01).not.toHaveClass("invalid-field");
    inputLancheDia01 = setInput("lanche__dia_01__categoria_1", "101");
    expect(inputLancheDia01).toHaveClass("invalid-field");

    let inputRefeicaoDia01 = setInput("refeicao__dia_01__categoria_1", "20");
    expect(inputRefeicaoDia01).not.toHaveClass("invalid-field");
    inputRefeicaoDia01 = setInput("refeicao__dia_01__categoria_1", "21");
    expect(inputRefeicaoDia01).toHaveClass("invalid-field");
  });
});
