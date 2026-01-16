import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ModalAutorizaDietaEspecial from "src/components/screens/DietaEspecial/Relatorio/componentes/FormAutorizaDietaEspecial/componentes/ModalAutorizaDietaEspecial";

describe("Teste do componente ModalAutorizaDietaEspecial", () => {
  const mockProps = {
    showModal: true,
    closeModal: jest.fn(),
    handleSubmit: jest.fn(),
    dietaEspecial: {
      aluno: {
        nome: "João da Silva",
      },
    },
  };

  const renderComponent = (mockProps) => {
    return render(<ModalAutorizaDietaEspecial {...mockProps} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o título 'Atenção' e a mensagem com o nome do aluno", () => {
    renderComponent(mockProps);

    expect(screen.getByText("Atenção")).toBeInTheDocument();

    const mensagem = screen.getByText(
      /O aluno João da Silva já possui uma dieta especial ativa/i,
    );
    expect(mensagem).toBeInTheDocument();
  });

  it("deve chamar closeModal quando o botão 'Cancelar' for clicado", () => {
    renderComponent(mockProps);

    const botaoCancelar = screen.getByRole("button", { name: /cancelar/i });
    fireEvent.click(botaoCancelar);

    expect(mockProps.closeModal).toHaveBeenCalledTimes(1);
  });

  it("deve chamar handleSubmit quando o botão 'Inativar e continuar' for clicado", () => {
    renderComponent(mockProps);

    const botaoAcao = screen.getByRole("button", {
      name: /inativar e continuar/i,
    });
    fireEvent.click(botaoAcao);

    expect(mockProps.handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("deve chamar closeModal ao clicar no botão de fechar (X) do header", () => {
    renderComponent(mockProps);

    const botaoFecharHeader = screen.getByRole("button", { name: /close/i });
    fireEvent.click(botaoFecharHeader);

    expect(mockProps.closeModal).toHaveBeenCalledTimes(1);
  });

  it("não deve renderizar nada quando showModal for false", () => {
    const mockPropsAtualizado = {
      ...mockProps,
      showModal: false,
    };
    renderComponent(mockPropsAtualizado);
    expect(screen.queryByText("Atenção")).not.toBeInTheDocument();
  });
});
