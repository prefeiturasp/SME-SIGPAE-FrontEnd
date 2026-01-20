import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ModalEnviarAlteracao from "src/components/screens/PreRecebimento/AlterarCronograma/components/Modals/ModalEnviarAlteracao";

describe("Testa o componente ModalEnviarAlteracao", () => {
  const mockProps = {
    show: true,
    loading: false,
    handleClose: jest.fn(),
    handleSim: jest.fn(),
  };

  const renderComponent = (mockProps) => {
    return render(<ModalEnviarAlteracao {...mockProps} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o título e as mensagens do modal corretamente", () => {
    renderComponent(mockProps);
    expect(screen.getByText("Alteração no Cronograma")).toBeInTheDocument();
    expect(
      screen.getByText(/A alteração no cronograma será enviada ao Fornecedor/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Você confirma o envio da alteração do cronograma/i),
    ).toBeInTheDocument();
  });

  it("deve chamar handleClose ao clicar no botão 'Não'", () => {
    renderComponent(mockProps);

    const botaoNao = screen.getByRole("button", { name: /não/i });
    fireEvent.click(botaoNao);
    expect(mockProps.handleClose).toHaveBeenCalledTimes(1);
  });

  it("deve chamar handleSim ao clicar no botão 'Sim'", () => {
    renderComponent(mockProps);

    const botaoSim = screen.getByRole("button", { name: /sim/i });
    fireEvent.click(botaoSim);
    expect(mockProps.handleSim).toHaveBeenCalledTimes(1);
  });

  it("deve exibir o estado de carregamento quando loading for true", () => {
    const propsAtualizada = {
      ...mockProps,
      loading: true,
    };
    renderComponent(propsAtualizada);

    expect(screen.getByText("Carregando...")).toBeInTheDocument();
    const spinElement = screen.getByText("Carregando...").closest(".ant-spin");
    expect(spinElement).toBeInTheDocument();
  });

  it("deve chamar handleClose ao clicar no botão de fechar (X) do header", () => {
    renderComponent(mockProps);

    const botaoFecharHeader = screen.getByRole("button", { name: /close/i });
    fireEvent.click(botaoFecharHeader);

    expect(mockProps.handleClose).toHaveBeenCalledTimes(1);
  });

  it("não deve renderizar o conteúdo quando show for false", () => {
    const propsAtualizada = {
      ...mockProps,
      show: false,
    };
    renderComponent(propsAtualizada);

    expect(
      screen.queryByText("Alteração no Cronograma"),
    ).not.toBeInTheDocument();
  });
});
