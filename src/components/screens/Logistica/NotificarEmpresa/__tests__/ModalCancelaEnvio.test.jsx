import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ModalCancelarEnvio from "src/components/screens/Logistica/NotificarEmpresa/components/ModalCancelarEnvio";

const mockHandleClose = jest.fn();
const mockVoltarPagina = jest.fn();

const renderComponent = (show) => {
  return render(
    <ModalCancelarEnvio
      show={show}
      handleClose={mockHandleClose}
      voltarPagina={mockVoltarPagina}
    />,
  );
};

describe("Teste do componente ModalCancelarEnvio", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o modal com título e corpo quando 'show' for true", () => {
    renderComponent(true);

    expect(
      screen.getByText(/Cancelar Edição da Notificação/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Deseja cancelar a edição da notificação\?/i),
    ).toBeInTheDocument();
  });

  it("não deve renderizar o conteúdo quando 'show' for false", () => {
    renderComponent(false);
    expect(
      screen.queryByText(/Cancelar Edição da Notificação/i),
    ).not.toBeInTheDocument();
  });

  it("deve chamar handleClose ao clicar no botão 'Não'", () => {
    renderComponent(true);

    const btnNao = screen.getByRole("button", { name: /não/i });
    fireEvent.click(btnNao);

    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  it("deve chamar voltarPagina ao clicar no botão 'Sim'", () => {
    renderComponent(true);

    const btnSim = screen.getByRole("button", { name: /sim/i });
    fireEvent.click(btnSim);

    expect(mockVoltarPagina).toHaveBeenCalledTimes(1);
    expect(mockHandleClose).not.toHaveBeenCalled(); // Garante que apenas uma ação foi tomada
  });

  it("deve chamar handleClose ao clicar no botão de fechar do cabeçalho", () => {
    renderComponent(true);

    const btnClose = screen.getByLabelText(/close/i);
    fireEvent.click(btnClose);

    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });
});
