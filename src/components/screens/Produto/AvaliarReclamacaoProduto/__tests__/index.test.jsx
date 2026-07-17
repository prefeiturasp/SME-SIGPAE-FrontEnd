import "@testing-library/jest-dom";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useNavigationType } from "react-router-dom";

import { deepCopy, gerarParametrosConsulta } from "src/helpers/utilities";
import { formatarValues } from "../helpers";

import {
  getHomologacao,
  getNomesTerceirizadas,
  getProdutosAvaliacaoReclamacao,
} from "src/services/produto.service";

import TabelaProdutos from "src/components/screens/Produto/AvaliarReclamacaoProduto/components/TabelaProdutos";
import { Paginacao } from "src/components/Shareable/Paginacao";

import { AvaliarReclamacaoProduto } from "../index";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigationType: jest.fn(),
}));

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

jest.mock(
  "src/components/screens/Produto/Reclamacao/components/FormBuscaProduto",
  () => {
    const React = require("react");

    return {
      __esModule: true,
      default: jest.fn(({ onSubmit, formName }) =>
        React.createElement(
          "button",
          {
            type: "button",
            "data-testid": "form-busca-produto",
            "data-form-name": formName,
            onClick: () =>
              onSubmit({
                nome_produto: "Arroz",
                nome_marca: "Marca Teste",
              }),
          },
          "Buscar produto",
        ),
      ),
    };
  },
);

jest.mock(
  "src/components/screens/Produto/AvaliarReclamacaoProduto/components/TabelaProdutos",
  () => {
    const React = require("react");

    return {
      __esModule: true,
      default: jest.fn(() =>
        React.createElement("div", {
          "data-testid": "tabela-produtos",
        }),
      ),
    };
  },
);

jest.mock("src/components/Shareable/Paginacao", () => {
  const React = require("react");

  return {
    Paginacao: jest.fn(({ onChange }) =>
      React.createElement(
        "button",
        {
          type: "button",
          "data-testid": "alterar-pagina",
          onClick: () => onChange(3),
        },
        "Alterar página",
      ),
    ),
  };
});

jest.mock("src/helpers/utilities", () => ({
  deepCopy: jest.fn(),
  gerarParametrosConsulta: jest.fn(),
}));

jest.mock("../helpers", () => ({
  formatarValues: jest.fn(),
}));

jest.mock("src/services/produto.service", () => ({
  getProdutosAvaliacaoReclamacao: jest.fn(),
  getHomologacao: jest.fn(),
  getNomesTerceirizadas: jest.fn(),
}));

const produtoMock = {
  uuid: "00000000-0000-4000-8000-000000000001",
  nome: "Arroz integral",
};

const terceirizadasMock = [
  {
    uuid: "00000000-0000-4000-8000-000000000002",
    nome_fantasia: "Empresa Teste",
  },
];

const valoresBuscaMock = {
  nome_produto: "Arroz",
  nome_marca: "Marca Teste",
};

const criarProps = (sobrescritas = {}) => ({
  setPropsPageProduto: jest.fn(),
  reset: jest.fn(),
  produtos: null,
  setProdutos: jest.fn(),
  produtosCount: 0,
  setProdutosCount: jest.fn(),
  page: 1,
  setPage: jest.fn(),
  indiceProdutoAtivo: undefined,
  setIndiceProdutoAtivo: jest.fn(),
  ...sobrescritas,
});

const renderizarComponente = (sobrescritas = {}) => {
  const props = criarProps(sobrescritas);

  render(<AvaliarReclamacaoProduto {...props} />);

  return props;
};

