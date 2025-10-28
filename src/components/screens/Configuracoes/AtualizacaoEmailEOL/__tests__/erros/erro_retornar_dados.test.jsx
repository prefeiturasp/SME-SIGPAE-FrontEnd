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
import AtualizacaoEmail from "../../index";
import mock from "src/services/_mock";

describe("Teste comportamento ao não retorna dados - AtualizacaoEmailEOL", () => {
  beforeEach(async () => {
    mock.onGet(`/dados-usuario-eol-completo/99999/`).reply(400, {});

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

  it("mostra erro se EOL não retorna dados", async () => {
    fireEvent.change(screen.getByTestId("input-rf"), {
      target: { value: "99999" },
    });

    fireEvent.click(screen.getByTestId("botao-buscar-rf"));

    await waitFor(() => {
      expect(
        screen.getByText("API do EOL não retornou nada para o RF 99999")
      ).toBeInTheDocument();
    });
  });
});
