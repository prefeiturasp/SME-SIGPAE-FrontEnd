import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ModalAutorizaAlteracaoUE from "src/components/screens/DietaEspecial/Relatorio/componentes/FormAutorizaDietaEspecial/componentes/ModalAutorizaAlteracaoUE";

describe("Testa componente ModalAutorizaAlteracaoUE", () => {
  const mockProps = {
    showModal: true,
    closeModal: jest.fn(),
    handleSubmit: jest.fn(),
    submitting: false,
    dietaEspecial: {
      aluno: { nome: "João da Silva Sauro" },
      data_inicio: "10/01/2024",
      data_termino: "10/12/2024",
    },
  };

  const renderComponent = (mockProps) => {
    return render(<ModalAutorizaAlteracaoUE {...mockProps} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o título e os dados da dieta especial corretamente", () => {
    renderComponent(mockProps);
    expect(
      screen.getByText(/Solicitação de Alteração de U.E/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockProps.dietaEspecial.aluno.nome),
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockProps.dietaEspecial.data_inicio),
    ).toBeInTheDocument();
    expect(
      screen.getByText(mockProps.dietaEspecial.data_termino),
    ).toBeInTheDocument();

    // Verifica Labels estáticos
    expect(screen.getByText(/Nome Completo do Aluno/i)).toBeInTheDocument();
    expect(screen.getByText(/Início da Vigência/i)).toBeInTheDocument();
  });

  it("deve chamar handleSubmit quando o botão 'Sim' for clicado", () => {
    renderComponent(mockProps);

    const botaoSim = screen.getByRole("button", { name: /sim/i });
    fireEvent.click(botaoSim);

    expect(mockProps.handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("deve chamar closeModal quando o botão 'Cancelar' for clicado", () => {
    renderComponent(mockProps);

    const botaoCancelar = screen.getByRole("button", { name: /cancelar/i });
    fireEvent.click(botaoCancelar);

    expect(mockProps.closeModal).toHaveBeenCalledTimes(1);
  });

  it("deve chamar closeModal ao clicar no botão de fechar (X) do header", () => {
    renderComponent(mockProps);
    const botaoFechar = screen.getByRole("button", { name: /close/i });
    fireEvent.click(botaoFechar);

    expect(mockProps.closeModal).toHaveBeenCalledTimes(1);
  });

  it("deve exibir o componente de loading quando submitting for true", () => {
    const mockPropsAtualizado = {
      ...mockProps,
      submitting: true,
    };
    renderComponent(mockPropsAtualizado);
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it("não deve exibir o modal quando showModal for false", () => {
    const mockPropsAtualizado = {
      ...mockProps,
      showModal: false,
    };

    const { queryByText } = renderComponent(mockPropsAtualizado);
    expect(
      queryByText(/Solicitação de Alteração de U.E/i),
    ).not.toBeInTheDocument();
  });
});
