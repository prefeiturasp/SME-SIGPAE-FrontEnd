import { getInitalState, formataResultado } from "../helper";

// Mock dos helpers
jest.mock("src/helpers/utilities", () => ({
  usuarioEhEscolaTerceirizada: jest.fn(),
  usuarioEhEscolaTerceirizadaDiretor: jest.fn(),
  usuarioEhEmpresaTerceirizada: jest.fn(),
}));

describe("helper.js", () => {
  const editaisMock = ["Edital 1", "Edital 2"];

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getInitalState", () => {
    it("retorna edital e agrupado false para Escola Terceirizada", () => {
      const utilities = require("src/helpers/utilities");
      utilities.usuarioEhEscolaTerceirizada.mockReturnValue(true);
      utilities.usuarioEhEscolaTerceirizadaDiretor.mockReturnValue(false);
      utilities.usuarioEhEmpresaTerceirizada.mockReturnValue(false);

      const resultado = getInitalState(editaisMock);
      expect(resultado).toEqual({
        agrupado_por_nome_e_marca: false,
        nome_edital: "Edital 1",
      });
    });

    it("retorna edital e agrupado false para Escola Terceirizada Diretor", () => {
      const utilities = require("src/helpers/utilities");
      utilities.usuarioEhEscolaTerceirizada.mockReturnValue(false);
      utilities.usuarioEhEscolaTerceirizadaDiretor.mockReturnValue(true);
      utilities.usuarioEhEmpresaTerceirizada.mockReturnValue(false);

      const resultado = getInitalState(editaisMock);
      expect(resultado).toEqual({
        agrupado_por_nome_e_marca: false,
        nome_edital: "Edital 1",
      });
    });

    it("retorna apenas agrupado false para Empresa Terceirizada", () => {
      const utilities = require("src/helpers/utilities");
      utilities.usuarioEhEscolaTerceirizada.mockReturnValue(false);
      utilities.usuarioEhEscolaTerceirizadaDiretor.mockReturnValue(false);
      utilities.usuarioEhEmpresaTerceirizada.mockReturnValue(true);

      const resultado = getInitalState(editaisMock);
      expect(resultado).toEqual({
        agrupado_por_nome_e_marca: false,
      });
    });

    it("retorna agrupado false para usuários comuns", () => {
      const utilities = require("src/helpers/utilities");
      utilities.usuarioEhEscolaTerceirizada.mockReturnValue(false);
      utilities.usuarioEhEscolaTerceirizadaDiretor.mockReturnValue(false);
      utilities.usuarioEhEmpresaTerceirizada.mockReturnValue(false);

      const resultado = getInitalState(editaisMock);
      expect(resultado).toEqual({
        agrupado_por_nome_e_marca: false,
      });
    });
  });

  describe("formataResultado", () => {
    it("agrupa produtos com o mesmo nome e retorna marcas e editais únicos", () => {
      const produtos = [
        { nome: "Arroz", marca: "Marca A", edital: "Edital 1" },
        { nome: "Arroz", marca: "Marca A", edital: "Edital 1" }, // duplicado
        { nome: "Arroz", marca: "Marca B", edital: "Edital 2" },
        { nome: "Feijão", marca: "Marca C", edital: "Edital 3" },
      ];

      const resultado = formataResultado(produtos);

      expect(resultado).toEqual([
        {
          nome: "Arroz",
          marcas: ["Marca A", "Marca B"],
          editais: ["Edital 1", "Edital 2"],
        },
        {
          nome: "Feijão",
          marcas: ["Marca C"],
          editais: ["Edital 3"],
        },
      ]);
    });

    it("retorna array vazio se a lista de produtos for vazia", () => {
      const resultado = formataResultado([]);
      expect(resultado).toEqual([]);
    });

    it("não duplica marcas nem editais mesmo que apareçam várias vezes", () => {
      const produtos = [
        { nome: "Macarrão", marca: "Marca X", edital: "Edital Alpha" },
        { nome: "Macarrão", marca: "Marca X", edital: "Edital Alpha" },
        { nome: "Macarrão", marca: "Marca Y", edital: "Edital Alpha" },
        { nome: "Macarrão", marca: "Marca Y", edital: "Edital Beta" },
      ];

      const resultado = formataResultado(produtos);

      expect(resultado).toEqual([
        {
          nome: "Macarrão",
          marcas: ["Marca X", "Marca Y"],
          editais: ["Edital Alpha", "Edital Beta"],
        },
      ]);
    });
  });
});
