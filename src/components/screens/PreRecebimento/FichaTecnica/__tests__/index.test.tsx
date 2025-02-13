import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { mockListaProdutosLogistica } from "mocks/produto.service/mockGetListaCompletaProdutosLogistica";
import mock from "services/_mock";
import FichaTecnicaPage from "pages/PreRecebimento/FichaTecnica/FichaTecnicaPage";
import { mockListaFichaTecnica } from "mocks/services/fichaTecnica.service/mockListarFichasTecnicas";
import { MeusDadosContext } from "context/MeusDadosContext";
import { mockMeusDadosFornecedor } from "mocks/services/perfil.service/mockMeusDados";

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
        <MeusDadosContext.Provider
          value={{
            meusDados: mockMeusDadosFornecedor,
            setMeusDados: jest.fn(),
          }}
        >
          <FichaTecnicaPage />
        </MeusDadosContext.Provider>
      </MemoryRouter>
    );
  });
};

describe("Testa página de Consulta de Ficha técnica", () => {
  it("carrega no modo Detalhar", async () => {
    await setup();
    await waitFor(() =>
      expect(screen.getByText(`Filtrar por N° da Ficha`)).toBeInTheDocument()
    );
  });
});
