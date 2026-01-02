import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosNutriSupervisao } from "src/mocks/meusDados/nutri-supervisao";
import RelatorioGerencialDietas from "src/pages/DietaEspecial/RelatorioGerencialDietas";
import mock from "src/services/_mock";

describe("Teste interface de Relatório Gerencial de Dietas", () => {
  beforeEach(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-12-19T10:00:00Z"));

    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosNutriSupervisao);
    mock
      .onGet("/nutrisupervisao-solicitacoes/totais-gerencial-dietas/")
      .reply(200, {
        total_solicitacoes: 36,
        total_autorizadas: 33,
        total_negadas: 0,
        total_canceladas: 8,
      });
    mock
      .onGet("/nutrisupervisao-solicitacoes/anos-com-dietas/")
      .reply(200, [2024, 2025]);
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_SUPERVISAO_NUTRICAO);

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
              meusDados: mockMeusDadosNutriSupervisao,
              setMeusDados: jest.fn(),
            }}
          >
            <RelatorioGerencialDietas />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("Renderiza título e breadcrumb `Relatório Gerencial de Dietas`", () => {
    expect(screen.queryAllByText("Relatório Gerencial de Dietas")).toHaveLength(
      2,
    );
  });

  it("Verifica renderização componente de filtros", () => {
    expect(screen.getByText("Filtrar Resultados")).toBeInTheDocument();
    expect(screen.getByText("Ano")).toBeInTheDocument();
  });

  it("Seleciona datas e verifica comportamento do campo", () => {
    const anoSelect = screen.getByText((content, element) => {
      return (
        element.classList.contains("select") &&
        element.textContent?.includes("Ano")
      );
    });
    expect(anoSelect).toBeInTheDocument();
    fireEvent.mouseDown(anoSelect);

    fireEvent.click(screen.getByText("2025"));
    fireEvent.click(screen.getByText("2024"));

    expect(screen.getByText("Todos os anos")).toBeInTheDocument();
  });

  it("Clica em filtrar e verifica exibição dos cards de totais", async () => {
    const botao = screen.getByText("Filtrar").closest("button");
    fireEvent.click(botao);

    await waitFor(() => {
      expect(screen.getByText("0036")).toBeInTheDocument();
      expect(screen.getByText("0033")).toBeInTheDocument();
      expect(screen.getByText("0000")).toBeInTheDocument();
      expect(screen.getByText("0008")).toBeInTheDocument();
    });
  });
});
