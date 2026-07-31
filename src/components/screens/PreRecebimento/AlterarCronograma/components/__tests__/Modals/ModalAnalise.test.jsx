import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import ModalAnaliseAlteracao from "../../Modals/ModalAnalise";

describe("Teste de comportamentos do componente Alterar Cronogramar - ModalAnalise", () => {
  const mockHandleClose = jest.fn();
  const mockSetShow = jest.fn();
  const mockHandleSim = jest.fn();

  const defaultProps = {
    show: true,
    setShow: mockSetShow,
    handleClose: mockHandleClose,
    loading: false,
    handleSim: mockHandleSim,
  };

  const setup = async (props = {}) => {
    await act(async () => {
      render(<ModalAnaliseAlteracao {...defaultProps} {...props} />);
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o modal corretamente", async () => {
    await setup();

    expect(screen.getByText("Análise da alteração")).toBeInTheDocument();

    expect(
      screen.getByText("Insira sua análise da Solicitação de Alteração"),
    ).toBeInTheDocument();

    expect(screen.getByText("Voltar")).toBeInTheDocument();
    expect(screen.getByText("Enviar")).toBeInTheDocument();
  });

  it("deve chamar handleClose ao clicar em Voltar", async () => {
    await setup();

    fireEvent.click(screen.getByText("Voltar"));

    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  it("deve manter o botão Enviar desabilitado quando não houver justificativa", async () => {
    await setup();

    const botao = screen.getByText("Enviar").closest("button");
    expect(botao).toBeDisabled();
  });

  it("deve habilitar o botão Enviar quando informar justificativa", async () => {
    await setup();

    fireEvent.change(screen.getByTestId("justificativa_cronograma"), {
      target: {
        value: "Justificativa teste",
      },
    });

    expect(screen.getByText("Enviar")).not.toBeDisabled();
  });

  it("deve abrir modal de confirmação ao clicar em Enviar", async () => {
    await setup();

    fireEvent.change(screen.getByTestId("justificativa_cronograma"), {
      target: {
        value: "Justificativa teste",
      },
    });

    fireEvent.click(screen.getByText("Enviar"));

    expect(mockSetShow).toHaveBeenCalledWith(false);

    expect(
      screen.getByText("Confirmar envio para Abastecimento"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Deseja enviar a Análise da Solicitação de Alteração de Cronograma/i,
      ),
    ).toBeInTheDocument();
  });

  it("deve fechar o modal de confirmação ao clicar em Não", async () => {
    await setup();

    fireEvent.change(screen.getByTestId("justificativa_cronograma"), {
      target: {
        value: "Justificativa teste",
      },
    });

    fireEvent.click(screen.getByText("Enviar"));

    fireEvent.click(screen.getByText("Não"));

    await waitFor(() => {
      expect(
        screen.queryByText("Confirmar envio para Abastecimento"),
      ).not.toBeInTheDocument();
    });
  });

  it("deve chamar handleSim ao confirmar envio", async () => {
    await setup();

    fireEvent.change(screen.getByTestId("justificativa_cronograma"), {
      target: {
        value: "Minha análise",
      },
    });

    fireEvent.click(screen.getByText("Enviar"));

    fireEvent.click(screen.getByText("Sim"));

    await waitFor(() => {
      expect(mockHandleSim).toHaveBeenCalledWith({
        justificativa_cronograma: "Minha análise",
      });
    });
  });

  it("não deve renderizar o modal quando show for false", async () => {
    await setup({
      show: false,
    });

    expect(screen.queryByText("Análise da alteração")).not.toBeInTheDocument();
  });
});
