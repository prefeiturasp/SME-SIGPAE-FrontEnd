import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ModalEnviarSolicitacao from "src/components/screens/PreRecebimento/AlterarCronograma/components/Modals/ModalEnviarSolicitacao";
const mockHandleClose = jest.fn();
const mockHandleSim = jest.fn();

const renderComponent = (show, loading) => {
  return render(
    <ModalEnviarSolicitacao
      show={show}
      handleClose={mockHandleClose}
      handleSim={mockHandleSim}
      loading={loading}
    />,
  );
};

describe("Teste do componente ModalEnviarSolicitacao", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o título e as mensagens de confirmação corretamente", () => {
    renderComponent(true, false);
    expect(
      screen.getByText(/Solicitar alteração no cronograma/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /A sua solicitação de alteração de cronograma será enviada/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/será enviada para a CODAE/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Você confirma o envio da solicitação/i),
    ).toBeInTheDocument();
  });

  it("deve exibir o feedback de carregamento quando a prop loading for verdadeira", () => {
    renderComponent(true, true);
    expect(screen.getByText(/Carregando\.\.\./i)).toBeInTheDocument();
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

  it("deve chamar handleClose ao clicar no botão 'X' do cabeçalho", () => {
    renderComponent(true, false);
    const btnClose = screen.getByLabelText(/close/i);
    fireEvent.click(btnClose);

    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });
});
