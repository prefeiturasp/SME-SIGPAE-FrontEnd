import React from "react";
import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { mockListaProdutosLogistica } from "src/mocks/produto.service/mockGetListaCompletaProdutosLogistica";
import mock from "src/services/_mock";
import FichaTecnicaPage from "src/pages/PreRecebimento/FichaTecnica/FichaTecnicaPage";
import { mockListaFichaTecnica } from "src/mocks/services/fichaTecnica.service/mockListarFichasTecnicas";

beforeEach(() => {
  mock
    .onGet(`/cadastro-produtos-edital/lista-completa-logistica/`)
    .reply(200, mockListaProdutosLogistica);

  mock.onGet(`/ficha-tecnica/`).reply(200, mockListaFichaTecnica);
});

const setup = async () => {
  await act(async () => {
    render(
      <MemoryRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <FichaTecnicaPage />
      </MemoryRouter>,
    );
  });
};

describe("Testa página de Consulta de Ficha técnica", () => {
  it("carrega a página com requisições", async () => {
    await setup();
    await waitFor(() =>
      expect(screen.getByText(`Filtrar por N° da Ficha`)).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(
        screen.getByText(`Fichas Técnicas Cadastradas`),
      ).toBeInTheDocument(),
    );
  });

  it("preenche campos e Limpa Filtros", async () => {
    await setup();
    await waitFor(() =>
      expect(screen.getByText(`Filtrar por N° da Ficha`)).toBeInTheDocument(),
    );

    let inputNumeroFicha = screen.getByTestId("numero_ficha");
    fireEvent.change(inputNumeroFicha, {
      target: { value: "111" },
    });

    expect(inputNumeroFicha).toHaveValue("111");

    const btnLimpar = screen.getByText("Limpar Filtros").closest("button");
    expect(btnLimpar).not.toBeDisabled();
    fireEvent.click(btnLimpar);

    expect(inputNumeroFicha).not.toHaveValue("111");
  });

  it("carrega a próxima página de requisições", async () => {
    await setup();
    await waitFor(() =>
      expect(screen.getByText(`Filtrar por N° da Ficha`)).toBeInTheDocument(),
    );

    const nextButton = screen.getByLabelText("right");
    fireEvent.click(nextButton);

    await waitFor(() =>
      expect(
        screen.getByText(`Fichas Técnicas Cadastradas`),
      ).toBeInTheDocument(),
    );
  });

  it("preenche campos e Aplica Filtros", async () => {
    await setup();
    await waitFor(() =>
      expect(screen.getByText(`Filtrar por N° da Ficha`)).toBeInTheDocument(),
    );

    let inputNumeroFicha = screen.getByTestId("numero_ficha");
    fireEvent.change(inputNumeroFicha, {
      target: { value: mockListaFichaTecnica.results[0].numero },
    });

    let mockFiltrado = { ...mockListaFichaTecnica };
    mockFiltrado.results = [mockListaFichaTecnica.results[0]];

    mock.onGet(`/ficha-tecnica/`).reply(200, mockFiltrado);

    const btnConsultar = screen.getByText("Filtrar").closest("button");
    expect(btnConsultar).not.toBeDisabled();
    fireEvent.click(btnConsultar);

    await waitFor(() =>
      expect(
        screen.getByText(mockListaFichaTecnica.results[0].numero),
      ).toBeInTheDocument(),
    );

    const fichaFiltrada = screen.queryByText(
      mockListaFichaTecnica.results[1].numero,
    );
    expect(fichaFiltrada).toBeNull();
  });

  it("renderiza tag Leve Leite para fichas do programa LEVE_LEITE", async () => {
    await setup();
    await waitFor(() =>
      expect(
        screen.getByText(`Fichas Técnicas Cadastradas`),
      ).toBeInTheDocument(),
    );

    const tagsLeveLeite = screen.getAllByText("LEVE LEITE - PLL");
    expect(tagsLeveLeite.length).toBeGreaterThan(0);
  });
});
