import React from "react";
import {
  render,
  act,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import mock from "src/services/_mock";
import { MemoryRouter } from "react-router-dom";
import SolicitacaoAlteracaoCronogramaPage from "src/pages/PreRecebimento/SolicitacaoAlteracaoCronogramaPage";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockGetListagemSolicitacaoAlteracaoCronograma } from "src/mocks/services/cronograma.service/mockGetListagemSolicitacaoAlteracaoCronograma";
import { mockMeusDadosCoordCodaeDilogLogistica } from "src/mocks/meusDados/CODAE/coord-codae-dilog-logistica";

import { PERFIL, TIPO_PERFIL } from "src/constants/shared";

const setupTest = async () => {
  localStorage.setItem("perfil", PERFIL.COORDENADOR_CODAE_DILOG_LOGISTICA);
  localStorage.setItem("tipo_perfil", TIPO_PERFIL.LOGISTICA);

  mock
    .onGet("/solicitacao-de-alteracao-de-cronograma/")
    .reply(200, mockGetListagemSolicitacaoAlteracaoCronograma);

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
            meusDados: mockMeusDadosCoordCodaeDilogLogistica,
            setMeusDados: jest.fn(),
          }}
        >
          <SolicitacaoAlteracaoCronogramaPage />
        </MeusDadosContext.Provider>
      </MemoryRouter>,
    );
  });
};

describe("Teste da página de Verificar Solicitações de Alteração de Cronograma", () => {
  beforeEach(async () => {
    await setupTest();
  });

  it("testa o carregamento da tabela assim como da tag leve leite", async () => {
    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("Digite o n° do Cronograma"),
      ).toBeInTheDocument();
    });

    const botaoFiltrar = screen.getByText("Filtrar").closest("button");
    fireEvent.click(botaoFiltrar);

    await waitFor(() => {
      expect(screen.getByText("Resultados da Pesquisa")).toBeInTheDocument();
    });

    expect(screen.getByText("00000102-ALT")).toBeInTheDocument();
    expect(screen.getByText("151/2024A")).toBeInTheDocument();

    expect(screen.getByText("00000101-ALT")).toBeInTheDocument();
    expect(screen.getByText("142/2024A")).toBeInTheDocument();

    const tagLeveLeite = document.querySelector("span.tag-leve-leite");
    expect(tagLeveLeite).toBeInTheDocument();
    expect(tagLeveLeite).toHaveTextContent("LEVE LEITE - PLL");

    const todasTagsLeveLeite = document.querySelectorAll("span.tag-leve-leite");
    expect(todasTagsLeveLeite.length).toBe(1);
  });
});
