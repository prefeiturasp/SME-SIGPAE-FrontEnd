import "@testing-library/jest-dom";
import { act, fireEvent, render, screen } from "@testing-library/react";
import ModalCancelarAnalise from "../components/ModalCancelarAnalise";

describe("Teste de comportamentos componente de Layout de Embalagem - ModalCancelarAnalise", () => {
  const mockHandleClose = jest.fn();
  const mockCancelar = jest.fn();

  const defaultProps = {
    show: true,
    handleClose: mockHandleClose,
    cancelar: mockCancelar,
  };

  const setup = async (props = {}) => {
    await act(async () => {
      render(<ModalCancelarAnalise {...defaultProps} {...props} />);
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o modal corretamente", async () => {
    await setup();

    expect(screen.getByText("Cancelar Análise")).toBeInTheDocument();

    expect(
      screen.getByText("Deseja cancelar a análise do Layout da Embalagem?"),
    ).toBeInTheDocument();

    expect(screen.getByText("Não")).toBeInTheDocument();
    expect(screen.getByText("Sim")).toBeInTheDocument();
  });

  it("deve chamar handleClose ao clicar em Não", async () => {
    await setup();

    fireEvent.click(screen.getByText("Não"));

    expect(mockHandleClose).toHaveBeenCalledTimes(1);
    expect(mockCancelar).not.toHaveBeenCalled();
  });

  it("deve chamar cancelar e handleClose ao clicar em Sim", async () => {
    await setup();

    fireEvent.click(screen.getByText("Sim"));

    expect(mockCancelar).toHaveBeenCalledTimes(1);
    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  it("não deve renderizar o modal quando show for false", async () => {
    await setup({
      show: false,
    });

    expect(screen.queryByText("Cancelar Análise")).not.toBeInTheDocument();

    expect(
      screen.queryByText("Deseja cancelar a análise do Layout da Embalagem?"),
    ).not.toBeInTheDocument();
  });
});
