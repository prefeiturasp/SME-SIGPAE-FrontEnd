import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockKitLanche } from "src/mocks/SolicitacaokitLanche/mockKitLanche";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosCogestor } from "src/mocks/meusDados/cogestor";
import { mockGetEscolaTercTotal } from "src/mocks/services/escola.service/mockGetEscolasTercTotal";
import { SolicitacaoUnificadaPage } from "src/pages/DRE/SolicitacaoUnificadaPage";
import mock from "src/services/_mock";

describe("Formulário Solicitação Unificada - DRE - Erro ao carregar rascunhos", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCogestor);
    mock.onGet("/kit-lanches/").reply(200, mockKitLanche);
    mock.onGet("/dias-uteis/").reply(200, {
      proximos_cinco_dias_uteis: "2025-04-22",
      proximos_dois_dias_uteis: "2025-04-16",
    });
    mock
      .onGet("/escolas-simplissima-com-dre-unpaginated/terc-total/")
      .reply(200, mockGetEscolaTercTotal);
    mock
      .onGet("/solicitacoes-kit-lanche-unificada/minhas-solicitacoes/")
      .reply(400, { detail: "Erro ao carregar rascunhos." });

    Object.defineProperty(global, "localStorage", { value: localStorageMock });
    localStorage.setItem("tipo_perfil", TIPO_PERFIL.DIRETORIA_REGIONAL);
    localStorage.setItem("perfil", PERFIL.COGESTOR_DRE);

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
              meusDados: mockMeusDadosCogestor,
              setMeusDados: jest.fn(),
            }}
          >
            <SolicitacaoUnificadaPage />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>,
      );
    });
  });

  it("Deve renderizar toast de erro `Erro ao carregar as inclusões salvas. Tente novamente mais tarde.`", async () => {
    await waitFor(() => {
      expect(
        screen.getByText(
          "Erro ao carregar as inclusões salvas. Tente novamente mais tarde.",
        ),
      ).toBeInTheDocument();
    });
  });
});
