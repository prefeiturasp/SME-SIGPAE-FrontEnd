import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import ModalAtivarInativar from "../index";
import { ativarInativarProduto } from "src/services/produto.service";
import {
  toastSuccess,
  toastError,
} from "src/components/Shareable/Toast/dialogs";

jest.mock("src/services/produto.service", () => ({
  ativarInativarProduto: jest.fn(),
}));

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastSuccess: jest.fn(),
  toastError: jest.fn(),
}));

describe("ModalAtivarInativar", () => {
  const mockCloseModal = jest.fn();
  const mockChangePage = jest.fn();
  const mockItemAtivo = {
    uuid: "123",
    ativo: true,
    nome: "Produto Teste",
  };
  const mockItemInativo = {
    uuid: "123",
    ativo: false,
    nome: "Produto Teste",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar corretamente para produto ativo", () => {
    render(
      <ModalAtivarInativar
        showModal={true}
        closeModal={mockCloseModal}
        item={mockItemAtivo}
        changePage={mockChangePage}
      />
    );

    expect(
      screen.getByText("Inativar produto vinculado ao edital")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Deseja inativar este produto vinculado ao edital?")
    ).toBeInTheDocument();
    expect(screen.getByText("Não")).toBeInTheDocument();
    expect(screen.getByText("Sim")).toBeInTheDocument();
  });

  it("deve renderizar corretamente para produto inativo", () => {
    render(
      <ModalAtivarInativar
        showModal={true}
        closeModal={mockCloseModal}
        item={mockItemInativo}
        changePage={mockChangePage}
      />
    );

    expect(
      screen.getByText("Ativar produto vinculado ao edital")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Deseja ativar este produto vinculado ao edital?")
    ).toBeInTheDocument();
  });

  it("deve fechar o modal quando clicar no botão Não", () => {
    render(
      <ModalAtivarInativar
        showModal={true}
        closeModal={mockCloseModal}
        item={mockItemAtivo}
        changePage={mockChangePage}
      />
    );

    fireEvent.click(screen.getByText("Não"));
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it("deve inativar produto com sucesso ao clicar em Sim", async () => {
    ativarInativarProduto.mockImplementation(() => Promise.resolve());

    render(
      <ModalAtivarInativar
        showModal={true}
        closeModal={mockCloseModal}
        item={mockItemAtivo}
        changePage={mockChangePage}
      />
    );

    await act(async () => {
      fireEvent.click(screen.getByText("Sim"));
    });

    expect(ativarInativarProduto).toHaveBeenCalledWith("123");
    expect(toastSuccess).toHaveBeenCalledWith("Produto inativado com sucesso");
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
    expect(mockChangePage).toHaveBeenCalledTimes(1);
  });

  it("deve ativar produto com sucesso ao clicar em Sim", async () => {
    ativarInativarProduto.mockImplementation(() => Promise.resolve());

    render(
      <ModalAtivarInativar
        showModal={true}
        closeModal={mockCloseModal}
        item={mockItemInativo}
        changePage={mockChangePage}
      />
    );

    await act(async () => {
      fireEvent.click(screen.getByText("Sim"));
    });

    expect(ativarInativarProduto).toHaveBeenCalledWith("123");
    expect(toastSuccess).toHaveBeenCalledWith("Produto ativado com sucesso");
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
    expect(mockChangePage).toHaveBeenCalledTimes(1);
  });

  it("deve mostrar erro quando a requisição falhar", async () => {
    const errorMessage = "Erro ao processar requisição";
    ativarInativarProduto.mockImplementation(() =>
      Promise.reject({
        response: {
          data: {
            detail: errorMessage,
          },
        },
      })
    );

    render(
      <ModalAtivarInativar
        showModal={true}
        closeModal={mockCloseModal}
        item={mockItemAtivo}
        changePage={mockChangePage}
      />
    );

    await act(async () => {
      fireEvent.click(screen.getByText("Sim"));
    });

    expect(ativarInativarProduto).toHaveBeenCalledWith("123");
    expect(toastError).toHaveBeenCalledWith(errorMessage);
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
    expect(mockChangePage).toHaveBeenCalledTimes(1);
  });
});
