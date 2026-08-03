import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { ToastContainer } from "react-toastify";
import ModalCancelaDietaEspecial from "../componentes/ModalCancelaDietaEspecial";
import HTTP_STATUS from "http-status-codes";

jest.mock("src/components/Shareable/FinalFormToRedux", () => () => null);

jest.mock("src/components/Shareable/CKEditorField", () => ({
  __esModule: true,
  default: ({ input, label }) => (
    <div>
      <label htmlFor={input.name}>{label}</label>
      <textarea
        id={input.name}
        data-testid={input.name}
        value={input.value || ""}
        onChange={(e) => input.onChange(e.target.value)}
      />
    </div>
  ),
}));

describe("Teste de comportamentos do componente - ModalCancelaDietaEspecial", () => {
  const mockOnCloseModal = jest.fn();
  const mockOnCancelar = jest.fn();

  const defaultProps = {
    showModal: true,
    onCloseModal: mockOnCloseModal,
    onCancelar: mockOnCancelar,
    uuid: "uuid-123",
  };

  const setup = async (props = {}) => {
    await act(async () => {
      render(
        <>
          <ModalCancelaDietaEspecial {...defaultProps} {...props} />
          <ToastContainer />
        </>,
      );
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();

    global.fetch = jest.fn();
  });

  it("deve renderizar o modal", async () => {
    await setup();

    expect(
      screen.getByText("Deseja cancelar a solicitação?"),
    ).toBeInTheDocument();

    expect(screen.getByText("Justificativa")).toBeInTheDocument();

    expect(screen.getByText("Não")).toBeInTheDocument();
    expect(screen.getByText("Sim")).toBeInTheDocument();
  });

  it("não deve renderizar quando showModal for false", async () => {
    await setup({
      showModal: false,
    });

    expect(
      screen.queryByText("Deseja cancelar a solicitação?"),
    ).not.toBeInTheDocument();
  });

  it("deve fechar o modal ao clicar em Não", async () => {
    await setup();

    fireEvent.click(screen.getByText("Não"));

    expect(mockOnCloseModal).toHaveBeenCalledTimes(1);
  });

  it("deve cancelar a solicitação com sucesso", async () => {
    global.fetch.mockResolvedValue({
      status: HTTP_STATUS.OK,
      json: async () => ({}),
    });

    await setup();

    fireEvent.change(screen.getByTestId("justificativa"), {
      target: {
        value: "Solicitação cancelada pela escola.",
      },
    });

    fireEvent.click(screen.getByText("Sim"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          "/solicitacoes-dieta-especial/uuid-123/escola-cancela-dieta-especial/",
        ),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            justificativa: "Solicitação cancelada pela escola.",
          }),
        }),
      );
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          "Solicitação de Dieta Especial cancelada com sucesso!",
        ),
      ).toBeInTheDocument();
    });

    expect(mockOnCancelar).toHaveBeenCalledTimes(1);
  });

  it("deve exibir mensagem de erro quando o cancelamento falhar", async () => {
    global.fetch.mockResolvedValue({
      status: HTTP_STATUS.BAD_REQUEST,
      json: async () => ({
        detail: "Erro interno",
      }),
    });

    await setup();

    fireEvent.change(screen.getByTestId("justificativa"), {
      target: {
        value: "Teste",
      },
    });

    fireEvent.click(screen.getByText("Sim"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          "/solicitacoes-dieta-especial/uuid-123/escola-cancela-dieta-especial/",
        ),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            justificativa: "Teste",
          }),
        }),
      );
    });

    await waitFor(() => {
      expect(
        screen.getByText(/Erro ao cancelar Solicitação de Dieta Especial/i),
      ).toBeInTheDocument();
    });

    expect(mockOnCancelar).not.toHaveBeenCalled();
  });

  it("não deve enviar com justificativa vazia", async () => {
    global.fetch.mockResolvedValue({
      status: HTTP_STATUS.OK,
      json: async () => ({}),
    });

    await setup();

    fireEvent.click(screen.getByText("Sim"));

    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });
});
