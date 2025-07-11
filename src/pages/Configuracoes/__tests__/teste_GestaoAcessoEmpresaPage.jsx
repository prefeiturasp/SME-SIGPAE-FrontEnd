import React from "react";
import { act, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import GestaoAcessoEmpresaPage from "src/pages/Configuracoes/GestaoAcessoEmpresaPage";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import mock from "src/services/_mock";
import { renderWithProvider } from "src/utils/test-utils";
import { PERFIL } from "src/constants/shared";

import {
  getNotificacoes,
  getQtdNaoLidas,
} from "src/services/notificacoes.service";

import { mockGetNotificacoes } from "src/mocks/services/notificacoes.service/mockGetNotificacoes";
import { mockGetQtdNaoLidas } from "src/mocks/services/notificacoes.service/mockGetQtdNaoLidas";

import { mockGetVisoesListagem } from "src/mocks/services/perfil.service/mockGetVisoesListagem";
import { mockGetPerfilListagem } from "src/mocks/services/perfil.service/mockGetPerfilListagem";
import { mockGetSubdivisoesCODAE } from "src/mocks/services/vinculos.service/mockGetSubdivisoesCODAE";
import { mockGetVinculosAtivos } from "src/mocks/services/vinculos.service/mockGetVinculosAtivos";
import { mockMeusDadosAdmCONTRATOS } from "src/mocks/meusDados/adm-contratos";

jest.mock("src/services/notificacoes.service");

describe("Teste <GestaoAcessoEmpresaPage>", () => {
  beforeEach(async () => {
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_CONTRATOS);

    getNotificacoes.mockResolvedValue({
      data: mockGetNotificacoes,
      status: 200,
    });

    getQtdNaoLidas.mockResolvedValue({
      data: mockGetQtdNaoLidas,
      status: 200,
    });

    mock.onGet("/vinculos/vinculos-ativos/").reply(200, mockGetVinculosAtivos);
    mock.onGet("/codae/").reply(200, mockGetSubdivisoesCODAE);
    mock.onGet(`/perfis/`).reply(200, mockGetPerfilListagem);
    mock.onGet(`/perfis/visoes/`).reply(200, mockGetVisoesListagem);

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
              meusDados: mockMeusDadosAdmCONTRATOS,
              setMeusDados: jest.fn(),
            }}
          >
            <GestaoAcessoEmpresaPage />
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

  it("Testa a abertura do modal de 'Adicionar Acesso' e verifica se foi renderizado corretamente", async () => {
    await waitFor(() =>
      expect(screen.getByText("Treinamento")).toBeInTheDocument()
    );

    const botaoAdicionar = screen
      .getByText("Adicionar Acesso")
      .closest("button");
    fireEvent.click(botaoAdicionar);

    // Radio Buttons não devem aparecer para o ADMINISTRADOR_CONTRATOS
    expect(screen.queryByText("Servidor")).not.toBeInTheDocument();
    expect(screen.queryByText("Não Servidor")).not.toBeInTheDocument();
    expect(screen.queryByText("Unidade Parceira")).not.toBeInTheDocument();
  });
});
