import {
  render,
  act,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import mock from "src/services/_mock";
import { MemoryRouter } from "react-router-dom";
import QuestoesPorProdutoPage from "src/pages/Recebimento/QuestoesPorProduto/QuestoesPorProdutoPage";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosDilogQualidade } from "src/mocks/meusDados/dilog-qualidade";

import { mockListaFichasTecnicasSimplesAprovadas } from "src/mocks/PreRecebimento/CadastroCronograma/mockListaFichasTecnicasSimplesAprovadas.jsx";
import {
  mockListarQuestoesPorProduto,
  mockListarQuestoesPorProduto2,
} from "src/mocks/services/questoesConferencia.service/mockListarQuestoesPorProduto";
import { mockListarQuestoesConferenciaSimples } from "src/mocks/services/questoesConferencia.service/mockListarQuestoesConferenciaSimples";

import { PERFIL, TIPO_PERFIL } from "src/constants/shared";

describe("Testar Edição de Fichas de Recebimento", () => {
  beforeEach(async () => {
    localStorage.setItem("perfil", PERFIL.DILOG_QUALIDADE);
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.PRE_RECEBIMENTO);

    mock
      .onGet("/ficha-tecnica/lista-simples/")
      .reply(200, mockListaFichasTecnicasSimplesAprovadas);

    mock
      .onGet(`/questoes-por-produto/`)
      .replyOnce(200, mockListarQuestoesPorProduto);

    mock
      .onGet("/questoes-conferencia/lista-simples-questoes/")
      .reply(200, mockListarQuestoesConferenciaSimples);
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
              meusDados: mockMeusDadosDilogQualidade,
              setMeusDados: jest.fn(),
            }}
          >
            <QuestoesPorProdutoPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  };

  it("Testa a renderização dos elementos corretos na listagem da página", async () => {
    await setup();

    await waitFor(() => {
      expect(
        screen.getByText("Produtos com Questões Atribuídas")
      ).toBeInTheDocument();
    });
    expect(screen.getAllByText("CAQUI").length).toBe(2);

    const listaVerQuestoes = screen.getAllByText("Ver Questões Atribuídas");
    expect(listaVerQuestoes.length).toBe(2);

    fireEvent.click(listaVerQuestoes[0]);

    await waitFor(() => {
      expect(
        screen.getByText("Fechar Questões Atribuídas")
      ).toBeInTheDocument();
    });
  });

  it("Valida botão de Limpar Filtros", async () => {
    await setup();

    const spanProduto = screen.getByText(
      "Digite o nº da ficha ou nome do produto"
    );
    const inputProduto =
      spanProduto.parentElement.querySelector("input") ||
      spanProduto.closest("div").querySelector("input") ||
      spanProduto.nextElementSibling;

    fireEvent.change(inputProduto, { target: { value: "FT011 - CAQUI" } });
    await waitFor(() => {
      expect(inputProduto.value).toBe("FT011 - CAQUI");
    });

    mock
      .onGet(`/questoes-por-produto/`)
      .replyOnce(200, mockListarQuestoesPorProduto2);

    const botaoLimparFiltros = screen
      .getByText("Limpar Filtros")
      .closest("button");
    fireEvent.click(botaoLimparFiltros);

    await waitFor(() => {
      expect(inputProduto.value).toBe("");
    });
  });
});
