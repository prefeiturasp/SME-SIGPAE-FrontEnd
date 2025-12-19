import "@testing-library/jest-dom";
import { act, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockDietasAutorizadas } from "src/mocks/DietaEspecial/StatusSolicitacoes/dietasAutorizadas";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import * as StatusSolicitacoesDietaEspecialPage from "src/pages/DietaEspecial/StatusSolicitacoesPage";
import mock from "src/services/_mock";
import { renderWithProvider } from "src/utils/test-utils";

describe("Teste StatusSolicitacoes - Autorizadas Temporariamente - CODAE", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    mock
      .onGet("/codae-solicitacoes/autorizadas-temporariamente-dieta/")
      .replyOnce(200, mockDietasAutorizadas);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem(
      "tipo_perfil",
      TIPO_PERFIL.GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );
    localStorage.setItem(
      "perfil",
      PERFIL.COORDENADOR_GESTAO_ALIMENTACAO_TERCEIRIZADA,
    );

    Object.defineProperty(window, "location", {
      value: {
        href: "/solicitacoes-dieta-especial/solicitacoes-autorizadas-temporariamente",
        pathname:
          "/solicitacoes-dieta-especial/solicitacoes-autorizadas-temporariamente",
      },
      writable: true,
    });

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
              meusDados: mockMeusDadosCODAEGA,
              setMeusDados: jest.fn(),
            }}
          >
            <StatusSolicitacoesDietaEspecialPage.SolicitacoesDietaEspecialCODAE />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("Deve renderizar a tela de Solicitações Dieta Especial - Autorizadas Temporariamente", () => {
    expect(screen.queryAllByText("Status Solicitações")).toHaveLength(2);
    expect(screen.getByText("Autorizadas Temporariamente")).toBeInTheDocument();
    expect(
      screen.queryAllByText(
        "6104023 - PYETRO CRUZ RODRIGUES / EMEF PERICLES EUGENIO DA SILVA RAMOS",
      ),
    ).toHaveLength(3);
  });
});
