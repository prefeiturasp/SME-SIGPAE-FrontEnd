import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MODULO_GESTAO, PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockLotesSimplesEscolaEMEF } from "src/mocks/lote.service/Escola/EMEF/lotesSimples";
import { mockMeusDadosEscolaEMEFPericles } from "src/mocks/meusDados/escolaEMEFPericles";
import { mockTerceirizadasListaNomes } from "src/mocks/produto.service/Escola/EMEF/terceirizadasListaNomes";
import {
  mockListaFabricantes,
  mockListaMarcas,
  mockListaProdutos,
} from "src/mocks/Produto/BuscaAvancada/listas";
import { RelatorioReclamacaoProdutoPage } from "src/pages/Produto/RelatorioReclamacaoProdutoPage";
import mock from "src/services/_mock";

describe("Test Relatório Reclamação Produto - Usuário Escola - Erro Carregar Editais", () => {
  beforeEach(async () => {
    mock
      .onGet("/usuarios/meus-dados/")
      .reply(200, mockMeusDadosEscolaEMEFPericles);
    mock.onGet("/produtos-editais/lista-nomes-unicos/").reply(400, {});
    mock.onGet("/produtos/lista-nomes-unicos/").reply(200, mockListaProdutos);
    mock.onGet("/marcas/lista-nomes-unicos/").reply(200, mockListaMarcas);
    mock
      .onGet("/fabricantes/lista-nomes-unicos/")
      .reply(200, mockListaFabricantes);
    mock.onGet("/lotes-simples/").reply(200, mockLotesSimplesEscolaEMEF);
    mock
      .onGet("/terceirizadas/lista-nomes/")
      .reply(200, mockTerceirizadasListaNomes);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "nome_instituicao",
      `"EMEF PERICLES EUGENIO DA SILVA RAMOS"`
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
            <RelatorioReclamacaoProdutoPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Renderiza erro `Erro ao carregar Editais. Tente novamente mais tarde.`", () => {
    expect(
      screen.getByText("Erro ao carregar Editais. Tente novamente mais tarde.")
    ).toBeInTheDocument();
  });
});
