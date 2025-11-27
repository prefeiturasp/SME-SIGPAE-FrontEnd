import "@testing-library/jest-dom";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { debug } from "jest-preview";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockDietasAutorizadas } from "src/mocks/DietaEspecial/StatusSolicitacoes/dietasAutorizadas";
import { mockDietasAutorizadasFiltroPyetro } from "src/mocks/DietaEspecial/StatusSolicitacoes/dietasAutorizadasFiltroPyetro";
import { mockDietasAutorizadasPagina2 } from "src/mocks/DietaEspecial/StatusSolicitacoes/dietasAutorizadasPagina2";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import * as StatusSolicitacoesDietaEspecialPage from "src/pages/DietaEspecial/StatusSolicitacoesPage";
import mock from "src/services/_mock";
import { renderWithProvider } from "src/utils/test-utils";

describe("Teste StatusSolicitacoes - Autorizados", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCODAEGA);
    mock
      .onGet("/codae-solicitacoes/autorizados-dieta/")
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
        href: "/solicitacoes-dieta-especial/solicitacoes-autorizadas",
        pathname: "/solicitacoes-dieta-especial/solicitacoes-autorizadas",
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

  it("Deve renderizar a tela de Solicitações Dieta Especial - Autorizados CODAE", () => {
    expect(screen.queryAllByText("Status Solicitações")).toHaveLength(2);
    debug();
    expect(screen.getByText("Autorizadas")).toBeInTheDocument();
    expect(
      screen.queryAllByText(
        "6104023 - PYETRO CRUZ RODRIGUES / EMEF PERICLES EUGENIO DA SILVA RAMOS",
      ),
    ).toHaveLength(3);
  });

  it("Deve pesquisar uma solicitação de dieta especial (3+ caracteres)", async () => {
    jest.useFakeTimers();

    const divInputPesquisar = screen.getByTestId("div-input-pesquisar");
    const inputPesquisar = divInputPesquisar.querySelector("input");

    mock
      .onGet("/codae-solicitacoes/autorizados-dieta/")
      .reply(200, mockDietasAutorizadasFiltroPyetro);

    fireEvent.change(inputPesquisar, {
      target: { value: "PYETRO" },
    });

    jest.runAllTimers();

    await waitFor(() => {
      expect(
        screen.queryByText(
          "2339899 - SANDRA APARECIDA DE SOUZA / EMEF LEAO MACHADO, PROF.",
        ),
      ).not.toBeInTheDocument();
    });
  });

  it("Deve pesquisar uma solicitação de dieta especial (menos de 2 caracteres)", async () => {
    jest.useFakeTimers();

    const divInputPesquisar = screen.getByTestId("div-input-pesquisar");
    const inputPesquisar = divInputPesquisar.querySelector("input");

    mock
      .onGet("/codae-solicitacoes/autorizados-dieta/")
      .reply(200, mockDietasAutorizadas);

    fireEvent.change(inputPesquisar, {
      target: { value: "PY" },
    });

    jest.runAllTimers();

    await waitFor(() => {
      expect(
        screen.queryByText(
          "2339899 - SANDRA APARECIDA DE SOUZA / EMEF LEAO MACHADO, PROF.",
        ),
      ).toBeInTheDocument();
    });
  });

  it("Deve ir para a segunda página", async () => {
    const paginaDois = document.querySelector(
      ".ant-pagination .ant-pagination-item-2",
    );

    mock
      .onGet("/codae-solicitacoes/autorizados-dieta/")
      .reply(200, mockDietasAutorizadasPagina2);

    fireEvent.click(paginaDois);

    await waitFor(() => {
      expect(
        screen.getByText(
          "8075449 - NAGILLA THAIS ROSENDO DE FREITAS / EMEF PERICLES EUGENIO DA SILVA RAMOS",
        ),
      ).toBeInTheDocument();
    });
  });
});
