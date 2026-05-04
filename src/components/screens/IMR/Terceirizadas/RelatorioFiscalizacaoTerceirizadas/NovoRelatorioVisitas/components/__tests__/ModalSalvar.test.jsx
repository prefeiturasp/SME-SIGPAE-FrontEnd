import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ModalSalvar } from "../../components/ModalSalvar";

describe("Testes de comportamentos componente - Modal Salvar (Novo Relatório de Visitas)", () => {
  const handleClose = jest.fn();
  const salvar = jest.fn();

  const values = {
    campo1: "valor",
  };

  const escolaSelecionada = {
    label: "ESCOLA CEI CEU",
    value: "9f1c2a7e-3b44-4d91-8a6e-5c2f7b9e1a3d",
  };

  const setup = (show = true) =>
    render(
      <ModalSalvar
        show={show}
        handleClose={handleClose}
        salvar={salvar}
        values={values}
        escolaSelecionada={escolaSelecionada}
      />,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o título e o texto corretamente quando show = true", () => {
    setup(true);

    expect(
      screen.getByText("Enviar Relatório de Fiscalização"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Deseja enviar seu relatório de fiscalização/i),
    ).toBeInTheDocument();

    expect(screen.getByText("ESCOLA CEI CEU")).toBeInTheDocument();
  });

  it("não deve renderizar o modal quando show = false", () => {
    setup(false);

    expect(
      screen.queryByText("Enviar Relatório de Fiscalização"),
    ).not.toBeInTheDocument();
  });

  it("deve fechar o modal ao clicar no botão de fechar", () => {
    setup(true);

    const botaoFechar = screen.getByRole("button", { name: /close/i });

    fireEvent.click(botaoFechar);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("deve clicar em 'Não' e chamar handleClose", () => {
    setup(true);

    const botaoNao = screen.getByRole("button", { name: /Não/i });

    fireEvent.click(botaoNao);

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(salvar).not.toHaveBeenCalled();
  });

  it("deve clicar em 'Sim', chamar salvar com values e depois fechar o modal", async () => {
    salvar.mockResolvedValue();

    setup(true);

    const botaoSim = screen.getByRole("button", { name: /Sim/i });

    fireEvent.click(botaoSim);

    await waitFor(() => {
      expect(salvar).toHaveBeenCalledWith(values);
    });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
