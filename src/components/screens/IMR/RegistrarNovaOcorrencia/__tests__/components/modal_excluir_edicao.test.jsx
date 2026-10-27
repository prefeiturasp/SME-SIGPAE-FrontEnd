import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { ModalExcluirEdicao } from "../../components/ModalExcluirEdicao";

describe("Testes de comportamentos componente - ModalExcluirEdicao", () => {
  const handleClose = jest.fn();
  const excluir = jest.fn();

  const setup = (show = true) =>
    render(
      <MemoryRouter>
        <ModalExcluirEdicao
          show={show}
          handleClose={handleClose}
          excluir={excluir}
        />
      </MemoryRouter>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o título e a mensagem do modal", () => {
    setup(true);

    expect(
      screen.getByText("Excluir Registro da Ocorrência"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Deseja excluir o registro da ocorrência\? As informações inseridas serão removidas e o registro excluído\./i,
      ),
    ).toBeInTheDocument();
  });

  it("não deve renderizar o modal quando show = false", () => {
    setup(false);

    expect(
      screen.queryByText("Excluir Registro da Ocorrência"),
    ).not.toBeInTheDocument();
  });

  it("deve fechar o modal ao clicar no botão de fechar", () => {
    setup(true);

    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(excluir).not.toHaveBeenCalled();
  });

  it("deve fechar o modal sem excluir ao clicar em 'Não'", () => {
    setup(true);

    fireEvent.click(screen.getByRole("button", { name: /Não/i }));

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(excluir).not.toHaveBeenCalled();
  });

  it("deve excluir e fechar o modal ao clicar em 'Sim'", async () => {
    excluir.mockResolvedValue();

    setup(true);

    fireEvent.click(screen.getByRole("button", { name: /Sim/i }));

    await waitFor(() => {
      expect(excluir).toHaveBeenCalledTimes(1);
    });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
