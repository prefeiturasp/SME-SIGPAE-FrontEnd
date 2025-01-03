import {
  mockCEP,
  mockContatos,
  mockContratos,
  mockLotes,
  mockNutricionistas,
} from "../../../../../mocks/Cadastros/CadastroEmpresa/mocksHelper.js";
import {
  buscaCep,
  formataJsonParaEnvio,
  retornArrayTerceirizadas,
  transformaObjetos,
} from "../helper.js";
import { getEnderecoPorCEP } from "services/cep.service";

jest.mock("services/cep.service.js");

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
});
