import "@testing-library/jest-dom";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import ModalExcluirVinculo from "../components/ModalDesvincular";

jest.mock("src/components/Shareable/Botao", () => ({
  __esModule: true,
  default: ({ texto, onClick, style, className, type, disabled }) => (
    <button
      onClick={onClick}
      data-style={style}
      data-type={type}
      className={className}
      disabled={disabled}
    >
      {texto}
    </button>
  ),
}));

describe("Componente ModalExcluirVinculo", () => {
  const mockHandleClose = jest.fn();
  const mockHandleSim = jest.fn();
  const mockGuia = {
    numero_guia: "123456",
    uuid: "uuid-teste",
  };

  const renderModalExcluirVinculo = (props = {}) => {
    return render(
      <ModalExcluirVinculo
        guia={mockGuia}
        handleClose={mockHandleClose}
        handleSim={mockHandleSim}
        {...props}
      />,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("deve exibir o modal com os textos e botões corretos", () => {
    renderModalExcluirVinculo();

    expect(screen.getAllByText(/Excluir Vínculo/i)[0]).toBeInTheDocument();

    expect(
      screen.getByText(
        /Deseja realmente excluir o vínculo da Guia Nº 123456\?/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
  });

  it("deve chamar handleClose ao clicar no botão Cancelar", () => {
    renderModalExcluirVinculo();

    const botaoCancelar = screen.getByText("Cancelar");
    fireEvent.click(botaoCancelar);

    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  it("deve chamar handleSim com a guia ao clicar no botão Excluir Vínculo", () => {
    renderModalExcluirVinculo();

    const elementos = screen.getAllByText(/Excluir Vínculo/i);

    const botaoExcluir = elementos.find((el) => el.tagName === "BUTTON");

    expect(botaoExcluir).toBeInTheDocument();

    fireEvent.click(botaoExcluir!);

    expect(mockHandleSim).toHaveBeenCalledTimes(1);
    expect(mockHandleSim).toHaveBeenCalledWith(mockGuia);
  });
});
