import React from "react";
import { render, screen } from "@testing-library/react";
import { getProduto, getInformacoesGrupo } from "src/services/produto.service";
import { retornaTodosOsLogs } from "../../../components/RelatorioProduto/helpers";
import RelatorioProduto from "../../../components/RelatorioProduto";

const mockCorpoRelatorio = jest.fn();
const mockCorpoRelatorioDesenvolvimento = jest.fn();

jest.mock("src/services/produto.service", () => ({
  getProduto: jest.fn(),
  getInformacoesGrupo: jest.fn(),
}));

jest.mock("../../../components/RelatorioProduto/helpers", () => ({
  retornaTodosOsLogs: jest.fn(),
}));

jest.mock("src/constants/config", () => ({
  ENVIRONMENT: "production",
}));

jest.mock(
  "../../../components/RelatorioProduto/components/resultadoMock",
  () => {
    return function ResultadoMock() {
      return <div data-testid="resultado-mock" />;
    };
  },
);

jest.mock(
  "../../../components/RelatorioProduto/components/corpoRelatorio",
  () => {
    return function CorpoRelatorio(props) {
      mockCorpoRelatorio(props);

      return <div data-testid="corpo-relatorio" />;
    };
  },
);

jest.mock(
  "../../../components/RelatorioProduto/components/corpoRelatorio/index_development",
  () => {
    return function CorpoRelatorioDesenvolvimento(props) {
      mockCorpoRelatorioDesenvolvimento(props);

      return <div data-testid="corpo-relatorio-desenvolvimento" />;
    };
  },
);

jest.mock("antd", () => ({
  Spin: ({ tip, children }) => (
    <div data-testid="spin">
      <span>{tip}</span>
      {children}
    </div>
  ),
}));

const uuidProdutoMock = "00000000-0000-4000-8000-000000000001";

const produtoMock = {
  uuid: uuidProdutoMock,
  nome: "Produto teste",
  homologacao: [
    {
      uuid: "00000000-0000-4000-8000-000000000002",
    },
  ],
  ultima_homologacao: {
    uuid: "00000000-0000-4000-8000-000000000003",
    logs: [],
  },
};

const informacoesNutricionaisMock = [
  {
    uuid: "00000000-0000-4000-8000-000000000004",
    nome: "Macronutrientes",
  },
];

const todosOsLogsMock = [
  {
    status_evento_explicacao: "Produto cadastrado",
  },
];

describe("RelatorioProduto", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    window.history.replaceState({}, "", `/?uuid=${uuidProdutoMock}`);

    getProduto.mockResolvedValue({
      data: produtoMock,
    });

    getInformacoesGrupo.mockResolvedValue({
      data: {
        results: informacoesNutricionaisMock,
      },
    });

    retornaTodosOsLogs.mockReturnValue(todosOsLogsMock);
  });

  it("renderiza o relatório padrão quando o ambiente é de produção", async () => {
    render(<RelatorioProduto />);

    expect(await screen.findByTestId("corpo-relatorio")).toBeInTheDocument();

    expect(getProduto).toHaveBeenCalledTimes(1);
    expect(getProduto).toHaveBeenCalledWith(uuidProdutoMock);

    expect(getInformacoesGrupo).toHaveBeenCalledTimes(1);

    expect(retornaTodosOsLogs).toHaveBeenCalledTimes(1);
    expect(retornaTodosOsLogs).toHaveBeenCalledWith(produtoMock.homologacao);

    expect(mockCorpoRelatorio).toHaveBeenCalledWith({
      informacoesNutricionais: informacoesNutricionaisMock,
      produto: {
        ...produtoMock,
        todos_logs: todosOsLogsMock,
      },
      historico: produtoMock.ultima_homologacao,
    });

    expect(mockCorpoRelatorioDesenvolvimento).not.toHaveBeenCalled();
    expect(screen.queryByTestId("spin")).not.toBeInTheDocument();
  });
});
