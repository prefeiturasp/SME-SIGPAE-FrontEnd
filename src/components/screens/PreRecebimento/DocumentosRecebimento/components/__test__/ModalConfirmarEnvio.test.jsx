import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ModalConfirmarEnvio from "src/components/screens/PreRecebimento/DocumentosRecebimento/components/ModalConfirmarEnvio/index.tsx";

const mockHandleClose = jest.fn();
const mockHandleSim = jest.fn();

const renderComponent = ({
  show = true,
  loading = false,
  correcao = false,
} = {}) => {
  return render(
    <ModalConfirmarEnvio
      show={show}
      handleClose={mockHandleClose}
      handleSim={mockHandleSim}
      loading={loading}
      correcao={correcao}
    />,
  );
};

describe("Teste do componente ModalConfirmarEnvio", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve exibir texto de 'documentos recebidos' quando correcao for false", () => {
    renderComponent({ correcao: false });
    expect(
      screen.getByText(/Deseja enviar os documentos recebidos/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/enviar as correções/i)).not.toBeInTheDocument();
  });

  it("deve exibir texto de 'correções' quando correcao for true", () => {
    renderComponent({ correcao: true });

    expect(
      screen.getByText(/Deseja enviar as correções para/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/documentos recebidos/i)).not.toBeInTheDocument();
  });

  it("deve renderizar o Spin de carregamento quando loading for true", () => {
    renderComponent({ loading: true });
    expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
  });

  it("deve chamar handleSim ao clicar no botão 'Sim'", () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /sim/i }));
    expect(mockHandleSim).toHaveBeenCalledTimes(1);
  });

  it("deve chamar handleClose ao clicar no botão 'Não'", () => {
    renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /não/i }));
    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });
});
