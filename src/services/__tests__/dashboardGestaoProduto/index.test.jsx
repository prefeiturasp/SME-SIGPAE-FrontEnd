import axios from "src/services/_base";
import { ErrorHandlerFunction } from "src/services/service-helpers";
import {
  getProdutosAguardandoAmostraAnaliseSensorial,
  getProdutosAguardandoAnaliseReclamacao,
  getProdutosCorrecaoDeProdutos,
  getProdutosHomologados,
  getProdutosNaoHomologados,
  getProdutosPendenteHomologacao,
  getProdutosQuestionamentoDaCODAE,
  getProdutosSuspensos,
} from "../../dashboardGestaoProduto";

jest.mock("src/services/_base", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock("src/services/service-helpers", () => ({
  ErrorHandlerFunction: jest.fn(),
}));

const params = {
  offset: 0,
  limit: 10,
  nome_produto: "Produto teste",
};

const respostaMock = {
  count: 1,
  next: null,
  previous: null,
  results: [
    {
      uuid: "00000000-0000-4000-8000-000000000001",
      nome: "Produto teste",
    },
  ],
};

const casosDeTeste = [
  {
    nome: "getProdutosPendenteHomologacao",
    servico: getProdutosPendenteHomologacao,
    url: "/dashboard-produtos/pendente-homologacao/",
  },
  {
    nome: "getProdutosSuspensos",
    servico: getProdutosSuspensos,
    url: "/dashboard-produtos/suspensos/",
  },
  {
    nome: "getProdutosHomologados",
    servico: getProdutosHomologados,
    url: "/dashboard-produtos/homologados/",
  },
  {
    nome: "getProdutosNaoHomologados",
    servico: getProdutosNaoHomologados,
    url: "/dashboard-produtos/nao-homologados/",
  },
  {
    nome: "getProdutosAguardandoAnaliseReclamacao",
    servico: getProdutosAguardandoAnaliseReclamacao,
    url: "/dashboard-produtos/aguardando-analise-reclamacao/",
  },
  {
    nome: "getProdutosCorrecaoDeProdutos",
    servico: getProdutosCorrecaoDeProdutos,
    url: "/dashboard-produtos/correcao-de-produtos/",
  },
  {
    nome: "getProdutosAguardandoAmostraAnaliseSensorial",
    servico: getProdutosAguardandoAmostraAnaliseSensorial,
    url: "/dashboard-produtos/aguardando-amostra-analise-sensorial/",
  },
  {
    nome: "getProdutosQuestionamentoDaCODAE",
    servico: getProdutosQuestionamentoDaCODAE,
    url: "/dashboard-produtos/questionamento-da-codae/",
  },
];

describe("dashboardGestaoProduto services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe.each(casosDeTeste)("$nome", ({ servico, url }) => {
    it("deve buscar os produtos com os parâmetros informados", async () => {
      axios.get.mockResolvedValueOnce({
        data: respostaMock,
        status: 200,
      });

      const resultado = await servico(params);

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith(url, { params });
      expect(resultado).toEqual({
        data: respostaMock,
        status: 200,
      });
    });

    it("deve chamar o tratador de erro e retornar undefined quando a requisição falhar", async () => {
      const erro = new Error("Erro ao buscar produtos");

      axios.get.mockRejectedValueOnce(erro);
      ErrorHandlerFunction.mockReturnValueOnce(undefined);

      const resultado = await servico(params);

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith(url, { params });
      expect(ErrorHandlerFunction).toHaveBeenCalledTimes(1);
      expect(ErrorHandlerFunction).toHaveBeenCalledWith(erro);
      expect(resultado).toBeUndefined();
    });
  });
});
