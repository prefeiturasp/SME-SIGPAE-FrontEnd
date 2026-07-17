import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import LabelResultadoDaBusca from "src/components/Shareable/LabelResultadoDaBusca";
import { Paginacao } from "src/components/Shareable/Paginacao";
import { ATIVACAO_DE_PRODUTO, GESTAO_PRODUTO } from "src/configs/constants";
import { deepEqual, gerarParametrosConsulta } from "src/helpers/utilities";
import { getProdutosListagem } from "src/services/produto.service";

import FormBuscaProduto from "../FormBuscaProduto";
import AtivacaoSuspencaoProduto from "../index";

jest.mock("antd", () => {
  const React = require("react");

  return {
    Spin: ({ children, spinning, tip }) =>
      React.createElement(
        "div",
        {
          "data-testid": "spin",
          "data-spinning": String(spinning),
          "data-tip": tip,
        },
        children,
      ),
  };
});

jest.mock("../FormBuscaProduto", () => {
  const React = require("react");

  const FormBuscaProdutoMock = jest.fn(({ onSubmit }) =>
    React.createElement(
      "div",
      {
        "data-testid": "form-busca-produto",
      },
      React.createElement(
        "button",
        {
          type: "button",
          "data-testid": "buscar-ativos",
          onClick: () =>
            onSubmit({
              nome_produto: "Arroz",
              status: "ativo",
            }),
        },
        "Buscar ativos",
      ),
      React.createElement(
        "button",
        {
          type: "button",
          "data-testid": "buscar-suspensos",
          onClick: () =>
            onSubmit({
              nome_produto: "Feijão",
              status: "suspenso",
            }),
        },
        "Buscar suspensos",
      ),
      React.createElement(
        "button",
        {
          type: "button",
          "data-testid": "buscar-todos",
          onClick: () =>
            onSubmit({
              nome_produto: "Macarrão",
              status: "",
            }),
        },
        "Buscar todos",
      ),
    ),
  );

  return {
    __esModule: true,
    default: FormBuscaProdutoMock,
  };
});

jest.mock("src/components/Shareable/Botao", () => {
  const React = require("react");

  return {
    __esModule: true,
    default: jest.fn(({ texto, type }) =>
      React.createElement(
        "button",
        {
          type,
          "data-testid": "botao-visualizar",
        },
        texto,
      ),
    ),
  };
});

jest.mock("src/components/Shareable/LabelResultadoDaBusca", () => {
  const React = require("react");

  const LabelResultadoDaBuscaMock = jest.fn(({ filtros }) =>
    React.createElement(
      "div",
      {
        "data-testid": "label-resultado-busca",
      },
      JSON.stringify(filtros),
    ),
  );

  return {
    __esModule: true,
    default: LabelResultadoDaBuscaMock,
  };
});

jest.mock("src/components/Shareable/Paginacao", () => {
  const React = require("react");

  return {
    Paginacao: jest.fn(({ current, total, onChange }) =>
      React.createElement(
        "button",
        {
          type: "button",
          "data-testid": "paginacao",
          "data-current": current,
          "data-total": total,
          onClick: () => onChange(2),
        },
        "Ir para página 2",
      ),
    ),
  };
});

jest.mock("src/helpers/utilities", () => ({
  deepEqual: jest.fn(),
  gerarParametrosConsulta: jest.fn(),
}));

jest.mock("src/services/produto.service", () => ({
  getProdutosListagem: jest.fn(),
}));

const produtoAtivoMock = {
  id_externo: "PRODUTO-001",
  nome: "Arroz integral",
  marca: {
    nome: "Marca Teste",
  },
  fabricante: {
    nome: "Fabricante Teste",
  },
  ultima_homologacao: {
    uuid: "00000000-0000-4000-8000-000000000001",
    status: "CODAE_HOMOLOGADO",
  },
  vinculos_produto_edital_ativos: 3,
  vinculos_produto_edital_suspensos: 0,
};

