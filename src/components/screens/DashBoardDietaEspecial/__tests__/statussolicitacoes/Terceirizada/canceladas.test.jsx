import "@testing-library/jest-dom";
import { act, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PERFIL, TIPO_PERFIL, TIPO_SERVICO } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockDietasAutorizadas } from "src/mocks/DietaEspecial/StatusSolicitacoes/dietasAutorizadas";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusLotesVinculados } from "src/mocks/lote.service/Terceirizada/meusLotesVinculados";
import { mockMeusDadosTerceirizada } from "src/mocks/meusDados/terceirizada";
import * as StatusSolicitacoesDietaEspecialPage from "src/pages/DietaEspecial/StatusSolicitacoesPage";
import mock from "src/services/_mock";
import { renderWithProvider } from "src/utils/test-utils";

describe("Teste StatusSolicitacoes - Terceirizada - Canceladas", () => {
  const terceirizadaUuid =
    mockMeusDadosTerceirizada.vinculo_atual.instituicao.uuid;

  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosTerceirizada);
    mock
      .onGet(`/terceirizada-solicitacoes/cancelados-dieta/${terceirizadaUuid}/`)
      .replyOnce(200, mockDietasAutorizadas);
    mock
      .onGet("/lotes/meus-lotes-vinculados/")
      .reply(200, mockMeusLotesVinculados);

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.TERCEIRIZADA);
    localStorage.setItem("perfil", PERFIL.ADMINISTRADOR_EMPRESA);
    localStorage.setItem("tipo_servico", TIPO_SERVICO.TERCEIRIZADA);

    Object.defineProperty(window, "location", {
      value: {
        href: "/solicitacoes-dieta-especial/solicitacoes-canceladas",
        pathname: "/solicitacoes-dieta-especial/solicitacoes-canceladas",
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

  it("Deve renderizar a tela de Solicitações Dieta Especial - Canceladas", () => {
    expect(screen.queryAllByText("Status Solicitações")).toHaveLength(2);
    expect(screen.getByText("Canceladas")).toBeInTheDocument();
    expect(
      screen.queryAllByText(
        "6104023 - PYETRO CRUZ RODRIGUES / EMEF PERICLES EUGENIO DA SILVA RAMOS",
      ),
    ).toHaveLength(3);
  });
});
