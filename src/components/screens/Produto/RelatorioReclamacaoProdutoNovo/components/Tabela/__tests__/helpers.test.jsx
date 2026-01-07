import moment from "moment";
import { getConfigCabecario } from "../helpers";

describe("Helper getConfigCabecario", () => {
  beforeAll(() => {
    jest.spyOn(moment.prototype, "format").mockReturnValue("31/12/2025");
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("deve retornar CABECARIO_REDUZIDO quando houver mais de 2 filtros e apenas 1 status", () => {
    const filtros = {
      status_reclamacao: ["CODAE_ACEITOU"],
      nome_produto: "Produto X",
      nome_marca: "Marca Y",
    };

    const result = getConfigCabecario(filtros);

    expect(result).toEqual({
      cabecario_tipo: "CABECARIO_REDUZIDO",
      titulo: "Veja os resultados para a busca:",
    });
  });

  it("deve retornar CABECARIO_POR_STATUS quando houver apenas status", () => {
    const filtros = {
      status_reclamacao: ["CODAE_ACEITOU"],
    };

    const result = getConfigCabecario(filtros);

    expect(result).toEqual({
      cabecario_tipo: "CABECARIO_POR_STATUS",
      status_cabecario: "CODAE aceitou",
      titulo: 'Veja os resultados para "CODAE aceitou"',
    });
  });

  it("deve retornar CABECARIO_POR_NOME quando filtrar por nome_produto", () => {
    const filtros = {
      status_reclamacao: [],
      nome_produto: "Arroz",
    };

    const result = getConfigCabecario(filtros);

    expect(result).toEqual({
      cabecario_tipo: "CABECARIO_POR_NOME",
      nome_busca: "Arroz",
      titulo: 'Veja os resultados para "Arroz"',
    });
  });

  it("deve retornar CABECARIO_POR_NOME quando filtrar por nome_marca", () => {
    const filtros = {
      status_reclamacao: [],
      nome_marca: "Marca Teste",
    };

    const result = getConfigCabecario(filtros);

    expect(result).toEqual({
      cabecario_tipo: "CABECARIO_POR_NOME",
      nome_busca: "Marca Teste",
      titulo: 'Veja os resultados para "Marca Teste"',
    });
  });

  it("deve retornar CABECARIO_POR_DATA quando houver apenas data inicial", () => {
    const filtros = {
      status_reclamacao: [],
      data_inicial_reclamacao: "01/01/2025",
    };

    const result = getConfigCabecario(filtros);

    expect(result).toEqual({
      cabecario_tipo: "CABECARIO_POR_DATA",
      data_final_reclamacao: "31/12/2025",
      titulo: 'Veja os resultados a partir de "01/01/2025":',
    });
  });

  it("deve retornar CABECARIO_POR_DATA quando houver apenas data final", () => {
    const filtros = {
      status_reclamacao: [],
      data_final_reclamacao: "10/01/2025",
    };

    const result = getConfigCabecario(filtros);

    expect(result).toEqual({
      cabecario_tipo: "CABECARIO_POR_DATA",
      titulo: 'Veja os resultados até "10/01/2025":',
    });
  });

  it("deve retornar CABECARIO_POR_DATA quando houver data inicial e final", () => {
    const filtros = {
      status_reclamacao: [],
      data_inicial_reclamacao: "01/01/2025",
      data_final_reclamacao: "10/01/2025",
    };

    const result = getConfigCabecario(filtros);

    expect(result).toEqual({
      cabecario_tipo: "CABECARIO_POR_DATA",
      titulo: "Veja os resultados para o período de 01/01/2025 à 10/01/2025:",
    });
  });

  it("deve retornar CABECARIO_REDUZIDO como fallback", () => {
    const filtros = {
      status_reclamacao: [],
    };

    const result = getConfigCabecario(filtros);

    expect(result).toEqual({
      cabecario_tipo: "CABECARIO_REDUZIDO",
      titulo: "Veja os resultados para a busca:",
    });
  });
});
