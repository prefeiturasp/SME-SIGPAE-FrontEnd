import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConsultaKitLanche from "../index";
import * as kitService from "../../../../../services/kitLanche/shared.service";

jest.mock("../../../../../services/kitLanche/shared.service");
jest.mock("src/helpers/utilities", () => ({
  gerarParametrosConsulta: jest.fn(() => ({ filtro: "mock" })),
}));

jest.mock("../components/Filtros", () => (props) => {
  return (
    <button
      onClick={() => props.setFiltros({ test: true })}
      data-testid="filtro-btn"
    >
      Simular Filtro
    </button>
  );
});

jest.mock("../components/ListagemKits", () => () => (
  <div data-testid="listagem">Listagem de Kits</div>
));

jest.mock("src/components/Shareable/Paginacao", () => (props) => {
  return (
    <button onClick={() => props.onChange(2)} data-testid="paginacao-btn">
      Próxima Página
    </button>
  );
});

describe("ConsultaKitLanche", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o componente inicial sem erro", () => {
    render(<ConsultaKitLanche />);
    expect(screen.getByText("Simular Filtro")).toBeInTheDocument();
  });

  it("deve executar busca e renderizar listagem quando filtros são aplicados", async () => {
    kitService.getKitsLanche.mockResolvedValueOnce({
      data: {
        count: 2,
        results: [{ id: 1 }, { id: 2 }],
      },
    });

    render(<ConsultaKitLanche />);
    userEvent.click(screen.getByTestId("filtro-btn"));

    await waitFor(() => {
      expect(kitService.getKitsLanche).toHaveBeenCalled();
      expect(screen.getByTestId("listagem")).toBeInTheDocument();
    });
  });

  it('deve exibir mensagem de "Não existe informação" se total === 0', async () => {
    kitService.getKitsLanche.mockResolvedValueOnce({
      data: {
        count: 0,
        results: [],
      },
    });

    render(<ConsultaKitLanche />);
    userEvent.click(screen.getByTestId("filtro-btn"));

    await waitFor(() => {
      expect(
        screen.getByText(
          "Não existe informação para os critérios de busca utilizados."
        )
      ).toBeInTheDocument();
    });
  });

  it('deve chamar nova página ao clicar em "Próxima Página"', async () => {
    kitService.getKitsLanche.mockResolvedValueOnce({
      data: {
        count: 2,
        results: [{ id: 1 }, { id: 2 }],
      },
    });

    render(<ConsultaKitLanche />);
    userEvent.click(screen.getByTestId("filtro-btn"));

    await waitFor(() => {
      expect(screen.getByTestId("paginacao-btn")).toBeInTheDocument();
    });

    kitService.getKitsLanche.mockResolvedValueOnce({
      data: {
        count: 2,
        results: [{ id: 3 }, { id: 4 }],
      },
    });

    userEvent.click(screen.getByTestId("paginacao-btn"));

    await waitFor(() => {
      expect(kitService.getKitsLanche).toHaveBeenCalledTimes(2);
    });
  });
});
