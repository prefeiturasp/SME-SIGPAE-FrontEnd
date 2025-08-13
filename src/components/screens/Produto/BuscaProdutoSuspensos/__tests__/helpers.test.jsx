import moment from "moment";
import {
  condicaoDeDatas,
  ehFiltroDeData,
  retornaDataMinima,
  retornaUltimaHomologacao,
  retornUltimoLog,
  retornaData,
  ultimoLogItem,
} from "../helpers";

describe("Função helpers.tsx", () => {
  test("condicaoDeDatas deve retornar o tipo de filtro de datas", () => {
    const range = condicaoDeDatas(["data_inicial", "data_final"]);
    expect(range).toBe("range");

    const ate_data = condicaoDeDatas(["data_final"]);
    expect(ate_data).toBe("ate_data");

    const de_data = condicaoDeDatas(["data_inicial"]);
    expect(de_data).toBe("de_data");

    const nenhum = condicaoDeDatas([]);
    expect(nenhum).toBe("nenhum");
  });

  test("ehFiltroDeData deve retornar um array indicando se é filtro e o tipo de filtro de datas", () => {
    const range = ehFiltroDeData(["data_inicial", "data_final"]);
    expect(range).toEqual([true, "range"]);

    const ate_data = ehFiltroDeData(["data_final"]);
    expect(ate_data).toEqual([true, "ate_data"]);

    const de_data = ehFiltroDeData(["data_inicial"]);
    expect(de_data).toEqual([true, "de_data"]);

    const nenhum = ehFiltroDeData([]);
    expect(nenhum).toEqual([false, "nenhum"]);
  });

  test("retornaDataMinima deve retornar um objeto Date correspondente à data", () => {
    const data = retornaDataMinima("08/08/2025");
    expect(data instanceof Date).toBe(true);
    expect(moment(data).format("DD/MM/YYYY")).toBe("08/08/2025");
  });

  test("retornaUltimaHomologacao deve retornar a última homologação", () => {
    const item = {
      produto: {
        homologacoes: ["homolog1", "homolog2", "homologFinal"],
      },
    };
    const resultado = retornaUltimaHomologacao(item);
    expect(resultado).toBe("homologFinal");
  });

  test("retornUltimoLog deve retornar o último log da homologação", () => {
    const homologacao = {
      logs: ["log1", "log2", "logFinal"],
    };
    const resultado = retornUltimoLog(homologacao);
    expect(resultado).toBe("logFinal");
  });

  test("retornaData deve retornar apenas a data (parte anterior ao espaço)", () => {
    const item = {
      criado_em: "2025-08-08 14:32:00",
    };
    const resultado = retornaData(item);
    expect(resultado).toBe("2025-08-08");
  });

  test("ultimoLogItem deve retornar o último log do item", () => {
    const item = {
      logs: [{ id: 1 }, { id: 2 }, { id: 3 }],
    };
    const resultado = ultimoLogItem(item);
    expect(resultado).toEqual({ id: 3 });
  });
});