const obterUltimaChamada = (mock) => {
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

describe("AvaliarReclamacaoProduto", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    window.history.pushState({}, "", "/");

    useNavigationType.mockReturnValue("POP");

    deepCopy.mockImplementation((value) =>
      value === undefined ? undefined : JSON.parse(JSON.stringify(value)),
    );

    formatarValues.mockImplementation((values) => ({
      ...values,
      valores_formatados: true,
    }));

    gerarParametrosConsulta.mockReturnValue("parametros-formatados");

    getNomesTerceirizadas.mockResolvedValue({
      data: {
        results: [],
      },
    });

    getProdutosAvaliacaoReclamacao.mockResolvedValue({
      data: {
        results: [],
        count: 0,
      },
    });
  });

  it("reinicia os dados ao acessar a página por uma nova navegação", async () => {
    useNavigationType.mockReturnValue("PUSH");

    getNomesTerceirizadas.mockResolvedValue({
      data: {
        results: terceirizadasMock,
      },
    });

    const props = renderizarComponente();

    await waitFor(() => {
      expect(getNomesTerceirizadas).toHaveBeenCalledTimes(1);
    });

    expect(props.reset).toHaveBeenCalledTimes(1);

    expect(getHomologacao).not.toHaveBeenCalled();

    expect(screen.getByTestId("form-busca-produto")).toHaveAttribute(
      "data-form-name",
      "avaliarReclamacaoProduto",
    );

    expect(screen.getByTestId("spin")).toHaveAttribute(
      "data-spinning",
      "false",
    );
  });

  it("carrega a homologação informada na URL", async () => {
    const uuid = "00000000-0000-4000-8000-000000000003";

    window.history.pushState({}, "", `/?uuid=${uuid}`);

    getHomologacao.mockResolvedValue({
      data: {
        produto: produtoMock,
      },
    });

    const props = renderizarComponente();

    await waitFor(() => {
      expect(getHomologacao).toHaveBeenCalledWith(uuid);
    });

    expect(props.setPropsPageProduto).toHaveBeenCalledWith(produtoMock);
    expect(props.setProdutos).toHaveBeenCalledWith([produtoMock]);
    expect(props.setIndiceProdutoAtivo).toHaveBeenCalledWith(0);

    expect(screen.getByTestId("spin")).toHaveAttribute(
      "data-spinning",
      "false",
    );
  });

  it("exibe mensagem de erro quando não consegue carregar a homologação", async () => {
    const uuid = "00000000-0000-4000-8000-000000000004";

    window.history.pushState({}, "", `/?uuid=${uuid}`);

    getHomologacao.mockRejectedValue(new Error("Erro ao carregar"));

    renderizarComponente();

    expect(
      await screen.findByText(
        "Erro ao carregar dados de Homologação de Produto",
      ),
    ).toBeInTheDocument();

    expect(screen.queryByTestId("form-busca-produto")).not.toBeInTheDocument();

    expect(screen.getByTestId("spin")).toHaveAttribute(
      "data-spinning",
      "false",
    );
  });

  it("consulta os produtos ao enviar os filtros de busca", async () => {
    const consultaControlada = criarPromessaControlada();

    getProdutosAvaliacaoReclamacao.mockReturnValue(consultaControlada.promise);

    const props = renderizarComponente({
      page: 2,
    });

    fireEvent.click(screen.getByTestId("form-busca-produto"));

    await waitFor(() => {
      expect(getProdutosAvaliacaoReclamacao).toHaveBeenCalledWith(
        "parametros-formatados",
      );
    });

    expect(props.setPage).toHaveBeenCalledWith(2);

    expect(formatarValues).toHaveBeenCalledWith(valoresBuscaMock);

    expect(gerarParametrosConsulta).toHaveBeenCalledWith({
      ...valoresBuscaMock,
      valores_formatados: true,
      page_size: 10,
      page: 2,
    });

    expect(screen.getByTestId("spin")).toHaveAttribute("data-spinning", "true");

    await act(async () => {
      consultaControlada.resolver({
        data: {
          results: [produtoMock],
          count: 1,
        },
      });
    });

    expect(props.setProdutos).toHaveBeenCalledWith([produtoMock]);
    expect(props.setProdutosCount).toHaveBeenCalledWith(1);
    expect(props.setIndiceProdutoAtivo).toHaveBeenCalledWith(undefined);

    await waitFor(() => {
      expect(screen.getByTestId("spin")).toHaveAttribute(
        "data-spinning",
        "false",
      );
    });
  });

  it("renderiza a tabela e a paginação quando existem produtos", async () => {
    getNomesTerceirizadas.mockResolvedValue({
      data: {
        results: terceirizadasMock,
      },
    });

    const props = renderizarComponente({
      produtos: [produtoMock],
      produtosCount: 25,
      page: 2,
      indiceProdutoAtivo: 0,
    });

    expect(
      screen.getByText("Veja os resultados para a busca:"),
    ).toBeInTheDocument();

    expect(screen.getByTestId("tabela-produtos")).toBeInTheDocument();
    expect(screen.getByTestId("alterar-pagina")).toBeInTheDocument();

    await waitFor(() => {
      const propsTabela = obterUltimaChamada(TabelaProdutos);

      expect(propsTabela.terceirizadas).toEqual(terceirizadasMock);
    });

    const propsTabela = obterUltimaChamada(TabelaProdutos);

    expect(propsTabela.listaProdutos).toEqual([produtoMock]);
    expect(propsTabela.indiceProdutoAtivo).toBe(0);
    expect(propsTabela.setIndiceProdutoAtivo).toBe(props.setIndiceProdutoAtivo);
    expect(propsTabela.setLoading).toEqual(expect.any(Function));
    expect(propsTabela.atualizar).toEqual(expect.any(Function));

    const propsPaginacao = obterUltimaChamada(Paginacao);

    expect(propsPaginacao.current).toBe(2);
    expect(propsPaginacao.total).toBe(25);
    expect(propsPaginacao.pageSize).toBe(10);
    expect(propsPaginacao.showSizeChanger).toBe(false);

    fireEvent.click(screen.getByTestId("alterar-pagina"));

    expect(props.setPage).toHaveBeenCalledWith(3);
  });

  it("exibe o nome do produto pesquisado no resultado", async () => {
    renderizarComponente({
      produtos: [produtoMock],
    });

    fireEvent.click(screen.getByTestId("form-busca-produto"));

    expect(
      await screen.findByText('Veja os resultados para: "Arroz"'),
    ).toBeInTheDocument();
  });

  it("exibe a mensagem de busca sem resultados", async () => {
    const props = renderizarComponente({
      produtos: [],
      page: undefined,
    });

    fireEvent.click(screen.getByTestId("form-busca-produto"));

    expect(
      await screen.findByText("A consulta retornou 0 resultados."),
    ).toBeInTheDocument();

    expect(props.setPage).toHaveBeenCalledWith(1);
  });

  it("não reinicia os dados quando a navegação não é do tipo PUSH", async () => {
    useNavigationType.mockReturnValue("POP");

    const props = renderizarComponente();

    await waitFor(() => {
      expect(getNomesTerceirizadas).toHaveBeenCalledTimes(1);
    });

    expect(props.reset).not.toHaveBeenCalled();
  });
});
