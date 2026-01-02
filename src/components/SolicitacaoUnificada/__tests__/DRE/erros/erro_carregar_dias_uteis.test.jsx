import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PERFIL, TIPO_PERFIL } from "src/constants/shared";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockSolicitacaoKitLancheUnificadoRascunho } from "src/mocks/SolicitacaoUnificada/Relatorio/solicitacaoKitLancheUnificadoRascunho";
import { mockKitLanche } from "src/mocks/SolicitacaokitLanche/mockKitLanche";
import { localStorageMock } from "src/mocks/localStorageMock";
import { mockMeusDadosCogestor } from "src/mocks/meusDados/cogestor";
import { mockGetEscolaTercTotal } from "src/mocks/services/escola.service/mockGetEscolasTercTotal";
import { SolicitacaoUnificadaPage } from "src/pages/DRE/SolicitacaoUnificadaPage";
import mock from "src/services/_mock";

describe("Formulário Solicitação Unificada - DRE - Erro ao carregar dias úteis", () => {
  beforeEach(async () => {
    mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosCogestor);
    mock.onGet("/kit-lanches/").reply(200, mockKitLanche);
    mock
      .onGet("/dias-uteis/")
      .reply(400, { detail: "Erro ao carregar dias úteis." });
    mock
      .onGet("/escolas-simplissima-com-dre-unpaginated/terc-total/")
      .reply(200, mockGetEscolaTercTotal);
    mock
      .onGet("/solicitacoes-kit-lanche-unificada/minhas-solicitacoes/")
      .reply(200, mockSolicitacaoKitLancheUnificadoRascunho);

    Object.defineProperty(global, "localStorage", {
      value: localStorageMock,
    });
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

  it("Deve renderizar erro `Erro ao carregar dias úteis. Tente novamente mais tarde.`", () => {
    expect(
      screen.getByText(
        "Erro ao carregar dias úteis. Tente novamente mais tarde.",
      ),
    ).toBeInTheDocument();
  });
});
