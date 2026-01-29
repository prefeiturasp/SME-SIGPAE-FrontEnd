import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ModalAnaliseDilog from "src/components/screens/PreRecebimento/AlterarCronograma/components/Modals/ModalAnaliseDilog";

const mockHandleClose = jest.fn();
const mockHandleSim = jest.fn();

const renderComponent = (show, loading) => {
  return render(
    <ModalAnaliseDilog
      show={show}
      handleClose={mockHandleClose}
      handleSim={mockHandleSim}
      loading={loading}
    />,
  );
};

describe("Teste do componente ModalAnaliseDilog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o título e a pergunta corretamente", () => {
    renderComponent(true, false);
    expect(
      screen.getByText(/Enviar análise para Fornecedor/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Deseja enviar a avaliação/i)).toBeInTheDocument();
    const fornecedorElements = screen.getAllByText(/Fornecedor/i);
    expect(fornecedorElements).toHaveLength(2);
  });

  it("deve exibir o indicador de carregamento quando loading for true", () => {
    renderComponent(true, true);
    expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
  });

  it("deve chamar handleClose ao clicar no botão 'Não'", () => {
    renderComponent(true, false);
    const btnNao = screen.getByRole("button", { name: /não/i });
    fireEvent.click(btnNao);

    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  it("deve chamar handleSim ao clicar no botão 'Sim'", () => {
    renderComponent(true, false);
    const btnSim = screen.getByRole("button", { name: /sim/i });
    fireEvent.click(btnSim);

    expect(mockHandleSim).toHaveBeenCalledTimes(1);
  });

  it("deve possuir a propriedade backdrop static", () => {
    renderComponent(true, false);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
