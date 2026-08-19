import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { criarCategoriaFaq } from "src/services/faq.service";
import CadastroCategoria from "src/components/screens/Faq/Categorias/Cadastro";

jest.mock("src/services/faq.service", () => ({
  criarCategoriaFaq: jest.fn(),
}));

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
  toastSuccess: jest.fn(),
}));

jest.mock(
  "src/components/Shareable/Page/PageNoSidebar",
  () =>
    ({ children, titulo }) => (
      <main>
        <h1>{titulo}</h1>
        {children}
      </main>
    ),
);

jest.mock("src/components/Shareable/Breadcrumb", () => () => (
  <div data-testid="breadcrumb" />
));

jest.mock(
  "src/components/Shareable/Input/InputText",
  () =>
    ({ id, input, label, maxlength, placeholder, required }) => (
      <div>
        <label htmlFor={id}>{label}</label>

        <input
          id={id}
          name={input.name}
          value={input.value}
          onChange={input.onChange}
          maxLength={maxlength}
          placeholder={placeholder}
          required={required}
        />
      </div>
    ),
);

jest.mock(
  "src/components/Shareable/Botao",
  () =>
    ({ disabled, onClick, texto, type }) => (
      <button
        type={type === "submit" ? "submit" : "button"}
        disabled={disabled}
        onClick={onClick}
      >
        {texto}
      </button>
    ),
);

jest.mock(
  "src/components/Shareable/ModalGenerico",
  () =>
    ({ handleClose, handleSim, show, texto, textoBotaoSim, titulo }) => {
      if (!show) {
        return null;
      }

      return (
        <div role="dialog" aria-label={titulo}>
          <h2>{titulo}</h2>
          <div>{texto}</div>

          <button type="button" aria-label="Fechar modal" onClick={handleClose}>
            Fechar
          </button>

          <button type="button" onClick={handleSim}>
            {textoBotaoSim}
          </button>
        </div>
      );
    },
);

const MENSAGEM_CATEGORIA_DUPLICADA =
  "Não é possível cadastrar a categoria, pois já existe uma categoria " +
  "com esse nome. Altere o nome informado e tente novamente.";

describe("CadastroCategoria", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("não envia o formulário quando o nome contém somente espaços", () => {
    render(<CadastroCategoria />);

    const input = screen.getByLabelText("Nome da Categoria");
    const form = input.closest("form");

    fireEvent.change(input, {
      target: {
        value: "   ",
      },
    });

    fireEvent.submit(form);

    expect(criarCategoriaFaq).not.toHaveBeenCalled();
  });

  it("envia o nome sem espaços externos e limpa o campo após o sucesso", async () => {
    const user = userEvent.setup();

    criarCategoriaFaq.mockResolvedValue({
      status: 201,
      data: {
        nome: "Alimentação Escolar",
      },
    });

    render(<CadastroCategoria />);

    const input = screen.getByLabelText("Nome da Categoria");

    await user.type(input, "  Alimentação Escolar  ");

    await user.click(
      screen.getByRole("button", {
        name: "Cadastrar Categoria",
      }),
    );

    await waitFor(() => {
      expect(criarCategoriaFaq).toHaveBeenCalledWith({
        nome: "Alimentação Escolar",
      });
    });

    expect(toastSuccess).toHaveBeenCalledWith(
      "Categoria Cadastrada com Sucesso!",
    );

    expect(input).toHaveValue("");
  });

  it("limpa o campo ao clicar em Cancelar", async () => {
    const user = userEvent.setup();

    render(<CadastroCategoria />);

    const input = screen.getByLabelText("Nome da Categoria");

    await user.type(input, "Gestão de Produtos");

    await user.click(
      screen.getByRole("button", {
        name: "Cancelar",
      }),
    );

    expect(input).toHaveValue("");
    expect(criarCategoriaFaq).not.toHaveBeenCalled();
  });

  it("fecha o modal de categoria duplicada ao clicar em OK", async () => {
    const user = userEvent.setup();

    criarCategoriaFaq.mockRejectedValue({
      response: {
        status: 400,
        data: {
          nome: [MENSAGEM_CATEGORIA_DUPLICADA],
        },
      },
    });

    render(<CadastroCategoria />);

    await user.type(
      screen.getByLabelText("Nome da Categoria"),
      "Alimentação Escolar",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Cadastrar Categoria",
      }),
    );

    await screen.findByRole("dialog", {
      name: "Cadastrar Categoria",
    });

    await user.click(
      screen.getByRole("button", {
        name: "OK",
      }),
    );

    expect(
      screen.queryByRole("dialog", {
        name: "Cadastrar Categoria",
      }),
    ).not.toBeInTheDocument();
  });

  it("exibe toast para erros diferentes de categoria duplicada", async () => {
    const user = userEvent.setup();

    criarCategoriaFaq.mockRejectedValue({
      response: {
        status: 500,
        data: {
          detail: "Erro interno do servidor.",
        },
      },
    });

    render(<CadastroCategoria />);

    await user.type(
      screen.getByLabelText("Nome da Categoria"),
      "Gestão de Produtos",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Cadastrar Categoria",
      }),
    );

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        "Não foi possível cadastrar a categoria.",
      );
    });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
