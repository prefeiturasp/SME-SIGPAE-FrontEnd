import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { ModalSalvarEdicao } from "../../components/ModalSalvarEdicao";

describe("Testes de comportamentos componente - ModalSalvarEdicao", () => {
  const handleClose = jest.fn();
  const salvar = jest.fn();

  const values = {
    categoria: "categoria_teste",
    tipo_ocorrencia: "tipo_teste",
    datas: ["10/09/2026"],
    ocorrencias: [],
    solicitacao_medicao_inicial: "123e4567-e89b-42d3-a456-426614174000",
  };

  const setup = (show = true) =>
    render(
      <MemoryRouter>
        <ModalSalvarEdicao
          show={show}
          handleClose={handleClose}
          salvar={salvar}
          values={values}
        />
      </MemoryRouter>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o título e as mensagens do modal", () => {
    setup(true);

    expect(screen.getByText("Salvar Edição da Ocorrência")).toBeInTheDocument();
    expect(
      screen.getByText(/Deseja salvar as alterações da ocorrência\?/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Você ainda poderá editar o registro até o envio da Medição Inicial/i,
      ),
    ).toBeInTheDocument();
  });

  it("não deve renderizar o modal quando show = false", () => {
    setup(false);

    expect(
      screen.queryByText("Salvar Edição da Ocorrência"),
    ).not.toBeInTheDocument();
  });

  it("deve fechar o modal ao clicar no botão de fechar", () => {
    setup(true);

    fireEvent.click(screen.getByRole("button", { name: /close/i }));

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(salvar).not.toHaveBeenCalled();
  });

  it("deve fechar o modal sem salvar ao clicar em 'Não'", () => {
    setup(true);

    fireEvent.click(screen.getByRole("button", { name: /Não/i }));

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(salvar).not.toHaveBeenCalled();
  });

  it("deve salvar e fechar o modal ao clicar em 'Sim'", async () => {
    salvar.mockResolvedValue();

    setup(true);

    fireEvent.click(screen.getByRole("button", { name: /Sim/i }));

    await waitFor(() => {
      expect(salvar).toHaveBeenCalledWith(values);
    });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
