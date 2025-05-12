import React from "react";
import {
  act,
  screen,
  waitFor,
  fireEvent,
  within,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import GestaoAcessoGeralPage from "pages/Configuracoes/GestaoAcessoGeralPage";
import { MeusDadosContext } from "context/MeusDadosContext";
import mock from "services/_mock";
import { renderWithProvider } from "utils/test-utils";
import { PERFIL } from "constants/shared";

import { mockGetVisoesListagem } from "mocks/services/perfil.service/mockGetVisoesListagem";
import { mockGetPerfilListagem } from "mocks/services/perfil.service/mockGetPerfilListagem";
import { mockGetSubdivisoesCODAE } from "mocks/services/vinculos.service/mockGetSubdivisoesCODAE";
import { mockGetVinculosAtivos } from "mocks/services/vinculos.service/mockGetVinculosAtivos";
import { mockMeusDadosAdmGestaoProduto } from "mocks/meusDados/admGestaoProduto";

describe("Teste <GestaoAcessoEmpresaPage>", () => {
  beforeEach(async () => {
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_GESTAO_PRODUTO);

    mock.onGet("/codae/").reply(200, mockGetSubdivisoesCODAE);
    mock.onGet(`/perfis/visoes/`).reply(200, mockGetVisoesListagem);
    mock.onGet("/vinculos/vinculos-ativos/").reply(200, mockGetVinculosAtivos);
    mock.onGet(`/perfis/`).reply(200, mockGetPerfilListagem);
    mock
      .onGet(
        `/perfis-vinculados/ADMINISTRADOR_GESTAO_PRODUTO/perfis-subordinados/`
      )
      .reply(200, [
        "ADMINISTRADOR_GESTAO_PRODUTO",
        "ADMINISTRADOR_EMPRESA",
        "USUARIO_EMPRESA",
      ]);

    await act(async () => {
      renderWithProvider(
        <MemoryRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <MeusDadosContext.Provider
            value={{
              meusDados: mockMeusDadosAdmGestaoProduto,
              setMeusDados: jest.fn(),
            }}
          >
            <GestaoAcessoGeralPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("Testa a renderização dos elementos da página", async () => {
    await waitFor(() =>
      expect(screen.getByText("Treinamento")).toBeInTheDocument()
    );
  });

  it("Verifica as visões disponíveis e se o fitro de perfis está funcional", async () => {
    await waitFor(() =>
      expect(
        screen.getByText("Usuários com Acesso Cadastrados")
      ).toBeInTheDocument()
    );

    const selectElement = screen
      .getByTestId("input-visao")
      .querySelector("select");
    expect(within(selectElement).queryByText("CODAE")).not.toBeNull();
    expect(within(selectElement).queryByText("Empresa")).not.toBeNull();
    fireEvent.change(selectElement, { target: { value: "CODAE" } });

    const selectPerfilAcesso = screen
      .getByTestId("input-perfil-acesso")
      .querySelector("select");
    fireEvent.mouseDown(selectPerfilAcesso);

    expect(
      within(selectPerfilAcesso).queryByText("ADMINISTRADOR_EMPRESA")
    ).toBeNull();
    expect(
      within(selectPerfilAcesso).queryByText("USUARIO_EMPRESA")
    ).toBeNull();
    expect(
      within(selectPerfilAcesso).queryByText("ADMINISTRADOR_GESTAO_PRODUTO")
    ).not.toBeNull();
  });

  it("Testa a abertura do modal de 'Adicionar Acesso' e verifica se foi renderizado corretamente", async () => {
    await waitFor(() =>
      expect(screen.getByText("Treinamento")).toBeInTheDocument()
    );

    await act(async () => {
      const botaoAdicionar = screen
        .getByText("Adicionar Acesso")
        .closest("button");
      fireEvent.click(botaoAdicionar);
    });

    expect(screen.queryByText("Servidor")).toBeInTheDocument();
    expect(screen.queryByText("Não Servidor")).toBeInTheDocument();
    expect(screen.queryByText("Unidade Parceira")).not.toBeInTheDocument();
  });
});
