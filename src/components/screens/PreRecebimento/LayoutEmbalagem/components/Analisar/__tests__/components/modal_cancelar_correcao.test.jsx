import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ModalCancelarCorrecao from "../../components/ModalCancelarCorrecao";

describe("Testes de comportamentos componente - ModalCancelarCorrecao", () => {
  const handleCloseMock = jest.fn();
  const cancelarMock = jest.fn();

  const defaultProps = {
    show: true,
    handleClose: handleCloseMock,
    cancelar: cancelarMock,
  };

  const setup = (props = {}) => {
    return render(<ModalCancelarCorrecao {...defaultProps} {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o modal corretamente", () => {
    setup();

    expect(screen.getByText("Cancelar Correções")).toBeInTheDocument();

    expect(
      screen.getByText(
        /Deseja cancelar a correção e remover as considerações inseridas neste tipo de embalagem\?/i,
      ),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Não" })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Sim" })).toBeInTheDocument();
  });

  it("deve chamar handleClose ao clicar no botão 'Não'", () => {
    setup();

    const botaoNao = screen.getByRole("button", { name: "Não" });

    fireEvent.click(botaoNao);

    expect(handleCloseMock).toHaveBeenCalledTimes(1);
    expect(cancelarMock).not.toHaveBeenCalled();
  });

  it("deve chamar cancelar e handleClose ao clicar no botão 'Sim'", () => {
    setup();

    const botaoSim = screen.getByRole("button", { name: "Sim" });

    fireEvent.click(botaoSim);

    expect(cancelarMock).toHaveBeenCalledTimes(1);
    expect(handleCloseMock).toHaveBeenCalledTimes(1);
  });

  it("não deve renderizar o modal quando show for false", () => {
    setup({ show: false });

    expect(screen.queryByText("Cancelar Correções")).not.toBeInTheDocument();
  });

  it("deve chamar handleClose ao fechar pelo botão de fechar do modal", () => {
    setup();

    const botaoFechar = screen.getByLabelText("Close");

    fireEvent.click(botaoFechar);

    expect(handleCloseMock).toHaveBeenCalledTimes(1);
  });
});
