import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useParams } from "react-router-dom";
import EdicaoCategoria from "../CadastroCategoria/Edicao";
import {
  atualizarCategoriaFaq,
  buscarCategoriaFaq,
} from "src/services/faq.service";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

jest.mock("src/services/faq.service", () => ({
  atualizarCategoriaFaq: jest.fn(),
  buscarCategoriaFaq: jest.fn(),
}));

jest.mock("src/components/Shareable/Toast/dialogs", () => ({
  toastError: jest.fn(),
  toastSuccess: jest.fn(),
}));

jest.mock("src/components/Shareable/Page/PageNoSidebar", () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

jest.mock("src/components/Shareable/Botao", () => ({
  __esModule: true,
  default: ({ texto, onClick, disabled }) => (
    <button
      type="button"
      onClick={onClick}
      data-disabled={disabled ? "true" : "false"}
    >
      {texto}
    </button>
  ),
}));

jest.mock("src/components/Shareable/Input/InputText", () => ({
  __esModule: true,
  default: ({ label, name, required, valorInicial, inputOnChange }) => (
    <label>
      <span>{label}</span>

      <input
        aria-label={label}
        name={name}
        required={required}
        value={valorInicial}
        onChange={inputOnChange}
      />
    </label>
  ),
}));

jest.mock("src/components/Shareable/SigpaeLogoLoader", () => ({
  SigpaeLogoLoader: () => <div>Carregando...</div>,
}));

jest.mock("src/components/Shareable/ModalGenerico", () => ({
  __esModule: true,
  default: ({ show, titulo, texto, textoBotaoSim, handleSim }) => {
    if (!show) {
      return null;
    }

    return (
      <div role="dialog">
        <h2>{titulo}</h2>

        <div>{texto}</div>

        <button type="button" onClick={handleSim}>
          {textoBotaoSim}
        </button>
      </div>
    );
  },
}));

const UUID_CATEGORIA = "11111111-1111-1111-1111-111111111111";

describe("Página de edição de categoria", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useParams.mockReturnValue({
      uuid: UUID_CATEGORIA,
    });

    buscarCategoriaFaq.mockResolvedValue({
      data: {
        nome: "Dieta Especial",
      },
    });
  });

  it("deve exibir erro quando não for possível carregar a categoria", async () => {
    buscarCategoriaFaq.mockRejectedValue(
      new Error("Erro ao carregar categoria"),
    );

    render(<EdicaoCategoria />);

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith(
        "Houve um erro ao carregar a categoria",
      );
    });

    expect(screen.queryByText("Carregando...")).not.toBeInTheDocument();
  });

  it("deve manter salvar alterações desabilitado enquanto o nome não for alterado", async () => {
    render(<EdicaoCategoria />);

    await screen.findByDisplayValue("Dieta Especial");

    const botaoSalvar = screen.getByRole("button", {
      name: "Salvar Alterações",
    });

    expect(botaoSalvar).toHaveAttribute("data-disabled", "true");

    fireEvent.click(botaoSalvar);

    expect(atualizarCategoriaFaq).not.toHaveBeenCalled();
  });

  it("deve restaurar o nome original ao cancelar a edição", async () => {
    render(<EdicaoCategoria />);

    const campoNome = await screen.findByRole("textbox", {
      name: "Nome da Categoria",
    });

    fireEvent.change(campoNome, {
      target: {
        value: "Categoria Alterada",
      },
    });

    expect(campoNome).toHaveValue("Categoria Alterada");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Cancelar",
      }),
    );

    expect(campoNome).toHaveValue("Dieta Especial");

    expect(atualizarCategoriaFaq).not.toHaveBeenCalled();

    expect(
      screen.getByRole("button", {
        name: "Salvar Alterações",
      }),
    ).toHaveAttribute("data-disabled", "true");
  });

  it("deve atualizar a categoria com o nome normalizado", async () => {
    atualizarCategoriaFaq.mockResolvedValue({
      data: {
        nome: "Gestão de Alimentação",
      },
    });

    render(<EdicaoCategoria />);

    const campoNome = await screen.findByRole("textbox", {
      name: "Nome da Categoria",
    });

    fireEvent.change(campoNome, {
      target: {
        value: "  Gestão de Alimentação  ",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Salvar Alterações",
      }),
    );

    await waitFor(() => {
      expect(atualizarCategoriaFaq).toHaveBeenCalledWith(UUID_CATEGORIA, {
        nome: "Gestão de Alimentação",
      });
    });

    expect(toastSuccess).toHaveBeenCalledWith(
      "Categoria Atualizada com Sucesso!",
    );

    await waitFor(() => {
      expect(campoNome).toHaveValue("Gestão de Alimentação");
    });

    expect(
      screen.getByRole("button", {
        name: "Salvar Alterações",
      }),
    ).toHaveAttribute("data-disabled", "true");
  });

  it("deve fechar a modal de categoria duplicada ao clicar em OK", async () => {
    atualizarCategoriaFaq.mockRejectedValue({
      response: {
        status: 400,
        data: {
          nome: ["Já existe uma categoria com esse nome."],
        },
      },
    });

    render(<EdicaoCategoria />);

    const campoNome = await screen.findByRole("textbox", {
      name: "Nome da Categoria",
    });

    fireEvent.change(campoNome, {
      target: {
        value: "Gestão de Produto",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Salvar Alterações",
      }),
    );

    await screen.findByRole("dialog");

    fireEvent.click(
      screen.getByRole("button", {
        name: "OK",
      }),
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
