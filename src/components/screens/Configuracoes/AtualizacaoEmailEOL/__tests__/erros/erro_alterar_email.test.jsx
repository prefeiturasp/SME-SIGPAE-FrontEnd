import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import { ToastContainer } from "react-toastify";
import { mockGetDadosUsuarioEOL } from "src/mocks/services/permissoes.service/mockGetDadosUsuarioEOL";
import AtualizacaoEmail from "../../index";
import mock from "src/services/_mock";

describe("Teste comportamento ao falhar ao alteração email - AtualizacaoEmailEOL", () => {
  beforeEach(async () => {
    mock
      .onGet(`/dados-usuario-eol-completo/${mockGetDadosUsuarioEOL.rf}/`)
      .reply(200, mockGetDadosUsuarioEOL);
    mock
      .onPatch(
        `/cadastro-com-coresso/${mockGetDadosUsuarioEOL.rf}/alterar-email/`
      )
      .reply(400, {});

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
              meusDados: mockMeusDadosCODAEGA,
              setMeusDados: jest.fn(),
            }}
          >
            <AtualizacaoEmail />
            <ToastContainer />
          </MeusDadosContext.Provider>
        </MemoryRouter>
      );
    });
  });

  it("mostra erro se falhar ao alterar email", async () => {
    fireEvent.change(screen.getByTestId("input-rf"), {
      target: { value: mockGetDadosUsuarioEOL.rf },
    });

    fireEvent.click(screen.getByTestId("botao-buscar-rf"));

    const emailField = screen.getByPlaceholderText("@sme.prefeitura.sp.gov.br");
    fireEvent.change(emailField, {
      target: { value: "teste@sme.prefeitura.sp.gov.br" },
    });

    fireEvent.click(screen.getByTestId("botao-salvar"));

    await waitFor(() => {
      expect(screen.getByText("Erro ao alterar e-mail")).toBeInTheDocument();
    });
  });
});
