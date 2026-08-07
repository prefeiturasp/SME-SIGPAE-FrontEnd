import { formataComoEventos } from "../helpers";

describe("formataComoEventos", () => {
  it("formata objetos como eventos da forma esperada", () => {
    const diasSobremesaDoce = [
      {
        data: "19/12/2024",
        tipo_unidade: { iniciais: "TU1", uuid: "uuid1" },
        edital_numero: "E1",
        edital: "edit_uuid1",
        criado_por: "user1",
        criado_em: "2024-12-19T10:00:00",
        uuid: "event_uuid1",
      },
      {
        data: "19/12/2024",
        tipo_unidade: { iniciais: "TU1", uuid: "uuid1" },
        edital_numero: "E2",
        edital: "edit_uuid2",
        criado_por: "user2",
        criado_em: "2024-12-19T11:00:00",
        uuid: "event_uuid2",
      },
    ];

    const expected = [
      {
        title: "TU1",
        tipo_unidade: { iniciais: "TU1", uuid: "uuid1" },
        tipo: undefined,
        data: "19/12/2024",
        start: new Date(2024, 11, 19, 0),
        end: new Date(2024, 11, 19, 1),
        allDay: true,
        criado_por: "user1",
        criado_em: "2024-12-19T10:00:00",
        uuid: "event_uuid1",
        editais_numeros: "\nE1\nE2",
        editais_numeros_virgula: ", E1, E2",
        editais_uuids: ["edit_uuid1", "edit_uuid2"],
      },
    ];

    const result = formataComoEventos(diasSobremesaDoce);
    expect(result).toEqual(expected);
  });

  it("adiciona prefixo 'Sob. AF - ' e propaga tipo quando tipo.nome === 'Sobremesa AF'", () => {
    const diasSobremesaDoce = [
      {
        data: "19/12/2024",
        tipo_unidade: { iniciais: "EMEF", uuid: "uuid1" },
        tipo: { nome: "Sobremesa AF" },
        edital_numero: "E1",
        edital: "edit_uuid1",
        criado_por: "user1",
        criado_em: "2024-12-19T10:00:00",
        uuid: "event_uuid1",
      },
    ];

    const result = formataComoEventos(diasSobremesaDoce);
    expect(result[0].title).toBe("Sob. AF - EMEF");
    expect(result[0].tipo).toEqual({ nome: "Sobremesa AF" });
  });

  it("nao altera titulo quando tipo.nome nao eh 'Sobremesa AF'", () => {
    const diasSobremesaDoce = [
      {
        data: "19/12/2024",
        tipo_unidade: { iniciais: "EMEF", uuid: "uuid1" },
        tipo: { nome: "Outro Tipo" },
        edital_numero: "E1",
        edital: "edit_uuid1",
        criado_por: "user1",
        criado_em: "2024-12-19T10:00:00",
        uuid: "event_uuid1",
      },
    ];

    const result = formataComoEventos(diasSobremesaDoce);
    expect(result[0].title).toBe("EMEF");
    expect(result[0].tipo).toEqual({ nome: "Outro Tipo" });
  });

  it("cria eventos separados para mesma data e unidade com tipos diferentes", () => {
    const diasSobremesaDoce = [
      {
        data: "04/08/2026",
        tipo_unidade: { iniciais: "CCI", uuid: "uuid-cci" },
        tipo: { uuid: "uuid-sobremesa-doce", nome: "Sobremesa Doce" },
        edital_numero: "Edital 56",
        edital: "edit_uuid1",
        criado_por: "user1",
        criado_em: "2026-08-05T17:52:16",
        uuid: "event_uuid1",
      },
      {
        data: "04/08/2026",
        tipo_unidade: { iniciais: "CCI", uuid: "uuid-cci" },
        tipo: { uuid: "uuid-sobremesa-af", nome: "Sobremesa AF" },
        edital_numero: "Edital 56",
        edital: "edit_uuid2",
        criado_por: "user1",
        criado_em: "2026-08-05T17:52:16",
        uuid: "event_uuid2",
      },
    ];

    const result = formataComoEventos(diasSobremesaDoce);
    expect(result.length).toBe(2);

    expect(result[0].title).toBe("CCI");
    expect(result[0].tipo).toEqual({
      uuid: "uuid-sobremesa-doce",
      nome: "Sobremesa Doce",
    });

    expect(result[1].title).toBe("Sob. AF - CCI");
    expect(result[1].tipo).toEqual({
      uuid: "uuid-sobremesa-af",
      nome: "Sobremesa AF",
    });
  });
});
