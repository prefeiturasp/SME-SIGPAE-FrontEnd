import { obterRelatorioQuantitativo } from "src/helpers/terceirizadas";
import mock from "src/services/_mock";
import { ENDPOINT_RELATORIO_QUANTITATIVO } from "src/constants/shared";

const DADOS_TESTE_RELATORIO_QUANTITATIVO = {
  results: [
    {
      nome_terceirizada: "Pedreira bebidas",
      qtde_por_status: [
        {
          status: "CODAE_NAO_HOMOLOGADO",
          qtde: 1,
        },
        {
          status: "TERCEIRIZADA_RESPONDEU_RECLAMACAO",
          qtde: 1,
        },
      ],
    },
    {
      nome_terceirizada: "SINGULAR GESTÃO DE SERVIÇOS LTDA",
      qtde_por_status: [
        {
          status: "CODAE_HOMOLOGADO",
          qtde: 1,
        },
        {
          status: "CODAE_NAO_HOMOLOGADO",
          qtde: 1,
        },
        {
          status: "CODAE_PEDIU_ANALISE_RECLAMACAO",
          qtde: 1,
        },
      ],
    },
  ],
};

const RESULTADO_RELATORIO_QUANTITATIVO = {
  totalProdutos: 5,
  qtdeDias: undefined,
  detalhes: [
    {
      nomeTerceirizada: "Pedreira bebidas",
      totalProdutos: 2,
      qtdePorStatus: {
        RECLAMACAO_DE_PRODUTO: 0,
        PRODUTOS_SUSPENSOS: 0,
        PRODUTOS_PENDENTES_HOMOLOGACAO: 0,
        PRODUTOS_ANALISE_RECLAMACAO: 1,
        PRODUTOS_AGUARDANDO_ANALISE_SENSORIAL: 0,
        PRODUTOS_AGUARDANDO_CORRECAO: 0,
        PRODUTOS_HOMOLOGADOS: 0,
        PRODUTOS_NAO_HOMOLOGADOS: 1,
      },
    },
    {
      nomeTerceirizada: "SINGULAR GESTÃO DE SERVIÇOS LTDA",
      totalProdutos: 3,
      qtdePorStatus: {
        RECLAMACAO_DE_PRODUTO: 0,
        PRODUTOS_SUSPENSOS: 0,
        PRODUTOS_PENDENTES_HOMOLOGACAO: 0,
        PRODUTOS_ANALISE_RECLAMACAO: 1,
        PRODUTOS_AGUARDANDO_ANALISE_SENSORIAL: 0,
        PRODUTOS_AGUARDANDO_CORRECAO: 0,
        PRODUTOS_HOMOLOGADOS: 1,
        PRODUTOS_NAO_HOMOLOGADOS: 1,
      },
    },
  ],
};

describe("test helperTerceirizadas", () => {
  mock
    .onGet(ENDPOINT_RELATORIO_QUANTITATIVO)
    .reply(200, DADOS_TESTE_RELATORIO_QUANTITATIVO);
  test("sem parâmetros", async () => {
    const resultado = await obterRelatorioQuantitativo();
    expect(resultado).toEqual(RESULTADO_RELATORIO_QUANTITATIVO);
  });
});
