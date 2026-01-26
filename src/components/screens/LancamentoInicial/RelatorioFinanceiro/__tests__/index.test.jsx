import {
  act,
  render,
  screen,
  fireEvent,
  cleanup,
  within,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RelatorioFinanceiro } from "../index";
import { mockMeusDadosSuperUsuarioMedicao } from "src/mocks/meusDados/superUsuarioMedicao";
import { mockLotesSimples } from "src/mocks/lote.service/mockLotesSimples";
import { mockGetGrupoUnidadeEscolar } from "src/mocks/services/escola.service/mockGetGrupoUnidadeEscolar";
import { mockRelatoriosFinanceiro } from "src/mocks/services/relatorioFinanceiro.service/mockGetRelatoriosFinanceiro";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockGetMesesAnosMedicaoInicial } from "src/mocks/services/dashboard.service/mockGetMesesAnosMedicaoInicial";
import mock from "src/services/_mock";

describe("Testes da interface de Relatorio Financeiro", () => {
  beforeEach(async () => {
    mock
      .onGet("/grupos-unidade-escolar/")
      .reply(200, mockGetGrupoUnidadeEscolar);
    mock.onGet("/lotes-simples/").reply(200, mockLotesSimples);
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosSuperUsuarioMedicao);
    mock
      .onGet("/medicao-inicial/relatorio-financeiro/")
      .reply(200, mockRelatoriosFinanceiro);
    mock
      .onGet("/medicao-inicial/solicitacao-medicao-inicial/meses-anos/")
      .reply(200, mockGetMesesAnosMedicaoInicial);

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
              meusDados: mockMeusDadosSuperUsuarioMedicao,
              setMeusDados: jest.fn(),
            }}
          >
            <RelatorioFinanceiro />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
    mock.resetHandlers();
  });

  it("deve renderizar os filtros corretamente", () => {
    expect(screen.getByText("Filtrar Resultados")).toBeInTheDocument();
    expect(screen.getAllByText("Lote e DRE")).toHaveLength(2);
    expect(screen.getAllByText("Tipo de Unidade")).toHaveLength(2);
    expect(screen.getAllByText("Mês de Referência")).toHaveLength(2);
    expect(screen.getAllByText("Status")).toHaveLength(2);
    expect(screen.getByText("Filtrar").closest("button")).toBeInTheDocument();
    expect(
      screen.getByText("Limpar Filtros").closest("button"),
    ).toBeInTheDocument();
  });

  const setMultiSelect = async (label, value) => {
    const selectLabel = screen.getAllByText(label)[0];
    const dropdown =
      selectLabel.closest(".select") ||
      selectLabel.closest(".final-form-multi-select");

    fireEvent.mouseDown(dropdown);

    const listbox = await screen.findByRole("listbox");
    const option = within(listbox).getByText(value);

    fireEvent.click(option);
  };

  it("deve exibir resultados ao selecionar filtro e clicar em filtrar", () => {
    setMultiSelect(
      "Lote e DRE",
      "04 - DIRETORIA REGIONAL DE EDUCACAO CAPELA DO SOCORRO",
    );

    const filtrar = screen.getByText("Filtrar").closest("button");
    fireEvent.click(filtrar);

    expect(screen.getByText("Resultados da Pesquisa")).toBeInTheDocument();

    expect(
      screen.getAllByText(/DIRETORIA REGIONAL DE EDUCACAO CAPELA DO SOCORRO/i),
    ).toHaveLength(2);

    expect(screen.getByText("Grupo 6 (CIEJA, CMCT)")).toBeInTheDocument();
    expect(screen.getByText("Grupo 1 (CCI, CEI, CEI CEU)")).toBeInTheDocument();
  });

  it("deve limpar o campo selecionado ao clicar em limpar filtros", () => {
    setMultiSelect("Lote e DRE", "Grupo 3 (CEU EMEF, CEU GESTAO, EMEF, EMEFM)");

    const limpar = screen.getByText("Limpar Filtros").closest("button");
    fireEvent.click(limpar);

    expect(
      screen.queryByText("Grupo 3 (CEU EMEF, CEU GESTAO, EMEF, EMEFM)"),
    ).not.toBeInTheDocument();
  });

  it("deve abrir o ModalAnalisar ao clicar em opção Analisar", () => {
    fireEvent.click(screen.getByTitle("Analisar"));

    expect(
      screen.getByText("Analisar ou Visualizar Medição"),
    ).toBeInTheDocument();
  });
});
