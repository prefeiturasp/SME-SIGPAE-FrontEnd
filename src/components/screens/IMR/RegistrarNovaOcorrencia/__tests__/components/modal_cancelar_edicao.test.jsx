import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { ModalCancelarEdicao } from "../../components/ModalCancelarEdicao";

describe("Testes de comportamentos componente - ModalCancelarEdicao", () => {
  const handleClose = jest.fn();
  const confirmar = jest.fn();

  const setup = (show = true) =>
    render(
      <MemoryRouter>
        <ModalCancelarEdicao
          show={show}
          handleClose={handleClose}
          confirmar={confirmar}
        />
      </MemoryRouter>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o título e as mensagens do modal", () => {
    setup(true);

    expect(
      screen.getByText("Cancelar Edição da Ocorrência"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Deseja cancelar a edição da ocorrência\?/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/As informações editadas não serão salvas\./i),
    ).toBeInTheDocument();
  });

  it("não deve renderizar o modal quando show = false", () => {
    setup(false);

    expect(
      screen.queryByText("Cancelar Edição da Ocorrência"),
    ).not.toBeInTheDocument();
  });

  it("deve fechar o modal ao clicar no botão de fechar", () => {
    setup(true);

    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(confirmar).not.toHaveBeenCalled();
  });

  it("deve fechar o modal sem cancelar a edição ao clicar em 'Não'", () => {
    setup(true);

    fireEvent.click(screen.getByRole("button", { name: /Não/i }));

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(confirmar).not.toHaveBeenCalled();
  });

  it("deve confirmar o cancelamento ao clicar em 'Sim'", () => {
    setup(true);

    fireEvent.click(screen.getByRole("button", { name: /Sim/i }));

    expect(confirmar).toHaveBeenCalledTimes(1);
  });
});
