import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import * as dialogs from "src/components/Shareable/Toast/dialogs";
import { MeusDadosContext } from "src/context/MeusDadosContext";
import { mockMeusDadosCODAEGA } from "src/mocks/meusDados/CODAE-GA";
import mock from "src/services/_mock";
import AtualizacaoEmail from "../../index";

describe("Teste comportamento ao não retornar dados - AtualizacaoEmailEOL", () => {
  let toastErrorSpy;

  const renderComponent = async () => {
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
        </MemoryRouter>,
      );
    });
  };

  beforeEach(() => {
    toastErrorSpy = jest.spyOn(dialogs, "toastError").mockImplementation();
  });

  afterEach(() => {
    toastErrorSpy.mockRestore();
    mock.reset();
  });

  it("mostra erro se 403 'não pertence a mesma DRE'", async () => {
    mock.onGet(`/dados-usuario-eol-completo/99999/`).reply(403, {});

    await renderComponent();

    fireEvent.change(screen.getByTestId("input-rf"), {
      target: { value: "99999" },
    });

    fireEvent.click(screen.getByTestId("botao-buscar-rf"));

    await waitFor(() => {
      expect(toastErrorSpy).toHaveBeenCalledWith(
        "RF não pertence a uma unidade de sua DRE.",
      );
    });
  });

  it("mostra erro se EOL não retorna dados", async () => {
    mock.onGet(`/dados-usuario-eol-completo/99999/`).reply(400, {});

    await renderComponent();

    fireEvent.change(screen.getByTestId("input-rf"), {
      target: { value: "99999" },
    });

    fireEvent.click(screen.getByTestId("botao-buscar-rf"));

    await waitFor(() => {
      expect(toastErrorSpy).toHaveBeenCalledWith(
        "API do EOL não retornou nada para o RF 99999",
      );
    });
  });
});
