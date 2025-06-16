import { formataComoEventos } from "../helpers.ts";

describe("Teste para a função formataComoEventos", () => {
  let etapas;

  beforeEach(() => {
    etapas = [
      {
        nome_produto: "Produto A",
        data_programada: "19/12/2024",
        etapa: "Etapa 1",
        nome_fornecedor: "Fulano",
        numero_cronograma: "001/0001",
        numero_empenho: "1",
        parte: "Parte 1",
        quantidade: 1,
        uuid: "f490c5ab-bba0-4f1d-b7b7-8d98892cf1e6",
        status: "Assinado CODAE",
        unidade_medida: "kg",
        uuid_cronograma: "a11ded5a-e3b3-480f-8132-f412b9c9b5be",
      },
      {
        nome_produto: "Produto B",
        data_programada: "20/12/2024",
        etapa: "Etapa 2",
        nome_fornecedor: "Ciclano",
        numero_cronograma: "002/0002",
        numero_empenho: "2",
        parte: "Parte 2",
        quantidade: 2,
        uuid: "f490c5ab-bba0-4f1d-b7b7-8d98892cf1f1",
        status: "Assinado CODAE",
        unidade_medida: "L",
        uuid_cronograma: "a11ded5a-e3b3-480f-8132-f412b9c9b55a",
      },
    ];
  });

  it("deve formatar etapas como eventos corretamente", () => {
    const eventos = formataComoEventos(etapas);

    expect(eventos).toEqual([
      {
        title: "Produto A",
        data: "19/12/2024",
        start: new Date(2024, 11, 19, 0),
        end: new Date(2024, 11, 19, 1),
        allDay: true,
        objeto: etapas[0],
      },
      {
        title: "Produto B",
        data: "20/12/2024",
        start: new Date(2024, 11, 20, 0),
        end: new Date(2024, 11, 20, 1),
        allDay: true,
        objeto: etapas[1],
      },
    ]);
  });

  it("deve retornar um array vazio se a entrada for um array vazio", () => {
    const eventos = formataComoEventos([]);
    expect(eventos).toEqual([]);
  });
});
