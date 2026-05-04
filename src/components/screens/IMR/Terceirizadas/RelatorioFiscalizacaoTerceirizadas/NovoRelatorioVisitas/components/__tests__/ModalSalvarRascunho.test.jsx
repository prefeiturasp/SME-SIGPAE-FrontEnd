import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ModalSalvarRascunho } from "../../components/ModalSalvarRascunho";

describe("Testes de comportamentos componente - ModalSalvarRascunho (Novo Relatório de Visitas)", () => {
  const handleClose = jest.fn();
  const salvarRascunho = jest.fn();

  const values = {
    campo1: "valor",
  };

  const escolaSelecionada = {
    label: "ESCOLA CEI CEU",
    value: "9f1c2a7e-3b44-4d91-8a6e-5c2f7b9e1a3d",
  };

  const renderComponent = (show = true) =>
    render(
      <ModalSalvarRascunho
        show={show}
        handleClose={handleClose}
        salvarRascunho={salvarRascunho}
        values={values}
        escolaSelecionada={escolaSelecionada}
      />,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o título e o texto corretamente quando show = true", () => {
    renderComponent(true);

    expect(screen.getByText("Salvar Rascunho")).toBeInTheDocument();

    expect(
      screen.getByText(/Deseja salvar o rascunho do relatório/i),
    ).toBeInTheDocument();

    expect(screen.getByText("ESCOLA CEI CEU")).toBeInTheDocument();
  });

  it("não deve renderizar o modal quando show = false", () => {
    renderComponent(false);

    expect(screen.queryByText("Salvar Rascunho")).not.toBeInTheDocument();
  });

  it("deve fechar o modal ao clicar no botão de fechar", () => {
    renderComponent(true);

    const botaoFechar = screen.getByRole("button", { name: /close/i });

    fireEvent.click(botaoFechar);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("deve clicar em 'Não' e chamar handleClose", () => {
    renderComponent(true);

    const botaoNao = screen.getByRole("button", { name: /Não/i });

    fireEvent.click(botaoNao);

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(salvarRascunho).not.toHaveBeenCalled();
  });

  it("deve clicar em 'Sim', chamar salvarRascunho com values e depois fechar o modal", async () => {
    salvarRascunho.mockResolvedValue();

    renderComponent(true);

    const botaoSim = screen.getByRole("button", { name: /Sim/i });

    fireEvent.click(botaoSim);

    await waitFor(() => {
      expect(salvarRascunho).toHaveBeenCalledWith(values);
    });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
