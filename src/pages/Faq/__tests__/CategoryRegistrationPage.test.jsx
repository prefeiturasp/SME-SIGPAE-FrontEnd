import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import { createFaqCategory } from "src/services/faq.service";
import CategoryRegistrationPage from "../CategoryRegistrationPage";

jest.mock("src/services/faq.service", () => ({
  createFaqCategory: jest.fn(),
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

describe("CategoryRegistrationPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza os elementos da tela de cadastro", () => {
    render(<CategoryRegistrationPage />);

    expect(
      screen.getByRole("heading", {
        name: "Cadastrar Categoria",
      }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Nome da Categoria")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Cancelar" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Cadastrar Categoria",
      }),
    ).toBeInTheDocument();
  });

  it("mantém o botão de cadastro desabilitado com o campo vazio", () => {
    render(<CategoryRegistrationPage />);

    expect(
      screen.getByRole("button", {
        name: "Cadastrar Categoria",
      }),
    ).toBeDisabled();
  });

  it("habilita o botão após informar o nome da categoria", async () => {
    const user = userEvent.setup();

    render(<CategoryRegistrationPage />);

    await user.type(
      screen.getByLabelText("Nome da Categoria"),
      "Alimentação Escolar",
    );

    expect(
      screen.getByRole("button", {
        name: "Cadastrar Categoria",
      }),
    ).toBeEnabled();
  });

  it("não envia o formulário quando o nome contém somente espaços", () => {
    render(<CategoryRegistrationPage />);

    const input = screen.getByLabelText("Nome da Categoria");
    const form = input.closest("form");

    fireEvent.change(input, {
      target: {
        value: "   ",
      },
    });

    fireEvent.submit(form);

    expect(createFaqCategory).not.toHaveBeenCalled();
  });

  it("envia o nome sem espaços externos e limpa o campo após o sucesso", async () => {
    const user = userEvent.setup();

    createFaqCategory.mockResolvedValue({
      status: 201,
      data: {
        nome: "Alimentação Escolar",
      },
    });

    render(<CategoryRegistrationPage />);

    const input = screen.getByLabelText("Nome da Categoria");

    await user.type(input, "  Alimentação Escolar  ");

    await user.click(
      screen.getByRole("button", {
        name: "Cadastrar Categoria",
      }),
    );

    await waitFor(() => {
      expect(createFaqCategory).toHaveBeenCalledWith({
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

    render(<CategoryRegistrationPage />);

    const input = screen.getByLabelText("Nome da Categoria");

    await user.type(input, "Gestão de Produtos");

    await user.click(
      screen.getByRole("button", {
        name: "Cancelar",
      }),
    );

    expect(input).toHaveValue("");
    expect(createFaqCategory).not.toHaveBeenCalled();
  });

  it("exibe o modal ao tentar cadastrar uma categoria duplicada", async () => {
    const user = userEvent.setup();

    createFaqCategory.mockRejectedValue({
      response: {
        status: 400,
        data: {
          nome: [MENSAGEM_CATEGORIA_DUPLICADA],
        },
      },
    });

    render(<CategoryRegistrationPage />);

    const input = screen.getByLabelText("Nome da Categoria");

    await user.type(input, "Alimentação Escolar");

    await user.click(
      screen.getByRole("button", {
        name: "Cadastrar Categoria",
      }),
    );

    expect(
      await screen.findByRole("dialog", {
        name: "Cadastrar Categoria",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText(MENSAGEM_CATEGORIA_DUPLICADA)).toBeInTheDocument();

    expect(input).toHaveValue("Alimentação Escolar");
    expect(toastError).not.toHaveBeenCalled();
  });

  it("fecha o modal de categoria duplicada ao clicar em OK", async () => {
    const user = userEvent.setup();

    createFaqCategory.mockRejectedValue({
      response: {
        status: 400,
        data: {
          nome: [MENSAGEM_CATEGORIA_DUPLICADA],
        },
      },
    });

    render(<CategoryRegistrationPage />);

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

    createFaqCategory.mockRejectedValue({
      response: {
        status: 500,
        data: {
          detail: "Erro interno do servidor.",
        },
      },
    });

    render(<CategoryRegistrationPage />);

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
