import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastContainer } from "react-toastify";
import ModalInsucesso from "../components/ModalInsucesso";
import mock from "src/services/_mock";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Testes de comportamentos Modal Insucesso - Registrar Insucesso Entrega", () => {
  beforeEach(() => {
    mock.resetHistory();
    mock.onPost("/insucesso-de-entrega/").reply(201, {});
  });

  const setup = (disabled = false) => {
    render(
      <>
        <ModalInsucesso
          values={{
            id: 10,
            numero_guia: "123",
            data_entrega: "2026-01-01",
            data_entrega_real: "2026-01-31",
            observacao: "teste",
          }}
          disabled={disabled}
        />
        <ToastContainer />
      </>,
    );
  };

  it("deve abrir o modal ao clicar em Registrar", async () => {
    setup();

    await userEvent.click(screen.getByRole("button", { name: "Registrar" }));

    expect(screen.getByText("Confirmação de registro")).toBeInTheDocument();
  });

  it("botão Não deve fechar o modal", async () => {
    setup();

    await userEvent.click(screen.getByRole("button", { name: "Registrar" }));
    await userEvent.click(screen.getByRole("button", { name: "Não" }));

    await waitFor(() => {
      expect(
        screen.queryByText("Confirmação de registro"),
      ).not.toBeInTheDocument();
    });
  });

  it("botão Sim deve enviar payload correto", async () => {
    setup();

    await userEvent.click(screen.getByRole("button", { name: "Registrar" }));
    await userEvent.click(screen.getByRole("button", { name: "Sim" }));

    await waitFor(() => {
      expect(mock.history.post.length).toBe(1);
    });

    const payload = JSON.parse(mock.history.post[0].data);

    expect(payload).toEqual({
      id: 10,
      observacao: "teste",
    });
  });

  it("deve mostrar toastSuccess e navegar em caso de sucesso", async () => {
    setup();

    await userEvent.click(screen.getByRole("button", { name: "Registrar" }));
    await userEvent.click(screen.getByRole("button", { name: "Sim" }));

    await waitFor(() => {
      expect(
        screen.getByText("Insucesso de entrega registrado."),
      ).toBeInTheDocument();
    });

    expect(mockNavigate).toHaveBeenCalledWith("/logistica/insucesso-entrega");
  });

  it("deve mostrar toastError em caso de erro", async () => {
    mock.onPost("/insucesso-de-entrega/").reply(400, {
      detail: "Erro ao registrar",
    });

    setup();

    await userEvent.click(screen.getByRole("button", { name: "Registrar" }));
    await userEvent.click(screen.getByRole("button", { name: "Sim" }));

    await waitFor(() => {
      expect(screen.getByText("Erro ao registrar")).toBeInTheDocument();
    });
  });

  it("botão Registrar deve respeitar disabled", () => {
    setup(true);

    expect(screen.getByRole("button", { name: "Registrar" })).toBeDisabled();
  });
});
