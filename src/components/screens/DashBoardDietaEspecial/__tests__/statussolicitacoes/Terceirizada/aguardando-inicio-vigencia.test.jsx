import "@testing-library/jest-dom";
import { act, screen } from "@testing-library/react";
import { debug } from "jest-preview";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockDietasAutorizadas } from "src/mocks/DietaEspecial/StatusSolicitacoes/dietasAutorizadas";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosTerceirizada } from "src/mocks/meusDados/terceirizada";
import * as StatusSolicitacoesDietaEspecialPage from "src/pages/DietaEspecial/StatusSolicitacoesPage";
import mock from "src/services/_mock";
import { renderWithProvider } from "src/utils/test-utils";

describe("Teste StatusSolicitacoes - Aguardando início da vigência - Terceirizada", () => {
  const terceirizadaUuid =
    mockMeusDadosTerceirizada.vinculo_atual.instituicao.uuid;

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosTerceirizada);
    mock
      .onGet(
        `/terceirizada-solicitacoes/aguardando-vigencia-dieta/${terceirizadaUuid}/`,
      )
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
        href: "/solicitacoes-dieta-especial/solicitacoes-aguardando-inicio-vigencia",
        pathname:
          "/solicitacoes-dieta-especial/solicitacoes-aguardando-inicio-vigencia",
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
              meusDados: mockMeusDadosTerceirizada,
              setMeusDados: jest.fn(),
            }}
          >
            <StatusSolicitacoesDietaEspecialPage.SolicitacoesDietaEspecialTerceirizada />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("Deve renderizar a tela de Solicitações Dieta Especial - Aguardando início da vigência", () => {
    expect(screen.queryAllByText("Status Solicitações")).toHaveLength(2);
    debug();
    expect(
      screen.getByText("Aguardando início da vigência"),
    ).toBeInTheDocument();
    expect(
      screen.queryAllByText(
        "6104023 - PYETRO CRUZ RODRIGUES / EMEF PERICLES EUGENIO DA SILVA RAMOS",
      ),
    ).toHaveLength(3);
  });
});
