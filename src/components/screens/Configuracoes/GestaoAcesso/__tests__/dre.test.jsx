import "@testing-library/jest-dom";
import { act, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosCogestor } from "src/mocks/meusDados/cogestor";
import { mockGetPerfilListagem } from "src/mocks/services/perfil.service/mockGetPerfilListagem";
import { mockGetVisoesListagem } from "src/mocks/services/perfil.service/mockGetVisoesListagem";
import { mockGetSubdivisoesCODAE } from "src/mocks/services/vinculos.service/mockGetSubdivisoesCODAE";
import { mockVinculosAtivosDRE } from "src/mocks/services/vinculos.service/vinculosAtivosDRE";
import { GestaoAcessoCogestorPage } from "src/pages/Configuracoes/GestaoAcessoCogestorPage";
import mock from "src/services/_mock";
import { renderWithProvider } from "src/utils/test-utils";

describe("Teste de tela de Gestão de Acesso - DRE", () => {
  beforeEach(async () => {
    mock.onGet("/codae/").reply(200, mockGetSubdivisoesCODAE);
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCogestor);
    mock.onGet(`/perfis/visoes/`).reply(200, mockGetVisoesListagem);
    mock.onGet(`/perfis/`).reply(200, mockGetPerfilListagem);
    mock.onGet("/vinculos/vinculos-ativos/").reply(200, mockVinculosAtivosDRE);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);
    localStorage.setItem("perfil", PERFIL.COGESTOR_DRE);

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
              meusDados: mockMeusDadosCogestor,
              setMeusDados: jest.fn(),
            }}
          >
            <ToastContainer />
            <GestaoAcessoCogestorPage />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("renderiza tela de Gestão de Acesso", async () => {
    await waitFor(() => {
      expect(screen.queryAllByText("Gestão de Acesso")).toHaveLength(2);
    });
  });

  it("select Visão não está mais desabilitado e renderiza DRE e Escola", async () => {
    const selectElement = screen
      .getByTestId("input-visao")
      .querySelector("select");
    expect(selectElement).not.toBeDisabled();
    expect(
      within(selectElement).queryByText("Diretoria Regional"),
    ).not.toBeNull();
    expect(within(selectElement).queryByText("Escola")).not.toBeNull();
  });
});
