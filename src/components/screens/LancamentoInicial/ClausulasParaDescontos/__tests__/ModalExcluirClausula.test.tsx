import "@testing-library/jest-dom";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { ModalExcluirClausula } from "../components/ModalExcluirClausula";

jest.mock("src/components/Shareable/Botao", () => ({
  __esModule: true,
  default: ({ texto, onClick, style, className, type, disabled }: any) => (
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

describe("Componente ModalExcluirClausula", () => {
  const mockHandleClose = jest.fn();
  const mockHandleConfirm = jest.fn();
  const uuid = "uuid-teste-123";

  const renderModalExcluirClausula = (
    props: Partial<React.ComponentProps<typeof ModalExcluirClausula>> = {},
  ) => {
    return render(
      <ModalExcluirClausula
        uuid={uuid}
        show={true}
        handleClose={mockHandleClose}
        handleConfirm={mockHandleConfirm}
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
    renderModalExcluirClausula();

    expect(screen.getByText("Excluir Cláusula")).toBeInTheDocument();
    expect(
      screen.getByText(/Você confirma a exclusão da cláusula selecionada\?/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Não será possível aplicar o desconto indicado em novas medições\./i,
      ),
    ).toBeInTheDocument();

    expect(screen.getByText("Não")).toBeInTheDocument();
    expect(screen.getByText("Sim")).toBeInTheDocument();
  });

  it("deve chamar handleClose ao clicar no botão Não", () => {
    renderModalExcluirClausula();

    const botaoNao = screen.getByText("Não");
    fireEvent.click(botaoNao);

    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  it("deve chamar handleConfirm com o uuid ao clicar no botão Sim", () => {
    renderModalExcluirClausula();

    const botaoSim = screen.getByText("Sim");
    fireEvent.click(botaoSim);

    expect(mockHandleConfirm).toHaveBeenCalledTimes(1);
    expect(mockHandleConfirm).toHaveBeenCalledWith(uuid);
  });

  it("deve desabilitar o botão Sim quando carregando for true", () => {
    renderModalExcluirClausula({ carregando: true });

    const botaoSim = screen.getByText("Sim");
    expect(botaoSim).toBeDisabled();
  });

  it("deve deixar o botão Sim habilitado quando carregando não é passado (default false)", () => {
    renderModalExcluirClausula();

    const botaoSim = screen.getByText("Sim");
    expect(botaoSim).not.toBeDisabled();
  });

  it("não deve exibir o modal quando show for false", () => {
    render(
      <ModalExcluirClausula
        uuid={uuid}
        show={false}
        handleClose={mockHandleClose}
        handleConfirm={mockHandleConfirm}
      />,
    );

    expect(screen.queryByText("Excluir Cláusula")).not.toBeInTheDocument();
  });
});
