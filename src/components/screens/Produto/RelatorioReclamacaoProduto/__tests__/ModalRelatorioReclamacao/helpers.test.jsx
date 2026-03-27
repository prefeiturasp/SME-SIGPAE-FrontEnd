import { getConfigCabecario } from "../../components/ModalRelatorioReclamacao/helpers";
import moment from "moment";

describe("Teste de helpers de ModalRelatorioReclamacao", () => {
  it("deve retornar CABECARIO_REDUZIDO quando há muitos filtros e apenas 1 status", () => {
    const filtros = {
      status_reclamacao: ["CODAE_ACEITOU"],
      nome_produto: "Produto",
      nome_marca: "Marca",
    };

    const resultado = getConfigCabecario(filtros);
    expect(resultado.cabecario_tipo).toBe("CABECARIO_REDUZIDO");
    expect(resultado.titulo).toBe("Veja os resultados para a busca:");
  });

  it("deve retornar CABECARIO_POR_STATUS", () => {
    const filtros = {
      status_reclamacao: ["CODAE_ACEITOU"],
    };

    const resultado = getConfigCabecario(filtros);
    expect(resultado.cabecario_tipo).toBe("CABECARIO_POR_STATUS");
    expect(resultado.status_cabecario).toBe("CODAE aceitou");
    expect(resultado.titulo).toBe('Veja os resultados para "CODAE aceitou"');
  });

  it("deve retornar CABECARIO_POR_NOME (produto)", () => {
    const filtros = {
      status_reclamacao: [],
      nome_produto: "Arroz",
    };

    const resultado = getConfigCabecario(filtros);
    expect(resultado.cabecario_tipo).toBe("CABECARIO_POR_NOME");
    expect(resultado.nome_busca).toBe("Arroz");
  });

  it("deve retornar CABECARIO_POR_NOME (marca)", () => {
    const filtros = {
      status_reclamacao: [],
      nome_marca: "Marca X",
    };

    const resultado = getConfigCabecario(filtros);
    expect(resultado.nome_busca).toBe("Marca X");
  });

  it("deve retornar CABECARIO_POR_NOME (fabricante)", () => {
    const filtros = {
      status_reclamacao: [],
      nome_fabricante: "Fabricante Y",
    };

    const resultado = getConfigCabecario(filtros);
    expect(resultado.nome_busca).toBe("Fabricante Y");
  });

  it("deve retornar CABECARIO_POR_DATA com data inicial", () => {
    const filtros = {
      status_reclamacao: [],
      data_inicial_reclamacao: "01/01/2024",
    };

    const resultado = getConfigCabecario(filtros);
    expect(resultado.cabecario_tipo).toBe("CABECARIO_POR_DATA");
    expect(resultado.data_final_reclamacao).toBe(moment().format("DD/MM/YYYY"));
    expect(resultado.titulo).toContain("01/01/2024");
  });

  it("deve retornar CABECARIO_POR_DATA com data final", () => {
    const filtros = {
      status_reclamacao: [],
      data_final_reclamacao: "10/01/2024",
    };

    const resultado = getConfigCabecario(filtros);
    expect(resultado.cabecario_tipo).toBe("CABECARIO_POR_DATA");
    expect(resultado.titulo).toContain("10/01/2024");
  });

  it("deve retornar período completo quando tem data inicial e final", () => {
    const filtros = {
      status_reclamacao: [],
      data_inicial_reclamacao: "01/01/2024",
      data_final_reclamacao: "10/01/2024",
    };

    const resultado = getConfigCabecario(filtros);
    expect(resultado.cabecario_tipo).toBe("CABECARIO_POR_DATA");
    expect(resultado.titulo).toBe(
      "Veja os resultados para o período de 01/01/2024 à 10/01/2024:",
    );
  });

  it("deve cair no default (CABECARIO_REDUZIDO)", () => {
    const filtros = {
      status_reclamacao: [],
    };

    const resultado = getConfigCabecario(filtros);
    expect(resultado.cabecario_tipo).toBe("CABECARIO_REDUZIDO");
  });
});
