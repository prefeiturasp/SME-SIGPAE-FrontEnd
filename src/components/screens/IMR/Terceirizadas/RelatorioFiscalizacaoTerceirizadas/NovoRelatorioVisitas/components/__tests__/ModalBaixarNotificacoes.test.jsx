import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalBaixarNotificaoces } from "src/components/screens/IMR/Terceirizadas/RelatorioFiscalizacaoTerceirizadas/NovoRelatorioVisitas/components/ModalBaixarNotificacoes";

const mockHandleClose = jest.fn();
const mockSalvarEBaixar = jest.fn().mockResolvedValue(undefined);
jest.mock("src/components/Shareable/Botao", () => {
  return ({ texto, onClick, type }) => (
    <button type={type} onClick={onClick}>
      {texto}
    </button>
  );
});

const renderComponent = () => {
  return render(
    <ModalBaixarNotificaoces
      show={true}
      handleClose={mockHandleClose}
      salvarRascunhoEBaixarNotificacoes={mockSalvarEBaixar}
    />,
  );
};

describe("Teste do componente ModalBaixarNotificaoces", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve exibir o título e a mensagem de confirmação corretamente", () => {
    renderComponent();
    expect(
      screen.getByText(/Salvar Relatório e Baixar Notificações/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Deseja salvar as informações inseridas no relatório/i),
    ).toBeInTheDocument();
  });

  it("deve chamar handleClose ao clicar no botão 'Não'", () => {
    renderComponent();
    const btnNao = screen.getByRole("button", { name: /não/i });
    fireEvent.click(btnNao);

    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  it("deve chamar salvarRascunhoEBaixarNotificacoes ao clicar no botão 'Sim'", () => {
    renderComponent();
    const btnSim = screen.getByRole("button", { name: /sim/i });
    fireEvent.click(btnSim);

    expect(mockSalvarEBaixar).toHaveBeenCalledTimes(1);
  });

  it("deve chamar handleClose ao clicar no botão de fechar (X) do header", () => {
    renderComponent();
    const btnClose = screen.getByLabelText(/close/i);
    fireEvent.click(btnClose);
    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });
});
