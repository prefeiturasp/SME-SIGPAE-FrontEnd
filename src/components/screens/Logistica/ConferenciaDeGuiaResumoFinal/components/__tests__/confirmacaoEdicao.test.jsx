import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ConfirmacaoEdicao from "src/components/screens/Logistica/ConferenciaDeGuiaResumoFinal/components/confirmacaoEdicao";

describe("Componente ConfirmacaoEdicao", () => {
  const mockOnSubmit = jest.fn();
  const defaultProps = {
    texto: "Finalizar",
    disabled: false,
    guia: { status: "Aguardando conferência" },
    onSubmit: mockOnSubmit,
    reposicao: false,
  };

  const renderComponent = (props) => {
    return render(<ConfirmacaoEdicao {...props} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o botão com o texto correto", () => {
    renderComponent(defaultProps);
    expect(screen.getByText("Finalizar")).toBeInTheDocument();
  });

  it("deve chamar onSubmit diretamente quando o status da guia não for de reposição", () => {
    renderComponent(defaultProps);
    const botaoPrincipal = screen.getByText("Finalizar");
    fireEvent.click(botaoPrincipal);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/Deseja continuar\?/i)).not.toBeInTheDocument();
  });

  it("deve chamar onSubmit diretamente se for reposição total mas a prop 'reposicao' for true", () => {
    const props = {
      ...defaultProps,
      guia: { status: "Reposição total" },
      reposicao: true,
    };
    renderComponent(props);

    fireEvent.click(screen.getByText("Finalizar"));
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/Deseja continuar\?/i)).not.toBeInTheDocument();
  });

  describe("Interação com Modal", () => {
    const propsComModal = {
      ...defaultProps,
      guia: { status: "Reposição parcial" },
      reposicao: false,
    };

    it("deve abrir o modal ao clicar no botão se o status for reposição e não houver flag de reposicao", () => {
      renderComponent(propsComModal);
      fireEvent.click(screen.getByText("Finalizar"));
      expect(
        screen.getByText(/registro de reposição será apagado/i),
      ).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("deve fechar o modal e NÃO submeter ao clicar em 'Não'", async () => {
      renderComponent(propsComModal);
      fireEvent.click(screen.getByText("Finalizar"));
      expect(
        screen.getByText(/registro de reposição será apagado/i),
      ).toBeInTheDocument();
      const botaoNao = screen.getByText("Não");
      fireEvent.click(botaoNao);
      expect(mockOnSubmit).not.toHaveBeenCalled();
      await waitFor(() => {
        expect(
          screen.queryByText(/registro de reposição será apagado/i),
        ).not.toBeInTheDocument();
      });
    });

    it("deve chamar onSubmit ao clicar em 'Sim' dentro do modal", () => {
      renderComponent(propsComModal);
      fireEvent.click(screen.getByText("Finalizar"));
      const botaoSim = screen.getByText("Sim");
      fireEvent.click(botaoSim);
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });

  it("deve respeitar a propriedade disabled do botão", () => {
    const propsDesabilitado = {
      ...defaultProps,
      disabled: true,
    };
    renderComponent(propsDesabilitado);
    const botao = screen.getByRole("button", { name: /finalizar/i });
    expect(botao).toBeDisabled();
  });
});
