import {
  mockCEP,
  mockContatos,
  mockContratos,
  mockLotes,
  mockNutricionistas,
} from "../../../../../mocks/Cadastros/CadastroEmpresa/mocksHelper";
import {
  buscaCep,
  formataJsonParaEnvio,
  mensagemErroCnpj,
  retornArrayTerceirizadas,
  transformaObjetos,
} from "../helper";
import { getEnderecoPorCEP } from "src/services/cep.service";

jest.mock("src/services/cep.service.jsx");

describe("Função transformaObjetos", () => {
  it("deve retornar uma lista de objetos", () => {
    let objetos = {
      results: [
        {
          uuid: "1",
          nome: "Teste 1",
        },
        {
          uuid: "2",
          nome: "Teste 2",
        },
        {
          uuid: "3",
          nome: "Teste 3",
        },
      ],
    };

    let lista = transformaObjetos(objetos);

    expect(lista).toEqual([
      {
        uuid: "1",
        label: "Teste 1",
        value: "1",
      },
      {
        uuid: "2",
        label: "Teste 2",
        value: "2",
      },
      {
        uuid: "3",
        label: "Teste 3",
        value: "3",
      },
    ]);
  });

  it("deve retornar uma lista de objetos", () => {
    let objetos = {
      results: [
        {
          uuid: "1",
          nome: "Teste 1",
        },
        {
          uuid: "2",
          nome: "Teste 2",
        },
        {
          uuid: "3",
          nome: "Teste 3",
        },
      ],
    };

    let lista = transformaObjetos(objetos);

    expect(lista).toEqual([
      {
        uuid: "1",
        label: "Teste 1",
        value: "1",
      },
      {
        uuid: "2",
        label: "Teste 2",
        value: "2",
      },
      {
        uuid: "3",
        label: "Teste 3",
        value: "3",
      },
    ]);
  });
});

describe("Função retornArrayTerceirizadas", () => {
  it("deve retornar uma lista de terceirizadas", () => {
    let terceirizadas = [
      {
        contratos: [],
        contatos: [],
        lotes: [],
        nutricionistas: [],
        eh_distribuidor: true,
        ativo: true,
      },
      {
        contratos: mockContratos,
        contatos: mockContatos,
        lotes: mockLotes,
        nutricionistas: mockNutricionistas,
      },
    ];

    let lista = retornArrayTerceirizadas(terceirizadas);

    expect(lista[1].nutricionistas).toEqual([
      {
        nome: "Nutri 1",
        crn: "123",
        super_admin_terceirizadas: false,
        telefone: null,
        email: null,
      },
      {
        nome: "Nutri 2",
        crn: "456",
        super_admin_terceirizadas: true,
        telefone: "(11) 11111-1111",
        email: "email@email.com",
      },
    ]);
  });
});

describe("Função buscaCep", () => {
  beforeEach(() => {
    getEnderecoPorCEP.mockResolvedValue({
      data: mockCEP,
      status: 200,
    });
  });

  it("deve retornar os dados do endereco", async () => {
    let cep = "00000000";

    let dados = await buscaCep(cep);

    expect(dados).toEqual({
      desabilitado: true,
      bairro: mockCEP.bairro,
      cidade: mockCEP.localidade,
      endereco: mockCEP.logradouro,
      estado: mockCEP.uf,
      request: true,
    });
  });

  it("retorna dados nulos e desabilitado false em caso de CEP inválido", async () => {
    let cep = "1";

    let dados = await buscaCep(cep);

    expect(dados).toEqual({
      desabilitado: true,
      bairro: null,
      cidade: null,
      endereco: null,
      estado: null,
    });
  });

  it("retorna dados nulos e desabilitado TRUE em caso de erro na API", async () => {
    getEnderecoPorCEP.mockResolvedValue({
      data: mockCEP,
      status: 500,
    });

    let cep = "00000000";

    let dados = await buscaCep(cep);

    expect(dados).toEqual({
      desabilitado: false,
      bairro: null,
      cidade: null,
      endereco: null,
      estado: null,
    });
  });
});

describe("Função formataJsonParaEnvio", () => {
  let valoresForm = {
    cep: "",
    telefone_representante: "(11) 11111-1111",
    responsavel_telefone: "(22) 22222-2222",
  };

  let valoresState = {
    contatosNutricionista: mockNutricionistas,
    contatosEmpresa: mockContatos,
  };

  it("retorna payload caso seja distribuidor", async () => {
    valoresState.ehDistribuidor = true;
    valoresState.contatosPessoaEmpresa = mockContatos;
    valoresState.contratos = mockContratos;

    let payload = formataJsonParaEnvio(valoresForm, valoresState);

    expect(payload.responsavel_telefone).toEqual("22 222222222");
  });

  it("retorna payload caso não seja distribuidor", async () => {
    valoresState.ehDistribuidor = false;

    let payload = formataJsonParaEnvio(valoresForm, valoresState);

    expect(payload.representante_telefone).toEqual("11111111111");
    expect(payload.responsavel_telefone).toEqual("22222222222");
  });

  describe("Número do contrato no payload", () => {
    const valoresFormulario = {
      cep: "01001-000",
      numero_contrato_0: "001/2026",
      numero_processo_0: "6016.2026/0000001-0",
      vigencia_de_0: "01/01/2026",
      vigencia_ate_0: "31/12/2026",
    };

    const estadoFormulario = {
      ehDistribuidor: true,
      contatosPessoaEmpresa: [],
      contratos: [
        {
          uuid: "79966033-3226-403e-9617-aa7e4c638c3a",
          numero: "001/2026",
          encerrado: false,
        },
      ],
    };

    it("envia o número no cadastro de um novo contrato", () => {
      const dados = formataJsonParaEnvio(valoresFormulario, {
        ...estadoFormulario,
        contratos: [{ encerrado: false }],
      });

      expect(dados.contratos).toHaveLength(1);
      expect(dados.contratos[0].numero).toBe("001/2026");
    });

    it("envia o novo número mantendo o UUID do contrato existente", () => {
      const dados = formataJsonParaEnvio(
        { ...valoresFormulario, numero_contrato_0: "002/2026" },
        estadoFormulario,
      );

      expect(dados.contratos).toHaveLength(1);
      expect(dados.contratos[0]).toMatchObject({
        uuid: "79966033-3226-403e-9617-aa7e4c638c3a",
        numero: "002/2026",
      });
    });

    it("omite o número quando ele não foi alterado na edição", () => {
      const dados = formataJsonParaEnvio(valoresFormulario, estadoFormulario);

      expect(dados.contratos).toHaveLength(1);
      expect(dados.contratos[0].uuid).toBe(
        "79966033-3226-403e-9617-aa7e4c638c3a",
      );
      expect(dados.contratos[0]).not.toHaveProperty("numero");
    });
  });
});

describe("Função mensagemErroCnpj", () => {
  const mensagem =
    "Não foi possível concluir o cadastro, pois já existe uma empresa cadastrada com o CNPJ informado.";

  it("retorna a mensagem quando o backend aponta erro no CNPJ", () => {
    expect(mensagemErroCnpj({ cnpj: [mensagem] })).toEqual(mensagem);
  });

  it("retorna null quando o backend não aponta erro no CNPJ", () => {
    expect(mensagemErroCnpj({ razao_social: ["Erro"] })).toBeNull();
    expect(mensagemErroCnpj(undefined)).toBeNull();
  });

  it("retorna null quando a lista de erros do CNPJ está vazia", () => {
    expect(mensagemErroCnpj({ cnpj: [] })).toBeNull();
  });
});