const produtoSuspensoMock = {
  id_externo: "PRODUTO-002",
  nome: "Feijão carioca",
  marca: {
    nome: "Marca Suspensa",
  },
  fabricante: {
    nome: "Fabricante Suspenso",
  },
  ultima_homologacao: {
    uuid: "00000000-0000-4000-8000-000000000002",
    status: "CODAE_SUSPENDEU",
  },
  vinculos_produto_edital_ativos: 0,
  vinculos_produto_edital_suspensos: 2,
};

const renderizarComponente = () =>
  render(
    <MemoryRouter>
      <AtivacaoSuspencaoProduto />
    </MemoryRouter>,
  );

const obterUltimasProps = (mock) => {
  const chamadas = mock.mock.calls;

  return chamadas[chamadas.length - 1][0];
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

describe("AtivacaoSuspencaoProduto", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    deepEqual.mockImplementation(
      (primeiroValor, segundoValor) =>
        JSON.stringify(primeiroValor) === JSON.stringify(segundoValor),
    );

    gerarParametrosConsulta.mockImplementation((valores) => valores);

    getProdutosListagem.mockResolvedValue({
      data: {
        results: [],
        count: 0,
      },
    });
  });

  it("renderiza o formulário e não consulta produtos antes do envio", () => {
    renderizarComponente();

    expect(screen.getByTestId("form-busca-produto")).toBeInTheDocument();
    expect(getProdutosListagem).not.toHaveBeenCalled();

    expect(screen.getByTestId("spin")).toHaveAttribute(
      "data-spinning",
      "false",
    );

    const propsFormulario = obterUltimasProps(FormBuscaProduto);

    expect(propsFormulario.onSubmit).toEqual(expect.any(Function));
    expect(propsFormulario.onAtualizaProdutos).toEqual(expect.any(Function));
    expect(propsFormulario.exibirBotaoVoltar).toBe(true);
  });

  it("consulta e exibe os produtos ativos", async () => {
    getProdutosListagem.mockResolvedValue({
      data: {
        results: [produtoAtivoMock],
        count: 1,
      },
    });

    renderizarComponente();

    fireEvent.click(screen.getByTestId("buscar-ativos"));

    await waitFor(() => {
      expect(gerarParametrosConsulta).toHaveBeenCalledWith({
        nome_produto: "Arroz",
        status: ["CODAE_HOMOLOGADO"],
        page: 1,
        page_size: 10,
      });
    });

    expect(getProdutosListagem).toHaveBeenCalledWith({
      nome_produto: "Arroz",
      status: ["CODAE_HOMOLOGADO"],
      page: 1,
      page_size: 10,
    });

    expect(await screen.findByText("Arroz integral")).toBeInTheDocument();
    expect(screen.getByText("Marca Teste")).toBeInTheDocument();
    expect(screen.getByText("Fabricante Teste")).toBeInTheDocument();
    expect(screen.getByText("Ativo")).toBeInTheDocument();
    expect(screen.getByText("Editais ativos")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();

    const link = screen.getByRole("link", {
      name: "Visualizar",
    });

    expect(link).toHaveAttribute(
      "href",
      `/${GESTAO_PRODUTO}/${ATIVACAO_DE_PRODUTO}/detalhe?id=${produtoAtivoMock.ultima_homologacao.uuid}`,
    );

    const propsLabel = obterUltimasProps(LabelResultadoDaBusca);

    expect(propsLabel.filtros).toEqual({
      nome_produto: "Arroz",
      status: ["CODAE_HOMOLOGADO"],
    });

    const propsPaginacao = obterUltimasProps(Paginacao);

    expect(propsPaginacao.current).toBe(1);
    expect(propsPaginacao.total).toBe(1);
    expect(propsPaginacao.pageSize).toBe(10);
    expect(propsPaginacao.showSizeChanger).toBe(false);
  });

  it("consulta e exibe os produtos suspensos", async () => {
    getProdutosListagem.mockResolvedValue({
      data: {
        results: [produtoSuspensoMock],
        count: 1,
      },
    });

    renderizarComponente();

    fireEvent.click(screen.getByTestId("buscar-suspensos"));

    await waitFor(() => {
      expect(gerarParametrosConsulta).toHaveBeenCalledWith({
        nome_produto: "Feijão",
        status: ["CODAE_SUSPENDEU", "CODAE_AUTORIZOU_RECLAMACAO"],
        page: 1,
        page_size: 10,
      });
    });

    expect(getProdutosListagem).toHaveBeenCalledWith({
      nome_produto: "Feijão",
      status: ["CODAE_SUSPENDEU", "CODAE_AUTORIZOU_RECLAMACAO"],
      page: 1,
      page_size: 10,
    });

    expect(await screen.findByText("Feijão carioca")).toBeInTheDocument();

    expect(screen.getByText("Marca Suspensa")).toBeInTheDocument();
    expect(screen.getByText("Fabricante Suspenso")).toBeInTheDocument();
    expect(screen.getByText("Suspenso")).toBeInTheDocument();
    expect(screen.getByText("Editais")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();

    const link = screen.getByRole("link", {
      name: "Visualizar",
    });

    expect(link).toHaveAttribute(
      "href",
      `/${GESTAO_PRODUTO}/${ATIVACAO_DE_PRODUTO}/detalhe?id=${produtoSuspensoMock.ultima_homologacao.uuid}&suspenso=true`,
    );
  });

  it("consulta todos os status quando nenhum filtro de status é selecionado", async () => {
    renderizarComponente();

    fireEvent.click(screen.getByTestId("buscar-todos"));

    await waitFor(() => {
      expect(gerarParametrosConsulta).toHaveBeenCalledWith({
        nome_produto: "Macarrão",
        status: [
          "CODAE_HOMOLOGADO",
          "CODAE_SUSPENDEU",
          "CODAE_AUTORIZOU_RECLAMACAO",
        ],
        page: 1,
        page_size: 10,
      });
    });

    expect(getProdutosListagem).toHaveBeenCalledWith({
      nome_produto: "Macarrão",
      status: [
        "CODAE_HOMOLOGADO",
        "CODAE_SUSPENDEU",
        "CODAE_AUTORIZOU_RECLAMACAO",
      ],
      page: 1,
      page_size: 10,
    });
  });

  it("exibe mensagem quando a consulta não retorna produtos", async () => {
    getProdutosListagem.mockResolvedValue({
      data: {
        results: [],
        count: 0,
      },
    });

    renderizarComponente();

    fireEvent.click(screen.getByTestId("buscar-ativos"));

    expect(
      await screen.findByText("Não existem dados para filtragem informada"),
    ).toBeInTheDocument();

    expect(
      screen.queryByTestId("label-resultado-busca"),
    ).not.toBeInTheDocument();

    expect(screen.queryByTestId("paginacao")).not.toBeInTheDocument();
  });

  it("realiza uma nova consulta ao mudar de página", async () => {
    getProdutosListagem.mockResolvedValue({
      data: {
        results: [produtoAtivoMock],
        count: 15,
      },
    });

    renderizarComponente();

    fireEvent.click(screen.getByTestId("buscar-ativos"));

    await screen.findByText("Arroz integral");

    fireEvent.click(screen.getByTestId("paginacao"));

    await waitFor(() => {
      expect(getProdutosListagem).toHaveBeenCalledTimes(2);
    });

    expect(gerarParametrosConsulta).toHaveBeenLastCalledWith({
      nome_produto: "Arroz",
      status: ["CODAE_HOMOLOGADO"],
      page: 2,
      page_size: 10,
    });

    const propsPaginacao = obterUltimasProps(Paginacao);

    expect(propsPaginacao.current).toBe(2);
    expect(propsPaginacao.total).toBe(15);
  });

  it("exibe o carregamento enquanto a consulta está pendente", async () => {
    const consultaControlada = criarPromessaControlada();

    getProdutosListagem.mockReturnValue(consultaControlada.promise);

    renderizarComponente();

    fireEvent.click(screen.getByTestId("buscar-ativos"));

    await waitFor(() => {
      expect(getProdutosListagem).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByTestId("spin")).toHaveAttribute("data-spinning", "true");

    await act(async () => {
      consultaControlada.resolver({
        data: {
          results: [produtoAtivoMock],
          count: 1,
        },
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId("spin")).toHaveAttribute(
        "data-spinning",
        "false",
      );
    });
  });
});
