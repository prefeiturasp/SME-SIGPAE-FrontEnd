import React from "react";
import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import {
  getNomesUnicosEditais,
  getNomesUnicosFabricantes,
  getNomesUnicosMarcas,
  getNomesUnicosProdutos,
} from "src/services/produto.service";

import FormBuscaProduto from "../../FormBuscaProduto";

jest.mock("antd", () => {
  const React = require("react");

  return {
    Row: ({ children }) =>
      React.createElement(
        "div",
        {
          "data-testid": "row",
        },
        children,
      ),
    Col: ({ children, md, lg }) =>
      React.createElement(
        "div",
        {
          "data-testid": "col",
          "data-md": md,
          "data-lg": lg,
        },
        children,
      ),
  };
});

jest.mock("src/components/Shareable/AutoCompleteField/unaccent", () => {
  const React = require("react");

  return {
    __esModule: true,
    default: jest.fn(({ input, label, placeholder, dataSource, className }) =>
      React.createElement(
        "label",
        null,
        label,
        React.createElement("input", {
          ...input,
          className,
          placeholder,
          "data-testid": `campo-${input.name}`,
          "data-source": JSON.stringify(dataSource || []),
        }),
      ),
    ),
  };
});

jest.mock("src/components/Shareable/SelectSelecione", () => {
  const React = require("react");

  return {
    __esModule: true,
    default: jest.fn(({ input, label, options }) =>
      React.createElement(
        "label",
        null,
        label,
        React.createElement(
          "select",
          {
            ...input,
            "data-testid": `campo-${input.name}`,
          },
          React.createElement(
            "option",
            {
              value: "",
            },
            "Selecione",
          ),
          options.map((option) =>
            React.createElement(
              "option",
              {
                key: option.uuid,
                value: option.uuid,
              },
              option.nome,
            ),
          ),
        ),
      ),
    ),
  };
});

jest.mock("src/components/Shareable/Botao", () => {
  const React = require("react");

  return {
    __esModule: true,
    default: jest.fn(({ texto, type, style, className, disabled, onClick }) =>
      React.createElement(
        "button",
        {
          type,
          className,
          disabled,
          onClick,
          "data-style": style,
        },
        texto,
      ),
    ),
  };
});

jest.mock("src/services/produto.service", () => ({
  getNomesUnicosProdutos: jest.fn(),
  getNomesUnicosMarcas: jest.fn(),
  getNomesUnicosFabricantes: jest.fn(),
  getNomesUnicosEditais: jest.fn(),
}));

const produtosMock = ["Arroz", "Feijão"];
const marcasMock = ["Marca A", "Marca B"];
const fabricantesMock = ["Fabricante A", "Fabricante B"];
const editaisMock = ["Edital 001", "Edital 002"];

const configurarServicos = () => {
  getNomesUnicosProdutos.mockResolvedValue({
    data: {
      results: produtosMock,
    },
  });

  getNomesUnicosMarcas.mockResolvedValue({
    data: {
      results: marcasMock,
    },
  });

  getNomesUnicosFabricantes.mockResolvedValue({
    data: {
      results: fabricantesMock,
    },
  });

  getNomesUnicosEditais.mockResolvedValue({
    data: {
      results: editaisMock,
    },
  });
};

const renderizarComponente = ({
  onSubmit = jest.fn(),
  exibirBotaoVoltar = false,
  exibirStatus = true,
} = {}) => {
  render(
    <FormBuscaProduto
      onSubmit={onSubmit}
      exibirBotaoVoltar={exibirBotaoVoltar}
      exibirStatus={exibirStatus}
    />,
  );

  return {
    onSubmit,
  };
};

const aguardarCarregamentoDosDados = async () => {
  await waitFor(() => {
    expect(screen.getByTestId("campo-nome_produto")).toHaveAttribute(
      "data-source",
      JSON.stringify(produtosMock),
    );
  });
};

const criarPromessaControlada = () => {
  let resolver;

  const promise = new Promise((resolve) => {
    resolver = resolve;
  });

  return {
    promise,
    resolver,
  };
};

