import { retornaTodosOsLogs } from "../../../components/RelatorioProduto/helpers";

describe("retornaTodosOsLogs", () => {
  it("retorna os logs com a empresa e o estado inativo", () => {
    const homologacaoMock = {
      rastro_terceirizada: {
        nome_fantasia: "Empresa Teste",
      },
      logs: [
        {
          status_evento_explicacao: "Produto cadastrado",
        },
        {
          status_evento_explicacao: "Produto enviado para análise",
        },
      ],
    };

    const resultado = retornaTodosOsLogs(homologacaoMock);

    expect(resultado).toEqual([
      {
        status_evento_explicacao: "Produto cadastrado",
        ativo: false,
        empresa: "Empresa Teste",
      },
      {
        status_evento_explicacao: "Produto enviado para análise",
        ativo: false,
        empresa: "Empresa Teste",
      },
    ]);
  });
});