describe("FormBuscaProduto", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    configurarServicos();
  });

  it("carrega os produtos, marcas, fabricantes e editais ao montar o formulário", async () => {
    renderizarComponente();

    expect(getNomesUnicosProdutos).toHaveBeenCalledTimes(1);
    expect(getNomesUnicosMarcas).toHaveBeenCalledTimes(1);
    expect(getNomesUnicosFabricantes).toHaveBeenCalledTimes(1);
    expect(getNomesUnicosEditais).toHaveBeenCalledTimes(1);

    await aguardarCarregamentoDosDados();

    expect(screen.getByTestId("campo-nome_produto")).toHaveAttribute(
      "data-source",
      JSON.stringify(produtosMock),
    );

    expect(screen.getByTestId("campo-nome_marca")).toHaveAttribute(
      "data-source",
      JSON.stringify(marcasMock),
    );

    expect(screen.getByTestId("campo-nome_fabricante")).toHaveAttribute(
      "data-source",
      JSON.stringify(fabricantesMock),
    );

    expect(screen.getByTestId("campo-nome_edital")).toHaveAttribute(
      "data-source",
      JSON.stringify(editaisMock),
    );
  });

  it("renderiza os campos e o seletor de status por padrão", async () => {
    renderizarComponente();

    await aguardarCarregamentoDosDados();

    expect(screen.getByLabelText("Nome do Produto")).toHaveAttribute(
      "placeholder",
      "Digite nome do produto",
    );

    expect(screen.getByLabelText("Edital")).toHaveAttribute(
      "placeholder",
      "Digite edital do produto",
    );

    expect(screen.getByLabelText("Marca do Produto")).toHaveAttribute(
      "placeholder",
      "Digite marca do produto",
    );

    expect(screen.getByLabelText("Fabricante do Produto")).toHaveAttribute(
      "placeholder",
      "Digite fabricante do produto",
    );

    expect(screen.getByLabelText("Status")).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Ativo",
      }),
    ).toHaveValue("ativo");

    expect(
      screen.getByRole("option", {
        name: "Suspenso",
      }),
    ).toHaveValue("suspenso");

    expect(
      screen.getByRole("button", {
        name: "Consultar",
      }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: "Limpar Filtro",
      }),
    ).not.toBeInTheDocument();
  });

  it("envia os valores preenchidos ao consultar", async () => {
    const onSubmit = jest.fn();

    renderizarComponente({
      onSubmit,
    });

    await aguardarCarregamentoDosDados();

    fireEvent.change(screen.getByLabelText("Nome do Produto"), {
      target: {
        value: "Arroz",
      },
    });

    fireEvent.change(screen.getByLabelText("Edital"), {
      target: {
        value: "Edital 001",
      },
    });

    fireEvent.change(screen.getByLabelText("Marca do Produto"), {
      target: {
        value: "Marca A",
      },
    });

    fireEvent.change(screen.getByLabelText("Fabricante do Produto"), {
      target: {
        value: "Fabricante A",
      },
    });

    fireEvent.change(screen.getByLabelText("Status"), {
      target: {
        value: "ativo",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Consultar",
      }),
    );

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onSubmit.mock.calls[0][0]).toEqual({
      nome_produto: "Arroz",
      nome_edital: "Edital 001",
      nome_marca: "Marca A",
      nome_fabricante: "Fabricante A",
      status: "ativo",
    });
  });

  it("exibe e executa a limpeza dos filtros", async () => {
    const onSubmit = jest.fn();

    renderizarComponente({
      onSubmit,
      exibirBotaoVoltar: true,
    });

    await aguardarCarregamentoDosDados();

    fireEvent.change(screen.getByLabelText("Nome do Produto"), {
      target: {
        value: "Arroz",
      },
    });

    fireEvent.change(screen.getByLabelText("Marca do Produto"), {
      target: {
        value: "Marca A",
      },
    });

    fireEvent.change(screen.getByLabelText("Status"), {
      target: {
        value: "suspenso",
      },
    });

    expect(screen.getByLabelText("Nome do Produto")).toHaveValue("Arroz");

    expect(screen.getByLabelText("Marca do Produto")).toHaveValue("Marca A");

    expect(screen.getByLabelText("Status")).toHaveValue("suspenso");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Limpar Filtro",
      }),
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Nome do Produto")).toHaveValue("");

      expect(screen.getByLabelText("Marca do Produto")).toHaveValue("");

      expect(screen.getByLabelText("Status")).toHaveValue("");
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("não exibe o campo de status quando exibirStatus é falso", async () => {
    const onSubmit = jest.fn();

    renderizarComponente({
      onSubmit,
      exibirStatus: false,
    });

    await aguardarCarregamentoDosDados();

    expect(screen.queryByLabelText("Status")).not.toBeInTheDocument();

    expect(
      screen.queryByRole("option", {
        name: "Ativo",
      }),
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Nome do Produto"), {
      target: {
        value: "Feijão",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Consultar",
      }),
    );

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onSubmit.mock.calls[0][0]).toEqual({
      nome_produto: "Feijão",
    });
  });

  it("desabilita os botões enquanto o formulário está sendo enviado", async () => {
    const envioControlado = criarPromessaControlada();

    const onSubmit = jest.fn(() => envioControlado.promise);

    renderizarComponente({
      onSubmit,
      exibirBotaoVoltar: true,
    });

    await aguardarCarregamentoDosDados();

    const botaoConsultar = screen.getByRole("button", {
      name: "Consultar",
    });

    const botaoLimpar = screen.getByRole("button", {
      name: "Limpar Filtro",
    });

    fireEvent.click(botaoConsultar);

    await waitFor(() => {
      expect(botaoConsultar).toBeDisabled();
      expect(botaoLimpar).toBeDisabled();
    });

    await act(async () => {
      envioControlado.resolver();
    });

    await waitFor(() => {
      expect(botaoConsultar).toBeEnabled();
      expect(botaoLimpar).toBeEnabled();
    });
  });
});
